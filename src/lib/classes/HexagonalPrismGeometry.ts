import { BufferAttribute, CylinderGeometry, Float32BufferAttribute, GeometryGroup, InterleavedBufferAttribute, MathUtils, Vector3 } from 'three';
import { getIndexedVertex } from '../threeHelpers';

// With guidance from https://eperezcosano.github.io/hex-grid/

/** "even-q" vertical layout, as per here: https://www.redblobgames.com/grids/hexagons/#coordinates-offset */

export default class HexagonalPrismGeometry extends CylinderGeometry {
    static hexAngle = (2 * Math.PI) / 6; // 60 deg
    static cos = Math.cos(this.hexAngle);
    static sin = Math.sin(this.hexAngle);

    constructor(radius: number, height: number, thetaStart?: number, thetaLength?: number) {
        const sides = 6;
        super(radius, radius, height, sides, 1, false, thetaStart, thetaLength);

        this.rotateX(MathUtils.degToRad(90));
        this.rotateZ(MathUtils.degToRad(90)); // for now!
        this.computeBoundingBox();
        this.center();

        const indexAttr = this.getIndex();

        if (indexAttr) {
            const sideGroup = this.groups[0];
            const topGroup = this.groups[1];
            const bottomGroup = this.groups[2];

            const uvAttr = this.getAttribute('uv');
            const posAttr = this.getAttribute('position');

            const newArray = Array.from({ length: uvAttr.array.length }, () => 0);
            const newUvAttr = new Float32BufferAttribute(newArray, uvAttr.itemSize);

            HexagonalPrismGeometry.setAttributesCaps(newUvAttr, [1, 0], 'top', topGroup, sideGroup, indexAttr, posAttr);
            HexagonalPrismGeometry.setAttributesCaps(newUvAttr, [0, 1], 'bottom', bottomGroup, sideGroup, indexAttr, posAttr);

            this.setAttribute('uv', newUvAttr);
        }

        this.clearGroups();
    }

    static setAttributesCaps(
        attribute: BufferAttribute | InterleavedBufferAttribute,
        values: number[],
        capSide: 'top' | 'bottom',
        geoGroupCap: GeometryGroup,
        geoGroupSide: GeometryGroup,
        indexAttribute: BufferAttribute,
        positionAttribute: BufferAttribute | InterleavedBufferAttribute,
    ) {
        const capVectors: ReturnType<typeof getIndexedVertex>[] = [];
        const sideVectors: ReturnType<typeof getIndexedVertex>[] = [];
        const capVector = new Vector3();
        const sideVector = new Vector3();
        let attributeIndices: Set<number> = new Set();

        for (let i = geoGroupCap.start; i < geoGroupCap.start + geoGroupCap.count; i++) {
            if (capSide === 'top' && (i - geoGroupCap.start + 1) % 3 === 0) {
                continue;
            } else {
                capVectors.push(getIndexedVertex(i, indexAttribute, positionAttribute));
            }
        }

        if (capSide === 'bottom') {
            for (let i = geoGroupSide.start; i < geoGroupSide.start + geoGroupSide.count; i++) {
                sideVectors.push(getIndexedVertex(i, indexAttribute, positionAttribute));
            }
        }

        capVectors.forEach(({ points, attributeIndex }) => {
            if (capSide === 'top') {
                attributeIndices.add(attributeIndex);
            } else if (capSide === 'bottom') {
                capVector.fromArray(points);
                sideVectors.forEach((vColl) => sideVector.fromArray(vColl.points).equals(capVector) && attributeIndices.add(vColl.attributeIndex));
                attributeIndices.add(attributeIndex);
            }
        });

        attributeIndices.forEach((attribIdx) => {
            for (let i = 0; i < attribute.itemSize; i++) {
                attribute.setComponent(attribIdx, i, values[i]);
            }
        });
    }

    static getXYOffsets(radius: number, padding: number, column: number, row: number) {
        const horizontalColumnOffset = this.getHorizontalColumnOffset(radius);
        const verticalColumnOffset = this.getVerticalColumnOffset(radius);
        const rowOffset = verticalColumnOffset * 2; // height

        const evenOrUneven = column % 2 === 0 ? 1 : 0;

        let x = column * (horizontalColumnOffset + padding);
        let y = (verticalColumnOffset + padding / 2) * evenOrUneven + row * (rowOffset + padding);

        x -= radius / 2; // start offset to left

        return [x, y];
    }

    static getColumnAndRowByIndex = (index: number, numColumns: number) => {
        const column = index % numColumns;
        const row = Math.floor(index / numColumns);

        return [column, row];
    };

    static getNeighborsEvenQ([hexColumn, hexRow]: [number, number], direction: number) {
        const directions = this.directionDifferencesEvenQ;

        // bitwise AND,"because it works with negative numbers too"
        const parity = hexColumn & 1;
        const diff = directions[parity][direction];
        const offsetCoordinates: [number, number] = [hexColumn + diff[0], hexRow + diff[1]];

        return offsetCoordinates;
    }

    static getHorizontalColumnOffset = (radius: number) => {
        const rCos = radius * this.cos;
        return radius + rCos;
    };

    static getVerticalColumnOffset = (radius: number) => {
        const rSin = radius * this.sin;
        return rSin;
    };

    /** Index 0 is above/north, then moving clockwise (index 3 being below/south) */
    static directionDifferencesEvenQ: [
        [[number, number], [number, number], [number, number], [number, number], [number, number], [number, number]],
        [[number, number], [number, number], [number, number], [number, number], [number, number], [number, number]],
    ] = [
        // even columns
        [
            [0, -1],
            [+1, 0],
            [+1, +1],
            [0, +1],
            [-1, +1],
            [-1, 0],
        ],
        // odd columns
        [
            [0, -1],
            [+1, -1],
            [+1, 0],
            [0, +1],
            [-1, 0],
            [-1, -1],
        ],
    ];
}

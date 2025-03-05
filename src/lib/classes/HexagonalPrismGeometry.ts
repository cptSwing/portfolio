import { BufferAttribute, BufferGeometry, Float32BufferAttribute, GeometryGroup, InterleavedBufferAttribute, MathUtils, Vector3 } from 'three';
import { getIndexedVertex } from '../threeHelpers';

// With lots of guidance from https://www.redblobgames.com/grids/hexagons/

export default class HexagonalPrismGeometry extends BufferGeometry {
    type = 'HexagonalPrismGeometry';
    parameters = {};

    // radius is the radius of the outer circle touching all hexagon corners
    constructor(radius: number, height: number, flatTop = true, isFlatShaded = false, thetaStart = 0, thetaLength = Math.PI * 2) {
        super();

        const radialSegments = 6;
        const heightSegments = 2;
        const fillet = radius / 5;
        const filletRadius = radius - fillet;

        this.parameters = {
            radius,
            height: height,
            radialSegments,
            heightSegments, // WARN chamfer needs more I guess
            thetaStart: thetaStart,
            thetaLength: thetaLength,
        };

        const scope = this;

        // buffers
        const indices: number[] = [];
        const vertices: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];

        // helper variables
        let index = 0;
        const indexArray: number[][] = [];
        const halfHeight = height / 2;
        let groupStart = 0;

        // generate geometry
        generateTorso();
        if (radius > 0) generateCap(true);

        // build geometry
        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        if (!isFlatShaded) {
            this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        }
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        // added
        if (!isFlatShaded) {
            this.computeVertexNormals();
            handleNormals();
        }

        this.rotateX(MathUtils.degToRad(90));

        if (flatTop) {
            this.rotateZ(MathUtils.degToRad(90));
        }

        this.center();
        this.computeBoundingBox();

        function generateTorso() {
            const normal = new Vector3();
            const vertex = new Vector3();

            let groupCount = 0;

            const slope = 0;

            const filletTopRow = 0;
            const filletBottomRow = 1;
            const overallBottomRow = heightSegments;

            // generate vertices, normals and uvs
            for (let y = 0; y <= heightSegments; y++) {
                const indexRow = [];

                const v = y / heightSegments;

                let radiusRow: number;
                if (y === filletTopRow) {
                    radiusRow = filletRadius;
                } else {
                    radiusRow = radius;
                }

                for (let x = 0; x <= radialSegments; x++) {
                    const u = x / radialSegments;

                    const theta = u * thetaLength + thetaStart;

                    const sinTheta = Math.sin(theta);
                    const cosTheta = Math.cos(theta);

                    // vertex
                    let vertexHeight: number;

                    if (y === filletTopRow) {
                        vertexHeight = halfHeight;
                    } else if (y === filletBottomRow) {
                        vertexHeight = halfHeight - fillet;
                    } else {
                        vertexHeight = -v * height + halfHeight;
                    }

                    vertex.x = radiusRow * sinTheta;
                    vertex.y = vertexHeight;
                    vertex.z = radiusRow * cosTheta;
                    vertices.push(vertex.x, vertex.y, vertex.z);

                    // normal
                    if (!isFlatShaded) {
                        normal.set(sinTheta, slope, cosTheta).normalize();
                        normals.push(normal.x, normal.y, normal.z);
                    }

                    // uv
                    if (y === filletTopRow) {
                        uvs.push(1, 0);
                    } else if (y === overallBottomRow) {
                        uvs.push(0, 1);
                    } else {
                        uvs.push(0, 0);
                    }

                    // save index of vertex in respective row
                    indexRow.push(index++);
                }

                // now save vertices of the row in our index array
                indexArray.push(indexRow);
            }

            // generate indices
            for (let x = 0; x < radialSegments; x++) {
                for (let y = 0; y < heightSegments; y++) {
                    // we use the index array to access the correct indices
                    const a = indexArray[y][x];
                    const b = indexArray[y + 1][x];
                    const c = indexArray[y + 1][x + 1];
                    const d = indexArray[y][x + 1];

                    // faces
                    if (radius > 0) {
                        indices.push(a, b, d);
                        groupCount += 3;

                        indices.push(b, c, d);
                        groupCount += 3;
                    }
                }
            }

            // add a group to the geometry. this will ensure multi material support
            scope.addGroup(groupStart, groupCount, 0);

            // calculate new start value for groups
            groupStart += groupCount;
        }

        function generateCap(top: boolean) {
            // save the index of the first center vertex
            const centerIndexStart = index;

            let groupCount = 0;

            const sign = top === true ? 1 : -1;

            // first we generate the center vertex data of the cap.
            for (let x = 1; x <= radialSegments; x++) {
                // vertex
                vertices.push(0, halfHeight * sign, 0);

                // normal
                if (!isFlatShaded) {
                    normals.push(0, sign, 0);
                }
                // uv
                uvs.push(0, 0);

                // increase index
                index++;
            }

            // save the index of the last center vertex
            const centerIndexEnd = index;

            // generate indices
            for (let x = 0; x < radialSegments; x++) {
                const c = centerIndexStart + x;
                const i = centerIndexEnd + x;

                if (top === true) {
                    // face top
                    indices.push(x, x + 1, c);
                    // indices.push(x, x + 1, c);
                } else {
                    // face bottom
                    indices.push(i + 1, i, c);
                }

                groupCount += 3;
            }

            // add a group to the geometry. this will ensure multi material support
            scope.addGroup(groupStart, groupCount, top === true ? 1 : 2);

            // calculate new start value for groups
            groupStart += groupCount;
        }

        function handleNormals() {
            const normals = scope.attributes.normal.array;
            const n1 = new Vector3();
            const n2 = new Vector3();
            const n = new Vector3();

            // normal[0], normal[6] on ring 0 should be: [0, 1, 2] and [18, 19, 20]
            // normal[0], normal[6] on ring 1 should be: [21, 22, 23] and [39, 40, 41]
            // normal[0], normal[6] on ring 2 should be: [42, 43, 44] and [60, 61, 62]
            const firstNormals = [0, 21, 42];
            const lastNormals = [18, 39, 60];

            for (let i = 0, j = 0; i < firstNormals.length; i++, j += 3) {
                const firstNormal = firstNormals[i];
                const lastNormal = lastNormals[i];
                // select the normal of the first vertex
                n1.x = normals[firstNormal + 0];
                n1.y = normals[firstNormal + 1];
                n1.z = normals[firstNormal + 2];

                // select the normal of the last vertex
                n2.x = normals[lastNormal + 0];
                n2.y = normals[lastNormal + 1];
                n2.z = normals[lastNormal + 2];

                // average normals
                n.addVectors(n1, n2).normalize();

                // assign the new values to both normals
                normals[firstNormal + 0] = normals[lastNormal + 0] = n.x;
                normals[firstNormal + 1] = normals[lastNormal + 1] = n.y;
                normals[firstNormal + 2] = normals[lastNormal + 2] = n.z;
            }

            const topNormals = Array.from({ length: 21 / 3 + 18 / 3 }).map((_, idx) => (idx < 21 / 3 ? idx * 3 : (idx + 42 / 3) * 3));

            for (let i = 0; i < topNormals.length; i++) {
                const topNormal = topNormals[i];
                n1.x = 0;
                n1.y = 1;
                n1.z = 0;

                n2.x = normals[topNormal + 0];
                n2.y = normals[topNormal + 1];
                n2.z = normals[topNormal + 2];

                // average normals
                n.addVectors(n1, n2).normalize();

                normals[topNormal + 0] = n.x;
                normals[topNormal + 1] = n.y;
                normals[topNormal + 2] = n.z;
            }
        }
    }

    setAttributesCaps(
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
}

export class HexagonalPrismUtilities {
    static hexAngle = (2 * Math.PI) / 6; // 60 deg
    static hexSine = Math.sin(this.hexAngle);
    static hexCosine = Math.cos(this.hexAngle);

    static getWidthHeight(size: number, flatTop = true) {
        const sizeTimes2 = size * 2;
        const sizeTimesSqrt3 = size * Math.sqrt(3);
        return (flatTop ? [sizeTimes2, sizeTimesSqrt3] : [sizeTimesSqrt3, sizeTimes2]) as [number, number];
    }

    static getSizeFromWidth(width: number, flatTop = true) {
        return flatTop ? width / 2 : width / Math.sqrt(3);
    }

    /** Returns distance between hexagon centers in a grid */
    static getSpacing(size: number, flatTop = true) {
        const [width, height] = this.getWidthHeight(size, flatTop);
        let horizontalDistance: number, verticalDistance: number;
        if (flatTop) {
            horizontalDistance = (3 / 4) * width;
            verticalDistance = height;
        } else {
            horizontalDistance = width;
            verticalDistance = (3 / 4) * height;
        }

        return [horizontalDistance, verticalDistance];
    }

    static getSizeFromSpacing(distance: number, horizontal: boolean, flatTop = true) {
        const distanceTimesTwoThirds = distance * (2 / 3);
        const distanceDivBySqrt3 = distance / Math.sqrt(3);

        let size: number;
        if (horizontal) {
            size = flatTop ? distanceTimesTwoThirds : distanceDivBySqrt3;
        } else {
            size = flatTop ? distanceDivBySqrt3 : distanceTimesTwoThirds;
        }

        return size;
    }

    static getXYOffsets(width: number, padding: number, column: number, row: number, flatTop: boolean) {
        const size = this.getSizeFromWidth(width, flatTop);
        const [horizontalSpacing, verticalSpacing] = this.getSpacing(size, flatTop);
        const [, height] = this.getWidthHeight(size, flatTop);

        const rSin = this.hexSine * size;
        const shorterToLongerDimRatio = flatTop ? rSin / size : size / rSin;

        const horizontalColumnOffset = horizontalSpacing + padding * shorterToLongerDimRatio;
        const verticalColumnOffset = verticalSpacing + padding;

        let x = column * horizontalColumnOffset;
        let y = row * verticalColumnOffset;

        if (flatTop) {
            const evenOrUneven = column % 2 === 0 ? 1 : 0;
            y += ((height + padding) / 2) * evenOrUneven;
        } else {
            const evenOrUneven = row % 2 === 0 ? 1 : 0;
            x += ((width + padding * shorterToLongerDimRatio) / 2) * evenOrUneven;
        }

        return [x, y];
    }

    static getColumnAndRowByIndex = (index: number, numColumns: number) => {
        const column = index % numColumns;
        const row = Math.floor(index / numColumns);

        return [column, row] as [number, number];
    };

    // Even-R shoves even rows (r) right (pointy-top hexes)
    static getNeighbors([hexColumn, hexRow]: [number, number], direction: number, flatTop: boolean) {
        const directions = flatTop ? this.directionDifferencesEvenQ : this.directionDifferencesEvenR;

        // bitwise AND -> "because it works with negative numbers too"
        const parity = (flatTop ? hexColumn : hexRow) & 1;
        const diff = directions[parity][direction];

        const offsetCoordinates: [number, number] = [hexColumn + diff[0], hexRow + diff[1]];

        return offsetCoordinates;
    }

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

    /** Index 0 is the first hex in the north-eastern area, eg first hex in local X+/Y+. then moving clockwise (index 3 being below/south-west) */
    static directionDifferencesEvenR: [
        [[number, number], [number, number], [number, number], [number, number], [number, number], [number, number]],
        [[number, number], [number, number], [number, number], [number, number], [number, number], [number, number]],
    ] = [
        // even rows
        [
            [+1, -1],
            [+1, 0],
            [+1, +1],
            [0, +1],
            [-1, 0],
            [0, -1],
        ],
        // odd rows
        [
            [0, -1],
            [+1, 0],
            [0, +1],
            [-1, +1],
            [-1, 0],
            [-1, -1],
        ],
    ];
}

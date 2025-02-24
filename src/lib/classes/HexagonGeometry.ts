import { CircleGeometry } from 'three';

// With guidance from https://eperezcosano.github.io/hex-grid/

/** "even-q" vertical layout, as per here: https://www.redblobgames.com/grids/hexagons/#coordinates-offset */

export default class HexagonGeometry extends CircleGeometry {
    static hexAngle = (2 * Math.PI) / 6; // 60 deg
    static cos = Math.cos(this.hexAngle);
    static sin = Math.sin(this.hexAngle);

    constructor(radius: number, thetaStart?: number, thetaLength?: number) {
        super(radius, 6, thetaStart, thetaLength);
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
        const directions = HexagonGeometry.directionDifferencesEvenQ;

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

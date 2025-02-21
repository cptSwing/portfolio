import { CircleGeometry } from 'three';

// With guidance from https://eperezcosano.github.io/hex-grid/

/** "even-q" vertical layout, as per here: https://www.redblobgames.com/grids/hexagons/#coordinates-offset */

export default class HexagonGeometry extends CircleGeometry {
    radius; // width / 2
    horizontalColumnOffset;
    verticalColumnOffset;
    rowOffset; // height

    constructor(radius: number, thetaStart?: number, thetaLength?: number) {
        super(radius, 6, thetaStart, thetaLength);
        this.radius = radius;

        const angle = (2 * Math.PI) / 6; // 60 deg
        const rSin = radius * Math.sin(angle);
        const rCos = radius * Math.cos(angle);

        this.horizontalColumnOffset = radius + rCos;
        this.verticalColumnOffset = rSin;
        this.rowOffset = rSin * 2;
    }

    getXYOffsets(column: number, row: number, padding: number) {
        const horizontalColumnOffset = this.horizontalColumnOffset;
        const verticalColumnOffset = this.verticalColumnOffset;
        const rowOffset = this.rowOffset;
        const radius = this.radius;

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

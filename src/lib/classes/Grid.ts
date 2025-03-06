import { InstancedEntity } from '@three.ez/instanced-mesh';
import { Color } from 'three';
import { OffsetCoordinate, DefaultGridData, GridData, CubeCoordinate } from '../../types/types';

export class Grid {
    static setInstanceColor = (instance: InstancedEntity, colorObject: Color) => {
        instance.color = colorObject.setHex(0x000000); // Set to black to not initially add anything to 'diffuse'
    };

    static getColumnAndRowByIndex(index: number, numColumns: number) {
        const column = index % numColumns;
        const row = Math.floor(index / numColumns);

        return [column, row] as OffsetCoordinate;
    }

    static offsetCoordsToIndices(coord: OffsetCoordinate, numColumns: number, numRows: number, filterOutOfBounds = true) {
        const [column, row] = coord;
        let index = row * numColumns + column;

        if (filterOutOfBounds && (column < 0 || column >= numColumns || row < 0 || row >= numRows)) {
            index = -1; // prevent wrapping to other side, as filtered below
        }

        return index;
    }
}

export class HexGrid extends Grid {
    static hexAngle = (2 * Math.PI) / 6; // 60 deg
    static hexSine = Math.sin(this.hexAngle);
    static hexCosine = Math.cos(this.hexAngle);

    static getInstanceCount = (params: DefaultGridData) => {
        const { overallWidth, overallHeight, instanceFlatTop, instancePadding, gridCount } = params;

        const overallArea = overallWidth * overallHeight;
        const idealInstanceArea = overallArea / gridCount;

        const size = Math.sqrt((2 * idealInstanceArea) / (3 * Math.sqrt(3))); // same as radius
        const [horizontalSpacing, verticalSpacing] = this.getSpacing(size, instanceFlatTop); // column width, basically
        const rSin = this.hexSine * size;

        const shorterToLongerDimRatio = instanceFlatTop ? rSin / size : size / rSin;
        const adjustedHorizontalPadding = instancePadding * shorterToLongerDimRatio;
        const horizontalSpacingNoPadding = Math.max(0.001, horizontalSpacing - adjustedHorizontalPadding);

        const newSizeH = this.getSizeFromSpacing(horizontalSpacingNoPadding, true, instanceFlatTop);
        const [width, height] = this.getWidthHeight(newSizeH, instanceFlatTop);

        const numColumns = Math.ceil((overallWidth + adjustedHorizontalPadding) / horizontalSpacing);
        const numRows = Math.ceil((overallHeight + height / 2) / verticalSpacing);

        return {
            ...params,
            instanceWidth: width,
            gridCount: numColumns * numRows,
            gridColumns: numColumns,
            gridRows: numRows,
        } as GridData;
    };

    static setInstancePosition(
        instance: InstancedEntity,
        index: number,
        gridColumns: number,
        [extentX, extentY]: [number, number],
        width: number,
        padding: number,
        flatTop: boolean,
    ) {
        let offsetX, offsetY;
        const [column, row] = this.getColumnAndRowByIndex(index, gridColumns);
        [offsetX, offsetY] = this.getXYOffsets(width, padding, column, row, flatTop);

        const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        instance.position.set(position.x, position.y, position.z);
    }

    static getAdjacentIndices(instanceIndex: number, numColumns: number, numRows: number, distance: number, _flatTop = false, filterOutOfBounds = true) {
        let allNeighbors: number[] = [];

        const neighbors = this.getAllNeighbors(instanceIndex, distance, numColumns);
        allNeighbors = neighbors.flat().map((coords) => this.offsetCoordsToIndices(coords, numColumns, numRows, filterOutOfBounds));

        if (filterOutOfBounds) {
            return allNeighbors.filter((adjacent) => adjacent >= 0);
        } else {
            return allNeighbors;
        }
    }

    static getAllNeighbors(instanceIndex: number, distance: number, numColumns: number) {
        const offsetCoords = this.getColumnAndRowByIndex(instanceIndex, numColumns);
        const cubeCoords = this.coord_EvenRToCube(offsetCoords);
        const neighboringRings = this.getSpiralRingsCubeCoordinates(cubeCoords, distance);
        const neighborsOffsetCoords = neighboringRings.map((cubeCoordArray) => cubeCoordArray.map((cubeCoord) => this.coord_CubeToEvenR(cubeCoord)));
        return neighborsOffsetCoords;
    }

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

    static coord_CubeToEvenR([q, r, _s]: CubeCoordinate) {
        const column = q + (r + (r & 1)) / 2;
        const row = r;
        return [column, row] as OffsetCoordinate;
    }

    static coord_EvenRToCube([column, row]: OffsetCoordinate) {
        const q = column - (row + (row & 1)) / 2;
        const r = row;
        const s = -q - r;
        return [q, r, s] as CubeCoordinate;
    }

    static getRingCubeCoordinates([q, r, s]: CubeCoordinate, radius: number) {
        const [qDir0, rDir0, sDir0] = this.directionDifferencesCube[4];
        const [qScaled, rScaled, sScaled] = [qDir0 * radius, rDir0 * radius, sDir0 * radius];
        const results = [];

        let cubeHex: CubeCoordinate = [q + qScaled, r + rScaled, s + sScaled];

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                results.push(cubeHex);
                cubeHex = this.getNeighborsCubeCoordinates(cubeHex, i);
            }
        }

        return results;
    }

    static getSpiralRingsCubeCoordinates(cubeHex: CubeCoordinate, radius: number) {
        const results: CubeCoordinate[][] = [];

        for (let i = 1; i <= radius; i++) {
            results.push(this.getRingCubeCoordinates(cubeHex, i));
        }
        return results;
    }

    static getNeighborsCubeCoordinates([q, r, s]: CubeCoordinate, direction: number, diagonal = false) {
        const [dirQ, dirR, dirS] = diagonal ? this.directionDifferencesDiagonalCube[direction] : this.directionDifferencesCube[direction];
        return [q + dirQ, r + dirR, s + dirS] as CubeCoordinate;
    }

    static directionDifferencesCube: [CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate] = [
        [+1, -1, 0],
        [+1, 0, -1],
        [0, +1, -1],
        [-1, +1, 0],
        [-1, 0, +1],
        [0, -1, +1],
    ];

    static directionDifferencesDiagonalCube: [CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate, CubeCoordinate] = [
        [+1, -2, +1],
        [+2, -1, -1],
        [+1, +1, -2],
        [-1, +2, -1],
        [-2, +1, +1],
        [-1, -1, +2],
    ];

    // Even-R shoves even rows (r) right (pointy-top hexes)
    static getNeighborsOffsetCoordinates([hexColumn, hexRow]: OffsetCoordinate, direction: number, flatTop: boolean) {
        const directions = flatTop ? this.directionDifferencesOffsetEvenQ : this.directionDifferencesOffsetEvenR;

        // bitwise AND -> "because it works with negative numbers too"
        const parity = (flatTop ? hexColumn : hexRow) & 1;
        const diff = directions[parity][direction];

        const offsetCoordinates: [number, number] = [hexColumn + diff[0], hexRow + diff[1]];

        return offsetCoordinates;
    }

    /** Index 0 is above/north, then moving clockwise (index 3 being below/south) */
    static directionDifferencesOffsetEvenQ: [
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
    static directionDifferencesOffsetEvenR: [
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

export class SquareGrid extends Grid {
    static getInstanceCount = (params: DefaultGridData) => {
        const { overallWidth, overallHeight, instancePadding, gridCount } = params;

        const overallArea = overallWidth * overallHeight;
        const idealInstanceArea = overallArea / gridCount;

        // Via https://stackoverflow.com/a/1575761
        const idealInstanceWidth = Math.sqrt(idealInstanceArea);

        const columns = Math.round(overallWidth / idealInstanceWidth);
        let rows = Math.round(overallHeight / idealInstanceWidth);

        const minLength = Math.min(overallWidth / columns, overallWidth / rows);
        if (overallHeight > minLength * rows) rows++;

        return { ...params, instanceWidth: minLength - instancePadding, gridCount: columns * rows, gridColumns: columns, gridRows: rows } as GridData;
    };

    static setInstancePosition = (
        instance: InstancedEntity,
        index: number,
        gridColumns: number,
        [extentX, extentY]: [number, number],
        width: number,
        padding: number,
    ) => {
        let offsetX, offsetY;
        const [column, row] = this.getColumnAndRowByIndex(index, gridColumns);

        offsetX = column * width + padding;
        offsetY = row * width + padding;

        const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        instance.position.set(position.x, position.y, position.z);
    };

    static getAdjacentIndices(instanceIndex: number, numColumns: number, filterOutOfBounds = true) {
        let allNeighbors: number[] = [];

        const above = instanceIndex - numColumns;
        const toRight = instanceIndex + 1;
        const below = instanceIndex + numColumns;
        const toLeft = instanceIndex - 1;

        allNeighbors.push(above, toRight, below, toLeft);

        return filterOutOfBounds ? allNeighbors.filter((adjacent) => adjacent >= 0) : allNeighbors;
    }
}

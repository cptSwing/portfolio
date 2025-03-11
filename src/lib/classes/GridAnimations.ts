import { HexGrid } from './Grid';

export class GridAnimations {
    static animationTimer(time: number) {
        // TODO something with the 'time' stamp from useFrame --> do x every 10 seconds, or some such
    }

    static getRingShape(instanceIndex: number, distance: number | number[], gridColsRows: [number, number]) {
        let indicesArray: number[][];

        if (Array.isArray(distance) && distance.length) {
            const rings: number[][][] = distance.map((distanceValue) => HexGrid.getRingIndices(instanceIndex, distanceValue, gridColsRows));
            indicesArray = GridAnimations.mergeIndicesDistanceLevels(...rings);
        } else {
            indicesArray = HexGrid.getRingIndices(instanceIndex, distance as number, gridColsRows);
        }
        indicesArray[0] = [instanceIndex];
        return indicesArray;
    }

    static getHexagonShape(instanceIndex: number, distance: number, gridColsRows: [number, number]) {
        const indicesArray = HexGrid.getSpiralIndices(instanceIndex, distance, gridColsRows);
        indicesArray[0] = [instanceIndex];
        return indicesArray;
    }

    static getStarShape(instanceIndex: number, distance: number, gridColsRows: [number, number]) {
        const indicesArrayQ = HexGrid.getAxesIndices(instanceIndex, distance, 'q', 'both', gridColsRows);
        const indicesArrayR = HexGrid.getAxesIndices(instanceIndex, distance, 'r', 'both', gridColsRows);
        const indicesArrayS = HexGrid.getAxesIndices(instanceIndex, distance, 's', 'both', gridColsRows);

        const indicesArray = GridAnimations.mergeIndicesDistanceLevels(indicesArrayQ, indicesArrayR, indicesArrayS);
        indicesArray[0] = [instanceIndex];

        return indicesArray;
    }

    /** Merges several arrays of Indices, taking their distance level into account. */
    static mergeIndicesDistanceLevels(...arrayOfIndicesByDistance: number[][][]) {
        const longestArrayIndex = arrayOfIndicesByDistance.reduce((prev, current, idx, arr) => (arr[prev].length > current.length ? prev : idx), 0);
        const longestIndicesArray = arrayOfIndicesByDistance.splice(longestArrayIndex, 1)[0];

        arrayOfIndicesByDistance.forEach((indices) => {
            for (let i = 0; i < longestIndicesArray.length; i++) {
                indices[i] && longestIndicesArray[i].push(...indices[i]);
            }
        });

        return longestIndicesArray;
    }

    static filterIndices(indicesArray: number[][], removeCenter = false) {
        let filtered = indicesArray;
        if (removeCenter) filtered.splice(0, 1);
        filtered = indicesArray.filter((indicesAtDistance) => indicesAtDistance.length);
        const filteredAndDeDuped = filtered.map((indices) => Array.from(new Set(indices)));

        return filteredAndDeDuped;
    }
}

import configJSON from '../config/config.json';
import { HexagonData, HexagonLink } from '../types/types';
import { NavigationExpansionState } from '../views/Main';

const {
    hexMenu: { columns, scaleUp },
} = configJSON;

export const staticValues = {
    heightAspectRatio: {
        flatTop: 0.866,
        pointyTop: 1.1547,
    },
    tilingMultiplierHorizontal: {
        flatTop: 1.5,
        pointyTop: 1,
    },
    tilingMultiplierVertical: {
        flatTop: 1,
        pointyTop: 1.5,
    },
};

const hexHeightAspectRatio = staticValues.heightAspectRatio.flatTop;
const hexHeight = hexHeightAspectRatio * scaleUp;
const hexHalfHeight = hexHeight / 2;

const getOffsetsAndScale = (column: number, row: number) => {
    const shouldAdjustGlobalXOffset = ((columns * 3 - 1) / 2) % 2 == 0;
    const xOffsetPerRow = row % 2 === 0 ? (shouldAdjustGlobalXOffset ? 0 : 0.75) : shouldAdjustGlobalXOffset ? -0.75 : 0;
    const xValue = (1.5 * column + xOffsetPerRow) * scaleUp;

    const yOffsetPerRow = hexHalfHeight;
    const yValue = (row - 1) * yOffsetPerRow;

    return {
        x: xValue,
        y: yValue,
    };
};

const allOffsets = Array.from({ length: 9 }).map((_, rowIndex) =>
    Array.from({ length: rowIndex % 2 === 0 ? 3 : 4 }).map((_, colIndex) => getOffsetsAndScale(colIndex, rowIndex)),
);

const origins = {
    'top-left': '6.25% 0%',
    'left': '0% 12.5%',
    'bottom-left': '6.25% 25%',
    'bottom-right': '18.75% 25%',
};

const hexShape: ((Record<NavigationExpansionState, HexagonData> & HexagonLink) | null)[][] = [
    // 0
    [
        null,
        {
            home: { position: allOffsets[0][1], rotation: 0, isHalf: true, scale: 1 },
            category: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 0.5 },
            post: { position: allOffsets[0][1], rotation: 0, isHalf: true, scale: 1 },
        },
        null,
    ],

    // 1
    [
        null,
        {
            home: { position: allOffsets[1][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[1][0], rotation: -60, isHalf: true, scale: 1 },
            post: { position: allOffsets[1][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[1][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[1][3], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[1][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 2
    [
        {
            home: { position: allOffsets[2][0], rotation: -60, isHalf: true, scale: 1 },
            category: { position: allOffsets[0][0], rotation: 0, isHalf: true, scale: 1 },
            post: { position: allOffsets[2][0], rotation: -60, isHalf: true, scale: 1 },
        },
        {
            home: { position: allOffsets[2][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[0][2], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[2][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[2][2], rotation: 60, isHalf: true, scale: 1 },
            category: { position: allOffsets[2][2], rotation: -120, isHalf: true, scale: 1 },
            post: { position: allOffsets[2][2], rotation: 60, isHalf: true, scale: 1 },
        },
    ],

    // 3
    [
        null,
        {
            home: { position: allOffsets[3][1], rotation: -60, isHalf: false, scale: 1 },
            category: { position: allOffsets[8][0], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[3][1], rotation: 0, isHalf: false, scale: 1 },
            title: 'code',
            url: '0',
        },
        null,
        {
            home: { position: allOffsets[3][2], rotation: 60, isHalf: false, scale: 1 },
            category: { position: allOffsets[6][0], rotation: 0, isHalf: false, scale: 0.5, origin: origins['bottom-right'] },
            post: { position: allOffsets[3][2], rotation: 0, isHalf: false, scale: 1 },
            title: '3d',
            url: '1',
        },
        null,
        null,
    ],

    // 4 (Vertical center)
    [
        {
            home: { position: allOffsets[4][0], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[2][0], rotation: 120, isHalf: true, scale: 1 },
            post: { position: allOffsets[4][0], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[3][0], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[4][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[3][3], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[4][2], rotation: 0, isHalf: false, scale: 1 },
        },
    ],

    // 5
    [
        null,
        {
            home: { position: allOffsets[5][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[5][0], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[5][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[5][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[5][3], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[5][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 6
    [
        {
            home: { position: allOffsets[6][0], rotation: -120, isHalf: true, scale: 1 },
            category: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[6][0], rotation: -120, isHalf: true, scale: 1 },
        },
        {
            home: { position: allOffsets[6][1], rotation: 180, isHalf: false, scale: 1 },
            category: { position: allOffsets[7][1], rotation: 0, isHalf: false, scale: 0.5, origin: origins['left'] },
            post: { position: allOffsets[6][1], rotation: 0, isHalf: false, scale: 1 },
            title: 'log',
            url: '3',
        },
        null,
        {
            home: { position: allOffsets[6][2], rotation: 120, isHalf: true, scale: 1 },
            category: { position: allOffsets[6][2], rotation: -60, isHalf: true, scale: 1 },
            post: { position: allOffsets[6][2], rotation: 120, isHalf: true, scale: 1 },
        },
    ],

    // 7
    [
        null,
        {
            home: { position: allOffsets[7][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[7][0], rotation: -120, isHalf: true, scale: 1 },
            post: { position: allOffsets[7][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[7][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[7][3], rotation: 0, isHalf: false, scale: 1 },
            post: { position: allOffsets[7][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 8
    [
        null,
        {
            home: { position: allOffsets[8][1], rotation: 180, isHalf: true, scale: 1 },
            category: { position: allOffsets[8][2], rotation: 180, isHalf: true, scale: 1 },
            post: { position: allOffsets[8][1], rotation: 180, isHalf: true, scale: 1 },
        },
        null,
    ],
];

export default hexShape;

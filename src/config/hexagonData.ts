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

const hexShape: ((Record<NavigationExpansionState, HexagonData> & HexagonLink) | null)[][] = [
    // 0
    [
        null,
        {
            home: { position: allOffsets[0][1], rotation: 0, isHalf: true, scale: 1 },
            category: { position: allOffsets[1][0], rotation: 120, isHalf: true, scale: 0.9, offsets: { x: 2.325, y: -5.65 } },
            post: { position: allOffsets[0][1], rotation: 0, isHalf: true, scale: 1 },
        },
        null,
    ],

    // 1
    [
        null,
        {
            home: { position: allOffsets[1][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[1][0], rotation: -60, isHalf: true, scale: 0.975, offsets: { x: 0.1, y: 0.3 } },
            post: { position: allOffsets[1][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[1][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[3][0], rotation: 120, isHalf: false, scale: 1 },
            post: { position: allOffsets[1][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 2
    [
        {
            home: { position: allOffsets[2][0], rotation: -60, isHalf: true, scale: 1 },
            category: { position: allOffsets[0][2], rotation: -120, isHalf: true, scale: 0.8, offsets: { x: 20.35, y: 6.75 } },
            post: { position: allOffsets[2][0], rotation: -60, isHalf: true, scale: 1 },
        },
        {
            home: { position: allOffsets[2][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[2][0], rotation: 120, isHalf: false, scale: 0.5, offsets: { x: -28.35, y: -6.4 } },
            post: { position: allOffsets[2][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[2][2], rotation: 60, isHalf: true, scale: 1 },
            category: { position: allOffsets[1][3], rotation: -60, isHalf: true, scale: 0.65, offsets: { x: -1.9, y: 4.55 } },
            post: { position: allOffsets[2][2], rotation: 60, isHalf: true, scale: 1 },
        },
    ],

    // 3
    [
        null,
        {
            home: { position: allOffsets[3][1], rotation: -60, isHalf: false, scale: 1 },
            category: { position: allOffsets[7][0], rotation: 0, isHalf: false, scale: 0.8, offsets: { x: 1.35, y: -6.5 } }, // "Active" position
            post: { position: allOffsets[3][1], rotation: 0, isHalf: false, scale: 1 },
            title: 'code',
            url: '0',
        },
        {
            home: { position: allOffsets[3][2], rotation: 60, isHalf: false, scale: 1 },
            category: { position: allOffsets[8][0], rotation: 0, isHalf: false, scale: 0.5, offsets: { x: -15.575, y: -2.5 } },
            post: { position: allOffsets[3][2], rotation: 0, isHalf: false, scale: 1 },
            title: '3d',
            url: '1',
        },
        null,
    ],

    // 4 (Vertical center)
    [
        {
            home: { position: allOffsets[4][0], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[0][0], rotation: 60, isHalf: true, scale: 0.35, offsets: { x: -8.15, y: 0.25 } },
            post: { position: allOffsets[4][0], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[0][2], rotation: 0, isHalf: false, scale: 0.5, offsets: { x: 11.75, y: 3.125 } },
            post: { position: allOffsets[4][1], rotation: 0, isHalf: false, scale: 1 },
            title: 'mnu',
            url: 'menu',
        },
        {
            home: { position: allOffsets[4][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[3][3], rotation: 0, isHalf: false, scale: 1, offsets: { x: 0, y: 0.2 } },
            post: { position: allOffsets[4][2], rotation: 0, isHalf: false, scale: 1 },
        },
    ],

    // 5
    [
        null,
        {
            home: { position: allOffsets[5][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[4][0], rotation: 0, isHalf: true, scale: 0.35, offsets: { x: -26.75, y: 0.35 } },
            post: { position: allOffsets[5][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[5][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[4][2], rotation: 0, isHalf: false, scale: 0.55, offsets: { x: 21.25, y: 7.1 } },
            post: { position: allOffsets[5][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 6
    [
        {
            home: { position: allOffsets[6][0], rotation: -120, isHalf: true, scale: 1 },
            category: { position: allOffsets[4][0], rotation: 60, isHalf: true, scale: 0.47, offsets: { x: -28.5, y: -6.1 } },
            post: { position: allOffsets[6][0], rotation: -120, isHalf: true, scale: 1 },
        },
        {
            home: { position: allOffsets[6][1], rotation: 180, isHalf: false, scale: 1 },
            category: { position: allOffsets[7][0], rotation: 0, isHalf: false, scale: 0.37, offsets: { x: 11.3, y: 3.575 } },
            post: { position: allOffsets[6][1], rotation: 0, isHalf: false, scale: 1 },
            title: 'log',
            url: '3',
        },
        {
            home: { position: allOffsets[6][2], rotation: 120, isHalf: true, scale: 1 },
            category: { position: allOffsets[5][3], rotation: 120, isHalf: true, scale: 0.55, offsets: { x: 2.5, y: 8.5 } },
            post: { position: allOffsets[6][2], rotation: 120, isHalf: true, scale: 1 },
        },
    ],

    // 7
    [
        null,
        {
            home: { position: allOffsets[7][1], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[5][0], rotation: -60, isHalf: false, scale: 0.75, offsets: { x: 1.45, y: -3 } },
            post: { position: allOffsets[7][1], rotation: 0, isHalf: false, scale: 1 },
        },
        {
            home: { position: allOffsets[7][2], rotation: 0, isHalf: false, scale: 1 },
            category: { position: allOffsets[6][2], rotation: -60, isHalf: true, scale: 1, offsets: { x: 19.125, y: 1.5 } },
            post: { position: allOffsets[7][2], rotation: 0, isHalf: false, scale: 1 },
        },
        null,
    ],

    // 8
    [
        null,
        {
            home: { position: allOffsets[8][1], rotation: 180, isHalf: true, scale: 1 },
            category: { position: allOffsets[8][2], rotation: 0, isHalf: false, scale: 0.6, offsets: { x: 16.5, y: -3.35 } },
            post: { position: allOffsets[8][1], rotation: 180, isHalf: true, scale: 1 },
        },
        null,
    ],
];

export default hexShape;

import configJSON from '../config/config.json';
import { HexagonData, HexagonLink, NavigationExpansionState, ZustandStore } from '../types/types';
import { useZustand } from './zustand';

const { store_toggleMenu, store_setPostNavState } = useZustand.getState().methods;

const {
    hexMenu: { columns, scaleUp },
} = configJSON;

export const staticValues = {
    heightAspect: {
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

const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

const tan60 = Math.tan(degToRad(60));

const allOffsets = Array.from({ length: 9 }).map((_, rowIndex) =>
    Array.from({ length: rowIndex % 2 === 0 ? 3 : 4 }).map((_, colIndex) => getOffsetsAndScale(colIndex, rowIndex)),
);
const defaultPosition = { x: 0, y: 0 };

const hexShape: (Record<NavigationExpansionState, HexagonData> | (Record<NavigationExpansionState, HexagonData> & HexagonLink) | null)[][] = [
    // 0
    [
        null,
        {
            home: { position: allOffsets[0]?.[1] ?? defaultPosition, rotation: 0, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[1]?.[0] ?? defaultPosition,
                rotation: 120,
                isHalf: true,
                scale: 1.1,
                offsets: { x: 5, y: -4.75 },
                isRightSide: false,
            }, // L1
            post: {
                position: allOffsets[1]?.[1] ?? defaultPosition,
                rotation: 30,
                isHalf: true,
                scale: 0,
                isRightSide: false,
                offsets: { x: 2.325, y: -5.65 },
            },
        },

        // Post controls, only available in that component
        {
            home: { position: allOffsets[0]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            category: { position: allOffsets[1]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            post: {
                position: allOffsets[0]?.[2] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.2,
                offsets: { x: 2.1, y: 4.25 },
                isRightSide: true,
            },
            svgIconPath: '/svg/ChevronLeftOutline.svg',
            target: () => store_setPostNavState('prev'),
        },
        {
            home: { position: allOffsets[0]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            category: { position: allOffsets[0]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            post: {
                position: allOffsets[0]?.[2] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.2,
                offsets: { x: 5.9, y: 1.75 },
                isRightSide: true,
            },
            svgIconPath: '/svg/XMarkOutline.svg',
            target: () => store_setPostNavState('close'),
        },
        {
            home: { position: allOffsets[0]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            category: { position: allOffsets[3]?.[3] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, isRightSide: false },
            post: {
                position: allOffsets[0]?.[2] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.2,
                offsets: { x: 9.7, y: 4.25 },
                isRightSide: true,
            },
            svgIconPath: '/svg/ChevronRightOutline.svg',
            target: () => store_setPostNavState('next'),
        },
    ],

    // 1
    [
        null,
        {
            home: { position: allOffsets[1]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[1]?.[0] ?? defaultPosition,
                rotation: -60,
                isHalf: true,
                scale: 0.8,
                offsets: { x: 3.25, y: 5.925 },
                isRightSide: false,
            }, // L4
            post: { position: allOffsets[1]?.[1] ?? defaultPosition, rotation: 90, isHalf: true, scale: 0, offsets: { x: 0.1, y: 0.3 }, isRightSide: false },
        },
        {
            home: { position: allOffsets[1]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[3]?.[0] ?? defaultPosition,
                rotation: 120,
                isHalf: false,
                scale: 0.65,
                offsets: { x: -2.25, y: 3.35 },
                isRightSide: false,
            }, // L6
            post: {
                position: allOffsets[7]?.[3] ?? defaultPosition,
                rotation: 30,
                isHalf: false,
                scale: 0.35,
                offsets: { x: -7.5, y: 9.5 },
                isRightSide: true,
            }, // Bottom right
        },
        null,
    ],

    // 2
    [
        {
            home: { position: allOffsets[2]?.[0] ?? defaultPosition, rotation: -60, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[0]?.[2] ?? defaultPosition,
                rotation: -120,
                isHalf: true,
                scale: 1,
                offsets: { x: 17.85, y: 7.25 },
                isRightSide: true,
            }, // R1
            post: { position: allOffsets[0]?.[1] ?? defaultPosition, rotation: 30, isHalf: true, scale: 0, offsets: { x: 20.35, y: 6.75 }, isRightSide: false },
        },
        {
            home: { position: allOffsets[2]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[3]?.[0] ?? defaultPosition,
                rotation: 120,
                isHalf: false,
                scale: 0.5,
                offsets: { x: -7.3, y: -17 },
                isRightSide: false,
            }, // L3
            post: {
                position: allOffsets[0]?.[2] ?? defaultPosition,
                rotation: -90,
                isHalf: false,
                scale: 0.35,
                offsets: { x: 12, y: 3.5 },
                isRightSide: true,
            }, // Top right
        },
        {
            home: { position: allOffsets[2]?.[2] ?? defaultPosition, rotation: 60, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[1]?.[3] ?? defaultPosition,
                rotation: 60,
                isHalf: true,
                scale: 0.75,
                offsets: { x: -2.4, y: -0.9 },
                isRightSide: true,
            }, // R2
            post: { position: allOffsets[1]?.[2] ?? defaultPosition, rotation: 90, isHalf: true, scale: 0, offsets: { x: -1.9, y: 4.55 }, isRightSide: false },
        },
    ],

    // 3
    [
        null,
        {
            home: { position: allOffsets[3]?.[1] ?? defaultPosition, rotation: -60, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[7]?.[0] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.8,
                offsets: { x: 1.35, y: -3.75 },
                isRightSide: false,
            }, // "Active" position
            post: { position: allOffsets[5]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, offsets: { x: 6.25, y: 1 }, isRightSide: false },
            title: 'code',
            target: '/0',
        },
        {
            home: { position: allOffsets[3]?.[2] ?? defaultPosition, rotation: 60, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[8]?.[0] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.5,
                offsets: { x: -15.575, y: -2 },
                isRightSide: false,
            },
            post: { position: allOffsets[6]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, offsets: { x: -12.5, y: 0 }, isRightSide: false },
            title: '3d',
            target: '/1',
        },
        null,
    ],

    // 4 (Vertical center)
    [
        {
            home: { position: allOffsets[4]?.[0] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[0]?.[0] ?? defaultPosition,
                rotation: 120,
                isHalf: true,
                scale: 0.25,
                offsets: { x: -8.7, y: 8.5 },
                isRightSide: false,
            }, // L2
            post: {
                position: allOffsets[0]?.[1] ?? defaultPosition,
                rotation: -90,
                isHalf: true,
                scale: 0,
                offsets: { x: -8.15, y: 0.25 },
                isRightSide: false,
            },
        },

        {
            home: { position: allOffsets[4]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[1]?.[3] ?? defaultPosition,
                rotation: 180,
                isHalf: true,
                scale: 0.3,
                offsets: { x: 2, y: 12.75 },
                isRightSide: true,
            }, // R3
            post: { position: allOffsets[0]?.[1] ?? defaultPosition, rotation: 30, isHalf: false, scale: 0, offsets: { x: 11.75, y: 3.1 }, isRightSide: false },
        },

        {
            home: { position: allOffsets[4]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[3]?.[3] ?? defaultPosition,
                rotation: 120,
                isHalf: false,
                scale: 1,
                offsets: { x: -1.6, y: -1.25 },
                isRightSide: true,
            }, // R4
            post: {
                position: allOffsets[7]?.[0] ?? defaultPosition,
                rotation: -90,
                isHalf: false,
                scale: 0.35,
                offsets: { x: 7.5, y: 9.75 },
                isRightSide: false,
            }, // Bottom Left
        },

        // Further UI:
        {
            home: { position: allOffsets[4]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0.3, offsets: { x: 0, y: -2.25 }, isRightSide: false },
            category: {
                position: allOffsets[1]?.[3] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.275,
                offsets: { x: -4.25, y: 10.6 },
                isRightSide: true,
            },
            post: {
                position: allOffsets[6]?.[0] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.25,
                offsets: { x: -12.5, y: 5 },
                isRightSide: false,
            },
            title: 'contact',
            svgIconPath: '/svg/ChatBubbleLeftRightOutline.svg',
            target: (ev) => store_toggleMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            home: {
                position: allOffsets[4]?.[1] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.25,
                offsets: { x: -5.5, y: 1.5 },
                isRightSide: false,
            },
            category: {
                position: allOffsets[2]?.[2] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.225,
                offsets: { x: 9.15, y: 1.15 },
                isRightSide: true,
            },
            post: { position: allOffsets[7]?.[0] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0.2, offsets: { x: 6.25, y: 0 }, isRightSide: false },
            title: 'config',
            svgIconPath: '/svg/AdjustmentsHorizontalOutline.svg',
            target: (ev) => store_toggleMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            home: { position: allOffsets[4]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0.25, offsets: { x: 5.5, y: 1.5 }, isRightSide: false },
            category: { position: allOffsets[1]?.[3] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, offsets: { x: -6, y: 1.9 }, isRightSide: false },
            post: { position: allOffsets[6]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, offsets: { x: 12.5, y: 0 }, isRightSide: false },
            title: 'login',
            svgIconPath: '/svg/UserIconOutline.svg',
            target: () => {},
        },

        // Appears only in 'category' and 'post' expansionState:
        {
            home: { position: allOffsets[4]?.[1] ?? defaultPosition, rotation: 180, isHalf: false, scale: 0, offsets: { x: -3.125, y: 0 }, isRightSide: false },
            category: {
                position: allOffsets[1]?.[3] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.225,
                offsets: { x: -9.65, y: 7.1 },
                isRightSide: true,
            },
            post: {
                position: allOffsets[1]?.[3] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.175,
                offsets: { x: -6.25, y: -1.5625 },
                isRightSide: true,
            },
            title: 'home',
            svgIconPath: '/svg/HomeOutline.svg',
            target: () => {
                store_toggleMenu({ name: null });
                return '/';
            },
        },
    ],

    // 5
    [
        null,
        {
            home: { position: allOffsets[5]?.[1] ?? defaultPosition, rotation: 60, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[4]?.[0] ?? defaultPosition,
                rotation: -60,
                isHalf: true,
                scale: 0.3,
                offsets: { x: -13.1, y: -4.65 },
                isRightSide: false,
            }, // L7
            post: {
                position: allOffsets[4]?.[1] ?? defaultPosition,
                rotation: 150,
                isHalf: true,
                scale: 0,
                offsets: { x: -26.75, y: 0.35 },
                isRightSide: false,
            },
        },
        {
            home: { position: allOffsets[5]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[4]?.[2] ?? defaultPosition,
                rotation: 60,
                isHalf: false,
                scale: 0.725,
                offsets: { x: 15.6, y: 6.55 },
                isRightSide: true,
            }, // R5
            post: { position: allOffsets[4]?.[1] ?? defaultPosition, rotation: -90, isHalf: false, scale: 0, offsets: { x: 16, y: 7.1 }, isRightSide: false },
        },
        null,
    ],

    // 6
    [
        {
            home: { position: allOffsets[6]?.[0] ?? defaultPosition, rotation: -120, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[4]?.[0] ?? defaultPosition,
                rotation: 0,
                isHalf: true,
                scale: 0.65,
                offsets: { x: -20.075, y: -22 },
                isRightSide: false,
            }, // L5
            post: {
                position: allOffsets[4]?.[1] ?? defaultPosition,
                rotation: -90,
                isHalf: true,
                scale: 0,
                offsets: { x: -28.5, y: -6.1 },
                isRightSide: false,
            },
        },
        {
            home: { position: allOffsets[6]?.[1] ?? defaultPosition, rotation: 180, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[7]?.[0] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.37,
                offsets: { x: 11.5, y: 4.45 },
                isRightSide: false,
            },
            post: { position: allOffsets[7]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 0, offsets: { x: 6.25, y: -1 }, isRightSide: false },
            title: 'log',
            target: '/3',
        },
        {
            home: { position: allOffsets[6]?.[2] ?? defaultPosition, rotation: 120, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[5]?.[3] ?? defaultPosition,
                rotation: 120,
                isHalf: true,
                scale: 0.7,
                offsets: { x: -3.6, y: 8.6 },
                isRightSide: true,
            }, // R6
            post: { position: allOffsets[5]?.[2] ?? defaultPosition, rotation: -90, isHalf: true, scale: 0, offsets: { x: -2.75, y: 8.5 }, isRightSide: false },
        },
    ],

    // 7
    [
        null,
        {
            home: { position: allOffsets[7]?.[1] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[5]?.[0] ?? defaultPosition,
                rotation: -60,
                isHalf: false,
                scale: 1.075,
                offsets: { x: 2.4, y: -1.3 },
                isRightSide: false,
            }, // L8
            post: { position: allOffsets[5]?.[1] ?? defaultPosition, rotation: 60, isHalf: false, scale: 0, offsets: { x: 1.45, y: -3 }, isRightSide: false },
        },
        {
            home: { position: allOffsets[7]?.[2] ?? defaultPosition, rotation: 0, isHalf: false, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[6]?.[2] ?? defaultPosition,
                rotation: -60,
                isHalf: true,
                scale: 1.1,
                offsets: { x: 16.1, y: 1.75 },
                isRightSide: true,
            }, // R7
            post: { position: allOffsets[6]?.[1] ?? defaultPosition, rotation: 30, isHalf: true, scale: 0, offsets: { x: 13.9, y: 1.5 }, isRightSide: false },
        },
        null,
    ],

    // 8
    [
        null,
        {
            home: { position: allOffsets[8]?.[1] ?? defaultPosition, rotation: 180, isHalf: true, scale: 1, isRightSide: false },
            category: {
                position: allOffsets[8]?.[2] ?? defaultPosition,
                rotation: 0,
                isHalf: false,
                scale: 0.7,
                offsets: { x: 12, y: -3.35 },
                isRightSide: true,
            }, // R8
            post: {
                position: allOffsets[0]?.[0] ?? defaultPosition,
                rotation: -30,
                isHalf: false,
                scale: 0.35,
                offsets: { x: -12, y: 3.5 },
                isRightSide: false,
            }, // Top left
        },
        null,
    ],
];

export const regularHexagons: Record<NavigationExpansionState, HexagonData>[] = [];
export const buttonHexagons: (Record<NavigationExpansionState, HexagonData> & HexagonLink)[] = [];

hexShape.forEach((hexRow) =>
    hexRow.forEach((hexCol) => {
        if (hexCol) {
            if (
                (hexCol as Record<NavigationExpansionState, HexagonData> & HexagonLink).title ||
                (hexCol as Record<NavigationExpansionState, HexagonData> & HexagonLink).svgIconPath
            ) {
                buttonHexagons.push(hexCol as Record<NavigationExpansionState, HexagonData> & HexagonLink);
            } else {
                regularHexagons.push(hexCol);
            }
        }
    }),
);

export const roundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5);
export const halfRoundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5, true);

export const subMenuButtonHexagonPath = getHexagonPath(0.5, 0.1);

export function getShapePaths(styleIndex: number, aspectRatio: number) {
    let shapePath;
    switch (styleIndex) {
        // isFirst
        case 0:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,${0.075} 
                    L${0.075 / aspectRatio / tan60},0 
                    
                    L${1 - 0.025 / aspectRatio / tan60},0 
                    L1,${0.025} 

                    L1,1 
                    L1,1 
                    
                    L${0.125 / aspectRatio / tan60},1 
                    L0,${1 - 0.125}
                    Z`;

            break;

        case 1:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,${0.05} 
                    L${0.05 / aspectRatio / tan60},0 
                    
                    L1,0 
                    L1,0 

                    L1,${1 - 0.05} 
                    L${1 - 0.05 / aspectRatio / tan60},1 
                    
                    L${0.375 / aspectRatio / tan60},1 
                    L0,${1 - 0.375}
                    Z`;

            break;

        case 2:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,0 
                    L0,0 
                    
                    L${1 - 0.05 / aspectRatio / tan60},0 
                    L1,${0.05} 

                    L1,${1 - 0.2125} 
                    L${1 - 0.2125 / aspectRatio / tan60},1 
                    
                    L${0.05 / aspectRatio / tan60},1 
                    L0,${1 - 0.05}
                    Z`;

            break;

        case 3:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,0 
                    L0,0 
                    
                    L${1 - 0.08 / aspectRatio / tan60},0 
                    L1,${0.08} 

                    L1,${1 - 0.08} 
                    L${1 - 0.08 / aspectRatio / tan60},1 
                    
                    L0,1 
                    L0,1
                    Z`;

            break;

        case 4:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,0 
                    L0,0 
                    
                    L${1 - 0.08 / aspectRatio / tan60},0 
                    L1,${0.08} 

                    L1,${1 - 0.225} 
                    L${1 - 0.225 / aspectRatio / tan60},1 
                    
                    L0,1 
                    L0,1
                    Z`;

            break;

        case 5:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,${0.15} 
                    L${0.15 / aspectRatio / tan60},0 
                    
                    L${1 - 0.4 / aspectRatio / tan60},0 
                    L1,${0.4} 

                    L1,${1 - 0.15} 
                    L${1 - 0.15 / aspectRatio / tan60},1 
                    
                    L0,1 
                    L0,1
                    Z`;

            break;

        case 6:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,${0.15} 
                    L${0.15 / aspectRatio / tan60},0 
                    
                    L${1 - 0.15 / aspectRatio / tan60},0 
                    L1,${0.15} 

                    L1,1 
                    L1,1 
                    
                    L0,1 
                    L0,1
                    Z`;
            break;

        case 7:
            // top left; top right; bottom right; bottom left
            shapePath = `
                    M0,${0.15} 
                    L${0.15 / aspectRatio / tan60},0 
                    
                    L${1 - 0.15 / aspectRatio / tan60},0 
                    L1,${0.15} 

                    L1,1 
                    L1,1 
                    
                    L0,1 
                    L0,1
                    Z`;

            break;

        default:
            shapePath = 'M0,0 L1,0 L1,1 L0,1 Z';
    }

    return shapePath;
}

export function getHexagonalClipPath(
    y_NormalizedPercent: number,
    parentSize: { width: number; height: number },
    options?: {
        multipliers?: { x?: number; y?: number };
        shape?: 'full' | 'top-left' | 'top-right' | 'bottom' | 'slant-right';
    },
) {
    const { multipliers, shape } = options ?? {};

    const width = parentSize.width * (multipliers?.x ?? 1);
    const height = parentSize.height * (multipliers?.y ?? 1);
    const aspectRatio = width / height;

    const y_Percent = y_NormalizedPercent * 100;
    const x_Percent = y_Percent / aspectRatio / tan60;

    const actualShape = shape ?? 'full';

    switch (actualShape) {
        case 'full':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, calc(100% - ${x_Percent}%) 0%, 100% ${y_Percent}%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, ${x_Percent}% 100%, 0% calc
            (100% - ${y_Percent}%))`;

        case 'top-left':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, 100% 0%, 100% 100%, 0% 100%)`;

        case 'top-right':
            return `polygon(0% 0%, calc(100% - ${x_Percent}%) 0%, 100% ${y_Percent}%, 100% 100%, 0% 100%)`;

        case 'bottom':
            return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, ${x_Percent}% 100%, 0% calc(100% - ${y_Percent}%))`;

        case 'slant-right':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, 100% 0%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, 0% 100%)`;
    }
}

/* Local functions */

function getOffsetsAndScale(column: number, row: number) {
    const shouldAdjustGlobalXOffset = ((columns * 3 - 1) / 2) % 2 == 0;
    const xOffsetPerRow = row % 2 === 0 ? (shouldAdjustGlobalXOffset ? 0 : 0.75) : shouldAdjustGlobalXOffset ? -0.75 : 0;
    const xValue = (1.5 * column + xOffsetPerRow) * scaleUp;

    const yOffsetPerRow = (staticValues.heightAspect.flatTop * scaleUp) / 2;
    const yValue = (row - 1) * yOffsetPerRow;

    return {
        x: xValue,
        y: yValue,
    };
}

function getHexagonPath(sideLength = 1, cornerRadius = 8, isHalf = false) {
    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspect.flatTop;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);
        points.push({ x, y });
    }

    const cornerSinOffset = cornerRadius * sin(30);
    const cornerCosOffset = cornerRadius * cos(30);

    return isHalf
        ? ` M ${points[0]!.x + cornerSinOffset},${points[0]!.y + cornerCosOffset}   \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffset * 2},${points[0]!.y}   \
            \
            L ${points[1]!.x + cornerSinOffset},${points[0]!.y} \
            Q ${points[1]!.x},${points[0]!.y} ${points[1]!.x + cornerSinOffset * 2},${points[0]!.y}   \
            \
            L ${points[2]!.x - cornerSinOffset * 2},${points[3]!.y} \
            Q ${points[2]!.x},${points[3]!.y} ${points[2]!.x + cornerSinOffset},${points[3]!.y}   \
            \
            L ${points[3]!.x - cornerSinOffset * 2},${points[3]!.y} \
            Q ${points[3]!.x},${points[0]!.y} ${points[3]!.x - cornerSinOffset},${points[3]!.y + cornerCosOffset} \
            \
            L ${points[4]!.x + cornerSinOffset},${points[4]!.y - cornerCosOffset}   \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffset * 2},${points[4]!.y}   \
            \
            L ${points[5]!.x + cornerSinOffset * 2},${points[5]!.y} \
            Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffset},${points[5]!.y - cornerCosOffset} \
            \
            Z`
        : ` M ${points[0]!.x + cornerSinOffset},${points[0]!.y + cornerCosOffset} \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffset},${points[0]!.y - cornerCosOffset} \
            \
            L ${points[1]!.x - cornerSinOffset},${points[1]!.y + cornerCosOffset} \
            Q ${points[1]!.x},${points[1]!.y} ${points[1]!.x + cornerSinOffset * 2},${points[1]!.y} \
            \
            L ${points[2]!.x - cornerSinOffset * 2},${points[2]!.y} \
            Q ${points[2]!.x},${points[2]!.y} ${points[2]!.x + cornerSinOffset},${points[2]!.y + cornerCosOffset} \
            \
            L ${points[3]!.x - cornerSinOffset},${points[3]!.y - cornerCosOffset} \
            Q ${points[3]!.x},${points[3]!.y} ${points[3]!.x - cornerSinOffset},${points[3]!.y + cornerCosOffset} \
            \
            L ${points[4]!.x + cornerSinOffset},${points[4]!.y - cornerCosOffset} \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffset * 2},${points[4]!.y} \
            \
            L ${points[5]!.x + cornerSinOffset * 2},${points[5]!.y} \
            Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffset},${points[5]!.y - cornerCosOffset} \
            \
            Z`;
}

const getMenuButtonPosition = (ev: React.MouseEvent<SVGGElement, MouseEvent>) => {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();
    const position: ZustandStore['values']['activeMenuButton']['positionAndSize'] = { x: left, y: top, width, height };
    return position;
};

function degToRad(deg: number) {
    return (Math.PI / 180) * deg;
}
function sin(deg: number) {
    return Math.sin(degToRad(deg));
}
function cos(deg: number) {
    return Math.cos(degToRad(deg));
}

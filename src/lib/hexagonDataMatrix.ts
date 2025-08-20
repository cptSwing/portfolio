import { config } from '../types/exportTyped';
import { ROUTE } from '../types/enums';
import {
    HexagonMenuButtonRouteData,
    HexagonNavigationCategoryButtonRouteData,
    HexagonNavigationDefaultButtonRouteData,
    HexagonRouteData,
    ZustandStore,
} from '../types/types';
import { useZustand } from './zustand';

const { store_toggleMenu, store_setPostNavigationState } = useZustand.getState().methods;

const {
    ui: {
        hexMenu: { columns, rows, scaleUp },
    },
} = config;

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

const tan60 = Math.tan(degToRad(60));
const sin30 = sin(30);
const cos30 = cos(30);
export const matrixNearZeroScale = 0.0001; // value 0 can not be transitioned to / animated in a matrix() transform

const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

// x: -50 = hex sits on the SVG parent's X:0; total width = 100
// y: -43.3 = hex sits on SVG parent's Y:0 (total height 86.6)
// viewBoxes['hexFlat'] : 0 0 400 346.4 --> (400x0.866)

export const regularHexagons: HexagonRouteData[] = [
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 0,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -49.925,
                y: -8.95,
            },
            rotation: 120,
            isHalf: true,
            scale: 1.075,
            shouldOffset: false,
        }, // L1
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 30,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -67.5,
                y: 25.98,
            },
            rotation: -60,
            isHalf: true,
            scale: 0.8,
            shouldOffset: false,
        }, // L4
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -81.25,
                y: 121,
            },
            rotation: 120,
            isHalf: false,
            scale: 0.7,
            shouldOffset: false,
        }, // L6
        [ROUTE.post]: {
            position: {
                x: 345,
                y: 290,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.35,
            shouldOffset: true,
        }, // Bottom right
    },

    {
        [ROUTE.home]: {
            position: {
                x: 0,
                y: 43.3,
            },
            rotation: -60,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: -9.5,
            },
            rotation: -120,
            isHalf: true,
            scale: 1.05,
            shouldOffset: true,
        }, // R1
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -101.75,
                y: 38.8,
            },
            rotation: 120,
            isHalf: false,
            scale: 0.5,
            shouldOffset: false,
        }, // L3
        [ROUTE.post]: {
            position: {
                x: 345,
                y: -32,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.35,
            shouldOffset: true,
        }, // Top right
    },
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: 43.3,
            },
            rotation: 60,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 364,
                y: -24.5,
            },
            rotation: 60,
            isHalf: true,
            scale: 0.65,
            shouldOffset: true,
        }, // R2
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 0,
                y: 129.9,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -35,
                y: -9.5,
            },
            rotation: 120,
            isHalf: true,
            scale: 0.25,
            shouldOffset: false,
        }, // L2
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: -90,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 385,
                y: 40,
            },
            rotation: 60,
            isHalf: true,
            scale: 0.395,
            shouldOffset: true,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: 129.9,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 382.5,
                y: 63.25,
            },
            rotation: 120,
            isHalf: false,
            scale: 0.75,
            shouldOffset: true,
        }, // R4
        [ROUTE.post]: {
            position: {
                x: -45,
                y: 290,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.35,
            shouldOffset: false,
        }, // Bottom Left
    },

    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: -60,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -73.2,
                y: 171.5,
            },
            rotation: -60,
            isHalf: true,
            scale: 0.37,
            shouldOffset: false,
        }, // L7
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 150,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 381.5,
                y: 126.5,
            },
            rotation: 60,
            isHalf: false,
            scale: 0.7,
            shouldOffset: true,
        }, // R5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 0,
                y: 216.5,
            },
            rotation: -120,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -81.5,
                y: 62,
            },
            rotation: 0,
            isHalf: true,
            scale: 0.65,
            shouldOffset: false,
        }, // L5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: 216.5,
            },
            rotation: 120,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 379.5,
                y: 185.5,
            },
            rotation: 120,
            isHalf: true,
            scale: 0.65,
            shouldOffset: true,
        }, // R6
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -81.75,
                y: 182,
            },
            rotation: 120,
            isHalf: true,
            scale: 0.7,
            shouldOffset: false,
        }, // L8
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 60,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 225,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 371,
                y: 204.5,
            },
            rotation: -60,
            isHalf: true,
            scale: 1.1,
            shouldOffset: true,
        }, // R7
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 30,
            isHalf: true,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 303.1,
            },
            rotation: 180,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 360,
                y: 282.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.7,
            shouldOffset: true,
        }, // R8
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.35,
            shouldOffset: false,
        }, // Top left
    },
];

export const navigationButtonHexagons: (HexagonNavigationDefaultButtonRouteData | HexagonNavigationCategoryButtonRouteData)[] = [
    // Category Links
    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 86.6,
            },
            rotation: -60,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -62,
                y: 275,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.825,
            shouldOffset: false,
        }, // "Active" position
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        name: 'code',
        title: 'code',
        target: '/0',
    },
    {
        [ROUTE.home]: {
            position: {
                x: 225,
                y: 86.6,
            },
            rotation: 60,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -68.75,
                y: 213.7,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.565,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        name: '3d',
        title: '3d',
        target: '/1',
    },
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 180,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: -104,
                y: 239.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.4,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        name: 'log',
        title: 'log',
        target: '/3',
    },

    // Appears only in '[ROUTE.category]' and '[ROUTE.post]' routeData:
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 180,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 351,
                y: 9.25,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: -50,
                y: 211,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: false,
        },
        name: 'home',
        title: '',
        svgIconPath: '/svg/HomeOutline.svg',
        target: () => {
            store_toggleMenu({ name: null });
            return '/';
        },
    },
];

export const menuButtonHexagons: HexagonMenuButtonRouteData[] = [
    // Further UI:
    {
        [ROUTE.home]: {
            position: {
                x: 172.5,
                y: 134.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        name: 'login',
        title: 'login',
        svgIconPath: '/svg/UserIconOutline.svg',
        target: () => {},
    },

    {
        [ROUTE.home]: {
            position: {
                x: 127.5,
                y: 134.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 351.5,
                y: 29.25,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: -50,
                y: 232.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.25,
            shouldOffset: false,
        },
        name: 'config',
        title: 'opts',
        svgIconPath: '/svg/AdjustmentsHorizontalOutline.svg',
        target: (ev) => store_toggleMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },

    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 122,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 373.25,
                y: 17.75,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.3,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: -50,
                y: 257.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
            shouldOffset: false,
        },
        name: 'contact',
        title: 'me!',
        svgIconPath: '/svg/ChatBubbleLeftRightOutline.svg',
        target: (ev) => store_toggleMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },

    // Only available in Post route:
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 312.5,
                y: -29.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: true,
        },
        name: 'previous',
        svgIconPath: '/svg/ChevronLeftOutline.svg',
        target: () => store_setPostNavigationState('prev'),
    },

    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: 86.6,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 341.5,
                y: -29.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: true,
        },
        name: 'next',
        svgIconPath: '/svg/ChevronRightOutline.svg',
        target: () => store_setPostNavigationState('next'),
    },

    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: matrixNearZeroScale,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 327,
                y: -37.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: true,
        },
        name: 'close',
        svgIconPath: '/svg/XMarkOutline.svg',
        target: () => store_setPostNavigationState('close'),
    },
];

export const roundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5);
export const halfRoundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5, true);
export const subMenuButtonHexagonPath = getHexagonPath(0.5, 0.1);

type Point = [number, number];
type PointOpts = {
    point: Point;
    customRadius?: number;
    useAspectRatio?: boolean;
};

function roundedPolygon(points: PointOpts[], cornerRadius: number, aspectRatio = 1): string {
    if (points.length < 3) return '';

    const pathParts: string[] = [];
    const length = points.length;

    const radius = cornerRadius;

    for (let i = 0; i < length; i++) {
        const withOpts = points[i]!;
        const r = withOpts.customRadius ?? radius;
        const aspect = withOpts.useAspectRatio ? aspectRatio : 1;

        const previous = points[(i - 1 + length) % length]!.point;
        const current = points[i]!.point;
        const next = points[(i + 1) % length]!.point;

        // Direction vectors
        const inVector: Point = [current[0] - previous[0], current[1] - previous[1]];
        const outVector: Point = [next[0] - current[0], next[1] - current[1]];

        // Normalize vectors
        const inLength = Math.hypot(inVector[0], inVector[1]);
        const outLength = Math.hypot(outVector[0], outVector[1]);

        const inDirection: Point = [inVector[0] / inLength, inVector[1] / inLength];
        const outDirection: Point = [outVector[0] / outLength, outVector[1] / outLength];

        // Entry and exit points
        const entry: Point = [current[0] - inDirection[0] * r, current[1] - inDirection[1] * r];
        const exit: Point = [current[0] + outDirection[0] * r, current[1] + outDirection[1] * r];

        if (i === 0) {
            pathParts.push(`M ${entry[0] / aspect},${entry[1]}`);
        } else {
            pathParts.push(`L ${entry[0] / aspect},${entry[1]}`);
        }

        pathParts.push(`Q ${current[0]},${current[1]} ${exit[0] / aspect},${exit[1]}`);
    }

    pathParts.push('Z');
    return pathParts.join(' ');
}

function getCategoryCardPath(styleIndex: number, aspectRatio: number): string {
    const cornerRadius = 0.0175;

    let path;

    switch (styleIndex) {
        // isFirst
        case 0:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0.41] },
                    { point: [0.41 / aspectRatio / tan60, 0] },

                    { point: [1, 0] },

                    { point: [1, 1] },
                    { point: [0.9075, 1] },
                    { point: [0.9075, 0.91] },
                    { point: [0.51, 0.91] },
                    { point: [0.51, 1] },

                    { point: [0, 1] },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 1:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0] },

                    { point: [0.645, 0] },
                    { point: [0.645, 0.12] },
                    { point: [1, 0.12] },

                    { point: [1, 1] },

                    { point: [0.325 / aspectRatio / tan60, 1] },
                    { point: [0, 1 - 0.325] },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 2:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0.12] },
                    { point: [0.215, 0.12] },
                    { point: [0.215, 0] },

                    { point: [1, 0] },

                    { point: [1, 1 - 0.19] },
                    { point: [1 - 0.19 / aspectRatio / tan60, 1] },

                    { point: [0, 1], useAspectRatio: true },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 3:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon([{ point: [0, 0] }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1] }], cornerRadius, aspectRatio);
            break;
        case 4:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;

        case 5:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0], useAspectRatio: true },

                    { point: [1 - 0.2 / aspectRatio / tan60, 0] },
                    { point: [1, 0.2] },

                    { point: [1, 1] },

                    { point: [0, 1], useAspectRatio: true },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 6:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 7:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;

        default:
            path = 'M0,0 L1,0 L1,1 L0,1 Z';
    }

    return path;
}

export function getIndexCategoryCardPath(gridAreaIndex: number, width: number, height: number): string {
    const aspectRatio = width / height;
    const path = getCategoryCardPath(gridAreaIndex, aspectRatio);
    return path;
}

const _allOffsets = Array.from({ length: rows }).map((_, rowIndex) =>
    Array.from({ length: rowIndex % 2 === 0 ? 3 : 4 }).map((_, colIndex) => _getOffsetsAndScale(colIndex, rowIndex)),
);

/* Local functions */

function _getOffsetsAndScale(column: number, row: number): { x: number; y: number } {
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

function getHexagonPath(sideLength = 1, cornerRadius = 8, isHalf = false): string {
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

    const cornerSinOffset = cornerRadius * sin30;
    const cornerCosOffset = cornerRadius * cos30;

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

/**
 * Description placeholder
 *
 * @export
 * @param {number} y_NormalizedPercent Percentage value in 0 - 1 range
 * @param {{ width: number; height: number }} parentSize
 * @param {?{
 *         multipliers?: { x?: number; y?: number };
 *         shape?: 'full' | 'top-left' | 'top-right' | 'bottom' | 'slant-right';
 *     }} [options]
 * @returns {string}
 */
export function getHexagonalClipPath(
    y_NormalizedPercent: number,
    size: { width: number; height: number },
    options?: {
        multipliers?: { x?: number; y?: number };
        shape?: 'full' | 'top-left' | 'top-right' | 'bottom' | 'slant-right';
    },
): string {
    const { multipliers, shape } = options ?? {};
    const { width, height } = size;

    const clipWidth = width * (multipliers?.x ?? 1);
    const clipHeight = height * (multipliers?.y ?? 1);
    const aspectRatio = clipWidth / clipHeight;

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

function getMenuButtonPosition(ev: React.MouseEvent<SVGGElement, MouseEvent>): Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();
    const position: ZustandStore['values']['activeMenuButton']['positionAndSize'] = { x: left, y: top, width, height };
    return position;
}

export function degToRad(deg: number): number {
    return (Math.PI / 180) * deg;
}
export function sin(deg: number, clampTo?: number): number {
    const sinNum = Math.sin(degToRad(deg));
    return clampTo ? parseFloat(sinNum.toFixed(clampTo)) : sinNum;
}
export function cos(deg: number, clampTo?: number): number {
    const cosNum = Math.cos(degToRad(deg));
    return clampTo ? parseFloat(cosNum.toFixed(clampTo)) : cosNum;
}

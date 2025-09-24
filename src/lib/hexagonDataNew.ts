import { config } from '../types/exportTyped';
import { ROUTE } from '../types/enums';
import {
    CategoryNavigationButtonRouteData,
    HexagonRouteData,
    HexagonRouteDataTransformOffsets,
    HexagonTransformData,
    MenuButtonRouteData,
    PostNavigationButtonRouteData,
    ZustandStore,
} from '../types/types';
import { useZustand } from './zustand';
import roundToDecimal from './roundToDecimal';
import { BreakpointName } from '../hooks/useBreakPoint';

const { store_toggleSubMenu, store_toggleHamburgerMenu, store_setPostNavigationState } = useZustand.getState().methods;

const {
    ui: {
        hexMenu: { columns, rows, scaleUp, strokeWidth: strokeWidthDefault },
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

// TODO put to config? or a static.json?
export const viewBoxWidth = 400;
export const viewBoxHeight = viewBoxWidth * staticValues.heightAspect.flatTop;
export const viewBoxAspect = viewBoxWidth / viewBoxHeight;

const tan60 = Math.tan(degToRad(60));
const sin30 = sin(30);
const cos30 = cos(30);

const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

// Hex-Flat Orientation: Scale 1, Hex-Pointy Orientation: 1.154734 (??)
// x: -50 = hex sits on the parent's X:0; total width = 100
// y: -43.3 = hex sits on parent's Y:0 (total height 86.6)

// viewBoxes['hexFlat'] : 0 0 400 346.4 --> (400x0.866)

export const regularHexagons: HexagonRouteData[] = [
    // Appear everywhere:
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 120,
            isHalf: false,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 0,
            },
            rotation: 210,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
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
                x: 187.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
                x: 75,
                y: 129.9,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
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
                x: 187.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        }, // R2
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
            shouldOffset: false,
        },
    },

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
                x: 37.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
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
                x: 150,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        }, // L7
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 150,
            isHalf: true,
            scale: 0,
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
                x: 225,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        }, // R5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: false,
            scale: 0,
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
                x: 37.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        }, // L5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
                x: 262.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        }, // R6
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
                x: 150,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.35,
            shouldOffset: false,
        },
    },

    // Appear only after "Home"  (replace Nav menu buttons)
    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 86.6,
            },
            rotation: -60,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 64.5,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 225,
                y: 86.6,
            },
            rotation: 60,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 194.85,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
    },
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 180,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 262.5,
                y: 64.95,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.866,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
    },
];

// Half hexes in ROUTE.category
export const halfRegularHexagons: HexagonRouteData[] = [
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
                x: 0,
                y: 43.3,
            },
            rotation: -60,
            isHalf: true,
            scale: 2,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
                x: 300,
                y: 43.3,
            },
            rotation: 60,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
                x: 150,
                y: -43.3,
            },
            rotation: -360,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 60,
            isHalf: false,
            scale: 0,
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
                x: 0,
                y: 216.5,
            },
            rotation: -120,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
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
                x: 300,
                y: 216.5,
            },
            rotation: 120,
            isHalf: true,
            scale: 2,
            shouldOffset: true,
        },
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
                x: 150,
                y: 303.1,
            },
            rotation: 180,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
            shouldOffset: false,
        },
    },
];

export const halfRegularHexagonsRotatedIris: HexagonRouteDataTransformOffsets[] = [
    // Half hexes in ROUTE.category
    {
        [ROUTE.category]: {
            position: {
                x: 100,
                y: 43.3,
            },
            rotation: 120,
            isHalf: true,
            scale: 2,
            shouldOffset: true,
        },
    },

    {
        [ROUTE.category]: {
            position: {
                x: 200,
                y: 43.3,
            },
            rotation: 180,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.category]: {
            position: {
                x: 50,
                y: 129.9,
            },
            rotation: 60,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.category]: {
            position: {
                x: 250,
                y: 129.9,
            },
            rotation: -120,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
    },

    {
        [ROUTE.category]: {
            position: {
                x: 100,
                y: 216.5,
            },
            rotation: 0,
            isHalf: true,
            scale: 2,
            shouldOffset: true,
        },
    },

    {
        [ROUTE.category]: {
            position: {
                x: 200,
                y: 216.5,
            },
            rotation: -60,
            isHalf: true,
            scale: 2,
            shouldOffset: false,
        },
    },
];

/*
At Scale 1, perfectly set up
    
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
                x: 125,
                y: 86.6,
            },
            rotation: 120,
            isHalf: true,
            scale: 1,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
                x: 175,
                y: 86.6,
            },
            rotation: 180,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
                x: 100,
                y: 129.9,
            },
            rotation: 60,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 60,
            isHalf: false,
            scale: 0,
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
                x: 200,
                y: 129.9,
            },
            rotation: -120,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
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
                x: 125,
                y: 173.2,
            },
            rotation: 0,
            isHalf: true,
            scale: 1,
            shouldOffset: true,
        },
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
                x: 175,
                y: 173.2,
            },
            rotation: -60,
            isHalf: true,
            scale: 1,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
            shouldOffset: false,
        },
    },

*/

export const categoryNavigationButtonPositions: Record<'active' | 'left' | 'right', Omit<Partial<HexagonTransformData>, 'isHalf'>> = {
    active: {
        position: {
            x: 150,
            y: 267.5,
        },
        rotation: -90,
        // scale: 0.6,
        scale: 0.4,
    },
    left: {
        position: {
            x: 115,
            y: 267.5,
        },
        rotation: 90,
        scale: 0.4,
    },
    right: {
        position: {
            x: 185,
            y: 267.5,
        },
        rotation: 150,
        scale: 0.4,
    },
};

export const categoryNavigationButtons: (CategoryNavigationButtonRouteData | MenuButtonRouteData)[] = [
    // Hamburger Icon
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 130,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.35,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 80,
                y: 272,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            shouldOffset: false,
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
        name: 'hamburger',
        title: '',
        svgIconPath: '/svg/Bars3Outline.svg',
        target: () => {
            store_toggleHamburgerMenu();
        },
    },

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
                x: 112.5,
                y: 272,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.37,
            shouldOffset: false,
        }, // "Active" position
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
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
                x: 150,
                y: 272,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.37,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
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
                x: 187.5,
                y: 272,
            },
            rotation: -150,
            isHalf: false,
            scale: 0.37,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 220,
                y: 272,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            shouldOffset: false,
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
        title: 'home',
        svgIconPath: '/svg/HomeOutline.svg',
        target: () => {
            store_toggleSubMenu({ name: null });
            store_toggleHamburgerMenu(false);
            return '/';
        },
    },
];

export const hamburgerButton: MenuButtonRouteData = {
    [ROUTE.home]: {
        position: {
            x: 150,
            y: 130,
        },
        rotation: 0,
        isHalf: false,
        scale: 0.35,
        shouldOffset: false,
    },
    [ROUTE.category]: {
        position: {
            x: 75,
            y: 272,
        },
        rotation: 30,
        isHalf: false,
        scale: 0.25,
        shouldOffset: false,
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
    name: 'hamburger',
    title: '',
    svgIconPath: '/svg/Bars3Outline.svg',
    target: () => {
        store_toggleHamburgerMenu();
    },
};

export const hamburgerBackgroundHexagon: HexagonRouteData = {
    [ROUTE.home]: {
        position: {
            x: 150,
            y: 129.9,
        },
        rotation: 120,
        isHalf: false,
        scale: 1,
        shouldOffset: false,
    },
    [ROUTE.category]: {
        position: {
            x: 150,
            y: 0,
        },
        rotation: 210,
        isHalf: false,
        scale: 0.866,
        shouldOffset: false,
    },
    [ROUTE.post]: {
        position: {
            x: 75,
            y: 0,
        },
        rotation: 30,
        isHalf: false,
        scale: 0,
        shouldOffset: false,
    },
};

export const hamburgerBackgroundHexagonOffsets: HexagonRouteDataTransformOffsets = {
    [ROUTE.home]: {
        rotation: 360,
        scale: 1.3,
    },
    [ROUTE.category]: {
        position: {
            x: 150,
            y: 10,
        },
        rotation: 360,
        scale: 1.1,
    },
};

export const menuButtons: MenuButtonRouteData[] = [
    // User Login (inactive), disappears after ROUTE.home
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 157.5,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        name: 'login',
        title: 'login',
        svgIconPath: '/svg/UserIconOutline.svg',
        target: () => {},
    },

    // Settings
    {
        [ROUTE.home]: {
            position: {
                x: 180,
                y: 140,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
            shouldOffset: true,
        },
        [ROUTE.category]: {
            position: {
                x: 175,
                y: 15,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        title: 'options',
        svgIconPath: '/svg/AdjustmentsHorizontalOutline.svg',
        target: (ev) => store_toggleSubMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },

    // Contact
    {
        [ROUTE.home]: {
            position: {
                x: 120,
                y: 140,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
            shouldOffset: true,
        },
        [ROUTE.category]: {
            position: {
                x: 125,
                y: 15,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        title: 'contact',
        svgIconPath: '/svg/ChatBubbleLeftRightOutline.svg',
        target: (ev) => store_toggleSubMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },
];

export const menuButtonsHamburgerTransformOffsets: HexagonRouteDataTransformOffsets[] = [
    // User Login (inactive), disappears after ROUTE.home
    {
        [ROUTE.home]: {
            rotation: 0,
            scale: 0.35,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
        },
    },

    // Settings
    {
        [ROUTE.home]: {
            position: {
                x: 180,
                y: 140,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.35,
            shouldOffset: true,
        },
        [ROUTE.category]: {
            position: {
                x: 175,
                y: 15,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.3,
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
    },

    // Contact
    {
        [ROUTE.home]: {
            position: {
                x: 120,
                y: 140,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.35,
            shouldOffset: true,
        },
        [ROUTE.category]: {
            position: {
                x: 125,
                y: 15,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 30,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.3,
            shouldOffset: false,
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
    },
];

// Only available in Post route
export const postNavigationButtons: PostNavigationButtonRouteData[] = [
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 312,
                y: -29.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.2,
            shouldOffset: true,
        },
        name: 'previous',
        svgIconPath: '/svg/ChevronLeftOutline.svg',
        target: () => store_setPostNavigationState('previous'),
    },

    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 375,
                y: 86.6,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 342,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
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

export const backgroundHexagons: HexagonRouteData[] = [
    // Only in Category
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 0,
            isHalf: true,
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 37.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 1.732,
            shouldOffset: true,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 296,
                y: 46,
            },
            rotation: -30,
            isHalf: false,
            scale: 1.732,
            shouldOffset: false,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 262.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 1.732,
            shouldOffset: true,
        }, // R6
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
            scale: 0,
            shouldOffset: false,
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 1.732,
            shouldOffset: true,
        },
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0,
            shouldOffset: false,
        },
    },
];

// TODO likely not needed?
export const hexagonRouteOffsetValues: Record<ROUTE, Record<BreakpointName | 'base', number>> = {
    [ROUTE.home]: { 'base': 0, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 0 },
    [ROUTE.category]: { 'base': 160, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 28 },
    [ROUTE.post]: { 'base': 163, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 31.5 },
};

/* Active (ie front) Hex in Category route */
export const categoryCardActiveHexagon: HexagonTransformData = {
    position: {
        x: 150,
        y: 129.9,
    },
    rotation: 0,
    isHalf: false,
    scale: 2.5,
    shouldOffset: false,
};

/* inactive (small) Hexagons in Category route */
const categoryCardInactiveHexagon: HexagonTransformData = {
    position: {
        x: 0,
        y: 0,
    },
    rotation: 0,
    isHalf: false,
    scale: 1,
    shouldOffset: false,
};

const { clipPathWidth, clipPathHeight } = config.ui.hexMenu;
const centerPosition = viewBoxWidth / 2 - hexHalfWidth; // 100 width hexagon, transform top left corner, 400 width viewbox = 150 (hence spans 150 to 250)

export function offsetHexagonTransforms<T>(baseTransforms: T, offsets: HexagonRouteDataTransformOffsets): T;
export function offsetHexagonTransforms<T>(baseTransforms: T[], offsets: HexagonRouteDataTransformOffsets[]): T[];
export function offsetHexagonTransforms<T = HexagonRouteData | CategoryNavigationButtonRouteData | MenuButtonRouteData | PostNavigationButtonRouteData>(
    baseTransforms: T | T[],
    offsets: HexagonRouteDataTransformOffsets | HexagonRouteDataTransformOffsets[],
): T | T[] {
    if (!Array.isArray(baseTransforms) && !Array.isArray(offsets)) {
        return offsetRoute(baseTransforms, offsets) as T;
    } else if ((baseTransforms as T[]).length && (offsets as HexagonRouteDataTransformOffsets[]).length) {
        return (baseTransforms as T[]).map((genericRouteData, idx) =>
            offsetRoute(genericRouteData, (offsets as HexagonRouteDataTransformOffsets[])[idx]),
        ) as T[];
    } else {
        throw new Error('invalid input arguments');
    }

    function offsetRoute<T>(routeData: T, routeOffset?: HexagonRouteDataTransformOffsets) {
        const newRouteData: T = { ...routeData };

        let key: keyof T;
        for (key in routeData) {
            if (key in ROUTE && routeOffset && key in routeOffset) {
                const route = key as unknown as ROUTE;
                (newRouteData as HexagonRouteData)[route] = {
                    ...(newRouteData as HexagonRouteData)[route],
                    ...routeOffset[route],
                };
            }
        }

        return newRouteData;
    }
}

export function getCategoryHexagons(count: number): HexagonTransformData[] {
    const activeHexagonScale = categoryCardActiveHexagon.scale;
    const inactiveHexagonScale = activeHexagonScale / Math.max(count - 1, 8);

    const allHexagons = [categoryCardActiveHexagon];

    if (count > 1) {
        const extraHexagons = count - 1;

        const activeHexagonWidthInViewBox = clipPathWidth * activeHexagonScale;
        const activeHexagonHeightInViewBox = clipPathHeight * activeHexagonScale;

        const _activeHexagonHalfWidth = activeHexagonWidthInViewBox / 2;
        const activeHexagonThreeQuarterWidth = activeHexagonWidthInViewBox * 0.75;
        const _activeHexagonQuarterWidth = activeHexagonWidthInViewBox / 4;
        const activeHexagonHalfHeight = activeHexagonHeightInViewBox / 2;

        const inactiveHexagonWidth = clipPathWidth * inactiveHexagonScale;
        const inactiveHexagonHeight = clipPathHeight * inactiveHexagonScale;

        const _inactiveHexagonHeightOffset = Math.min(inactiveHexagonHeight, (activeHexagonHalfHeight - inactiveHexagonHeight) / count);
        const inactiveHexagonWidthOffset =
            Math.min(inactiveHexagonWidth, (activeHexagonThreeQuarterWidth - inactiveHexagonWidth) / count) + inactiveHexagonWidth / 8;

        for (let i = 0; i < extraHexagons; i++) {
            // const additionalHexagonStartingPositionY = 5 + inactiveHexagonHeightOffset * (i);
            // const additionalHexagonStartingPositionX = additionalHexagonStartingPositionY / -tan60 + position.x - activeHexagonQuarterWidth - inactiveHexagonWidth;

            const centered = extraHexagons % 2 === 0 ? extraHexagons / 4 : Math.floor(extraHexagons / 2);
            const inactiveHexagonStartingPositionX = inactiveHexagonWidthOffset * i + (centerPosition - centered * inactiveHexagonWidthOffset);

            const inactiveHexagon = { ...categoryCardInactiveHexagon };
            inactiveHexagon.position = { ...categoryCardInactiveHexagon.position, x: inactiveHexagonStartingPositionX };
            inactiveHexagon.scale = inactiveHexagonScale;

            allHexagons.push(inactiveHexagon);
        }
    }

    return allHexagons;
}

export const roundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5);
export const halfRoundedHexagonPath = getHexagonPath(hexHalfWidth, hexHalfWidth / 5, true);
export const widerRoundedHexagonPath = getHexagonPath(hexHalfWidth * 0.45, (hexHalfWidth * 0.45) / 5, false, 1.1);
export const widerNarrowRoundedHexagonPath = getHexagonPath(hexHalfWidth * 1, (hexHalfWidth * 1) / 5, false, 0.1);
export const roundedSideHexagonPathRight = getHexagonalSidePath(hexHalfWidth * 0.6, hexHalfWidth / 7, 0.1, true);
export const roundedSideHexagonPathLeft = getHexagonalSidePath(hexHalfWidth * 0.6, hexHalfWidth / 7, 0.1);

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

const hexagonClipPathStatic = `path("${roundedHexagonPath}")`;
const halfHexagonClipPathStatic = `path("${halfRoundedHexagonPath}")`;

export function calcCSSVariables(
    translate: { x: number; y: number },
    rotation: number,
    scale: number,
    isHalf: boolean,
    parentSize: {
        width: number;
        height: number;
    },
    options?: { strokeWidth?: number; shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { strokeWidth = strokeWidthDefault, shouldOffset, offset, clampTo: _clampTo } = options ?? {};

    let { width, height } = parentSize;

    // TODO better than the top left stack-spawn, bu
    if (!width || !height) {
        width = viewBoxWidth;
        height = viewBoxHeight;
    }

    const parentAspect = width / height;
    const ratio = viewBoxAspect / parentAspect;

    const parentToViewboxWidth = width / viewBoxWidth;
    const parentToViewboxHeight = height / viewBoxHeight;
    const insetByStrokeWidth = (1 - strokeWidth) * scale;

    const mappedScaleX = roundToDecimal(insetByStrokeWidth * parentToViewboxWidth * ratio, 3);
    const mappedScaleY = roundToDecimal(insetByStrokeWidth * parentToViewboxHeight, 3);

    const mappedTranslateX = roundToDecimal(translate.x * parentToViewboxWidth * ratio + getOffset(parentToViewboxWidth * ratio), 0);
    const mappedTranslateY = roundToDecimal(translate.y * parentToViewboxHeight + getOffset(parentToViewboxHeight) * (viewBoxHeight / viewBoxWidth), 0);

    return {
        '--hexagon-translate-x': mappedTranslateX + 'px',
        '--hexagon-translate-y': mappedTranslateY + 'px',
        '--hexagon-rotate': rotation + 'deg',
        '--hexagon-scale-x': mappedScaleX,
        '--hexagon-scale-y': mappedScaleY,
        // '--hexagon-scale-x': `calc(${insetByStrokeWidth} * var(--hexagon-width-container-to-viewbox) * var(--hexagon-ratio-of-aspects))`,
        // '--hexagon-scale-y': `calc(${insetByStrokeWidth} * var(--hexagon-height-container-to-viewbox))`,
        '--hexagon-lighting-gradient-counter-rotation': `calc(${-rotation}deg - var(--home-menu-rotation, 0deg))`,
        '--hexagon-clip-path': isHalf ? halfHexagonClipPathStatic : hexagonClipPathStatic,
    };
}

function getOffset(scale: number) {
    const baseline = 1;
    const factor = 50;
    return factor * (scale - baseline);
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

function getHexagonPath(sideLength = 1, cornerRadius = 8, isHalf = false, wider = 0): string {
    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspect.flatTop;

    const extraWidth = wider ? sideLength * 2 * wider : 0;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);

        let xRounded = roundToDecimal(x, 4);
        const yRounded = roundToDecimal(y, 4);

        if (wider) {
            switch (i) {
                case 0:
                    xRounded = 30;
                    break;
                case 2:
                    xRounded += extraWidth;
                    break;
                case 3:
                    xRounded += extraWidth;
                    break;
                case 4:
                    xRounded += extraWidth;
                    break;
            }
        }
        points.push({ x: xRounded, y: yRounded });
    }

    const cornerSinOffsetRounded = roundToDecimal(cornerRadius * sin30, 4);
    const cornerCosOffsetRounded = roundToDecimal(cornerRadius * cos30, 4);

    return isHalf
        ? ` M ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded}   \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y}   \
            \
            L ${points[1]!.x + cornerSinOffsetRounded},${points[0]!.y} \
            Q ${points[1]!.x},${points[0]!.y} ${points[1]!.x + cornerSinOffsetRounded * 2},${points[0]!.y}   \
            \
            L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[3]!.y} \
            Q ${points[2]!.x},${points[3]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[3]!.y}   \
            \
            L ${points[3]!.x - cornerSinOffsetRounded * 2},${points[3]!.y} \
            Q ${points[3]!.x},${points[0]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded}   \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y}   \
            \
            L ${points[5]!.x + cornerSinOffsetRounded * 2},${points[5]!.y} \
            Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y - cornerCosOffsetRounded} \
            \
            Z`
        : ` M ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded} \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y - cornerCosOffsetRounded} \
            \
            L ${points[1]!.x - cornerSinOffsetRounded},${points[1]!.y + cornerCosOffsetRounded} \
            Q ${points[1]!.x},${points[1]!.y} ${points[1]!.x + cornerSinOffsetRounded * 2},${points[1]!.y} \
            \
            L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[2]!.y} \
            Q ${points[2]!.x},${points[2]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[2]!.y + cornerCosOffsetRounded} \
            \
            L ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y - cornerCosOffsetRounded} \
            Q ${points[3]!.x},${points[3]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded} \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y} \
            \
            L ${points[5]!.x + cornerSinOffsetRounded * 2},${points[5]!.y} \
            Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y - cornerCosOffsetRounded} \
            \
            Z`;
}

function getHexagonalSidePath(sideLength = 1, cornerRadius = 8, shorter = 0, isRightSide = false): string {
    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspect.flatTop;

    const extraWidth = shorter ? sideLength * (isRightSide ? 2 : 2) * shorter : 0;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);

        let xRounded = roundToDecimal(x, 4);
        const yRounded = roundToDecimal(y, 4);

        if (shorter) {
            if (isRightSide) {
                switch (i) {
                    case 0:
                        xRounded = sideLength / 1.1547;
                        break;
                    case 2:
                        xRounded += extraWidth;
                        break;
                    case 3:
                        xRounded += extraWidth;
                        break;
                    case 4:
                        xRounded += extraWidth;
                        break;
                }
            } else {
                switch (i) {
                    case 2:
                        xRounded += extraWidth;
                        break;
                    case 3:
                        xRounded -= sideLength / 2;
                        break;
                    case 4:
                        xRounded += extraWidth;
                        break;
                }
            }
        }
        points.push({ x: xRounded, y: yRounded });
    }

    const cornerSinOffsetRounded = roundToDecimal(cornerRadius * sin30, 4);
    const cornerCosOffsetRounded = roundToDecimal(cornerRadius * cos30, 4);

    return isRightSide
        ? ` M ${points[0]!.x - cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded} \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x - cornerSinOffsetRounded},${points[0]!.y - cornerCosOffsetRounded} \
            \
            L ${points[1]!.x - cornerSinOffsetRounded},${points[1]!.y}  \
            \
            L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[2]!.y} \
            Q ${points[2]!.x},${points[2]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[2]!.y + cornerCosOffsetRounded} \
            \
            L ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y - cornerCosOffsetRounded} \
            Q ${points[3]!.x},${points[3]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded} \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y} \
            \
            L ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y} \
            \
            Z`
        : ` M ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y + cornerCosOffsetRounded} \
            Q ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y - cornerCosOffsetRounded} \
            \
            L ${points[1]!.x},${points[1]!.y + cornerCosOffsetRounded} \
            Q ${points[1]!.x + cornerSinOffsetRounded},${points[1]!.y} ${points[1]!.x + cornerSinOffsetRounded * 3},${points[1]!.y} \
            \
            L ${points[2]!.x + cornerSinOffsetRounded * 2},${points[2]!.y} \
            \
            L ${points[3]!.x + cornerSinOffsetRounded / 2},${points[3]!.y - cornerCosOffsetRounded} \
            Q ${points[3]!.x - cornerSinOffsetRounded / 3},${points[3]!.y} ${points[3]!.x + cornerSinOffsetRounded / 2},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded * 2},${points[4]!.y} \
            \
            L ${points[5]!.x + cornerSinOffsetRounded * 3},${points[5]!.y} \
            Q ${points[5]!.x + cornerSinOffsetRounded},${points[5]!.y} ${points[5]!.x},${points[5]!.y - cornerCosOffsetRounded} \
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

function getMenuButtonPosition(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();
    const position: ZustandStore['values']['activeSubMenuButton']['positionAndSize'] = { x: left, y: top, width, height };
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

function _toSvgTransform(
    translate?: { x: number; y: number },
    rotate_DEG?: number,
    scale?: { x: number; y: number },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo: _clampTo } = options ?? {};

    const translation = translate ? `translate(${shouldOffset && offset ? translate.x + offset : translate.x} ${translate.y}) ` : '';
    const rotation = rotate_DEG ? `rotate(${rotate_DEG}) ` : '';
    const scaling = scale ? `scale(${scale.x}, ${scale.y}) ` : '';

    return translation + rotation + scaling;
}

function _toSvgTransformMatrix(
    translate = { x: 0, y: 0 },
    rotate_DEG = 0,
    scale = { x: 1, y: 1 },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo } = options ?? {};

    const angle = degToRad(rotate_DEG); // Convert to radians
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Apply scale and rotation
    const a = scale.x * cos;
    const b = scale.x * sin;
    const c = -scale.y * sin;
    const d = scale.y * cos;
    const e = shouldOffset && offset ? translate.x + offset : translate.x;
    const f = translate.y;

    return `matrix(${a.toFixed(clampTo ?? 6)} ${b.toFixed(clampTo ?? 6)} ${c.toFixed(clampTo ?? 6)} ${d.toFixed(clampTo ?? 6)} ${e.toFixed(clampTo ?? 6)} ${f.toFixed(clampTo ?? 6)})`;
}

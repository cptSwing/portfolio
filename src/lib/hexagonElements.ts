// Hex-Flat Orientation: Scale 1, Hex-Pointy Orientation: 1.154734 (??)
// x: -50 = hex sits on the parent's X:0; total width = 100
// y: -43.3 = hex sits on parent's Y:0 (total height 86.6)

import { ROUTE } from '../types/enums';
import { HexagonRouteData, HexagonTransformData, CategoryLinkButtonRouteData, FunctionalButtonRouteData } from '../types/types';
import { getMenuButtonPosition } from './menuFunctions';
import { useZustand } from './zustand';

const { store_toggleSubMenu, store_toggleHamburgerMenu, store_setPostNavigationState } = useZustand.getState().methods;

/**
 * Pre-scaled-positioning notes:
 *
 * X Axis / width
 * ==============
 * Single: 100
 * Half: 50
 * Xpos: minus 50
 * --->>> So, at total width of 400, to position a hexagon at horizontal center: (400 / 2 = 200) - 50 = 150 !!
 *
 *
 * Y Axis / height
 * ==============
 * Single: 86.6
 * Half: 43.3
 * Ypos: minus 43.3
 * --->>> So, at total height of 346.4, to position a hexagon at vertical center: (346.4 / 2 = 173.2) - 43.3 = 129.9
 *
 */

// viewBoxes['hexFlat'] : 0 0 400 346.4 --> (400x0.866)

// "Regular" Hexagons in Category ROUTE to be precise
// Most hexagons positioned on outside at thirds:
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
        },
        [ROUTE.category]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 0,
                y: 129.9,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
        }, // L3
        [ROUTE.post]: {
            position: {
                x: 345,
                y: -32,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.35,
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
        },
        [ROUTE.category]: {
            position: {
                x: 225,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        }, // R2
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 37.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // L7
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 150,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 300,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // R5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 262.5,
                y: 64.95,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        }, // L5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.35,
        },
    },
];

// "Regular" Hexagons in Category ROUTE to be precise
// Hexagons positioned as triangle
export const regularHexagonsTriangle: HexagonRouteData[] = [
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
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 194.85,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 187.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 75,
                y: 129.9,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.866,
        }, // L3
        [ROUTE.post]: {
            position: {
                x: 345,
                y: -32,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.35,
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
        },
        [ROUTE.category]: {
            position: {
                x: 187.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        }, // R2
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 37.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // L7
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 150,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 225,
                y: 129.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.866,
        }, // R5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 262.5,
                y: 64.95,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        }, // L5
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 64.5,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.866,
        },
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.35,
        },
    },
];

// Half hexes in ROUTE.category. Do not necessarily want to have half hexagons always be half hexagons, for some cool clip-path transitions in-between ROUTEs
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
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 108.25,
            },
            rotation: -60,
            isHalf: true,
            scale: 0.5,
        }, // Top left
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 216.5,
            },
            rotation: 30,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 86.6,
            },
            rotation: -360,
            isHalf: true,
            scale: 0.5,
        }, // Top center
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 60,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 187.5,
                y: 108.25,
            },
            rotation: 60,
            isHalf: true,
            scale: 0.5,
        }, // Top right
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 187.5,
                y: 151.55,
            },
            rotation: 120,
            isHalf: true,
            scale: 0.5,
        }, // Bottom right
        [ROUTE.post]: {
            position: {
                x: -45,
                y: 290,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.35,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 173.2,
            },
            rotation: 180,
            isHalf: true,
            scale: 0.5,
        }, // Bottom center
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 112.5,
                y: 151.55,
            },
            rotation: -120,
            isHalf: true,
            scale: 0.5,
        }, // Bottom Left
        [ROUTE.post]: {
            position: {
                x: 345,
                y: 290,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.35,
        },
    },
];

export const categoryLinkButtons: CategoryLinkButtonRouteData[] = [
    {
        [ROUTE.home]: {
            position: {
                x: 75,
                y: 86.6,
            },
            rotation: -60,
            isHalf: false,
            scale: 1,
        },
        [ROUTE.category]: {
            position: {
                x: 315,
                y: 191,
            },
            rotation: -90,
            isHalf: false,
            scale: 0.37,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 173.2,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 299,
                y: 220,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.37,
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
        },
        [ROUTE.category]: {
            position: {
                x: 283,
                y: 248,
            },
            rotation: -150,
            isHalf: false,
            scale: 0.37,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 259.8,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
        },
        name: 'log',
        title: 'log',
        target: '/3',
    },
];

export const functionalButtons: FunctionalButtonRouteData[] = [
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
            counterRotate: true,
        },
        [ROUTE.category]: {
            position: {
                x: -6,
                y: 210,
            },
            rotation: -30,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        [ROUTE.post]: {
            position: {
                x: -45.5,
                y: -32,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        name: 'hamburger',
        title: '',
        svgIconPath: '/svg/Bars3Outline.svg',
        target: (ev) => {
            store_toggleHamburgerMenu(true);
            store_toggleSubMenu({ name: 'root-close', positionAndSize: ev && getMenuButtonPosition(ev) });
        },
    },

    // These appear only in '[ROUTE.category]' or even just '[ROUTE.post]' routeData:
    // Home
    {
        [ROUTE.home]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 180,
            isHalf: false,
            scale: 0,
            counterRotate: true,
        },
        [ROUTE.category]: {
            position: {
                x: 5.5,
                y: 230,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        [ROUTE.post]: {
            position: {
                x: 150,
                y: 129,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
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

    // Previous
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            counterRotate: true,
        },
        [ROUTE.category]: {
            position: {
                x: 17,
                y: 249.5,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.25,
            counterRotate: false,
        },
        [ROUTE.post]: {
            position: {
                x: -45.5,
                y: 290.5,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        name: 'previous',
        svgIconPath: '/svg/ChevronLeftOutline.svg',
        target: () => store_setPostNavigationState('previous'),
    },

    // Next
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            counterRotate: true,
        },
        [ROUTE.category]: {
            position: {
                x: 27.75,
                y: 268.9,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.25,
            counterRotate: false,
        },
        [ROUTE.post]: {
            position: {
                x: 345.25,
                y: 290.5,
            },
            rotation: 30,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        name: 'next',
        svgIconPath: '/svg/ChevronRightOutline.svg',
        target: () => store_setPostNavigationState('next'),
    },

    // Close Post
    {
        [ROUTE.home]: {
            position: {
                x: 300,
                y: -43.3,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            counterRotate: true,
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 129.9,
            },
            rotation: 0,
            isHalf: false,
            scale: 0,
            counterRotate: true,
        },
        [ROUTE.post]: {
            position: {
                x: 345.25,
                y: -32,
            },
            rotation: 90,
            isHalf: false,
            scale: 0.25,
            counterRotate: true,
        },
        name: 'close',
        svgIconPath: '/svg/XMarkOutline.svg',
        target: () => store_setPostNavigationState('close'),
    },
];

export const hamburgerMenuButtons: FunctionalButtonRouteData[] = [
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
        },
        [ROUTE.category]: {
            position: {
                x: 175,
                y: 15,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
        },
        [ROUTE.post]: {
            position: {
                x: -50,
                y: 232.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.25,
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
        },
        [ROUTE.category]: {
            position: {
                x: 125,
                y: 15,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
        },
        [ROUTE.post]: {
            position: {
                x: -50,
                y: 257.5,
            },
            rotation: 0,
            isHalf: false,
            scale: 0.275,
        },
        name: 'contact',
        title: 'contact',
        svgIconPath: '/svg/ChatBubbleLeftRightOutline.svg',
        target: (ev) => store_toggleSubMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
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
        },
        [ROUTE.category]: {
            position: {
                x: 37.5,
                y: 64.95,
            },
            rotation: 90,
            isHalf: false,
            scale: 1.732,
        }, // R3
        [ROUTE.post]: {
            position: {
                x: 150,
                y: -43.3,
            },
            rotation: 30,
            isHalf: false,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 296,
                y: 46,
            },
            rotation: -30,
            isHalf: false,
            scale: 1.732,
        },
        [ROUTE.post]: {
            position: {
                x: 75,
                y: 0,
            },
            rotation: 90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 262.5,
                y: 194.85,
            },
            rotation: 30,
            isHalf: false,
            scale: 1.732,
        }, // R6
        [ROUTE.post]: {
            position: {
                x: 225,
                y: 173.2,
            },
            rotation: -90,
            isHalf: true,
            scale: 0,
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
        },
        [ROUTE.category]: {
            position: {
                x: 150,
                y: 259.8,
            },
            rotation: 30,
            isHalf: false,
            scale: 1.732,
        },
        [ROUTE.post]: {
            position: {
                x: -45,
                y: -32,
            },
            rotation: -30,
            isHalf: false,
            scale: 0,
        },
    },
];

export const hexagonGridTransformCenter = {
    x: 150,
    y: 129.9,
};

/* Active (ie front) Hex in Category route */
export const categoryCardActiveHexagon: HexagonTransformData = {
    position: hexagonGridTransformCenter,
    rotation: 0,
    isHalf: false,
    scale: 2.3,
};

/* inactive (small) Hexagons in Category route */
export const categoryCardInactiveHexagon: HexagonTransformData = {
    position: {
        x: 0,
        y: -45,
    },
    rotation: 30,
    isHalf: false,
    scale: 1,
};

export const brandTransformData: HexagonRouteData = {
    [ROUTE.home]: {
        position: {
            x: 150,
            y: 42.5,
        },
        rotation: 0,
        isHalf: true,
        scale: 0.85,
    },
    [ROUTE.category]: {
        position: {
            x: 335,
            y: -55,
        },
        rotation: -360,
        isHalf: false,
        scale: 1,
    },
    //     [ROUTE.category]: {
    //     position: {
    //         x: 312.5,
    //         y: 227.5,
    //     },
    //     rotation: -420,
    //     isHalf: false,
    //     scale: 1,
    //
    // },
    [ROUTE.post]: {
        position: {
            x: -45,
            y: -32,
        },
        rotation: -30,
        isHalf: false,
        scale: 0,
    },
};

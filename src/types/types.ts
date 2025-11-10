import { NavigateOptions, To } from 'react-router-dom';
import { CATEGORY, HAMBURGERMENUITEMS, ROUTE, TOOL } from './enums';

export type Config = {
    ui: {
        hexagonPaths: {
            gutterWidth: number;
            scaleUp: number;
            clipPathWidth: number;
            clipPathHeight: number;
        };
        carousel: {
            frontScale: number;
            frontScaleImage: number;
        };
        animation: {
            menuTransition_Ms: number;
        };
    };
};

export const themes = ['pink', 'orange', 'bw', 'yellow'] as const;
export type Theme = (typeof themes)[number];

export type ZustandStore = {
    values: {
        theme: Theme;
        routeData: RouteData;
        cardTransition: boolean;
        hamburgerMenuRect: Pick<DOMRect, 'width' | 'height'> | null;
        activeHamburgerMenuItemName: HamburgerMenuItem['name'];
        postIndex: number | null;
        debug: {
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setRouteData: (routeData: RouteData) => void;
        store_setTimedCardTransition: (isReady: boolean) => void;
        store_toggleHamburgerMenu: (rect: ZustandStore['values']['hamburgerMenuRect']) => void;
        store_toggleActiveHamburgerItem: (newMenuState: ZustandStore['values']['activeHamburgerMenuItemName']) => void;
        store_setPostIndexAndTransitionTrue: (directionOrIndex: ('previous' | 'next') | number) => void;
        store_setDebugValues: (debugValues: Partial<ZustandStore['values']['debug']>) => void;
    };
};

export type RouteData =
    | { name: ROUTE.home; content: { category?: Category; post?: Post } }
    | { name: ROUTE.category; content: { category: Category; post?: Post } }
    | { name: ROUTE.post; content: { category: Category; post: Post } };

export type DataBase = Record<CategoryName, Category>;

export type Category = {
    id: number;
    title: string;
    posts: Post[];
    categoryBlurb: string;
};

export type Post = {
    id: number;
    title: string;
    date: string | string[];
    textBlocks: { text: string; showcaseIndex?: number }[];
    showcases?: Post_Showcase[];
    subTitle?: string;
    cardImage?: string;
    cardImagePosition?: string;
    clients?: { abbreviation: string; svgUrl?: string; name: string }[];
    stack?: (keyof typeof TOOL)[];
    liveViews?: { url: string; title: string; description: string }[];
    source?: {
        href: string;
        alt: string;
    };
};

export type HamburgerMenuItem = {
    name: Omit<keyof typeof HAMBURGERMENUITEMS, '__empty'>;
    startOffset?: number;
    subMenuItems?: HamburgerMenuItem[];
    iconPath?: string;
    iconSize?: number;
    isWorking?: boolean;
    isLink?: boolean;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Post_Showcase_Base = {
    caption?: string;
};

export interface Post_Showcase_Image extends Post_Showcase_Base {
    imgUrl: string;
    hasThumbnail?: boolean;
}

export interface Post_Showcase_Youtube extends Post_Showcase_Base {
    youtubeUrl: string;
}

export type Post_Showcase = Post_Showcase_Image | Post_Showcase_Youtube;

type PostNavigationName = 'previous' | 'close' | 'next';
type FunctionalButtonName = 'home' | 'hamburger' | PostNavigationName;
export type CategoryName = keyof typeof CATEGORY;
export type AllButtonNames = CategoryName | FunctionalButtonName;

export type HexagonTransformData = {
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    isHalf: boolean;
};

export type HexagonRouteData = Record<ROUTE, HexagonTransformData>;
export type HexagonRouteDataTransformOffsets = Partial<Record<ROUTE, Partial<HexagonTransformData>>>;

interface ButtonTransformData extends HexagonTransformData {
    counterRotate?: boolean;
}

export type ButtonRouteData = Record<ROUTE, ButtonTransformData>;

interface ButtonData {
    name: AllButtonNames;
}

interface CategoryLinkButtonData extends ButtonData {
    name: CategoryName;
    title: CategoryName;
    target: [To, NavigateOptions?];
}
/** A Button for navigating to/from a CATEGORY */
export interface CategoryLinkButtonRouteData extends ButtonRouteData, CategoryLinkButtonData {}

interface FunctionalButtonData extends ButtonData {
    name: FunctionalButtonName;
    title?: string;
    svgIconPath: string;
    target: (routeName?: ROUTE, ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => [To, NavigateOptions?] | void;
}
/** A Button that executes a function (which can also return a navigatable target) */
export interface FunctionalButtonRouteData extends ButtonRouteData, FunctionalButtonData {}
export interface FunctionalButtonRouteDataTransformOffsets extends HexagonRouteDataTransformOffsets, FunctionalButtonData {}

export type valueof<T> = T[keyof T];

export type TransitionTargetReached = boolean;
export type RotateShortestDistance = boolean;

export type HexagonStyleObject = {
    '--hexagon-translate-x': string;
    '--hexagon-translate-y': string;
    '--hexagon-rotate': string;
    '--hexagon-scale-x': number;
    '--hexagon-scale-y': number;
    '--hexagon-lighting-gradient-counter-rotation': string;
    '--hexagon-clip-path': string;
    '--glassmorphic-grain-scale'?: number;
    '--regular-hexagon-transition-random-factor'?: number;
};

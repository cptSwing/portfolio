import { BreakpointName } from '../hooks/useBreakPoint';
import { CATEGORY, ROUTE, TOOL } from './enums';

export type Config = {
    categoryGrid: {
        areaCount: number;
    };
    placeholders: {
        cardImage: string;
    };
    ui: {
        hexMenu: {
            columns: number;
            rows: number;
            strokeWidth: number;
            scaleUp: number;
            clipPathWidth: number;
            clipPathHeight: number;
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
        runIrisTransition: boolean;
        breakpoint: BreakpointName | null;
        hamburgerIsOpen: boolean;
        activeSubMenuButton: { name: MenuName | null; positionAndSize?: { x: number; y: number; width: number; height: number } };
        postNavigationState: PostNavigationName | null;
        debug: {
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setRouteData: (routeData: RouteData) => void;
        store_setRunIrisTransition: (isReady: boolean) => void;
        store_setBreakpoint: (breakpoint: BreakpointName | null) => void;
        store_toggleHamburgerMenu: (isOpen?: boolean) => void;
        store_toggleSubMenu: (newMenuState: ZustandStore['values']['activeSubMenuButton']) => void;
        store_setPostNavigationState: (postNavigationState: PostNavigationName | null) => void;
        store_setDebugValues: (debugValues: Partial<ZustandStore['values']['debug']>) => void;
    };
};

export type RouteData =
    | { name: ROUTE.home; content: { category?: Category; post?: Post } }
    | { name: ROUTE.category; content: { category: Category; post?: Post } }
    | { name: ROUTE.post; content: { category: Category; post: Post } };

export type DataBase = Record<keyof typeof CATEGORY, Category>;

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
    textBlocks: { text: string; useShowCaseIndex?: number }[];
    showCases?: Post_ShowCase[];
    subTitle?: string;
    cardImage?: string;
    clients?: { abbreviation: string; svgUrl?: string; name: string }[];
    stack?: (keyof typeof TOOL)[];
    viewLive?: { url: string; title: string; description: string }[];
    viewSource?: {
        href: string;
        alt: string;
    };
};

type Post_ShowCase_Base = {
    caption?: string;
};

export interface Post_ShowCase_Image extends Post_ShowCase_Base {
    imgUrl: string;
}

export interface Post_ShowCase_Youtube extends Post_ShowCase_Base {
    youtubeUrl: string;
}

/* NOTE Easy, if non-generic, method to build a Type that has EITHER key1 OR key2. Mind the "?"" in the key to be excluded in the helper types above. */
export type Post_ShowCase = Post_ShowCase_Image | Post_ShowCase_Youtube;

type PostNavigationName = 'previous' | 'close' | 'next';
type MenuName = 'home' | 'hamburger' | 'config' | 'contact' | 'login';
export type CategoryName = keyof typeof CATEGORY;
export type ButtonName = CategoryName | MenuName | PostNavigationName;

export type HexagonTransformData = {
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    isHalf: boolean;
    shouldOffset: boolean;
};
export type HexagonRouteData = Record<ROUTE, HexagonTransformData>;
export type HexagonRouteDataTransformOffsets = Partial<Record<ROUTE, Partial<HexagonTransformData>>>;

interface CategoryNavigationButtonData {
    name: CategoryName;
    title: string;
    target: string;
}
/** A Button for navigating to/from a CATEGORY */
export interface CategoryNavigationButtonRouteData extends HexagonRouteData, CategoryNavigationButtonData {}

interface MenuButtonData {
    name: MenuName;
    title?: string;
    svgIconPath: string;
    target: (ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => string | void;
}
/** A Button that executes a function (which can also return a navigatable target) */
export interface MenuButtonRouteData extends HexagonRouteData, MenuButtonData {}
export interface MenuButtonRouteDataTransformOffsets extends HexagonRouteDataTransformOffsets, MenuButtonData {}

interface PostNavigationButtonData {
    name: PostNavigationName;
    svgIconPath: string;
    target: (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
/** A Button on POST route, switches between posts, or returns to CATEGORY route */
export interface PostNavigationButtonRouteData extends HexagonRouteData, PostNavigationButtonData {}

export type GridAreaPathData = {
    width: number;
    height: number;
    path: string;
};

export type valueof<T> = T[keyof T];

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
        breakpoint: BreakpointName | null;
        activeMenuButton: { name: MenuName | null; positionAndSize?: { x: number; y: number; width: number; height: number } };
        postNavigationState: Omit<NavigationButtonName, 'home'> | null;
        debug: {
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setRouteData: (routeData: RouteData) => void;
        store_setBreakpoint: (breakpoint: BreakpointName | null) => void;
        store_toggleMenu: (newMenuState: ZustandStore['values']['activeMenuButton']) => void;
        store_setPostNavigationState: (postNavigationState: Omit<NavigationButtonName, 'home'> | null) => void;
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

type MenuName = 'config' | 'contact' | 'login' | 'previous' | 'close' | 'next';
type NavigationButtonName = 'home';
export type CategoryName = keyof typeof CATEGORY;
export type ButtonName = CategoryName | MenuName | NavigationButtonName;

export type HexagonData = {
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    isHalf: boolean;
    shouldOffset: boolean;
};
export type HexagonRouteData = Record<ROUTE, HexagonData>;

interface HexagonButtonData {
    name: ButtonName;
    title?: string;
    svgIconPath?: string;
}

export interface HexagonNavigationButtonData extends HexagonButtonData {
    target: string | ((ev?: React.MouseEvent<HTMLDivElement, MouseEvent>) => string);
}
export interface HexagonNavigationDefaultButtonData extends HexagonNavigationButtonData {
    name: NavigationButtonName;
    svgIconPath: string;
}
export interface HexagonNavigationCategoryButtonData extends HexagonNavigationButtonData {
    name: CategoryName;
    title: string;
}
export interface HexagonNavigationDefaultButtonRouteData extends HexagonRouteData, HexagonNavigationDefaultButtonData {}
export interface HexagonNavigationCategoryButtonRouteData extends HexagonRouteData, HexagonNavigationCategoryButtonData {}

export interface HexagonMenuButtonRouteData extends HexagonRouteData, HexagonButtonData {
    target: (ev?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    name: MenuName;
    svgIconPath: string;
}

export type GridAreaPathData = {
    width: number;
    height: number;
    path: string;
};

export type valueof<T> = T[keyof T];

import { CATEGORY, ROUTE, TOOL } from './enums';

export type Config = {
    categoryGrid: {
        cellCount: number;
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

export type ZustandStore = {
    values: {
        theme: 'yellow' | 'pink' | 'orange' | 'bw';
        routeData: RouteData;
        activeMenuButton: { name: UI_MenuLink | null; positionAndSize?: { x: number; y: number; width: number; height: number } };
        postNavigationState: Omit<UI_NavigationButton, 'gohome'> | null;
        debug: {
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setRouteData: (routeData: RouteData) => void;
        store_toggleMenu: (newMenuState: ZustandStore['values']['activeMenuButton']) => void;
        store_setPostNavigationState: (postNavigationState: Omit<UI_NavigationButton, 'home'> | null) => void;
        store_setDebugValues: (debugValues: Partial<ZustandStore['values']['debug']>) => void;
    };
};

export type RouteData =
    | { name: ROUTE.home; content: { category?: Category; post?: Post } }
    | { name: ROUTE.category; content: { category: Category; post?: Post } }
    | { name: ROUTE.post; content: { category: Category; post: Post } };

export type DataBase = Record<keyof typeof CATEGORY, Category>;

export type CategoryName = keyof typeof CATEGORY;
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
    titleCardBg?: string;
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

type UI_MenuLink = 'config' | 'contact' | 'login';
type UI_NavigationButton = 'home' | 'previous' | 'next' | 'close';
export type UI_CategoryLink = CategoryName;
export type UIButton = UI_CategoryLink | UI_MenuLink | UI_NavigationButton;

export type HexagonData = {
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    isHalf: boolean;
    offsets?: { x: number; y: number };
    isRightSide: boolean;
};
export type HexagonLink = { title?: UIButton; svgIconPath?: string; target: string | ((ev?: React.MouseEvent<SVGGElement, MouseEvent>) => void | string) };

export type GridAreaPathData = {
    width: number;
    height: number;
    path: string;
};

import { BreakpointName } from '../hooks/useBreakPoint';
import { CATEGORY, HAMBURGERMENUITEMS, ROUTE, TOOL } from './enums';

export type Config = {
    placeholders: {
        cardImage: string;
    };
    ui: {
        hexGrid: {
            gutterWidth: number;
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
        cardTransition: boolean;
        breakpoint: BreakpointName | null;
        hamburgerMenuRect: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> | null;
        activeHamburgerMenuItemName: HamburgerMenuItem['name'];
        postNavigationState: PostNavigationName | null;
        debug: {
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setRouteData: (routeData: RouteData) => void;
        store_setTimedCardTransition: (isReady: boolean) => void;
        store_setBreakpoint: (breakpoint: BreakpointName | null) => void;
        store_toggleHamburgerMenu: (rect: ZustandStore['values']['hamburgerMenuRect']) => void;
        store_toggleActiveHamburgerItem: (newMenuState: ZustandStore['values']['activeHamburgerMenuItemName']) => void;
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

export type HamburgerMenuItem = {
    name: Omit<keyof typeof HAMBURGERMENUITEMS, '__empty'>;
    startOffset?: number;
    subMenuItems?: HamburgerMenuItem[];
    iconPath?: string;
    iconSize?: number;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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
type FunctionalButtonName = 'home' | 'hamburger' | PostNavigationName;
export type CategoryName = keyof typeof CATEGORY;
export type AllButtonNames = CategoryName | FunctionalButtonName | HamburgerMenuItem['name'];

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
    target: string;
}
/** A Button for navigating to/from a CATEGORY */
export interface CategoryLinkButtonRouteData extends ButtonRouteData, CategoryLinkButtonData {}

interface FunctionalButtonData extends ButtonData {
    name: FunctionalButtonName;
    title?: string;
    svgIconPath: string;
    target: (ev?: React.MouseEvent<HTMLDivElement, MouseEvent>) => string | void;
}
/** A Button that executes a function (which can also return a navigatable target) */
export interface FunctionalButtonRouteData extends ButtonRouteData, FunctionalButtonData {}
export interface FunctionalButtonRouteDataTransformOffsets extends HexagonRouteDataTransformOffsets, FunctionalButtonData {}

export type valueof<T> = T[keyof T];

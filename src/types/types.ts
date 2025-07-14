import { MENU_CATEGORY, ToolsUrls } from './enums';

export type ZustandStore = {
    values: {
        theme: 'yellow' | 'pink' | 'orange' | 'bw';
        expansionState: NavigationExpansionState;
        menuState: MenuLink | null;
        postNavState: Omit<NavButton, 'home'> | null;
        debug: {
            applyFlipMotionBlur: boolean;
            applyTransformMatrixFix: boolean;
        };
    };
    methods: {
        store_cycleTheme: () => void;
        store_setExpansionState: (expansionState: NavigationExpansionState) => void;
        store_toggleMenu: (menuName: MenuLink | null) => void;
        store_setPostNavState: (postNavState: Omit<NavButton, 'home'> | null) => void;
        store_setDebugValues: (debugValues: Partial<ZustandStore['values']['debug']>) => void;
    };
};

export type NavigationExpansionState = 'home' | 'category' | 'post';

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

export type Post = {
    id: number;
    title: string;
    date: string | string[];
    textBlocks: { text: string; useShowCaseIndex?: number }[];
    showCases?: Post_ShowCase[];
    subTitle?: string;
    titleCardBg?: string;
    toolsUsed?: (keyof typeof ToolsUrls)[];
    codeLink?: {
        href: string;
        alt: string;
    };
};

export type DataBase = {
    [key in MENU_CATEGORY]: {
        id: number;
        categoryTitle: MENU_CATEGORY;
        posts: Post[];
        categoryCardBackgroundImage: string;
        categoryBackgroundSvg: CategoryLink;
        categoryBlurb: string;
        categoryBackgroundColor?: string;
    };
};

export type CategoryLink = 'code' | 'log' | '3d';
type MenuLink = 'settings' | 'contact' | 'controlpanel';
type NavButton = 'gohome' | 'previous' | 'next' | 'close';
export type UIButton = CategoryLink | MenuLink | NavButton;

export type HexagonData = { position: { x: number; y: number }; rotation: number; scale: number; isHalf: boolean; offsets?: { x: number; y: number } };
export type HexagonLink = { title: UIButton; svgPath?: string; target: string | (() => void | string) };

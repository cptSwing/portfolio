import { MENU_CATEGORY, ToolsUrls } from './enums';

export type ZustandStore = {
    nav: {
        /** Has a category in menu been opened? */
        activeCategory: MENU_CATEGORY | null;
        /** Which, if any, post was chosen? */
        activePost: Post | null;
    };

    methods: {
        store_activeCategory: (opened: MENU_CATEGORY | null) => void;
        store_activePost: (post: Post | null) => void;
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

export type Post = {
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
    [key in MENU_CATEGORY]: { posts: Post[]; categoryCardBackgroundImage: string; categoryBlurb: string; categoryBackgroundColor?: string };
};

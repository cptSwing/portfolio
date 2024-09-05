export enum MENUTARGET {
    News = 'News',
    About = 'About',
    Code = 'Code',
    Art = 'Art',
    // Undef = 'Undef',
}

export const menuTargetArray = Object.values(MENUTARGET);

export type ZustandStore = {
    nav: {
        /** Has a category in menu been opened? */
        categoryOpened: MENUTARGET | null;
        /** Which, if any, post was chosen? */
        activePost: Post | null;
    };

    methods: {
        store_categoryOpened: (opened: MENUTARGET | null) => void;
        store_activePost: (post: Post | null) => void;
    };
};

export type Post_Image = {
    imgUrl: string;
    caption?: string;
};

export type Post = {
    title: string;
    titleCardBg?: string;
    subTitle?: string;
    images?: Post_Image[];
    textContent: string[];
    codeLink?: string;
};

export type DataBase = {
    [key in MENUTARGET]: { posts: Post[]; headerCardBg: string };
};

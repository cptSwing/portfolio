export enum MENUTARGET {
    Updates = 'updates',
    Resume = 'resume',
    Code = 'code',
    Art = 'art',
    Contact = 'contact',
}

export type ZustandState = {
    active: { post: Post | null };

    methods: {
        store_activePost: (post: Post | null) => void;
    };
};

export type Post_Image = {
    imgUrl: string;
    caption: string;
};

export type Post = {
    title: string;
    titleCardBg: string;
    images?: Post_Image[];
    textContent: string[];
    codeLink?: string;
};

export type DataBase = {
    [key in MENUTARGET]: { posts: Post[]; headerCardBg: string };
};

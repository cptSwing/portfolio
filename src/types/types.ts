export enum MENUTARGET {
    Updates = 'updates',
    Resume = 'resume',
    Code = 'code',
    Art = 'art',
    Contact = 'contact',
}

export type ZustandState = {
    active: { post: DataBase_Post | null };

    methods: {
        store_activePost: (post: DataBase_Post | null) => void;
    };
};

export type DataBase_Post = {
    title: string;
    titleCardBg: string;
    galleryImages: string[] | null;
    textContent: string[];
    codeLink?: string;
};

export type DataBase = {
    [key in MENUTARGET]: { posts: DataBase_Post[]; headerCardBg: string };
};

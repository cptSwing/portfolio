export enum MENUTARGET {
    Updates = 'updates',
    Resume = 'resume',
    Code = 'code',
    Art = 'art',
    Contact = 'contact',
}

export type MenuToggleState = {
    [key in MENUTARGET]: boolean;
};

export type ZustandState = {
    menu: {
        state: MenuToggleState;
        isAnyChecked: boolean;
    };
    methods: {
        store_toggleMenuItem: (menuItem: MENUTARGET) => void;
    };
};

export type DataBase_Posts = {
    title: string;
    titleBg: string;
    galleryImages: string[];
    innerHtml: string;
};

export type DataBase = {
    [key in MENUTARGET]: { posts: DataBase_Posts[]; headerBg: string };
};

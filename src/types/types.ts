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
    menuState: MenuToggleState;
    methods: {
        store_toggleMenuItem: (menuItem: MENUTARGET) => void;
    };
};

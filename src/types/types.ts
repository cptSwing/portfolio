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

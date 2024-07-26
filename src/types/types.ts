export enum MENUTARGET {
    Default = 'default',
    Home = 'home',
    Back = 'back',
    Forward = 'forward',
    Settings = 'settings',
    ViewCode = 'viewCode',
    Resume = 'resume',
    Code = 'code',
    Art = 'art',
}

export type MenuToggleState = {
    [key in MENUTARGET]: boolean;
};

export type ZustandState = {
    menuState: MenuToggleState;
    menuLastUpdated: MENUTARGET;
    methods: {
        store_toggleMenuItem: (menuItem: MENUTARGET | null) => void;
    };
};

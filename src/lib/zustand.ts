import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MENUTARGET, MenuToggleState, ZustandState } from '../types/types';

const menuToggledFalse: MenuToggleState = {
    default: false,
    home: false,
    back: false,
    forward: false,
    settings: false,
    viewCode: false,
    resume: false,
    code: false,
    art: false,
};

export const menuToggledInitial: MenuToggleState = { ...menuToggledFalse, default: true };

export const useZustand = create<ZustandState>()(
    immer((set) => ({
        menuState: menuToggledInitial,
        menuLastUpdated: MENUTARGET.Default,
        methods: {
            store_toggleMenuItem: (menuItem) => {
                set((draftState) => {
                    // draftState.menuState = { ...menuToggledFalse };

                    let key: MENUTARGET;
                    for (key in draftState.menuState) {
                        draftState.menuState[key] = false;
                    }

                    if (menuItem) {
                        draftState.menuState[menuItem] = true;
                        draftState.menuLastUpdated = menuItem;
                    } else {
                        draftState.menuState.default = true;
                        draftState.menuLastUpdated = MENUTARGET.Default;
                    }
                    console.log(
                        '%c[zustand]',
                        'color: #193aca',
                        `draftState.menuState, menuItem, draftState.menuLastUpdated :`,
                        draftState.menuState,
                        menuItem,
                        draftState.menuLastUpdated,
                    );
                });
            },
        },
    })),
);

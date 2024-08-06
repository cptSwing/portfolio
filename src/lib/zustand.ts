import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MENUTARGET, MenuToggleState, ZustandState } from '../types/types';

const menuToggledFalse: MenuToggleState = {
    updates: false,
    resume: false,
    code: false,
    art: false,
    contact: false,
};

export const useZustand = create<ZustandState>()(
    immer((set) => ({
        menuState: menuToggledFalse,
        methods: {
            store_toggleMenuItem: (menuItem) => {
                set((draftState) => {
                    let key: MENUTARGET;
                    for (key in draftState.menuState) {
                        if (key === menuItem) {
                            draftState.menuState[key] = !draftState.menuState[key];
                        } else {
                            draftState.menuState[key] = false;
                        }
                    }
                });
            },
        },
    })),
);

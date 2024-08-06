import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MENUTARGET, MenuToggleState, ZustandState } from '../types/types';

const menuToggled: MenuToggleState = {
    updates: false,
    resume: false,
    code: false,
    art: false,
    contact: false,
};

export const useZustand = create<ZustandState>()(
    immer((set) => ({
        menu: { state: menuToggled, isAnyChecked: false },
        methods: {
            store_toggleMenuItem: (menuItem) => {
                set((draftState) => {
                    let key: MENUTARGET;

                    if (draftState.menu.isAnyChecked) {
                        for (key in draftState.menu.state) {
                            draftState.menu.state[key] = false;
                        }
                        draftState.menu.isAnyChecked = false;
                    } else {
                        for (key in draftState.menu.state) {
                            draftState.menu.state[key] = key === menuItem ? true : false;
                        }
                        draftState.menu.isAnyChecked = true;
                    }
                });
            },
        },
    })),
);

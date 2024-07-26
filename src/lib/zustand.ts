import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { MENUTARGETS, MenuToggleState } from "../types/types";

type ZustandState = {
    menuState: MenuToggleState;
};

export const useZustand = create<ZustandState>()(
    immer((set) => ({
        menuState: {
            default: true,
            home: false,
            back: false,
            forward: false,
            settings: false,
            viewCode: false,
            resume: false,
            code: false,
            art: false,
        },
        methods: {
            store_toggleMenuItem: (menuItem: MENUTARGETS) => {
                set((draftState) => {
                    draftState.menuState = { ...menuToggledFalse };

                    if (menuItem) {
                        draftState.menuState[menuItem] = true;
                    } else {
                        draftState.menuState.default = true;
                    }
                    console.log("%c[zustand]", "color: #193aca", `draftState.menuState, menuItem :`, draftState.menuState, menuItem);
                });
            },
        },
    })),
);

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

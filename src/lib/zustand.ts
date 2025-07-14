import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            theme: 'pink',
            expansionState: 'home',
            menuState: { menuName: null },
            postNavState: null,
            debug: {
                applyFlipMotionBlur: false,
                applyTransformMatrixFix: true,
            },
        },
        methods: {
            store_cycleTheme: () => {
                const current = get().values.theme;
                let next: ZustandStore['values']['theme'];

                switch (current) {
                    case 'yellow':
                        next = 'pink';
                        break;
                    case 'pink':
                        next = 'orange';
                        break;
                    case 'orange':
                        next = 'bw';
                        break;
                    case 'bw':
                        next = 'yellow';
                        break;
                }

                set((draftState) => {
                    draftState.values.theme = next;
                });
            },

            store_setExpansionState: (newState) => {
                set((draftState) => {
                    draftState.values.expansionState = newState;
                });
            },

            store_toggleMenu: (newMenuState) => {
                const { menuName, position } = get().values.menuState;
                const newValue = newMenuState.menuName === menuName ? null : newMenuState.menuName;

                set((draftState) => {
                    draftState.values.menuState = { menuName: newValue, position: newMenuState.position ?? position };
                });
            },

            store_setPostNavState: (postNavState) => {
                set((draftState) => {
                    draftState.values.postNavState = postNavState;
                });
            },

            store_setDebugValues: (debugValues) => {
                set((draftState) => {
                    draftState.values.debug = { ...draftState.values.debug, ...debugValues };
                });
            },
        },
    })),
);

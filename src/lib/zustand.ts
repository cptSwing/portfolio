import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';
import themes from './themes';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            themeIndex: 3,
            initialPostDimensions: null,
            debug: {
                applyFlipMotionBlur: false,
            },
        },
        methods: {
            store_cycleTheme: () => {
                const current = get().values.themeIndex;
                const next = current < themes.length - 1 ? current + 1 : 0;

                set((draftState) => {
                    draftState.values.themeIndex = next;
                });
            },

            store_setPostAnimationStartDimensions: (elementRect) => {
                set((draftState) => {
                    draftState.values.initialPostDimensions = elementRect;
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

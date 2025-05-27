import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            theme: 'pink',
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

            store_setDebugValues: (debugValues) => {
                set((draftState) => {
                    draftState.values.debug = { ...draftState.values.debug, ...debugValues };
                });
            },
        },
    })),
);

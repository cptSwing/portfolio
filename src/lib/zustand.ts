import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';
import themes from './themes';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: { themeIndex: 0 },
        methods: {
            store_cycleTheme: () => {
                const current = get().values.themeIndex;
                const next = current < themes.length - 1 ? current + 1 : 0;

                set((draftState) => {
                    draftState.values.themeIndex = next;
                });
            },
        },
    })),
);

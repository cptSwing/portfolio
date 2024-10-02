import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustand = create<ZustandStore>()(
    immer((set) => ({
        nav: { activeCategory: null, activePost: null },

        methods: {
            store_activeCategory: (opened) => {
                set((draftState) => {
                    draftState.nav.activeCategory = opened;
                });
            },

            store_activePost: (post) => {
                set((draftState) => {
                    draftState.nav.activePost = post;
                });
            },
        },
    })),
);

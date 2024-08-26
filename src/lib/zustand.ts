import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustand = create<ZustandStore>()(
    immer((set) => ({
        nav: { isOpened: null, activePost: null },

        methods: {
            store_isOpened: (opened) => {
                set((draftState) => {
                    draftState.nav.isOpened = opened;
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

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandState } from '../types/types';

export const useZustand = create<ZustandState>()(
    immer((set) => ({
        active: { post: null },

        methods: {
            store_activePost: (post) => {
                set((draftState) => {
                    draftState.active.post = post;
                });
            },
        },
    })),
);

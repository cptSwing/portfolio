import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        nav: { activeCategory: null, activePost: null },
        layout: { elem: null, distance: { top: 0 } },

        methods: {
            store_activeCategory: (opened) => {
                set((draftState) => {
                    draftState.nav.activeCategory = opened;
                });
            },

            store_activePost: (post) => {
                const stateElem = get().layout.elem;
                let distanceTop = 0;
                if (stateElem) {
                    const { height, top } = stateElem.getBoundingClientRect();
                    distanceTop = Math.ceil(height + top);
                }
                console.log('%c[zustand]', 'color: #e7721a', `stateElem, distanceTop :`, stateElem, distanceTop);
                set((draftState) => {
                    draftState.nav.activePost = post;
                    draftState.layout.distance.top = distanceTop;
                });
            },

            store_distance: (distance) => {
                set((draftState) => {
                    draftState.layout.distance.top = distance;
                });
            },
        },
    })),
);

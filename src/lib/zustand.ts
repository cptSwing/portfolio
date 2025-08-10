import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Category, Post, ZustandStore } from '../types/types';
import { ROUTE } from '../types/enums';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            theme: 'pink',
            routeData: { name: ROUTE.home, content: {} },
            activeMenuButton: { name: null },
            postNavigationState: null,
            debug: {
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

            store_setRouteData: ({ name, content }) => {
                const oldContent = get().values.routeData.content;
                const newRouteData = {
                    name,
                    content: {
                        ...oldContent,
                        ...content,
                    },
                };

                set((draftState) => {
                    draftState.values.routeData = newRouteData as { name: ROUTE.home; content: { category?: Category; post?: Post } }; // most permissive of the three types
                });
            },

            store_toggleMenu: (newMenuState) => {
                const { name, positionAndSize } = get().values.activeMenuButton;
                const newValue = newMenuState.name === name ? null : newMenuState.name;

                set((draftState) => {
                    draftState.values.activeMenuButton = { name: newValue, positionAndSize: newMenuState.positionAndSize ?? positionAndSize };
                });
            },

            store_setPostNavigationState: (postNavigationState) => {
                set((draftState) => {
                    draftState.values.postNavigationState = postNavigationState;
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

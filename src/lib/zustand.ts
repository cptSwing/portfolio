import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Category, Post, Theme, themes, ZustandStore } from '../types/types';
import { ROUTE } from '../types/enums';
import { cycleThrough } from 'cpts-javascript-utilities';
import { config } from '../types/exportTyped';

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            theme: 'pink',
            routeData: { name: ROUTE.home, content: {} },
            cardTransition: false,
            breakpoint: null,
            hamburgerMenuRect: null,
            activeHamburgerMenuItemName: 'DEFAULT',
            postNavigationState: null,
            debug: {
                applyTransformMatrixFix: true,
            },
        },
        methods: {
            store_cycleTheme: () => {
                const current = get().values.theme;
                const nextTheme = cycleThrough<Theme>(themes, current, 'next');

                set((draftState) => {
                    draftState.values.theme = nextTheme;
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

            store_setTimedCardTransition: (cardTransition) => {
                set((draftState) => {
                    draftState.values.cardTransition = cardTransition;
                });

                const timer = setTimeout(() => {
                    set((draftState) => {
                        draftState.values.cardTransition = false;
                    });
                    clearTimeout(timer);
                }, transitionDuration_MS);
            },

            store_setBreakpoint: (newBreakpoint) => {
                set((draftState) => {
                    draftState.values.breakpoint = newBreakpoint;
                });
            },

            store_toggleHamburgerMenu: (hamburgerMenuRect) => {
                set((draftState) => {
                    draftState.values.hamburgerMenuRect = hamburgerMenuRect;
                });
            },

            store_toggleActiveHamburgerItem: (newMenuItem) => {
                const current = get().values.activeHamburgerMenuItemName;
                const newName = current === newMenuItem ? 'DEFAULT' : newMenuItem;

                set((draftState) => {
                    draftState.values.activeHamburgerMenuItemName = newName;
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

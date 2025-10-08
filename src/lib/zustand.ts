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
            hamburgerMenuOpen: false,
            activeSubMenuButton: { name: null },
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

            store_toggleHamburgerMenu: (isOpen) => {
                const newValue = isOpen === true || isOpen === false ? isOpen : !get().values.hamburgerMenuOpen;

                set((draftState) => {
                    draftState.values.hamburgerMenuOpen = newValue;
                });
            },

            store_toggleSubMenu: (newMenuState) => {
                const { name, positionAndSize } = get().values.activeSubMenuButton;
                const newValue = newMenuState.name === name ? null : newMenuState.name;

                set((draftState) => {
                    draftState.values.activeSubMenuButton = { name: newValue, positionAndSize: newMenuState.positionAndSize ?? positionAndSize };
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

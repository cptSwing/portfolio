import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Category, Post, Theme, themes, ZustandStore } from '../types/types';
import { ROUTE } from '../types/enums';
import { cycleThrough } from 'cpts-javascript-utilities';
import { config } from '../types/exportTyped';
import wrapAroundArray from './wrapAroundArray';

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            theme: 'pink',
            routeData: { name: ROUTE.home, content: {} },
            cardTransition: false,
            hamburgerMenuRect: null,
            activeHamburgerMenuItemName: 'DEFAULT',
            postIndex: null,
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
                const newRouteData = {
                    name,
                    content,
                };

                set((draftState) => {
                    draftState.values.routeData = newRouteData as { name: ROUTE.home; content: { category?: Category; post?: Post } };
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

            store_setPostIndexAndTransitionTrue: (directionOrIndex) => {
                const newIndex = getNewPostIndex(get().values.postIndex ?? 0, get().values.routeData.content.category?.posts.length ?? 0, directionOrIndex);

                set((draftState) => {
                    draftState.values.postIndex = newIndex;
                });

                get().methods.store_setTimedCardTransition(true);
            },

            store_setDebugValues: (debugValues) => {
                set((draftState) => {
                    draftState.values.debug = { ...draftState.values.debug, ...debugValues };
                });
            },
        },
    })),
);

function getNewPostIndex(oldIndex: number, postCount: number, directionOrIndex: number | 'previous' | 'next') {
    let newIndex: number;
    if (directionOrIndex === 'previous' || directionOrIndex === 'next') {
        newIndex = wrapAroundArray(oldIndex, postCount, directionOrIndex);
    } else {
        newIndex = directionOrIndex;
    }

    return newIndex;
}

import { Category as Category_T } from '../../types/types';
import { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import { useZustand } from '../../lib/zustand.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';
import CategoryCards from '../CategoryCards.tsx';
import { usePreviousPersistent } from '../../hooks/usePrevious.ts';

const { store_setTimedCardTransition, store_toggleHamburgerMenu } = useZustand.getState().methods;

const Category: FC<{ show: boolean }> = memo(({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;
    const previousCategoryId = usePreviousPersistent(category.id);

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, ['!clip-inset-[-10%]']); // 'clip-inset-x-[-50%]'
    const [wheelDirection, wheelDistance] = useMouseWheelDirection();

    const activeIndexState = useState(0);
    const [, setActiveIndex] = activeIndexState;

    useLayoutEffect(() => {
        if (wheelDirection !== null) {
            setActiveIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
            store_setTimedCardTransition(true);
            store_toggleHamburgerMenu(null);
        }
    }, [category.posts.length, wheelDirection, setActiveIndex, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    /* Run after the wheel-direction effect to ensure activeIndex is at 0 when switching categories/unmounting */
    useLayoutEffect(() => {
        if (category.id !== previousCategoryId) {
            setActiveIndex(0);
        }

        return () => {
            setActiveIndex(0);
        };
    }, [category.id, previousCategoryId, setActiveIndex]);

    return isMounted ? (
        <div
            ref={categoryRef}
            className="absolute size-full transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-[50%]" //
        >
            <CategoryCards posts={category.posts} activeIndexState={activeIndexState} />
        </div>
    ) : null;
});

export default Category;

/* Local functions */

const loopFlipValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        const nextValue = value + 1;
        return nextValue >= max ? 0 : nextValue;
    } else {
        const previousValue = value - 1;
        return previousValue < 0 ? max - 1 : previousValue;
    }
};

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

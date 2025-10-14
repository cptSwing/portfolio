import { useEffect, useLayoutEffect } from 'react';
import useMouseWheelDirection from './useMouseWheelDirection';
import { useZustand } from '../lib/zustand';
import { usePrevious } from './usePrevious';

const { store_setTimedCardTransition, store_setPostIndex } = useZustand.getState().methods;

const useSwitchCategoryCard = (categoryId: number, categoryPostsCount: number) => {
    const postIndex = useZustand((store) => store.values.postIndex);
    const { direction, resetDirection } = useMouseWheelDirection();

    const previousCategoryId = usePrevious(categoryId);

    useLayoutEffect(() => {
        if (categoryId !== previousCategoryId) {
            store_setPostIndex(0);
            store_setTimedCardTransition(true);
        } else if (direction !== null) {
            store_setPostIndex(loopFlipValues(postIndex, categoryPostsCount, direction));
            resetDirection();
        }
    }, [categoryId, categoryPostsCount, direction, postIndex, previousCategoryId, resetDirection]); // wheelDistance needed as dependency to have this useEffect update at all

    useEffect(() => {
        store_setTimedCardTransition(true);
    }, [postIndex]);
};

export default useSwitchCategoryCard;

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

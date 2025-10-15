import { useLayoutEffect } from 'react';
import useMouseWheelDirection from './useMouseWheelDirection';
import { useZustand } from '../lib/zustand';
import { usePrevious } from './usePrevious';

const store_setPostIndex = useZustand.getState().methods.store_setPostIndex;

const useSwitchCategoryCard = (categoryId: number, categoryPostsCount: number) => {
    const postIndex = useZustand((store) => store.values.postIndex);
    const { direction, resetDirection } = useMouseWheelDirection();

    const previousCategoryId = usePrevious(categoryId);

    useLayoutEffect(() => {
        if (categoryId !== previousCategoryId) {
            store_setPostIndex(0);
        } else if (direction !== null) {
            store_setPostIndex(direction === 'down' ? 'next' : 'previous');
            resetDirection();
        }
    }, [categoryId, categoryPostsCount, direction, postIndex, previousCategoryId, resetDirection]); // wheelDistance needed as dependency to have this useEffect update at all
};

export default useSwitchCategoryCard;

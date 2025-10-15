import { useLayoutEffect } from 'react';
import useMouseWheelDirection from './useMouseWheelDirection';
import { useZustand } from '../lib/zustand';
import { usePrevious } from './usePrevious';

const store_setPostIndex = useZustand.getState().methods.store_setPostIndex;

const useSwitchCategoryCard = (categoryId: number, isActive = false) => {
    const post = useZustand((store) => store.values.routeData.content.post);
    const { direction, resetDirection } = useMouseWheelDirection();

    const previousCategoryId = usePrevious(categoryId);

    useLayoutEffect(() => {
        if (isActive) {
            if (categoryId !== previousCategoryId && !post?.id) {
                store_setPostIndex(0);
            } else if (direction !== null) {
                store_setPostIndex(direction === 'down' ? 'next' : 'previous');
                resetDirection();
            }
        }
    }, [categoryId, direction, isActive, post?.id, previousCategoryId, resetDirection]);
};

export default useSwitchCategoryCard;

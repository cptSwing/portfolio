import { useLayoutEffect } from 'react';
import useMouseWheelDirection from './useMouseWheelDirection';
import { cycleThrough } from 'cpts-javascript-utilities';
import { CATEGORY } from '../types/enums';
import { CategoryName, RotateShortestDistance, TransitionTargetReached } from '../types/types';

const categoryNames = Object.keys(CATEGORY).slice(3);

const useMouseRotate = (
    setTransitionState: React.Dispatch<React.SetStateAction<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>>,
    on: boolean,
) => {
    const { direction, resetDirection } = useMouseWheelDirection();

    useLayoutEffect(() => {
        if (on) {
            if (direction) {
                setTransitionState((oldTransitionState) => {
                    const oldTarget = oldTransitionState[0] ?? 'code';
                    const advanceOne = cycleThrough(categoryNames, oldTarget, direction === 'down' ? 'next' : 'previous') as CategoryName;
                    return [advanceOne, false, false];
                });
                resetDirection();
            }
        }
    }, [direction, on, resetDirection, setTransitionState]);
};

export default useMouseRotate;

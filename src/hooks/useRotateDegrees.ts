import { useLayoutEffect, useState } from 'react';
import { CATEGORY } from '../types/enums';
import { usePrevious } from './usePrevious';
import { cycleThrough } from 'cpts-javascript-utilities';
import { CategoryName, RotateShortestDistance } from '../types/types';

const categoryNames = Object.keys(CATEGORY).slice(3);
const defaultDegreeStep = 120;

const useRotateDegrees = (transitionTarget: CategoryName | null, shortestDistance: RotateShortestDistance, on: boolean) => {
    const previousTransitionTarget = usePrevious(transitionTarget);
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const firstTurn = rotationDegrees === 0;

    useLayoutEffect(() => {
        if (on) {
            if (transitionTarget && transitionTarget !== previousTransitionTarget) {
                const targetIndex = categoryNames.indexOf(transitionTarget);

                if (shortestDistance) {
                    const targetRotation = -targetIndex * defaultDegreeStep + 60;

                    setRotationDegrees((oldRotation) => oldRotation + shortestDegreeDelta(oldRotation, targetRotation));
                } else {
                    const nextTarget = cycleThrough(categoryNames, previousTransitionTarget ?? 'code', 'next') as CategoryName;
                    const offsetSign = transitionTarget === nextTarget ? -1 : 1;
                    const degreeStep = firstTurn ? defaultDegreeStep / 2 : defaultDegreeStep;

                    setRotationDegrees((oldRotation) => oldRotation + degreeStep * offsetSign);
                }
            }
        } else {
            setRotationDegrees(0);
        }
    }, [firstTurn, on, previousTransitionTarget, shortestDistance, transitionTarget]);

    return rotationDegrees;
};

export default useRotateDegrees;

function shortestDegreeDelta(currentDeg: number, targetDeg: number) {
    return ((targetDeg - currentDeg + 540) % 360) - 180;
}

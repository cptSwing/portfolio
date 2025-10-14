// TODO Does not work on touch/swipe
// TODO Ideas for Swipe: https://codesandbox.io/p/sandbox/react-swipe-hook-w77ui?file=%2Fsrc%2FuseSwipe.js ; https://medium.com/@serhanelmali/how-to-implement-swipe-functionality-in-react-with-the-useswipe-hook-5ead46025370

import { useCallback, useEffect, useRef, useState } from 'react';
import { useThrottledMouseWheel } from './useMouseWheel';

/** Defines wether the Mouse scrolls down- or upward */
const useMouseWheelDirection = (delay_Ms?: number) => {
    const mouseWheel = useThrottledMouseWheel(delay_Ms);
    const [direction, setDirection] = useState<'down' | 'up' | null>(null);
    const lastWheelValue = useRef(0);

    const resetDirection = useCallback(() => {
        setDirection(null);
    }, []);

    useEffect(() => {
        if (mouseWheel > lastWheelValue.current) {
            setDirection('down');
        } else if (mouseWheel < lastWheelValue.current) {
            setDirection('up');
        }

        lastWheelValue.current = mouseWheel;
    }, [mouseWheel, setDirection]);

    return { direction, resetDirection };
};

export default useMouseWheelDirection;

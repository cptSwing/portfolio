// TODO Does not work on touch/swipe
// TODO Ideas for Swipe: https://codesandbox.io/p/sandbox/react-swipe-hook-w77ui?file=%2Fsrc%2FuseSwipe.js ; https://medium.com/@serhanelmali/how-to-implement-swipe-functionality-in-react-with-the-useswipe-hook-5ead46025370

import { useEffect, useRef, useState } from 'react';
import { useThrottledMouseWheel } from './useMouseWheel';

/** Defines wether the Mouse scrolls down- or upward */
const useMouseWheelDirection = (delay_Ms?: number) => {
    const mouseWheel = useThrottledMouseWheel(delay_Ms);
    const [directionAndDistance, setDirectionAndDistance] = useState<['down' | 'up' | null, number]>([null, 0]);
    const lastWheelValue = useRef(0);

    useEffect(() => {
        if (mouseWheel > lastWheelValue.current) {
            setDirectionAndDistance(['down', mouseWheel]);
        } else if (mouseWheel < lastWheelValue.current) {
            setDirectionAndDistance(['up', mouseWheel]);
        }

        lastWheelValue.current = mouseWheel;
    }, [mouseWheel]);

    return directionAndDistance;
};

export default useMouseWheelDirection;

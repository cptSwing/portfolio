/** Define wether the Mouse scrolls down- or upward */
// TODO does this work for touch events?

import { useEffect, useRef, useState } from 'react';
import { useMouseWheel } from 'react-use';

const useMouseWheelDirection = () => {
    const mouseWheel = useMouseWheel();

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

// https://medium.com/@itsanuragjoshi/debouncing-and-throttling-in-react-enhancing-user-experience-with-custom-hooks-bcaa897162ef
// limits how often a function can be called.

import { useState, useEffect, useRef } from 'react';

const useThrottle = <T>(value: T, delay_Ms: number): T => {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastExecuted = useRef(Date.now());

    useEffect(() => {
        if (Date.now() - lastExecuted.current >= delay_Ms) {
            lastExecuted.current = Date.now(); // enough time has passed since the last execution: update the throttled value
            setThrottledValue(value);
        } else {
            // create a timer to update the throttled value after the delay_Ms
            const throttleTimer = setTimeout(() => {
                lastExecuted.current = Date.now();
                setThrottledValue(value);
            }, delay_Ms);

            return () => clearTimeout(throttleTimer);
        }
    }, [value, delay_Ms]);

    return throttledValue;
};

export default useThrottle;

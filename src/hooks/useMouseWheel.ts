import { useEffect, useState } from 'react';

// From github.com/streamich/react-use/blob/master/src/useMouseWheel.ts
export const useMouseWheel = () => {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);

    useEffect(() => {
        const updateScroll = (e: WheelEvent) => {
            setMouseWheelScrolled((currentState) => e.deltaY + currentState);
        };

        window.addEventListener('wheel', updateScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', updateScroll);
        };
    }, []);

    return mouseWheelScrolled;
};

export const useThrottledMouseWheel = (delay_Ms = 200) => {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);

    useEffect(() => {
        const throttledHandler = throttleAndDismissSmallValues((e: WheelEvent) => {
            setMouseWheelScrolled((currentState) => e.deltaY + currentState);
        }, delay_Ms);

        window.addEventListener('wheel', throttledHandler);

        return () => window.removeEventListener('wheel', throttledHandler);
    }, [delay_Ms]);

    return mouseWheelScrolled;
};

// https://stackoverflow.com/a/68256988
function throttleAndDismissSmallValues(callback: (e: WheelEvent) => void, delay_Ms: number, dismissMin = 5) {
    let time = Date.now();

    return (e: WheelEvent) => {
        // we dismiss every wheel event with deltaY less than 4
        if (Math.abs(e.deltaY) <= dismissMin) return;

        if (time + delay_Ms - Date.now() < 0) {
            callback(e);
            time = Date.now();
        }
    };
}

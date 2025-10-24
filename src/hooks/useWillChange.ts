/** As https://developer.mozilla.org/en-US/docs/Web/CSS/will-change recommends this css property not be used excessively, and in fact be added closely timed with the actual change expected to happen, here's a hook. */

import { Property } from 'csstype';
import { useEffect, useCallback } from 'react';

const useWillChange = <T>(
    ref: React.MutableRefObject<T | null>,
    properties: Omit<Property.WillChange, 'auto'>[],
    shouldTrigger: boolean,
    timeout = 500,
    callback?: () => void,
) => {
    useEffect(() => {
        if (!ref.current || !shouldTrigger) return;
        const el = ref.current;

        if (el && (el instanceof HTMLElement || el instanceof SVGElement)) {
            el.style.willChange = properties.join(', ');

            const timer = setTimeout(() => {
                el.style.willChange = 'auto';
                callback && callback();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [shouldTrigger, properties, ref, timeout, callback]);
};

export default useWillChange;

export const useWillChangeHandler = <T extends React.SyntheticEvent>(
    ref: React.RefObject<HTMLElement | SVGElement>,
    properties: Omit<Property.WillChange, 'auto'>[],
    timeout = 500,
) =>
    useCallback(
        (handler?: (event: T) => void) => (event: T) => {
            const el = ref.current;
            if (!el) return handler ? handler(event) : undefined;

            el.style.willChange = properties.join(', ');
            handler && handler(event);

            const timer = setTimeout(() => {
                el.style.willChange = 'auto';
                clearTimeout(timer);
            }, timeout);
        },
        [ref, properties, timeout],
    );

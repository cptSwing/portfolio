import { ForwardedRef, MutableRefObject, useEffect, useRef } from 'react';

/* https://stackoverflow.com/a/73046577 */

const useForwardedRef = <T>(ref: ForwardedRef<T>, callback?: (elem: T | null) => void): MutableRefObject<T | null> => {
    const innerRef = useRef<T | null>(null);

    useEffect(() => {
        if (!ref) return;

        if (typeof ref === 'function') {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }

        callback && callback(innerRef.current);
    }, [ref, callback]);

    return innerRef;
};

export default useForwardedRef;

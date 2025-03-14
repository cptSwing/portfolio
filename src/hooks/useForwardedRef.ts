import { ForwardedRef, MutableRefObject, useEffect, useRef } from 'react';

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
    });

    return innerRef;
};

export default useForwardedRef;

import { useRef, useEffect } from 'react';
import isNumber from '../lib/isNumber';

// based on https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
const useTimeout = (callback: () => void, delay_MS: number | null) => {
    const timeout_Ref = useRef<number>();
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const cb = () => {
            savedCallback.current();
            clearTimeout(timeout_Ref.current);
        };

        if (isNumber(delay_MS)) {
            timeout_Ref.current = setTimeout(cb, delay_MS!);
            return () => clearTimeout(timeout_Ref.current);
        }
    }, [delay_MS]);

    return timeout_Ref;
};

export default useTimeout;

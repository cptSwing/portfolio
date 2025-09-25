import { useRef, useEffect } from 'react';

// based on https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
const useTimeout = (callback: () => void, delay_MS: number | null) => {
    const timeout_Ref = useRef<number>();
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();

        if (typeof delay_MS === 'number') {
            timeout_Ref.current = setTimeout(tick, delay_MS);
            return () => clearTimeout(timeout_Ref.current);
        }
    }, [delay_MS]);

    return timeout_Ref;
};

export default useTimeout;

import { useEffect, useRef } from "react";

export const usePrevious = <T>(val: T): T | undefined => {
    const ref = useRef<T | undefined>();

    useEffect(() => {
        ref.current = val;
    }, [val]);

    return ref.current;
};

/* https://www.developerway.com/posts/implementing-advanced-use-previous-hook#part3 */

export const usePreviousPersistent = <T>(val: T): T | undefined | null => {
    // initialise the ref with previous and current values
    const ref = useRef<{ val: T | undefined | null; prev: T | undefined | null }>({
        val,
        prev: null,
    });

    const current = ref.current.val;

    // if the value passed into hook doesn't match what we store as "current", move the "current" to the "previous" and store the passed value as "current"
    if (val !== current) {
        ref.current = {
            val,
            prev: current,
        };
    }

    // return the previous value only
    return ref.current.prev;
};

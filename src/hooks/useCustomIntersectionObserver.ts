import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

export const useCustomIntersectionObserver = (observerOptions: IntersectionObserverInit = {}) => {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: null,
        rootMargin: '0px',
        ...observerOptions,
    });

    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (entry?.isIntersecting) {
            setHasIntersected(true);
        }

        // return () => setHasIntersected(false);
    }, [entry?.isIntersecting]);

    return [ref, entry, hasIntersected] as [
        (
            instance: Element | null,
        ) => void | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES],
        IntersectionObserverEntry | null,
        boolean,
    ];
};

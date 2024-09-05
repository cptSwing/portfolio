import { useEffect, useState } from 'react';

type Params = {
    elementRef: React.MutableRefObject<HTMLElement | null>;
    removeBefore?: string;
    add: string;
    removeAfter: string;
};

export const useClassListOnMount = ({ elementRef, removeBefore, add, removeAfter }: Params) => {
    const [hasRunOnce, setHasRunOnce] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (element && !hasRunOnce) {
            const [removeBeforeArr, addArr, removeAfterArr] = ([removeBefore, add, removeAfter].filter(Boolean) as string[]).map((string) => string.split(' '));

            const listenerCallback = function (this: HTMLElement) {
                this.classList.remove(...removeAfterArr);
                this.removeEventListener('transitionend', listenerCallback);
                setHasRunOnce(true);
            };

            element.classList.remove(...removeBeforeArr);
            element.classList.add(...addArr);

            element.addEventListener('transitionend', listenerCallback);
        }
    }, [elementRef, removeBefore, add, removeAfter, hasRunOnce]);

    return hasRunOnce;
};

import { useEffect, useRef } from 'react';

type Params = {
    elementRef: React.MutableRefObject<HTMLElement | null>;
    classes: {
        add: string[];
        remove: string[];
        removeAfter: string[];
    };
};

export const useClassListOnMount = ({ elementRef, classes }: Params) => {
    const isFirstMount = useRef<boolean>(true);

    useEffect(() => {
        if (elementRef.current && isFirstMount.current !== null) {
            if (isFirstMount.current) {
                elementRef.current.classList.remove(...classes.remove);
                elementRef.current.classList.add(...classes.add);
                isFirstMount.current = false;

                const listenerCallback = function (this: HTMLElement) {
                    this.classList.remove(...classes.removeAfter);
                    this.removeEventListener('transitionend', listenerCallback);
                };

                elementRef.current.addEventListener('transitionend', listenerCallback);
            }
        }
    }, [elementRef, classes.remove, classes.add, classes.removeAfter]);
};

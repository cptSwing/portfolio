import { RefObject, useEffect, useState } from 'react';

const useMountTransition = (target: RefObject<Element | null>, showTarget: boolean, classesOnMount: string[]) => {
    const [shouldMount, setShouldMount] = useState(false);

    useEffect(() => {
        if (showTarget) {
            setShouldMount(true);
        }
    }, [showTarget]);

    useEffect(() => {
        if (target.current) {
            if (shouldMount) {
                target.current.classList.add(...classesOnMount);
            }

            if (!showTarget) {
                target.current.classList.remove(...classesOnMount);

                function handleTransitionEnd(this: Element, event: Event) {
                    if (event.target === event.currentTarget) {
                        this.removeEventListener('transitionend', handleTransitionEnd);
                        setShouldMount(false);
                    }
                }

                target.current.addEventListener('transitionend', handleTransitionEnd);
            }
        }
    }, [shouldMount, showTarget, target, classesOnMount]);

    return shouldMount;
};

export default useMountTransition;

import { useEffect, useState } from 'react';

function useMountTransition(targetElement: React.MutableRefObject<Element | null>, showTargetElement: boolean, transitionClassName: string) {
    const [shouldMount, setShouldMount] = useState(false);

    useEffect(() => {
        if (showTargetElement) {
            setShouldMount(true);
        }
    }, [showTargetElement]);

    useEffect(() => {
        if (targetElement.current) {
            if (shouldMount) {
                targetElement.current.classList.add(transitionClassName);
            }

            if (!showTargetElement) {
                targetElement.current.classList.remove(transitionClassName);
                targetElement.current.addEventListener('transitionend', handleTransitionEnd);

                function handleTransitionEnd(this: Element, event: Event) {
                    if (event.target === event.currentTarget) {
                        this.removeEventListener('transitionend', handleTransitionEnd);
                        setShouldMount(false);
                    }
                }
            }
        }
    }, [shouldMount, showTargetElement, targetElement, transitionClassName]);

    return shouldMount;
}

export default useMountTransition;

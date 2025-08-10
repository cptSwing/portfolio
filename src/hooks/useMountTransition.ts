import { useEffect, useState } from 'react';

function useMountTransition(targetElement: React.MutableRefObject<Element | null>, showTargetElement: boolean, transitionClassName: string) {
    const [shouldMount, setShouldMount] = useState(showTargetElement);

    useEffect(() => {
        if (showTargetElement) {
            setShouldMount(true);
        }
    }, [targetElement, showTargetElement, transitionClassName]);

    useEffect(() => {
        if (targetElement.current) {
            if (shouldMount) {
                targetElement.current.classList.add(transitionClassName);
            }

            if (!showTargetElement) {
                targetElement.current.classList.remove(transitionClassName);

                function handleTransitionEnd(this: Element, event: Event) {
                    if (event.target === event.currentTarget) {
                        this.removeEventListener('transitionend', handleTransitionEnd);
                        setShouldMount(false);
                    }
                }

                targetElement.current.addEventListener('transitionend', handleTransitionEnd);
            }
        }
    }, [shouldMount, showTargetElement, targetElement, transitionClassName]);

    return shouldMount;
}

export default useMountTransition;

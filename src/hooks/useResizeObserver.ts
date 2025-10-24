import { useLayoutEffect, useRef, useState } from 'react';

const useResizeObserver = (elem?: Element | null) => {
    const [rect, setRect] = useState<DOMRect | null>(null);
    const observer_Ref = useRef<ResizeObserver>();

    useLayoutEffect(() => {
        if (!elem) {
            setRect(null);
        } else {
            observer_Ref.current = new ResizeObserver((entries) => entries.forEach((entry) => entry.target === elem && setRect(entry.contentRect)));

            const observer = observer_Ref.current;
            observer.observe(elem);

            return () => {
                observer.unobserve(elem);
            };
        }
    }, [elem]);

    return rect;
};

export default useResizeObserver;

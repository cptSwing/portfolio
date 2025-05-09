import { useEffect, useRef } from 'react';

const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick, { capture: true });

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
        };
    }, [ref, callback]);

    return ref;
};

export default useOutsideClick;

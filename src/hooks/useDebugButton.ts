import { useCallback, useEffect, useMemo } from 'react';

/**
 * Description placeholder
 *
 * @param {string} label
 * @param {(...args: {}) => unknown} buttonCallback
 * @param {number} [count=0]
 * @returns {unknown, count?: number) => void}
 */
export const useDebugButton: (label: string, buttonCallback: (ev: MouseEvent) => void | unknown, count?: number, row?: number) => void = (
    label,
    buttonCallback,
    count = 0,
    row = 0,
) => {
    const eventCb = useCallback((ev: MouseEvent) => {
        buttonCallback(ev);
    }, []);

    const buttonNode = useMemo(() => {
        const parent = document.createElement('div');
        parent.style.setProperty('position', 'fixed');
        parent.style.setProperty('top', '0.15rem');
        parent.style.setProperty('left', '0.15rem');
        parent.style.setProperty('margin', '1rem');
        parent.style.setProperty('transform', `translateX(${110 * count}%) translateY(${125 * row}%)`);

        const button = document.createElement('button');
        button.onclick = eventCb;
        button.innerHTML = `${label} #${count}<br/>${count}`;
        button.style.setProperty('font-size', '0.75rem');

        button.style.setProperty('background-color', 'blue');
        button.style.setProperty('color', 'white');
        button.style.setProperty('border-radius', '0.5rem');
        button.style.setProperty('padding', '0.25rem');

        parent.appendChild(button);

        return parent;
    }, []);

    useEffect(() => {
        document.body.appendChild(buttonNode);

        return () => {
            document.body.removeChild(buttonNode);
        };
    }, []);
};

import { useCallback, useEffect, useRef } from 'react';

/**
 * Description placeholder
 *
 * @param {string} label
 * @param {(...args: {}) => unknown} buttonCallback
 * @param {number} [count=0]
 * @returns {unknown, count?: number) => void}
 */
export const useDebugButton: (label: string, buttonCallback: (ev: MouseEvent) => void, isActive?: boolean) => void = (
    label,
    buttonCallback,
    isActive = true,
) => {
    const createContainer = useCallback((id: string) => {
        const container = document.body.appendChild(document.createElement('div'));
        container.id = id;
        container.style.setProperty('position', 'fixed');
        container.style.setProperty('top', '0.5rem');
        container.style.setProperty('left', '0.5rem');
        // container.style.setProperty('margin', '1rem');
        container.style.setProperty('display', 'grid');
        container.style.setProperty('grid-auto-flow', 'column');
        container.style.setProperty('column-gap', '0.333rem');

        return container;
    }, []);

    const createButton = useCallback(() => {
        const button = document.createElement('button');
        button.onclick = buttonCallback;
        button.innerHTML = label;

        button.style.setProperty('font-size', '0.6rem');
        button.style.setProperty('max-width', '5rem');
        button.style.setProperty('background-color', 'rgba(0,0,255,0.75)');
        button.style.setProperty('color', 'white');
        button.style.setProperty('border-radius', '0.25rem');
        button.style.setProperty('padding', '0.25rem');

        return button;
    }, [buttonCallback, label]);

    const debugWrapper_Ref = useRef<HTMLDivElement | null>(null);
    const buttonNode_Ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const debugContainer = document.getElementById('debug-container') as HTMLDivElement | null;

        if (!debugContainer && isActive) {
            debugWrapper_Ref.current = createContainer('debug-container');
        } else {
            debugWrapper_Ref.current = debugContainer;
        }

        return () => {};
    }, [createContainer, isActive]);

    useEffect(() => {
        if (debugWrapper_Ref.current && isActive) {
            if (!buttonNode_Ref.current) {
                buttonNode_Ref.current = createButton();
                debugWrapper_Ref.current.appendChild(buttonNode_Ref.current);
            }
        }

        return () => {
            if (buttonNode_Ref.current) {
                debugWrapper_Ref.current?.removeChild(buttonNode_Ref.current);
                buttonNode_Ref.current = null;
            }
        };
    }, [createButton, isActive]);
};

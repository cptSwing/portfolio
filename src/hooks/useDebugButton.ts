import { useCallback, useEffect, useRef } from 'react';
import { setCssProperties } from '../lib/cssProperties';

export const useDebugButton: (label: string, buttonCallback: (ev: MouseEvent) => void, isActive?: boolean) => void = (
    label,
    buttonCallback,
    isActive = true,
) => {
    const createContainer = useCallback((id: string) => {
        const container = document.body.appendChild(document.createElement('div'));
        container.id = id;
        setCssProperties(container, {
            'position': 'fixed',
            'top': '0.5rem',
            'left': '0.5rem',
            'display': 'grid',
            'grid-auto-flow': 'column',
            'column-gap': '0.333rem',
        });

        return container;
    }, []);

    const createButton = useCallback(() => {
        const button = document.createElement('button');
        button.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
        });

        button.addEventListener('mousedown', (ev) => {
            buttonCallback(ev);
        });

        button.innerHTML = label;

        setCssProperties(button, {
            'font-size': '0.6rem',
            'max-width': '5rem',
            'background-color': 'rgb(0,0,255)',
            'color': 'white',
            'border-radius': '0.25rem',
            'padding': '0.25rem',
            'opacity': '0.5',
        });

        button.onmouseover = () => button.style.setProperty('opacity', '1');
        button.onmouseout = () => button.style.setProperty('opacity', '0.5');

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

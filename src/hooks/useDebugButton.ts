import { useCallback, useEffect, useRef } from 'react';

const useDebugButton: (label: string, buttonCallback: (ev: MouseEvent) => void, isActive?: boolean) => void = (label, buttonCallback, isActive = true) => {
    const createContainer = useCallback((id: string) => {
        const container = document.body.appendChild(document.createElement('div'));
        container.id = id;

        container.appendChild(debugButtonStyleElement);

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
        button.classList.add('__debugButtonClass');

        return button;
    }, [buttonCallback, label]);

    /* Check for existing debug container */
    const debugWrapper_Ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const debugContainer = document.getElementById(debugContainerId) as HTMLDivElement | null;

        if (!debugContainer && isActive) {
            debugWrapper_Ref.current = createContainer(debugContainerId);
        } else {
            debugWrapper_Ref.current = debugContainer;
        }

        return () => {};
    }, [createContainer, isActive]);

    /* Check wether Button exists */
    const buttonNode_Ref = useRef<HTMLButtonElement | null>(null);
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

export default useDebugButton;

const debugContainerId = '__debug-container';

const clipPercentage = '75%';

const debugButtonStyle = /* css */ `
#${debugContainerId} {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    display: grid;
    grid-auto-flow: column;
    column-gap: 0.333rem;
    z-index: 9999;
    clip-path: inset(0 0 ${clipPercentage} 0);
    transition: clip-path;
    transition-duration: 150ms;
}

#${debugContainerId}:hover {
    clip-path: inset(0 0 0 0);
}

#${debugContainerId}:hover .__debugButtonClass:after {
    height: 100%;
    border-color: transparent
}

.__debugButtonClass {
    position: relative;
    font-size: 0.6rem;
    max-width: 5rem;
    background-color: lightblue;
    color: white;
    padding: 0.25rem;
    opacity: 0.5;
}

.__debugButtonClass:first-of-type {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
}

.__debugButtonClass:last-of-type {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
}

.__debugButtonClass:hover {
    opacity: 1;
}

.__debugButtonClass:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - ${clipPercentage});
    border-color: gray;
    border-bottom-width: 2px;
    transition: height, border-color;
    transition-duration: 150ms;
}
`;

const debugButtonStyleElement = document.createElement('style');
debugButtonStyleElement.textContent = debugButtonStyle;

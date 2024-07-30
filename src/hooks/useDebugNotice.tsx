import { useEffect, useRef, useState } from 'react';

const debugElementClassNames = 'fixed bottom-2 h-8 w-3/5 text-sm bg-red-200 text-blue-700 text-center hidden left-0 right-0 mx-auto';

const useDebugNotice = (debugMessage: string) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const [timer, setTimer] = useState<number>();

    useEffect(() => {
        if (document.readyState !== 'loading') {
            const debugElement = document.createElement('div');
            debugElement.classList.add(...debugElementClassNames.split(' '));
            document.body.append(debugElement);
            rootRef.current = debugElement;
        }

        return () => {
            timer && clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (rootRef.current && debugMessage) {
            rootRef.current.innerText = debugMessage;
            rootRef.current!.classList.toggle('hidden');

            setTimer(
                setTimeout(() => {
                    rootRef.current!.innerText = '';
                    rootRef.current!.classList.toggle('hidden');
                }, 10000),
            );
        }
    }, [debugMessage]);
};

export default useDebugNotice;

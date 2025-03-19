import { EffectCallback, useCallback, useEffect, useState } from 'react';

export const useIsDocumentReady = (callback?: EffectCallback) => {
    const [isReady, setIsReady] = useState(document.readyState === 'complete');

    const handleStateChange = useCallback(
        (ev: Event) => {
            if (ev.target?.readyState === 'complete') {
                setIsReady(true);
            } else {
                setIsReady(false);
            }

            callback && callback();
        },
        [callback],
    );

    useEffect(() => {
        document.addEventListener('readystatechange', handleStateChange);
        return () => document.removeEventListener('readystatechange', handleStateChange);
    }, [handleStateChange]);

    return isReady;
};

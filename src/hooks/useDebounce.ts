// https://stackblitz.com/edit/vitejs-vite-xabh2g?file=src%2Fhooks%2FuseDebounce.ts

/* delays until the user stops an action */

import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay_Ms: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay_Ms);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay_Ms]);

    return debouncedValue;
};

export default useDebounce;

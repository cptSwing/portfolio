import { useEffect, useRef } from 'react';
import { generateUUID } from 'three/src/math/MathUtils.js';

const useComponentStatus = (name?: string) => {
    const designation = useRef<string>(generateUUID());

    useEffect(() => {
        console.log(`%c[${designation.current}]`, 'color: #59e438', `--> render`);
    });

    useEffect(() => {
        if (name) {
            designation.current = name;
        }

        console.log(`%c[${designation.current}]`, 'color: #b7e8eb', `--> mount`);

        () => {
            console.log(`%c[${designation.current}]`, 'color: #b7e8eb', `--> unmount`);
        };
    }, []);
};

export default useComponentStatus;

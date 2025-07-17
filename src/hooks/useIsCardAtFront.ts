import { useEffect, useState } from 'react';
import config from '../config/config.json';
const cellCount = config.categoryGrid.cellCount;

const useIsCardAtFront = (zIndex: number) => {
    const [isAtFront, setIsAtFront] = useState(false);

    useEffect(() => {
        if (zIndex === cellCount) {
            setIsAtFront(true);
        } else {
            setIsAtFront(false);
        }
    }, [zIndex]);

    return isAtFront;
};

export default useIsCardAtFront;

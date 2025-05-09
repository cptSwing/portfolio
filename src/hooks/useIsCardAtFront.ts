import { useEffect, useState } from 'react';
import config from '../config/config.json';
const activeCellCount = config.categoryGrid.activeCellCount;

const useIsCardAtFront = (gridAreaIndex: number) => {
    const [isAtFront, setIsAtFront] = useState(false);

    useEffect(() => {
        if (gridAreaIndex === activeCellCount) {
            setIsAtFront(true);
        } else {
            setIsAtFront(false);
        }
    }, [gridAreaIndex]);

    return isAtFront;
};

export default useIsCardAtFront;

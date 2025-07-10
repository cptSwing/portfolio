import { FC } from 'react';
import { roundedHexagonPath } from '../config/hexagonData';

const RoundedHexagonSVG: FC<{ classNames: string }> = ({ classNames }) => {
    return (
        <svg viewBox='0 0 100 100' className={classNames}>
            <path d={roundedHexagonPath} />
        </svg>
    );
};

export default RoundedHexagonSVG;

import { FC } from 'react';
import { roundedHexagonPath } from '../config/hexagonData';

const RoundedHexagonSVG: FC<{ classNames: string; strokeWidth?: number }> = ({ classNames, strokeWidth }) => {
    return (
        <svg viewBox='0 0 100 100' className={classNames}>
            <clipPath id='svgHexClipPath'>
                <path d={roundedHexagonPath} />
            </clipPath>
            <path d={roundedHexagonPath} clipPath='url(#svgHexClipPath)' strokeWidth={strokeWidth} />
        </svg>
    );
};

export default RoundedHexagonSVG;

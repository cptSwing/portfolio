import { CSSProperties, FC } from 'react';
import { roundedHexagonPath } from '../config/hexagonData';

const RoundedHexagonSVG: FC<{ classNames: string; style?: CSSProperties }> = ({ classNames, style }) => {
    return (
        <svg viewBox='0 0 100 100' className={classNames} style={style}>
            <clipPath id='svgHexClipPath'>
                <path d={roundedHexagonPath} />
            </clipPath>
            <path d={roundedHexagonPath} clipPath='url(#svgHexClipPath)' />
        </svg>
    );
};

export default RoundedHexagonSVG;

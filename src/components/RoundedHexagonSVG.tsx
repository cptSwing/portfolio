import { FC } from 'react';
import { subMenuButtonHexagonPath } from '../config/hexagonData';

/**
 * For clipping with CSS `clip-path`: Set useClipPath to `true`, and refer to `url(#svgRoundedHexagonClipPath)` in the element's `clip-path` property.
 * For mask with CSS `mask-image`: Set hasMask to `true`, and refer to `url(#svgRoundedHexagonMask)` in mask-image property.
 *  WARN --> But apparently, the CSS `mask-size` property has no effect on such inline SVG references - so it does not seem possible to scale the mask to the element's size
 */
const RoundedHexagonSVG: FC<RoundedHexagonSVGProps> = ({
    showPath = true,
    useClipPath = false,
    idSuffix = '',
    hasMask = false,
    className,
    strokeColor = 'currentColor',
    strokeWidth = 0.1,
    fillColor = 'transparent',
}) => {
    const baseName = 'svgRoundedHexagon' + idSuffix;
    const pathId = baseName + '-path';
    const clipPathId = baseName + '-clipPath';

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            id={baseName}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            className={className}
            viewBox='0 0 1 0.866'
            width={showPath ? undefined : 0}
            height={showPath ? undefined : 0}
            preserveAspectRatio='none'
        >
            <defs>
                <path id={pathId} d={subMenuButtonHexagonPath} />

                {useClipPath && (
                    // Scaled up again to counteract the above viewBox
                    <clipPath id={clipPathId}>
                        <use href={'#' + pathId} />
                    </clipPath>
                )}

                {hasMask && (
                    <mask id={'svgRoundedHexagonMask' + idSuffix}>
                        <use href={'#' + pathId} fill='white' />
                    </mask>
                )}
            </defs>

            {showPath && <use href={'#' + pathId} clipPath={useClipPath ? `url(#${clipPathId})` : undefined} />}
        </svg>
    );
};

export default RoundedHexagonSVG;

/* Types */

type RoundedHexagonSVGPropsBase = {
    showPath?: boolean;
    className?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fillColor?: string;
    idSuffix?: string;
};

type RoundedHexagonSVGPropsClipPathTrue = {
    useClipPath: true;
    idSuffix: string;
};

type RoundedHexagonSVGPropsClipPathFalse = {
    useClipPath?: false;
};

type RoundedHexagonSVGPropsMaskTrue = {
    hasMask: true;
    idSuffix: string;
};

type RoundedHexagonSVGPropsMaskFalse = {
    hasMask?: false;
};

type RoundedHexagonSVGProps = RoundedHexagonSVGPropsBase &
    (RoundedHexagonSVGPropsClipPathTrue | RoundedHexagonSVGPropsClipPathFalse) &
    (RoundedHexagonSVGPropsMaskTrue | RoundedHexagonSVGPropsMaskFalse);

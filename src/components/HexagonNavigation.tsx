import { classNames } from 'cpts-javascript-utilities';
import { halfRoundedHexagonPath, roundedHexagonPath } from '../lib/hexagonDataMatrix';
import { useZustand } from '../lib/zustand';
import HexagonTiles from './HexagonTiles';
import GetChildSizeContext, { getChildSizeContextDefaultValue } from '../contexts/GetChildSizeContext';
import { useRef } from 'react';
import useResizeObserver from '../hooks/useResizeObserver';
import { SvgGlassFilter } from './GlassmorphicClipped';

const HexagonNavigation = () => {
    const _routeName = useZustand((store) => store.values.routeData.name);

    const hexagonElements_Ref = useRef<HTMLDivElement | null>(null);
    const hexagonElementsRect = useResizeObserver(hexagonElements_Ref.current);

    return (
        <GetChildSizeContext.Provider
            value={hexagonElementsRect ? { width: hexagonElementsRect.width, height: hexagonElementsRect.height } : getChildSizeContextDefaultValue}
        >
            <div
                ref={hexagonElements_Ref}
                className={classNames(
                    '[--hexagon-blur-color:theme(colors.white/0.2)] [--hexagon-fill-color:theme(colors.theme.primary/0.05)] [--hexagon-stroke-color:theme(colors.theme.secondary/0.2)]',
                    'pointer-events-none absolute size-full',
                )}
            >
                <SVGDefs />
                <HexagonTiles />
            </div>
        </GetChildSizeContext.Provider>
    );
};

export default HexagonNavigation;

const roundedHexagonPathName = 'roundedHexagonPath';
const halfRoundedHexagonPathName = 'halfRoundedHexagonPath';

const SVGDefs = () => {
    return (
        <svg width="0" height="0">
            <defs>
                <path
                    id={roundedHexagonPathName}
                    d={roundedHexagonPath}
                    // TODO set as options in Settings ?
                    // shapeRendering="geometricPrecision"
                    // shapeRendering="crispEdges"
                    // shapeRendering="optimizeSpeed"
                />
                <path id={halfRoundedHexagonPathName} d={halfRoundedHexagonPath} />
                <clipPath id={roundedHexagonPathName + '-clipPath'} clipPathUnits="userSpaceOnUse">
                    <use href={'#' + roundedHexagonPathName} />
                </clipPath>
                <clipPath id={halfRoundedHexagonPathName + '-clipPath'} clipPathUnits="userSpaceOnUse">
                    <use href={'#' + halfRoundedHexagonPathName} />
                </clipPath>

                <SvgGlassFilter withWrapper={false} />

                <filter id="svg-hexagon-bloom-filter" x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" edgeMode="wrap" result="blurResult" />

                    <feBlend in="blurResult" in2="SourceGraphic" mode="screen" result="final" />
                    <feMerge result="merge">
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="final" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
};

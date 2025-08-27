import { classNames } from 'cpts-javascript-utilities';
import { halfRoundedHexagonPath, roundedHexagonPath } from '../lib/hexagonDataMatrix';
import { useZustand } from '../lib/zustand';
import HexagonTiles from './HexagonTiles';
import GetChildSizeContext, { getChildSizeContextDefaultValue } from '../contexts/GetChildSizeContext';
import { useRef } from 'react';
import useResizeObserver from '../hooks/useResizeObserver';

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
                    '[--blur-color:theme(colors.white/0.2)] [--fill-color:theme(colors.theme.primary/0.01)] [--hexagon-blur-color-menu:theme(colors.theme.primary/0.75)] [--hexagon-fill-color-menu:theme(colors.theme.secondary/0.1)] [--hexagon-stroke-color-menu:theme(colors.theme.primary/1)] [--stroke-color:theme(colors.theme.secondary/0.1)]',
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

                <filter id="svg-hexagon-regular">
                    <feFlood floodColor="var(--fill-color)" result="fill-flood" />

                    <feFlood floodColor="var(--blur-color)" result="blur-flood" />
                    <feComposite operator="out" in="blur-flood" in2="SourceAlpha" result="blur-composite" />
                    <feMorphology operator="dilate" in="blur-composite" radius="2" result="blur-dilate" />
                    <feGaussianBlur in="blur-dilate" stdDeviation="5" result="blur-gaussian" />

                    <feFlood floodColor="var(--stroke-color)" result="stroke-flood" />
                    <feComposite operator="out" in="stroke-flood" in2="SourceAlpha" result="stroke-composite" />
                    <feMorphology operator="dilate" in="stroke-composite" radius="1" result="stroke-dilate" />

                    <feMerge>
                        <feMergeNode in="fill-flood" />
                        <feMergeNode in="blur-gaussian" />
                        <feMergeNode in="stroke-dilate" />
                    </feMerge>
                </filter>

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

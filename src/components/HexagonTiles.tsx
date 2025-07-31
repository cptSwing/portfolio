import { CSSProperties, FC, memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames';
import { CategoryLink, HexagonData, HexagonLink, NavigationExpansionState, UIButton } from '../types/types';
import { halfRoundedHexagonPath, linkHexes, nonLinkHexes, roundedHexagonPath, staticValues } from '../config/hexagonData';
import { useZustand } from '../lib/zustand';
import elementGetCurrentRotation from '../lib/elementGetCurrentRotation';
import { useBreakpoint } from '../hooks/useBreakPoint';

const columns = 3;
const strokeWidth = 0.025;
const scaleUp = 100;

const hexPaddingFactor = staticValues.tilingMultiplierHorizontal.flatTop;
const totalWidthAtCenter = (columns * hexPaddingFactor - (hexPaddingFactor - 1)) * 100;

const totalHeight = totalWidthAtCenter * staticValues.heightAspectRatio.flatTop;
const hexHeight = staticValues.heightAspectRatio.flatTop * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;
const svgTransitionDurationMs = 400;

const navRotationValues: Record<CategoryLink, number> = {
    'code': 60,
    '3d': -60,
    'log': 180,
};

const viewBoxes = {
    square: `0 0 ${totalWidthAtCenter} ${totalWidthAtCenter}`,
    hexFlat: `0 0 ${totalWidthAtCenter} ${totalHeight}`,
    hexPointy: `0 0 ${totalHeight} ${totalWidthAtCenter}`,
};

const HexagonTiles = () => {
    const menuTransitionStateUpdates = useState<[CategoryLink | null, TransitionTargetReached]>([null, true]);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;

    const expansionState = useZustand((store) => store.values.expansionState);

    useEffect(() => {
        if (expansionState !== 'home') {
            setMenuTransitionStates([null, true]);
        }
    }, [expansionState, setMenuTransitionStates]);

    const isXlBreakpoint = useBreakpoint('xl');

    const navMenuTransitionClasses_Memo = useMemo(() => {
        switch (menuTransitionTarget) {
            case 'code':
                return /* tw */ `rotate-[60deg] [&_.hex-link-class-code]:stroke-blue-500 [&_.hex-link-class-contact]:![--tw-rotate:-60deg] [&_.hex-link-class-settings]:![--tw-rotate:-60deg] [&_.hex-link-class-login]:![--tw-rotate:-60deg] [&_.hex-link-class-contact]:![--tw-translate-x:35.8%] [&_.hex-link-class-contact]:![--tw-translate-y:36.2%] [&_.hex-link-class-settings]:![--tw-translate-x:35.75%] [&_.hex-link-class-settings]:![--tw-translate-y:43.5%] [&_.hex-link-class-login]:![--tw-translate-x:41.25%] [&_.hex-link-class-login]:![--tw-translate-y:32.5%] ${menuTransitionTargetReached && '[&_.hex-regular-class]:has-[.hex-link-class-code:hover]:!scale-90 [&_.hex-regular-class]:has-[.hex-link-class-code:hover]:!delay-0 [&_.hex-regular-class]:has-[.hex-link-class-code:hover]:!duration-150 [&_.hex-link-class-code]:scale-90'}`;

            case '3d':
                return /* tw */ `rotate-[-60deg] [&_.hex-link-class-3d]:stroke-blue-500 [&_.hex-link-class-contact]:![--tw-rotate:60deg] [&_.hex-link-class-settings]:![--tw-rotate:60deg] [&_.hex-link-class-login]:![--tw-rotate:60deg] [&_.hex-link-class-contact]:![--tw-translate-x:39.35%] [&_.hex-link-class-contact]:![--tw-translate-y:36.2%] [&_.hex-link-class-settings]:![--tw-translate-x:33.7%] [&_.hex-link-class-settings]:![--tw-translate-y:32.6%] [&_.hex-link-class-login]:![--tw-translate-x:39.3%] [&_.hex-link-class-login]:![--tw-translate-y:43.6%] ${menuTransitionTargetReached && '[&_.hex-regular-class]:has-[.hex-link-class-3d:hover]:!scale-90 [&_.hex-regular-class]:has-[.hex-link-class-3d:hover]:!delay-0 [&_.hex-regular-class]:has-[.hex-link-class-3d:hover]:!duration-150 [&_.hex-link-class-3d]:scale-90'}`;

            case 'log':
                return /* tw */ `rotate-[180deg] [&_.hex-link-class-log]:stroke-blue-500 [&_.hex-link-class-contact]:![--tw-rotate:-180deg] [&_.hex-link-class-settings]:![--tw-rotate:-180deg] [&_.hex-link-class-login]:![--tw-rotate:-180deg] [&_.hex-link-class-contact]:![--tw-translate-y:39.75%] [&_.hex-link-class-settings]:![--tw-translate-x:43%] [&_.hex-link-class-settings]:![--tw-translate-y:36%] [&_.hex-link-class-login]:![--tw-translate-x:32%] [&_.hex-link-class-login]:![--tw-translate-y:36%] ${menuTransitionTargetReached && '[&_.hex-regular-class]:has-[.hex-link-class-log:hover]:!scale-90 [&_.hex-regular-class]:has-[.hex-link-class-log:hover]:!delay-0 [&_.hex-regular-class]:has-[.hex-link-class-log:hover]:!duration-150 [&_.hex-link-class-log]:scale-90'}`;

            default:
                return /* tw */ 'rotate-0';
        }
    }, [menuTransitionTarget, menuTransitionTargetReached]);

    return (
        <svg
            className={classNames(
                'pointer-events-none absolute z-10 overflow-visible transition-transform',
                expansionState === 'home' ? navMenuTransitionClasses_Memo : '',
            )}
            viewBox={
                expansionState === 'category'
                    ? viewBoxes['square']
                    : expansionState === 'post'
                      ? isXlBreakpoint
                          ? viewBoxes['hexFlat']
                          : viewBoxes['hexPointy']
                      : viewBoxes['hexFlat']
            }
            style={
                {
                    transitionDuration: `${svgTransitionDurationMs}ms`,
                } as CSSProperties
            }
            onTransitionEnd={({ target, currentTarget }) => {
                if (target === currentTarget) {
                    // ^^^  condition filters out bubbled child events
                    const elementRotation = elementGetCurrentRotation(currentTarget);
                    if (menuTransitionTarget && navRotationValues[menuTransitionTarget] === elementRotation) {
                        // Set transition target as reached:
                        setMenuTransitionStates(([prevTarget, _prevReached]) => [prevTarget, true]);
                    }
                }
            }}
        >
            <defs>
                <filter id='light-inner'>
                    <feFlood className='[flood-color:theme(colors.theme.primary-darker/0.5)]' />
                    <feComposite operator='out' in2='SourceGraphic' />
                    <feMorphology operator='dilate' radius='2' />
                    {/* <feGaussianBlur stdDeviation='1' /> */}
                    <feComposite operator='atop' in2='SourceGraphic' />
                </filter>
                <filter id='lighter-inner'>
                    <feFlood className='[flood-color:theme(colors.theme.primary-lighter/0.5)]' />
                    <feComposite operator='out' in2='SourceGraphic' />
                    <feMorphology operator='dilate' radius='7' />
                    <feGaussianBlur stdDeviation='5' />
                    <feComposite operator='atop' in2='SourceGraphic' />
                </filter>
                <linearGradient id='linearGradient' x1='0%' y1='100%' x2='0%' y2='0%'>
                    <stop offset='0%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                    <stop offset='50%' className='[stop-color:theme(colors.theme.primary-lighter/0.75)]' />
                    <stop offset='100%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                </linearGradient>
                <radialGradient id='radialGradient'>
                    <stop offset='90%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                    <stop offset='100%' className='[stop-color:theme(colors.theme.primary-lighter/1)]' />
                </radialGradient>
            </defs>

            {nonLinkHexes.map((hexData, idx) => (
                <AnimatedHexagon shapeData={hexData} expansionState={expansionState} key={`hex-regular-index-${idx}`} />
            ))}

            {linkHexes.map((hexData, idx) => (
                <ButtonHexagon
                    shapeData={hexData}
                    expansionState={expansionState}
                    menuTransitionStateUpdates={menuTransitionStateUpdates}
                    key={`hex-link-index-${idx}`}
                />
            ))}
        </svg>
    );
};

export default HexagonTiles;

const AnimatedHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData>;
    expansionState: NavigationExpansionState;
}> = memo(({ shapeData, expansionState }) => {
    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);
    const { position, rotation, scale, isHalf, offsets } = localShapeData_Memo;

    const path_Memo = useMemo(() => (isHalf ? halfRoundedHexagonPath : roundedHexagonPath), [isHalf]);
    const cssVariables_Memo = useMemo(() => calcCSSVariables(position, rotation, scale, offsets), [offsets, position, rotation, scale]);

    const randomDelay_Memo = useMemo(() => svgTransitionDurationMs * Math.random(), []);

    return (
        <>
            <clipPath id={`${randomDelay_Memo}-clipPath`}>
                <path
                    d={path_Memo}
                    className='transition-[d]'
                    style={{ transitionDuration: `${svgTransitionDurationMs}ms`, transitionDelay: `${randomDelay_Memo}ms` }}
                />
            </clipPath>

            <path
                d={path_Memo}
                className={classNames(
                    'hex-regular-class pointer-events-auto origin-[12.5%_12.5%] translate-x-0 transition-[fill,transform,stroke,stroke-width,d]',
                    expansionState === 'home'
                        ? 'fill-theme-primary/50 stroke-theme-primary-lighter/25 hover-active:fill-theme-primary/55 hover-active:stroke-theme-primary-lighter/20'
                        : expansionState === 'category'
                          ? 'fill-theme-primary/95 stroke-theme-primary-lighter/50 hover-active:fill-theme-primary hover-active:stroke-theme-primary-lighter/45'
                          : /* post */
                            'fill-theme-text-background stroke-theme-text-background',
                )}
                style={{
                    ...cssVariables_Memo,
                    transitionDuration: `50ms, ${svgTransitionDurationMs}ms`,
                    transitionDelay: `0ms, ${randomDelay_Memo}ms`,
                    strokeWidth: expansionState === 'home' ? `${8 / scale}` : expansionState === 'category' ? `${4 / scale}` : /* post */ '50',
                }}
                clipPath={`url(#${randomDelay_Memo}-clipPath)`}
            />
        </>
    );
});

const ButtonHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData> & HexagonLink;
    expansionState: NavigationExpansionState;
    menuTransitionStateUpdates: [[CategoryLink | null, boolean], React.Dispatch<React.SetStateAction<[CategoryLink | null, boolean]>>];
}> = memo(({ shapeData, expansionState, menuTransitionStateUpdates }) => {
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;

    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);
    const { title, svgPath, target } = shapeData;
    const { position, rotation, scale, offsets } = localShapeData_Memo;

    const cssVariables_Memo = useMemo(() => calcCSSVariables(position, rotation, scale, offsets), [offsets, position, rotation, scale]);
    const randomDelay_Memo = useMemo(() => svgTransitionDurationMs * Math.random(), []);
    const isCategoryLink_Memo = useMemo(() => isCategoryLink(title), [title]);

    const navigate = useNavigate();

    const handleClick = (ev: React.MouseEvent<SVGGElement, MouseEvent>) => {
        let targetResult = target;
        if (typeof targetResult !== 'string') {
            targetResult = (target as (ev: React.MouseEvent<SVGGElement, MouseEvent>) => void | string)(ev) ?? '';
        }
        navigate(targetResult);
    };

    const handleMouseEnter =
        isCategoryLink_Memo && expansionState === 'home' && menuTransitionTarget !== title && menuTransitionTargetReached
            ? //  Prevent parent from prematurely rotating again, and again, and again: --------- ^^^
              () => setMenuTransitionStates([title as CategoryLink, false])
            : undefined;

    return (
        <g
            className={classNames(
                'group origin-[12.5%_12.5%] translate-x-0 cursor-pointer no-underline transition-[transform,stroke] duration-700',
                expansionState === 'home' ? 'stroke-red-500' : expansionState === 'category' ? 'stroke-green-500' : 'stroke-theme-text-background',
                `hex-link-class hex-link-class-${title}`,
            )}
            style={{
                ...cssVariables_Memo,
                transitionDelay: `${randomDelay_Memo}ms`,
                strokeWidth:
                    expansionState === 'home' ? `${8 / scale / 2}` : expansionState === 'category' ? `${4 / scale / 2}` : /* post */ `${4 / scale / 2}`,
            }}
            role='button'
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            <path
                d={roundedHexagonPath}
                className='pointer-events-auto origin-[12.5%_12.5%] fill-theme-primary transition-[fill,filter] duration-300 [filter:url(#light-inner)] group-hover-active:scale-105 group-hover-active:[filter:url(#lighter-inner)]'
                style={{ clipPath: `view-box path("${roundedHexagonPath}")` }}
                // TODO set as options in Settings ?
                shapeRendering='geometricPrecision'
                // shapeRendering='crispEdges'
                // shapeRendering='optimizeSpeed'
                // paintOrder='stroke'
            />
            {svgPath ? (
                <foreignObject x='0' y='0' width='100' height='86.66' overflow='visible'>
                    <div
                        className='size-full origin-[12.5%_12.5%] bg-theme-secondary [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:scale-105 group-hover-active:bg-theme-secondary-lighter'
                        style={{ maskImage: `url(${svgPath})` }}
                    />
                    <span
                        className={classNames(
                            'absolute left-1/2 top-full -translate-x-1/2 font-lato text-sm uppercase',
                            expansionState === 'home'
                                ? 'mt-px text-theme-secondary-lighter/25 group-hover-active:text-theme-secondary-lighter'
                                : expansionState === 'category'
                                  ? 'mt-1 text-theme-primary/25 group-hover-active:text-theme-primary'
                                  : 'mt-px text-theme-text group-hover-active:text-theme-text',
                        )}
                    >
                        {title}
                    </span>
                </foreignObject>
            ) : (
                <text
                    x={hexHalfWidth}
                    y={hexHalfHeight}
                    textAnchor='middle'
                    alignmentBaseline='central'
                    className='pointer-events-none origin-[12.5%_12.5%] select-none fill-theme-secondary stroke-none font-fjalla-one text-4xl font-semibold transition-[transform,fill] group-hover-active:scale-105 group-hover-active:fill-theme-secondary-lighter'
                >
                    {title}
                </text>
            )}
        </g>
    );
});

// export const getRoundedHexagon

const calcCSSVariables = (
    position: { x: number; y: number },
    rotation: number,
    scale: number,
    offsets?: {
        x: number;
        y: number;
    },
) =>
    ({
        '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100 + (offsets?.x ?? 0)}%`,
        '--tw-translate-y': `${(position.y / totalHeight) * 100 + (offsets?.y ?? 0)}%`,
        '--tw-rotate': `${rotation}deg`,
        '--tw-scale-x': (1 - strokeWidth) * scale,
        '--tw-scale-y': (1 - strokeWidth) * scale,
    }) as CSSProperties;

const isCategoryLink = (title: UIButton) => title === 'code' || title === '3d' || title === 'log';

// local types

type TransitionTargetReached = boolean;

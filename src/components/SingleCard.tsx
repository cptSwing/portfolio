import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.json';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import remapToRange from '../lib/remapToRange.ts';
import { Flipped } from 'react-flip-toolkit';
import useIsCardAtFront from '../hooks/useIsCardAtFront.ts';
import { svgObjectBoundingBoxHexagonPath } from '../config/hexagonData.ts';

const { activeCellCount } = config.categoryGrid;

const SingleCard: FC<{
    post: Post;
    arrayIndex: number;
    totalCount: number;
    gridAreaIndex: number;
    setToFront: () => void;
}> = ({ post, arrayIndex, totalCount, gridAreaIndex, setToFront }) => {
    const { id } = post;
    const navigate = useNavigate();

    const gridCardStyle_Memo = useMemo(() => {
        const brightnessPercentage = 1 / activeCellCount;

        if (gridAreaIndex < 1) {
            const surplusCells = totalCount - activeCellCount;
            const thisSurplusCell = remapToRange(gridAreaIndex, -surplusCells + 1, 0, surplusCells - 1, 0);
            const r = 2; // ratio

            const total_ratio = (Math.pow(r, surplusCells) - 1) / (r - 1);
            const ratio = Math.pow(r, surplusCells - 1 - thisSurplusCell);
            const widthPercent = (ratio / total_ratio) * 100;

            return {
                gridArea: 'rest',
                position: 'absolute' as CSSProperties['position'],
                width: `calc(${widthPercent}% - 8px)`,
                left: `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent}%`,
                filter: `brightness(${brightnessPercentage / 2}) grayscale(${1 - brightnessPercentage / 2})`,
            };
        } else {
            return {
                gridArea: 'area' + gridAreaIndex,
                filter: `brightness(${gridAreaIndex * brightnessPercentage}) grayscale(${1 - gridAreaIndex * brightnessPercentage})`,
            };
        }
    }, [gridAreaIndex, totalCount]);

    const [widthHeight, setWidthHeight] = useState<[number, number]>([1, 0.5]);

    const isAtFront = useIsCardAtFront(gridAreaIndex);

    // WARN DEBUG
    const applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    useEffect(() => {
        console.log('%c[SingleCard]', 'color: #9da2fd', `gridArea ${gridAreaIndex} mount`);

        return () => {
            console.log('%c[SingleCard]', 'color: #9da2fd', `gridArea ${gridAreaIndex} unmount`);
        };
    }, [gridAreaIndex]);

    return (
        <Flipped
            flipId={arrayIndex}
            transformOrigin='0px 0px'
            opacity
            translate
            scale
            onComplete={(flippedElement) => {
                const { width, height } = flippedElement.getBoundingClientRect();
                setWidthHeight([width, height]);
            }}
        >
            <div
                className={classNames(
                    'absolute left-[-5%] top-[-5%] flex size-[110%] select-none flex-col items-center justify-between drop-shadow-md transition-[filter] duration-500 [clip-path:url(#test-clip-path)] hover-active:!filter-none',
                    applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={{
                    ...gridCardStyle_Memo,
                    zIndex: Math.max(gridAreaIndex, 0),
                }}
                onClick={() => {
                    if (isAtFront) {
                        navigate(id.toString());
                    } else {
                        setToFront();
                    }
                }}
            >
                <SVGClipPath parentWidthHeight={widthHeight} />
                <SingleCardImage post={post} isAtFront={isAtFront} />
            </div>
        </Flipped>
    );
};

export default SingleCard;

const SingleCardImage: FC<{
    post: Post;
    isAtFront: boolean;
}> = ({ post, isAtFront }) => {
    const { title, titleCardBg, subTitle } = post;

    return (
        <>
            <div
                // change key to re-render, meaning the animation runs once each keyswitch
                // key={String(gridAreaIndex)}
                className='group relative size-full overflow-hidden'
            >
                {/* Title: */}
                <h6
                    className={classNames(
                        'absolute left-1/2 top-[2%] z-10 max-w-[84%] -translate-x-1/2 items-center justify-center text-center text-theme-secondary-lighter',
                        'before:absolute before:left-[-15%] before:-z-10 before:h-full before:w-[130%] before:bg-theme-primary-darker/90 before:pl-[10%] before:[clip-path:polygon(0_50%,6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%)]',
                        isAtFront ? 'flex w-fit' : 'hidden size-0',
                    )}
                >
                    {title}
                </h6>

                <img className='size-full object-cover object-center' src={titleCardBg} alt={title} />

                {/* Subtitle: */}
                {subTitle && (
                    <div
                        className={classNames(
                            'absolute bottom-[2%] left-1/2 z-10 max-w-[84%] -translate-x-1/2 items-center justify-center text-nowrap text-center text-sm text-theme-secondary-lighter',
                            'before:absolute before:left-[-5%] before:-z-10 before:h-full before:w-[110%] before:bg-theme-primary/70 before:pl-[10%] before:[clip-path:polygon(0_50%,5px_0,calc(100%-5px)_0,100%_50%,calc(100%-5px)_100%,5px_100%)]',
                            isAtFront ? 'flex w-fit' : 'hidden size-0',
                        )}
                    >
                        <Markdown>{subTitle}</Markdown>
                    </div>
                )}
            </div>
        </>
    );
};

const divisor = 5;

// TODO wtf why is this not updating the defs??
const SVGClipPath: FC<{ parentWidthHeight: [number, number] }> = ({ parentWidthHeight }) => {
    const [width, height] = parentWidthHeight;

    const transforms_Memo = useMemo(() => {
        const aspectRatioWidth = width / height;
        const scaleX = 1 / divisor;
        const scaleY = scaleX * aspectRatioWidth;
        const verticalStep = scaleY * 0.866;

        return { scaleX, scaleY, verticalStep, aspectRatioWidth };
    }, [width, height]);

    return (
        <svg xmlns='http://www.w3.org/2000/svg' className='absolute size-full' data-aspect={width / height}>
            <defs>
                <clipPath id='test-clip-path' clipPathUnits='objectBoundingBox'>
                    <rect x='0.05' y='0.05' width='0.9' height='0.9' />

                    <path d={svgObjectBoundingBoxHexagonPath} transform={`translate(0 0) scale(${transforms_Memo.scaleX} ${transforms_Memo.scaleY})`} />
                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${1 - transforms_Memo.scaleX} 0) scale(${transforms_Memo.scaleX} ${transforms_Memo.scaleY})`}
                    />
                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${1 - transforms_Memo.scaleX} ${1 - transforms_Memo.verticalStep}) scale(${transforms_Memo.scaleX} ${transforms_Memo.scaleY})`}
                    />

                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(0 ${1 - transforms_Memo.verticalStep}) scale(${transforms_Memo.scaleX} ${transforms_Memo.scaleY})`}
                    />
                </clipPath>
            </defs>
        </svg>
    );
};

import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import { Flipped } from 'react-flip-toolkit';
import useIsCardAtFront from '../hooks/useIsCardAtFront.ts';
import { svgObjectBoundingBoxHexagonPath } from '../config/hexagonData.ts';

const SingleCard: FC<{
    post: Post;
    index: number;
    gridAreaStyle: CSSProperties;
    setToFront: () => void;
}> = ({ post, index, gridAreaStyle, setToFront }) => {
    const { id } = post;
    const navigate = useNavigate();

    const [widthHeight, setWidthHeight] = useState<[number, number]>([1, 0.5]);
    const isAtFront = useIsCardAtFront(gridAreaStyle.zIndex as number);

    useEffect(() => {
        console.log('%c[SingleCard]', 'color: #f7e0bb', `index, gridAreaStyle :`, index, gridAreaStyle);
    }, [index, gridAreaStyle]);

    // WARN DEBUG
    const applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped
            flipId={index}
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
                    'absolute left-[-5%] top-[-5%] flex size-[110%] select-none flex-col items-center justify-between drop-shadow-md transition-[filter] duration-500 hover-active:!filter-none',
                    applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={gridAreaStyle}
                onClick={() => {
                    if (isAtFront) {
                        navigate(id.toString());
                    } else {
                        setToFront();
                    }
                }}
            >
                <SVGClipPath parentWidthHeight={widthHeight} index={index} />
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
const SVGClipPath: FC<{ parentWidthHeight: [number, number]; index: number }> = ({ parentWidthHeight, index }) => {
    const transforms_Memo = useMemo(() => {
        const [width, height] = parentWidthHeight;

        const aspectRatioWidth = width / height;
        const scaleX = 1 / divisor;
        const scaleY = scaleX * aspectRatioWidth;
        const verticalStep = scaleY * 0.866;

        return { scaleX, scaleY, verticalStep, aspectRatioWidth };
    }, [parentWidthHeight]);

    return (
        <svg xmlns='http://www.w3.org/2000/svg' className='absolute' data-aspect={`${parentWidthHeight[0]} ${parentWidthHeight[1]}`}>
            <defs>
                <clipPath id={`test-clip-path-${index}`} clipPathUnits='objectBoundingBox'>
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

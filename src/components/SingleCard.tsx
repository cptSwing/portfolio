import { CSSProperties, FC, useCallback, useMemo } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import { Flipped } from 'react-flip-toolkit';
import { degToRad, svgObjectBoundingBoxHexagonPath } from '../config/hexagonData.ts';
import stripSpaces from '../lib/stripSpaces.ts';
import remapToRange from '../lib/remapToRange.ts';

const SingleCard: FC<{
    post: Post;
    cardIndex: number;
    flipIndex: number;
    cardCount: number;
    gridAreaStyles: CSSProperties[];
    gridAreaSizes: React.MutableRefObject<
        {
            width: number;
            height: number;
        }[]
    >;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStyles, gridAreaSizes, setFlipIndex }) => {
    const navigate = useNavigate();

    const styleIndex = getStyleIndex(flipIndex, cardIndex, cardCount);
    const gridAreaStyle = gridAreaStyles[styleIndex];

    const mountCallback_Cb = useCallback(
        (elem: HTMLButtonElement | null) => {
            /* Store various areas' sizes on mount, the earlier the better */
            // TODO should update on resize
            if (elem) {
                const { width, height } = elem.getBoundingClientRect();
                if (!gridAreaSizes.current[styleIndex]) gridAreaSizes.current[styleIndex] = { width, height };
            }
        },
        [gridAreaSizes, styleIndex],
    );

    const isAtFront = styleIndex === 0;

    const idSuffix = sanitizeString(post.id + post.title);

    const handleClick = () => {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            setFlipIndex(cardIndex);
        }
    };

    // WARN DEBUG
    const applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped flipId={post.id} transformOrigin='0px 0px' opacity translate scale>
            <button
                ref={mountCallback_Cb}
                className={classNames(
                    'drop-shadow-border absolute flex size-full select-none flex-col items-center justify-between transition-[filter] hover-active:![--tw-brightness:_brightness(1)] hover-active:![--tw-grayscale:_grayscale(0)]',
                    applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={gridAreaStyle}
                onClick={handleClick}
            >
                {gridAreaSizes.current[styleIndex] && <SVGClipPath parentWidthHeight={gridAreaSizes.current[styleIndex]} idSuffix={idSuffix} />}
                <SingleCardImage post={post} isAtFront={isAtFront} idSuffix={idSuffix} />
            </button>
        </Flipped>
    );
};

export default SingleCard;

const SingleCardImage: FC<{
    post: Post;
    isAtFront: boolean;
    idSuffix: string;
}> = ({ post, isAtFront, idSuffix }) => {
    const { title, titleCardBg, subTitle } = post;

    return (
        <div className='group relative size-full overflow-hidden' style={{ clipPath: `url(#test-clip-path-${idSuffix})` }}>
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
    );
};

const divisor = 3.5;

const SVGClipPath: FC<{
    parentWidthHeight: {
        width: number;
        height: number;
    };
    idSuffix: string;
}> = ({ parentWidthHeight, idSuffix }) => {
    const { width, height } = parentWidthHeight;
    const tan60 = Math.tan(degToRad(60));

    const widthNormalized = remapToRange(width, 0, width, 0, 1);
    const heightNormalized = remapToRange(height, 0, height, 0, 1);
    const oneTenthHeight = heightNormalized / 10;

    const transforms_Memo = useMemo(() => {
        const aspectRatioWidth = width / height;
        const scaleX = 1 / divisor;
        const scaleY = scaleX * aspectRatioWidth;

        return { scaleX, scaleY, aspectRatioWidth };
    }, [width, height]);

    return (
        <svg xmlns='http://www.w3.org/2000/svg' className='absolute' style={{ width, height }}>
            <defs>
                <clipPath id={`test-clip-path-${idSuffix}`} clipPathUnits='objectBoundingBox'>
                    <polygon
                        points={`0,${oneTenthHeight * 1.5} ${(oneTenthHeight * 1.5) / tan60 / transforms_Memo.aspectRatioWidth},0 ${1 - (oneTenthHeight * 3) / tan60 / transforms_Memo.aspectRatioWidth},0 1,${oneTenthHeight * 3} 1,${oneTenthHeight * 8.5} ${widthNormalized - (heightNormalized - oneTenthHeight * 8.5) / transforms_Memo.aspectRatioWidth / tan60},1 ${1 - (widthNormalized - (heightNormalized - oneTenthHeight * 7) / tan60 / transforms_Memo.aspectRatioWidth)},1 0,${oneTenthHeight * 7}`}
                    />

                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${0} ${oneTenthHeight * 6.425}) scale(${(oneTenthHeight * 3.5) / transforms_Memo.aspectRatioWidth} ${oneTenthHeight * 3.5})`}
                    />

                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${1 - (oneTenthHeight * 3.5) / transforms_Memo.aspectRatioWidth} ${oneTenthHeight * 0.55}) scale(${(oneTenthHeight * 3.5) / transforms_Memo.aspectRatioWidth} ${oneTenthHeight * 3.5})`}
                    />

                    <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${0} ${oneTenthHeight * 0.4}) scale(${(oneTenthHeight * 1) / transforms_Memo.aspectRatioWidth} ${oneTenthHeight * 1})`}
                    />

                    {/* <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${-0.005} ${oneTenthHeight * 7.95}) scale(${oneTenthHeight / 1.15 / transforms_Memo.aspectRatioWidth} ${oneTenthHeight / 1.15})`}
                    /> */}

                    {/* <path
                        d={svgObjectBoundingBoxHexagonPath}
                        transform={`translate(${oneTenthHeight / 5 / transforms_Memo.aspectRatioWidth} ${oneTenthHeight * 8.75}) scale(${oneTenthHeight / transforms_Memo.aspectRatioWidth} ${oneTenthHeight})`}
                    /> */}
                </clipPath>
            </defs>
        </svg>
    );
};

/* Local Functions */

/** Match the flipIndex to the correct style preset */
function getStyleIndex(flipIndex: number, cardIndex: number, cardCount: number) {
    if (flipIndex > cardIndex) {
        return cardCount + (cardIndex - flipIndex);
    } else if (flipIndex < cardIndex) {
        return cardIndex - flipIndex;
    } else {
        // flipIndex === cardIndex
        return 0;
    }
}

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

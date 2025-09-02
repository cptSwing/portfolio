import { CSSProperties, FC, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Post } from '../types/types.ts';
import { useNavigate } from 'react-router-dom';
import { classNames, remapRange, keyDownA11y } from 'cpts-javascript-utilities';
import { Flipped } from 'react-flip-toolkit';
import stripSpaces from '../lib/stripSpaces.ts';
import { getIndexCategoryCardPath } from '../lib/hexagonDataMatrix.ts';
import { config } from '../types/exportTyped.ts';
import { useZustand } from '../lib/zustand.ts';

const CategoryCard: FC<{
    post: Post;
    cardIndex: number;
    flipIndex: number;
    cardCount: number;
    gridAreaStylesAndPaths: React.MutableRefObject<
        {
            style: CSSProperties;
            path: string;
        }[]
    >;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStylesAndPaths, setFlipIndex, setTitle }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const navigate = useNavigate();

    const componentStrings_memo = useMemo(() => {
        const idSuffix = sanitizeString(post.id + '_' + post.title);
        const pathName = `svg-hexagon-path-${idSuffix}`;
        const clipPathName = pathName + '-clipPath';

        return {
            idSuffix,
            pathName,
            clipPathName,
        };
    }, [post.id, post.title]);

    const gridAreaIndex = getGridAreaIndex(flipIndex, cardIndex, cardCount);

    /* set synchronously so the later call to getBoundingClientRect() will report on the correct sizes of respective gridArea */
    const style = gridAreaStylesAndPaths.current[gridAreaIndex]?.style ?? getGridAreaStyle(gridAreaIndex, cardCount);
    const path = gridAreaStylesAndPaths.current[gridAreaIndex]?.path;

    useLayoutEffect(() => {
        if (svgRef.current && !gridAreaStylesAndPaths.current[gridAreaIndex]) {
            const { width, height } = svgRef.current!.getBoundingClientRect();
            const newPath = getIndexCategoryCardPath(gridAreaIndex, width, height);

            gridAreaStylesAndPaths.current[gridAreaIndex] = { style, path: newPath };
        }
    }, [gridAreaIndex, gridAreaStylesAndPaths, style]);

    /* set title to parent's 'banner' */
    useEffect(() => {
        if (gridAreaIndex === 0) {
            setTitle(post.title);
        }
    }, [gridAreaIndex, post, setTitle]);

    function handleClick() {
        if (gridAreaIndex === 0) {
            navigate(post.id.toString());
        } else {
            setFlipIndex(cardIndex);
        }
    }

    // WARN DEBUG
    const debug_applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped flipId={post.id} transformOrigin="0px 0px" opacity translate scale>
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className={classNames(
                    'group pointer-events-none relative overflow-visible',
                    gridAreaIndex === 0 ? 'cursor-pointer' : 'cursor-zoom-in',
                    debug_applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                )}
                style={style}
            >
                <defs>
                    {/* custom per-grid-area path: */}
                    <path id={componentStrings_memo.pathName} d={path} vectorEffect="non-scaling-stroke" />

                    {/* clip with same path in order for stroke attribute to only stroke inside of path: */}
                    <clipPath id={componentStrings_memo.clipPathName} clipPathUnits="objectBoundingBox" vectorEffect="non-scaling-stroke">
                        <use href={`#${componentStrings_memo.pathName}`} />
                    </clipPath>
                </defs>

                <ChildImageAndSvg
                    cardImage={post.cardImage}
                    pathName={componentStrings_memo.pathName}
                    clipPathName={componentStrings_memo.clipPathName}
                    clickHandler={handleClick}
                />
            </svg>
        </Flipped>
    );
};

const {
    ui: {
        animation: { menuTransition_Ms },
    },
} = config;

const ChildImageAndSvg: FC<{ cardImage?: string; pathName: string; clipPathName: string; clickHandler: React.MouseEventHandler<SVGSVGElement> }> = memo(
    ({ cardImage, pathName, clipPathName, clickHandler }) => {
        return (
            <>
                {/* Backdrop/Shadow */}
                {/* <rect
                    width="100%"
                    height="100%"
                    className="translate-x-1 translate-y-2 transform-gpu fill-theme-root-background"
                    clipPath={`url(#${clipPathName})`}
                    shapeRendering="crispEdges"
                /> */}

                <g
                    className="pointer-events-auto transition-[filter] [filter:var(--image-filter,brightness(0.1)_grayscale(0.1))] group-hover-active:brightness-110 group-hover-active:!duration-75"
                    style={{ transitionDuration: `${menuTransition_Ms}ms` }}
                    clipPath={`url(#${clipPathName})`}
                    role="button"
                    tabIndex={0}
                    onClick={clickHandler}
                    onKeyDown={keyDownA11y(clickHandler)}
                >
                    {/* Emulate object-cover via preserveAspectRatio */}
                    <image width="100%" height="100%" href={cardImage} preserveAspectRatio="xMidYMid slice" />

                    {/* Border, scale according to percentages of width/height */}
                    <svg viewBox="0 0 1 1" preserveAspectRatio="none">
                        <use
                            href={`#${pathName}`}
                            className={classNames('stroke-theme-primary-darker', cardImage ? 'fill-none' : 'fill-theme-secondary/50')}
                            strokeWidth={5}
                        />
                    </svg>
                </g>
            </>
        );
    },
);

const CatCard: FC<{
    post: Post;
    cardIndex: number;
    cardCount: number;
    flipIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ post, cardIndex, cardCount, flipIndexState }) => {
    const { id, title, subTitle, cardImage } = post;
    const navigate = useNavigate();
    const [flipIndex, setFlipIndex] = flipIndexState;
    const cardAngle = (360 / cardCount) * cardIndex;

    const carouselIndex = getCarouselIndex(flipIndex, cardIndex, cardCount);

    function handleClick() {
        if (carouselIndex === 0) {
            navigate(post.id.toString());
        } else {
            setFlipIndex(cardIndex);
        }
    }

    return (
        <button
            className={classNames(
                'glassmorphic pointer-events-auto absolute flex size-full items-center justify-center rounded-md p-4 transition-[transform,--carousel-card-opacity] delay-[150ms,0ms] duration-[--ui-animation-menu-transition-duration] [background-color:rgb(var(--theme-primary)/var(--carousel-card-opacity))]',
                carouselIndex === 0 ? 'cursor-pointer' : 'cursor-zoom-in',
            )}
            style={
                {
                    'zIndex': cardCount - Math.abs(carouselIndex),
                    '--carousel-card-opacity': `calc(${Math.abs(carouselIndex)} * var(--carousel-card-percentage))`,
                    'transform':
                        `rotateY(${cardAngle}deg) translateZ(var(--carousel-radius)) rotateY(calc(${-cardAngle}deg - var(--carousel-rotation)))` +
                        ' ' +
                        `scale3d(${carouselIndex === 0 ? 1 : 0.66}, ${carouselIndex === 0 ? 1 : 0.66}, ${carouselIndex === 0 ? 1 : 0.66})` +
                        ' ' +
                        `translate3d(calc(${-carouselIndex * 12.5}% * var(--carousel-card-percentage)), calc(${-carouselIndex * 30}% * (-1 * var(--carousel-card-percentage))), 0)`,
                } as CSSProperties
            }
            onClick={handleClick}
        >
            <div className="mx-auto h-3/4 w-1/4 bg-gray-700 text-sm text-theme-text-background">
                <span className="block">{title}</span>
                <span className="block">{subTitle}</span>

                <span className="mt-12 block">cardIndex: {cardIndex}</span>
                <span className="block">carouselIndex: {carouselIndex}</span>

                <span className="mt-[10%] block">flipIndex: {flipIndex}</span>
                <span className="block">cardCount: {cardCount}</span>
            </div>
            <img src={cardImage} alt={title} className="size-3/4 object-cover" />
        </button>
    );
};

export default CatCard;

/* Local Functions */

/** Match the flipIndex to the correct style preset */
function getCarouselIndex(flipIndex: number, cardIndex: number, cardCount: number) {
    // ie flipIndex === cardIndex
    let carouselIndex = 0;

    if (flipIndex > cardIndex) {
        carouselIndex = cardCount + (cardIndex - flipIndex);
    } else if (flipIndex < cardIndex) {
        carouselIndex = cardIndex - flipIndex;
    }

    return remapIndex(carouselIndex, cardCount);
}

function remapIndex(i: number, count: number) {
    const half = Math.ceil(count / 2);
    if (i < half) {
        return i;
    } else {
        return -(count - i);
    }
}

/** Match the flipIndex to the correct style preset */
function getGridAreaIndex(flipIndex: number, cardIndex: number, cardCount: number) {
    if (flipIndex > cardIndex) {
        return cardCount + (cardIndex - flipIndex);
    } else if (flipIndex < cardIndex) {
        return cardIndex - flipIndex;
    } else {
        // flipIndex === cardIndex
        return 0;
    }
}

const { areaCount } = config.categoryGrid;

function getGridAreaStyle(gridAreaIndex: number, cardCount: number): CSSProperties {
    const brightnessPercentage = 1 / areaCount;
    let baseStyle: CSSProperties = {
        zIndex: cardCount - gridAreaIndex,
    };

    if (gridAreaIndex >= areaCount) {
        const surplusCells = cardCount - areaCount;
        const thisSurplusCell = remapRange(gridAreaIndex - areaCount, 0, surplusCells - 1, 0, 1);

        const r = 2; // ratio

        const total_ratio = (Math.pow(r, surplusCells) - 1) / (r - 1);
        const ratio = Math.pow(r, surplusCells - 1 - thisSurplusCell);
        const widthPercent = (ratio / total_ratio) * 100;

        baseStyle = {
            ...baseStyle,
            'position': 'absolute',
            'gridArea': 'rest',
            'width': `${widthPercent * 0.9}%`,
            'left': `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent + widthPercent * 0.1}%`,
            '--image-filter': `brightness(${brightnessPercentage / 2}) grayscale(${1 - brightnessPercentage / 2})`,
        } as CSSProperties;
    } else {
        baseStyle = {
            ...baseStyle,
            'gridArea': `area${gridAreaIndex}`,
            '--image-filter': `brightness(${1 - gridAreaIndex * brightnessPercentage}) grayscale(${gridAreaIndex * brightnessPercentage})`,
        } as CSSProperties;
    }

    return baseStyle;
}

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

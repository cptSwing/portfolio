import { CSSProperties, FC, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Post } from '../types/types.ts';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { Flipped } from 'react-flip-toolkit';
import stripSpaces from '../lib/stripSpaces.ts';
import { getIndexCategoryCardPath } from '../lib/hexagonData.ts';
import remapToRange from '../lib/remapToRange.ts';
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
                    'group overflow-visible',
                    gridAreaIndex === 0 ? 'cursor-pointer' : 'cursor-zoom-in',
                    debug_applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                )}
                style={style}
                onClick={handleClick}
            >
                <defs>
                    {/* custom per-grid-area path: */}
                    <path id={componentStrings_memo.pathName} d={path} vectorEffect="non-scaling-stroke" />

                    {/* clip with same path in order for stroke attribute to only stroke inside of path: */}
                    <clipPath id={componentStrings_memo.clipPathName} clipPathUnits="objectBoundingBox">
                        <use href={`#${componentStrings_memo.pathName}`} />
                    </clipPath>
                </defs>

                <ChildImageAndSvg
                    gridAreaIndex={gridAreaIndex}
                    cardImage={post.cardImage}
                    pathName={componentStrings_memo.pathName}
                    clipPathName={componentStrings_memo.clipPathName}
                />
            </svg>
        </Flipped>
    );
};

export default CategoryCard;

const ChildImageAndSvg: FC<{ gridAreaIndex: number; cardImage?: string; pathName: string; clipPathName: string }> = memo(
    ({ gridAreaIndex, cardImage, pathName, clipPathName }) => {
        return (
            <>
                {/* Emulate object-cover via preserveAspectRatio */}
                <image
                    width="100%"
                    height="100%"
                    className="origin-center scale-[0.99] transform-gpu transition-[filter] [filter:var(--image-filter,brightness(0.1)_grayscale(0.1))] group-hover-active:brightness-110" // to combat pixel errors (rounding?)
                    href={cardImage}
                    clipPath={`url(#${clipPathName})`}
                    preserveAspectRatio="xMidYMid slice"
                />

                {/* Scale according to percentages of width/height */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" preserveAspectRatio="none">
                    <use
                        href={`#${pathName}`}
                        clipPath={`url(#${clipPathName})`}
                        className="stroke-theme-primary-darker"
                        shapeRendering="geometricPrecision"
                        strokeWidth={7 / ((gridAreaIndex + 5) / areaCount)}
                        fill="none"
                    />
                </svg>
            </>
        );
    },
);

/* Local Functions */

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

function getGridAreaStyle(gridAreaIndex: number, cardCount: number) {
    const brightnessPercentage = 1 / areaCount;

    let baseStyle: CSSProperties = {
        zIndex: cardCount - gridAreaIndex,
    };

    if (gridAreaIndex >= areaCount) {
        const surplusCells = cardCount - areaCount;
        const thisSurplusCell = remapToRange(gridAreaIndex - areaCount, 0, surplusCells - 1, 0, 1);

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
            'gridArea': 'area' + gridAreaIndex,
            '--image-filter': `brightness(${1 - gridAreaIndex * brightnessPercentage}) grayscale(${gridAreaIndex * brightnessPercentage})`,
        } as CSSProperties;
    }

    return baseStyle;
}

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

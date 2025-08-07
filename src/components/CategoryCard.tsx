import { CSSProperties, FC, useEffect, useLayoutEffect, useState } from 'react';
import { GridAreaPathData, PostType } from '../types/types.ts';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import { Flipped } from 'react-flip-toolkit';
import { getShapePaths } from '../config/hexagonData.ts';
import stripSpaces from '../lib/stripSpaces.ts';
import { useMeasure } from 'react-use';

const CategoryCard: FC<{
    post: PostType;
    cardIndex: number;
    flipIndex: number;
    cardCount: number;
    gridAreaStyles: CSSProperties[];
    gridAreaPathsData: React.MutableRefObject<GridAreaPathData[]>;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
    setInfoContent: React.Dispatch<
        React.SetStateAction<{
            title: string;
            subTitle: string;
        }>
    >;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStyles, gridAreaPathsData, setFlipIndex, setInfoContent }) => {
    const navigate = useNavigate();

    const gridAreaIndex = getGridAreaIndex(flipIndex, cardIndex, cardCount);
    const gridAreaStyle = gridAreaStyles[gridAreaIndex];
    const [gridAreaPathData, setGridAreaPathData] = useState<GridAreaPathData | undefined>(gridAreaPathsData.current[gridAreaIndex]);

    const [measureRef, { width, height }] = useMeasure<HTMLButtonElement>();

    useLayoutEffect(() => {
        if (width && height) {
            if (!gridAreaPathsData.current[gridAreaIndex]) {
                const newGridAreaPathData = getIndexClipPath(gridAreaIndex, width, height);
                gridAreaPathsData.current[gridAreaIndex] = newGridAreaPathData;
            } else if (width !== gridAreaPathsData.current[gridAreaIndex].width || height !== gridAreaPathsData.current[gridAreaIndex].height) {
                const updatedGridAreaPathData = getIndexClipPath(gridAreaIndex, width, height);
                gridAreaPathsData.current[gridAreaIndex] = updatedGridAreaPathData;
            }

            setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]);
        }
    }, [gridAreaPathsData, height, width, gridAreaIndex]);

    const isAtFront = gridAreaIndex === 0;

    /* Set title/subtitle to top 'banner' */
    useEffect(() => {
        if (isAtFront) {
            setInfoContent({ title: post.title, subTitle: post.subTitle ?? '' });
        }
    }, [isAtFront, post, setInfoContent]);

    const handleClick = () => {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            setFlipIndex(cardIndex);
        }
    };

    // WARN DEBUG
    const debug_applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped flipId={post.id} transformOrigin='0px 0px' opacity translate scale>
            <button
                // ref={mountCallback}
                ref={measureRef}
                className={classNames(
                    'group absolute flex size-full brightness-0 drop-shadow-omni-md grayscale-0 transition-[filter,background-color] hover-active:![--tw-brightness:_brightness(1)] hover-active:![--tw-grayscale:_grayscale(0)]',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                    debug_applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                )}
                style={gridAreaStyle}
                onClick={handleClick}
            >
                {gridAreaPathData && <SVGClippedImage post={post} gridAreaPathData={gridAreaPathData} />}
            </button>
        </Flipped>
    );
};

export default CategoryCard;

const SVGClippedImage: FC<{
    post: PostType;
    gridAreaPathData: GridAreaPathData;
}> = ({ post, gridAreaPathData }) => {
    const { id, title, titleCardBg } = post;
    const { width, height, shapePath } = gridAreaPathData;

    const idSuffix = sanitizeString(id + '_' + title);
    const pathName = `svg-hexagon-path-${idSuffix}`;
    const clipPathName = pathName + '-clipPath';

    return (
        <svg xmlns='http://www.w3.org/2000/svg' style={{ width, height }}>
            <defs>
                {/* custom per-grid-area path: */}
                <path id={pathName} d={shapePath} />

                {/* clip with same path in order for stroke attribute to only stroke inside of path: */}
                <clipPath id={clipPathName} clipPathUnits='objectBoundingBox'>
                    <use href={`#${pathName}`} />
                </clipPath>
            </defs>

            {/* Emulate object-cover via preserveAspectRatio */}
            <image
                width='100%'
                height='100%'
                className='origin-center scale-[0.9975] transform-gpu' // to combat pixel errors (rounding?)
                href={titleCardBg}
                clipPath={`url(#${clipPathName})`}
                preserveAspectRatio='xMidYMid slice'
            />

            {/* Scale according to percentages of width/height */}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' preserveAspectRatio='none'>
                <use
                    href={`#${pathName}`}
                    clipPath={`url(#${clipPathName})`}
                    className='fill-none stroke-theme-primary'
                    shapeRendering='geometricPrecision'
                    strokeWidth={10 / (width + height)}
                />
            </svg>
        </svg>
    );
};

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

function getIndexClipPath(gridAreaIndex: number, width: number, height: number) {
    const aspectRatio = width / height;
    const shapePath = getShapePaths(gridAreaIndex, aspectRatio);

    return {
        width,
        height,
        shapePath,
    };
}

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

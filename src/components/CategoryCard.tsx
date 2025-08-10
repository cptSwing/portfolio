import { CSSProperties, FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GridAreaPathData, Post } from '../types/types.ts';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import { Flipped } from 'react-flip-toolkit';
import stripSpaces from '../lib/stripSpaces.ts';
import { getIndexCategoryCardPath } from '../lib/hexagonData.ts';

const CategoryCard: FC<{
    post: Post;
    cardIndex: number;
    flipIndex: number;
    cardCount: number;
    gridAreaStyles: CSSProperties[];
    gridAreaPathsData: React.MutableRefObject<GridAreaPathData[]>;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
    setBannerTitle: React.Dispatch<React.SetStateAction<string>>;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStyles, gridAreaPathsData, setFlipIndex, setBannerTitle }) => {
    const navigate = useNavigate();

    const gridAreaIndex = getGridAreaIndex(flipIndex, cardIndex, cardCount);
    const isAtFront = gridAreaIndex === 0;
    const gridAreaStyle = gridAreaStyles[gridAreaIndex];
    const [gridAreaPathData, setGridAreaPathData] = useState<GridAreaPathData>(gridAreaPathsData.current[gridAreaIndex]!);

    useEffect(() => {
        setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]!);
    }, [gridAreaIndex, gridAreaPathData, gridAreaPathsData]);

    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // const [width, height] = useSize(resizeRef);

    // useEffect(() => {
    //     if (width && height) {
    //         if (!gridAreaPathsData.current[gridAreaIndex]) {
    //             const newGridAreaPathData = getIndexCategoryCardPath(gridAreaIndex, width, height);
    //             gridAreaPathsData.current[gridAreaIndex] = newGridAreaPathData;

    //             console.log('%c[CategoryCard]', 'color: #926ff1', `${gridAreaIndex} --> set new gridAreaPathData`);
    //         }
    //         // else if ( width !== gridAreaPathsData.current[ gridAreaIndex ].width || height !== gridAreaPathsData.current[ gridAreaIndex ].height ) {
    //         //     console.log(
    //         //         '%c[CategoryCard]',
    //         //         'color: #75f433',
    //         //         `${gridAreaIndex} --> width, gridAreaPathsData.width, height, gridAreaPathsData.height :`,
    //         //         width,
    //         //         gridAreaPathsData.current[gridAreaIndex].width,
    //         //         height,
    //         //         gridAreaPathsData.current[gridAreaIndex].height,
    //         //     );
    //         //     const updatedGridAreaPathData = getIndexCategoryCardPath(gridAreaIndex, width, height);
    //         //     gridAreaPathsData.current[gridAreaIndex] = updatedGridAreaPathData;

    //         //     setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]);

    //         //     console.log('%c[CategoryCard]', 'color: #6d03fb', `${gridAreaIndex} --> updated gridAreaPathData`);
    //         // }

    //         // setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]);
    //     }
    // }, [width, height, gridAreaIndex, gridAreaPathData, gridAreaPathsData]);

    // const [[width, height], setSize] = useState([0, 0]);

    // useEffect(() => {
    //     if (width && height) {
    //         console.log('%c[CategoryCard]', 'color: #a338d7', `${gridAreaIndex} --> width,height :`, width, height);
    //         setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]);
    //     }
    // }, [gridAreaIndex, gridAreaPathsData, height, width]);

    useEffect(() => {
        setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]!);
    }, [gridAreaIndex, gridAreaPathsData]);

    /* Set title/subtitle to top 'banner' */
    useEffect(() => {
        if (isAtFront) {
            setBannerTitle(post.title);
        }
    }, [isAtFront, post, setBannerTitle]);

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
        <Flipped
            flipId={post.id}
            transformOrigin="0px 0px"
            opacity
            translate
            scale
            onComplete={(elem) => {
                const { width, height } = elem.getBoundingClientRect();
                console.log('%c[CategoryCard]', 'color: #f90b01', `${gridAreaIndex} onComplete! --> width, height :`, width, height);
                if (gridAreaPathsData.current[gridAreaIndex]!.width !== width) {
                    const newGridAreaPathData = getIndexCategoryCardPath(gridAreaIndex, width, height);
                    gridAreaPathsData.current[gridAreaIndex] = newGridAreaPathData;

                    console.log('%c[CategoryCard]', 'color: #926ff1', `${gridAreaIndex} --> set new gridAreaPathData`);
                    setGridAreaPathData(gridAreaPathsData.current[gridAreaIndex]!);
                }
            }}
        >
            <button
                ref={buttonRef}
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
    post: Post;
    gridAreaPathData: GridAreaPathData;
}> = ({ post, gridAreaPathData }) => {
    const { id, title, titleCardBg } = post;
    const { width, height, path } = gridAreaPathData;

    const idSuffix = sanitizeString(id + '_' + title);
    const pathName = `svg-hexagon-path-${idSuffix}`;
    const clipPathName = pathName + '-clipPath';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // style={ { width, height } }
            width="100%"
            height="100%"
        >
            <defs>
                {/* custom per-grid-area path: */}
                <path id={pathName} d={path} vectorEffect="non-scaling-stroke" className="transition-[d]" />

                {/* clip with same path in order for stroke attribute to only stroke inside of path: */}
                <clipPath id={clipPathName} clipPathUnits="objectBoundingBox">
                    <use href={`#${pathName}`} />
                </clipPath>
            </defs>

            {/* Emulate object-cover via preserveAspectRatio */}
            <image
                width="100%"
                height="100%"
                className="origin-center scale-[0.99] transform-gpu" // to combat pixel errors (rounding?)
                href={titleCardBg}
                clipPath={`url(#${clipPathName})`}
                preserveAspectRatio="xMidYMid slice"
            />

            {/* Scale according to percentages of width/height */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" preserveAspectRatio="none">
                <use
                    href={`#${pathName}`}
                    clipPath={`url(#${clipPathName})`}
                    className="fill-none stroke-theme-primary-darker"
                    shapeRendering="geometricPrecision"
                    strokeWidth={10}
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

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

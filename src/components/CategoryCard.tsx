import { CSSProperties, FC, useEffect, useLayoutEffect, useState } from 'react';
import { ClipAreaSize, PostType } from '../types/types.ts';
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
    clipAreaSizes: React.MutableRefObject<ClipAreaSize[]>;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
    setInfoContent: React.Dispatch<
        React.SetStateAction<{
            title: string;
            subTitle: string;
        }>
    >;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStyles, clipAreaSizes, setFlipIndex, setInfoContent }) => {
    const navigate = useNavigate();

    const styleIndex = getStyleIndex(flipIndex, cardIndex, cardCount);
    const gridAreaStyle = gridAreaStyles[styleIndex];
    const [clipAreaSize, setClipAreaSize] = useState<ClipAreaSize | undefined>(clipAreaSizes.current[styleIndex]);

    const [measureRef, { width, height }] = useMeasure<HTMLButtonElement>();

    useLayoutEffect(() => {
        if (width && height) {
            if (!clipAreaSizes.current[styleIndex]) {
                const newClipAreaSize = getIndexClipPath(styleIndex, width, height);
                clipAreaSizes.current[styleIndex] = newClipAreaSize;
            } else if (width !== clipAreaSizes.current[styleIndex].width || height !== clipAreaSizes.current[styleIndex].height) {
                const updatedClipAreaSize = getIndexClipPath(styleIndex, width, height);
                clipAreaSizes.current[styleIndex] = updatedClipAreaSize;
            }

            setClipAreaSize(clipAreaSizes.current[styleIndex]);
        }
    }, [clipAreaSizes, height, width, styleIndex]);

    const isAtFront = styleIndex === 0;

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
                {clipAreaSize && <SVGClippedImage post={post} clipAreaSize={clipAreaSize} />}
            </button>
        </Flipped>
    );
};

export default CategoryCard;

const SVGClippedImage: FC<{
    post: PostType;
    clipAreaSize: ClipAreaSize;
}> = ({ post, clipAreaSize }) => {
    const { id, title, titleCardBg } = post;
    const { width, height, backgroundShapePath } = clipAreaSize;
    const idSuffix = sanitizeString(id + title);

    return (
        <svg xmlns='http://www.w3.org/2000/svg' className='pointer-events-none absolute' style={{ width, height }}>
            <defs>
                <clipPath id={`svg-hexagon-clip-path-${idSuffix}`} clipPathUnits='objectBoundingBox'>
                    <path className='transition-[d] delay-75' d={backgroundShapePath} />
                </clipPath>
            </defs>

            <foreignObject width='100%' height='100%' clipPath={`url(#svg-hexagon-clip-path-${idSuffix})`}>
                <img className='size-full object-cover object-center' src={titleCardBg} alt={title} />
            </foreignObject>
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

function getIndexClipPath(styleIndex: number, width: number, height: number) {
    const aspectRatio = width / height;
    const backgroundShapePath = getShapePaths(styleIndex, aspectRatio);

    return {
        width,
        height,
        backgroundShapePath,
    };
}

function sanitizeString(str: string) {
    return stripSpaces(str).replace(/[\])}[{(]/g, '_');
}

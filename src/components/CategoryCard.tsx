import { CSSProperties, FC, useEffect } from 'react';
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

    const [measureRef, { width: width, height: height }] = useMeasure<HTMLButtonElement>();

    /* Store areas' sizes */
    useEffect(() => {
        if (!clipAreaSizes.current[styleIndex]) {
            if (width && height) {
                const aspectRatio = width / height;
                const backgroundShapePath = getShapePaths(styleIndex, aspectRatio);

                clipAreaSizes.current[styleIndex] = {
                    width,
                    height,
                    backgroundShapePath,
                };
            }
        }
    }, [styleIndex, width, height, clipAreaSizes]);

    const gridAreaStyle = gridAreaStyles[styleIndex];
    const clipAreaSize = clipAreaSizes.current[styleIndex];

    const isAtFront = styleIndex === 0;

    useEffect(() => {
        if (isAtFront) {
            setInfoContent({ title: post.title, subTitle: post.subTitle ?? '' });
        }
    }, [isAtFront, post, setInfoContent]);

    const idSuffix = sanitizeString(post.id + post.title);

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
                ref={measureRef}
                className={classNames(
                    'group absolute flex size-full brightness-0 drop-shadow-omni-md grayscale-0 transition-[filter,background-color] hover-active:![--tw-brightness:_brightness(1)] hover-active:![--tw-grayscale:_grayscale(0)]',
                    debug_applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={gridAreaStyle}
                onClick={handleClick}
            >
                {/* Clip Path SVG */}
                {clipAreaSize && <SVGClipPath clipAreaSize={clipAreaSize} idSuffix={idSuffix} />}

                {/* Image */}
                <CategoryCardImage post={post} idSuffix={idSuffix} />
            </button>
        </Flipped>
    );
};

export default CategoryCard;

const CategoryCardImage: FC<{
    post: PostType;
    idSuffix: string;
}> = ({ post, idSuffix }) => {
    const { title, titleCardBg } = post;

    return (
        <div
            className='group relative size-full overflow-hidden bg-theme-primary-darker/70 hover-active:scale-[1.03]'
            style={
                {
                    clipPath: `url(#svg-hexagon-clip-path-${idSuffix})`,
                } as CSSProperties
            }
        >
            <img className='size-full object-cover object-center' src={titleCardBg} alt={title} />
        </div>
    );
};

const SVGClipPath: FC<{
    clipAreaSize: ClipAreaSize;
    idSuffix: string;
}> = ({ clipAreaSize, idSuffix }) => {
    const { width, height, backgroundShapePath } = clipAreaSize;

    return (
        <svg xmlns='http://www.w3.org/2000/svg' className='pointer-events-none absolute' style={{ width, height }}>
            <defs>
                <clipPath id={`svg-hexagon-clip-path-${idSuffix}`} clipPathUnits='objectBoundingBox'>
                    <path className='transition-[d] delay-75' d={backgroundShapePath} />
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

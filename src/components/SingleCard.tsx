import { CSSProperties, FC, useCallback } from 'react';
import { ClipAreaSize, Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import { Flipped } from 'react-flip-toolkit';
import { degToRad, staticValues, svgObjectBoundingBoxHexagonPath } from '../config/hexagonData.ts';
import stripSpaces from '../lib/stripSpaces.ts';

const SingleCard: FC<{
    post: Post;
    cardIndex: number;
    flipIndex: number;
    cardCount: number;
    gridAreaStyles: CSSProperties[];
    clipAreaSizes: React.MutableRefObject<ClipAreaSize[]>;
    setFlipIndex: (value: React.SetStateAction<number>) => void;
}> = ({ post, cardIndex, flipIndex, cardCount, gridAreaStyles, clipAreaSizes, setFlipIndex }) => {
    const navigate = useNavigate();

    const styleIndex = getStyleIndex(flipIndex, cardIndex, cardCount);

    /* Store various areas' sizes on mount, the earlier the better */
    const mountCallback_Cb = useCallback(
        (elem: HTMLButtonElement | null) => {
            if (elem) {
                const { width, height } = elem.getBoundingClientRect();
                const aspectRatio = width / height;
                const { backgroundShapePath, hexagonPathTransforms } = getShapePaths(styleIndex, aspectRatio);

                if (!clipAreaSizes.current[styleIndex])
                    // TODO should update on resize
                    clipAreaSizes.current[styleIndex] = {
                        width,
                        height,
                        aspectRatio,
                        backgroundShapePath,
                        hexagonPathTransforms,
                    };
            }
        },
        [clipAreaSizes, styleIndex],
    );

    const gridAreaStyle = gridAreaStyles[styleIndex];
    const clipAreaSize = clipAreaSizes.current[styleIndex];

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
    const debug_applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped flipId={post.id} transformOrigin='0px 0px' opacity translate scale>
            <button
                ref={mountCallback_Cb}
                className={classNames(
                    'group absolute flex size-full select-none flex-col items-center justify-between bg-theme-primary-darker/70 brightness-0 grayscale-0 transition-[filter,background-color] hover-active:bg-theme-primary-darker/0 hover-active:![--tw-brightness:_brightness(1)] hover-active:![--tw-grayscale:_grayscale(0)]',
                    debug_applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={{
                    ...gridAreaStyle,
                    clipPath: `url(#test-clip-path-${idSuffix})`,
                }}
                onClick={handleClick}
            >
                {/* Clip Path SVG */}
                {clipAreaSize && <SVGClipPath clipAreaSize={clipAreaSize} idSuffix={idSuffix} />}

                {/* Image */}
                <SingleCardImage post={post} styleIndex={styleIndex} isAtFront={isAtFront} idSuffix={idSuffix} />
            </button>
        </Flipped>
    );
};

export default SingleCard;

function getTitleClipPath(yAxisPoint: number) {
    const xAxisPoint = yAxisPoint / tan60;

    return `polygon(0% ${yAxisPoint}vh, ${xAxisPoint}vh 0%, calc(100% - ${xAxisPoint}vh) 0%, 100% ${yAxisPoint}vh, calc(100% - ${xAxisPoint}vh) 100%, ${xAxisPoint}vh 100%)`;
}

const SingleCardImage: FC<{
    post: Post;
    styleIndex: number;
    isAtFront: boolean;
    idSuffix: string;
}> = ({ post, styleIndex, isAtFront, idSuffix }) => {
    const { title, titleCardBg, subTitle } = post;

    return (
        <div
            className='group absolute inset-[--inset-on-hover] overflow-hidden transition-[inset] group-hover-active:![--inset-on-hover:0vw]'
            style={
                {
                    'clipPath': `url(#test-clip-path-${idSuffix})`,
                    '--inset-on-hover': '0.12vw',
                } as CSSProperties
            }
        >
            {/* Title: */}
            <span
                className={classNames(
                    'absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-center font-semibold text-theme-primary-darker transition-transform',
                    'before:absolute before:left-[-10%] before:top-1/2 before:-z-10 before:w-[120%] before:-translate-y-1/2 before:bg-theme-secondary-lighter/80 before:[clip-path:--title-clip-path]',
                    styleIndex === 0
                        ? 'top-[2vh] translate-y-0 text-[2vh] before:h-[2.5vh]'
                        : styleIndex < 5
                          ? 'top-[1.5vh] -translate-y-[4vh] text-[1.25vh] before:h-[1.75vh] group-hover-active:translate-y-0'
                          : 'hidden',
                )}
                style={
                    {
                        '--title-clip-path': getTitleClipPath(isAtFront ? 1.25 : 0.875),
                    } as CSSProperties
                }
            >
                {title}
            </span>

            <img className='size-full object-cover object-center' src={titleCardBg} alt={title} />

            {/* Subtitle: */}
            {subTitle && (
                <div
                    className={classNames(
                        'absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-center font-semibold text-theme-primary-darker transition-transform',
                        'before:absolute before:left-[-2.5%] before:top-1/2 before:-z-10 before:w-[105%] before:-translate-y-1/2 before:bg-theme-primary-lighter/80 before:[clip-path:--subtitle-clip-path]',
                        styleIndex === 0
                            ? 'bottom-[2vh] translate-y-0 text-[1.25vh] before:h-[2.25vh]'
                            : styleIndex < 5
                              ? 'bottom-[1.5vh] translate-y-[4vh] text-[1vh] before:h-[1.75vh] group-hover-active:translate-y-0'
                              : 'hidden',
                    )}
                    style={
                        {
                            '--subtitle-clip-path': getTitleClipPath(isAtFront ? 1.125 : 0.875),
                        } as CSSProperties
                    }
                >
                    <Markdown>{subTitle}</Markdown>
                </div>
            )}
        </div>
    );
};

const SVGClipPath: FC<{
    clipAreaSize: ClipAreaSize;
    idSuffix: string;
}> = ({ clipAreaSize, idSuffix }) => {
    const { width, height, aspectRatio, backgroundShapePath, hexagonPathTransforms } = clipAreaSize;

    return (
        <svg xmlns='http://www.w3.org/2000/svg' style={{ width, height }}>
            <defs>
                <clipPath id={`test-clip-path-${idSuffix}`} clipPathUnits='objectBoundingBox'>
                    <path className='transition-[d] delay-75' d={backgroundShapePath} />

                    {hexagonPathTransforms.map(({ scale, x, y }, idx) => (
                        <path
                            key={idSuffix + idx}
                            className='transition-transform'
                            d={svgObjectBoundingBoxHexagonPath}
                            transform={getHexagonPathOffsetAndScale(aspectRatio, scale, x, y)}
                        />
                    ))}
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

const hexAspectRatio = staticValues.heightAspectRatio.flatTop;

function getHexagonPathOffsetAndScale(aspectRatio: number, scale: number, xPos: number, yPos: number) {
    const scaleY = scale / hexAspectRatio;
    const scaleX = scaleY / aspectRatio;

    const offsetX = scaleX / 2;
    const offsetY = offsetX * hexAspectRatio * aspectRatio;

    return `translate(${xPos - offsetX} ${yPos - offsetY}) scale(${scaleX} ${scaleY})`;
}

const tan60 = Math.tan(degToRad(60));

function getShapePaths(styleIndex: number, aspectRatio: number) {
    let backgroundShapePath;
    const hexagonPathTransforms = [];

    switch (styleIndex) {
        // isFirst
        case 0:
        case 5:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.1} 
                    L${0.1 / aspectRatio / tan60},0 
                    
                    L${1 - 0.25 / aspectRatio / tan60},0 
                    L1,${0.25} 

                    L1,${1 - 0.3} 
                    L${1 - 0.3 / aspectRatio / tan60},1 
                    
                    L${0.15 / aspectRatio / tan60},1 
                    L0,${1 - 0.15}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.2, x: 0.9, y: 0.1 }, { scale: 0.25, x: 0.875, y: 0.815 }, { scale: 0.1, x: 0.05, y: 0.95 });
            break;

        case 1:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.15} 
                    L${0.15 / aspectRatio / tan60},0 
                    
                    L${1 - 0.25 / aspectRatio / tan60},0 
                    L1,${0.25} 

                    L1,${1 - 0.1} 
                    L${1 - 0.1 / aspectRatio / tan60},1 
                    
                    L${0.3 / aspectRatio / tan60},1 
                    L0,${1 - 0.3}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.2, x: 0.9, y: 0.1 }, { scale: 0.1, x: 0.05, y: 0.05 }, { scale: 0.25, x: 0.0875, y: 0.815 });
            break;

        case 2:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.15} 
                    L${0.15 / aspectRatio / tan60},0 
                    
                    L${1 - 0.3 / aspectRatio / tan60},0 
                    L1,${0.3} 

                    L1,${1 - 0.1} 
                    L${1 - 0.1 / aspectRatio / tan60},1 
                    
                    L${0.25 / aspectRatio / tan60},1 
                    L0,${1 - 0.25}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.1, x: 0.035, y: 0.085 }, { scale: 0.2, x: 0.925, y: 0.1 }, { scale: 0.25, x: 0.0875, y: 0.975 });
            break;

        case 3:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.3} 
                    L${0.3 / aspectRatio / tan60},0 
                    
                    L${1 - 0.1 / aspectRatio / tan60},0 
                    L1,${0.1} 

                    L1,${1 - 0.15} 
                    L${1 - 0.15 / aspectRatio / tan60},1 
                    
                    L${0.25 / aspectRatio / tan60},1 
                    L0,${1 - 0.25}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.3, x: 0.1, y: 0.03 }, { scale: 0.2, x: 0.5, y: 0.5 }, { scale: 0.25, x: 0.085, y: 0.825 });
            break;

        case 4:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.25} 
                    L${0.25 / aspectRatio / tan60},0 
                    
                    L${1 - 0.5 / aspectRatio / tan60},0 
                    L1,${0.5} 

                    L1,${1 - 0.15} 
                    L${1 - 0.15 / aspectRatio / tan60},1 
                    
                    L${0.1 / aspectRatio / tan60},1 
                    L0,${1 - 0.1}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.2, x: 0.075, y: 0.1 }, { scale: 0.2, x: 0.84, y: 0.1 }, { scale: 0.1, x: 0.5, y: 0.5 });
            break;

        case 6:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.2} 
                    L${0.2 / aspectRatio / tan60},0 
                    
                    L${1 - 0.2 / aspectRatio / tan60},0 
                    L1,${0.2} 

                    L1,${1 - 0.2} 
                    L${1 - 0.2 / aspectRatio / tan60},1 
                    
                    L${0.2 / aspectRatio / tan60},1 
                    L0,${1 - 0.2}
                    Z`;
            break;

        case 7:
            // top left; top right; bottom right; bottom left
            backgroundShapePath = `
                    M0,${0.2} 
                    L${0.2 / aspectRatio / tan60},0 
                    
                    L${1 - 0.2 / aspectRatio / tan60},0 
                    L1,${0.2} 

                    L1,${1 - 0.2} 
                    L${1 - 0.2 / aspectRatio / tan60},1 
                    
                    L${0.2 / aspectRatio / tan60},1 
                    L0,${1 - 0.2}
                    Z`;

            hexagonPathTransforms.push({ scale: 0.1, x: 0.5, y: 0.5 }, { scale: 0.1, x: 0.5, y: 0.5 }, { scale: 0.1, x: 0.5, y: 0.5 });
            break;

        default:
            backgroundShapePath = 'M0,0 L1,0 L1,1 L0,1 Z';
    }

    return { backgroundShapePath, hexagonPathTransforms };
}

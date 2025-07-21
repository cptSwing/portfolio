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
                    'group/button absolute flex size-full select-none flex-col items-center justify-between bg-theme-primary-darker/50 brightness-0 grayscale-0 transition-[filter,background-color] hover-active:bg-theme-primary-darker/10 hover-active:![--tw-brightness:_brightness(1)] hover-active:![--tw-grayscale:_grayscale(0)]',
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
        <div
            className='group absolute inset-[--inset-on-hover] overflow-hidden transition-[inset] group-hover-active/button:![--inset-on-hover:0vw]'
            style={
                {
                    'clipPath': `url(#test-clip-path-${idSuffix})`,
                    '--inset-on-hover': '0.12vw',
                } as CSSProperties
            }
        >
            {/* Title: */}
            <h6
                className={classNames(
                    'absolute left-1/2 top-[2%] z-10 max-w-[84%] -translate-x-1/2 items-center justify-center text-center text-theme-secondary-lighter',
                    'before:absolute before:left-0 before:-z-10 before:h-full before:w-full before:bg-theme-primary-darker/90 before:pl-[10%] before:[clip-path:--title-clip-path]',
                    isAtFront ? 'flex w-fit' : 'hidden size-0',
                )}
                // style={{ '--title-clip-path': `url(#test-clip-path-${idSuffix})` } as CSSProperties}
                style={{ '--title-clip-path': `path(${getShapePaths(6, 8, true).backgroundShapePath})` } as CSSProperties}
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

const SVGClipPath: FC<{
    clipAreaSize: ClipAreaSize;
    idSuffix: string;
}> = ({ clipAreaSize, idSuffix }) => {
    const { width, height, aspectRatio, backgroundShapePath, hexagonPathTransforms } = clipAreaSize;

    return (
        <svg xmlns='http://www.w3.org/2000/svg' style={{ width, height }}>
            <defs>
                <clipPath id={`test-clip-path-${idSuffix}`} clipPathUnits='objectBoundingBox'>
                    <path className='transition-[d] duration-300' d={backgroundShapePath} />

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

function getShapePaths(styleIndex: number, aspectRatio: number, addPercentUnit = false) {
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
            backgroundShapePath = addPercentUnit
                ? `
                    M0%,${0.2 * 100}% 
                    L${(0.2 * 100) / aspectRatio / tan60}%,0% 
                    
                    L${((1 - 0.2) * 100) / aspectRatio / tan60}%,0% 
                    L100%,${0.2 * 100}% 

                    L100%,${(1 - 0.2) * 100}% 
                    L${((1 - 0.2) * 100) / aspectRatio / tan60}%,100% 
                    
                    L${(0.2 * 100) / aspectRatio / tan60}%,100% 
                    L0%,${(1 - 0.2) * 100}%
                    Z`
                : `
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

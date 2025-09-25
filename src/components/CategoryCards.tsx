import { cloneElement, CSSProperties, FC, ReactElement, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getCategoryHexagons, calcCSSVariables } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonTransformData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { config } from '../types/exportTyped';
import { useNavigate } from 'react-router-dom';
import FitText from './utilityComponents/FitText';
import { Clients } from './PostDetails';
import useTimeout from '../hooks/useTimeout';

const CategoryCards: FC<{
    posts: Post[];
    activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ posts, activeIndexState }) => {
    const containerSize = useContext(GetChildSizeContext);
    const categoryHexagons_Memo = useMemo(() => getCategoryHexagons(posts.length), [posts]);

    return posts.map((post, idx) => (
        <CategoryHexagon
            key={`hex-post-card-index-${idx}`}
            allButtons={categoryHexagons_Memo}
            post={post}
            containerSize={containerSize}
            cardIndex={idx}
            activeIndexState={activeIndexState}
        />
    ));
};

export default CategoryCards;

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const CategoryHexagon: FC<{
    allButtons: HexagonTransformData[];
    post: Post;
    containerSize: {
        width: number;
        height: number;
    };
    cardIndex: number;
    activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ allButtons, post, containerSize, cardIndex, activeIndexState }) => {
    const { title, subTitle, cardImage, clients } = post;
    const [activeIndex, setActiveIndex] = activeIndexState;

    const runIrisTransition = useZustand((state) => state.values.runIrisTransition);
    const [transitionIsCompleted, setTransitionIsCompleted] = useState(false);
    const [runPanelsTransition, setRunPanelsTransition] = useState(false);

    const isAtFront = activeIndex === cardIndex;
    const thisButtonIndex = getGridAreaIndex(activeIndex, cardIndex, allButtons.length);

    const navigate = useNavigate();
    useTimeout(() => setRunPanelsTransition(true), isAtFront && !runIrisTransition && transitionIsCompleted ? transitionDuration_MS * 1.5 : null);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = allButtons[thisButtonIndex]!;
        return calcCSSVariables(position, rotation, runPanelsTransition && isAtFront ? 3 : scale, isHalf, containerSize, {
            strokeWidth: 0,
        });
    }, [allButtons, containerSize, isAtFront, runPanelsTransition, thisButtonIndex]);

    useLayoutEffect(() => {
        if (isAtFront) {
            setTransitionIsCompleted(false);
        }
        return () => setRunPanelsTransition(false);
    }, [activeIndex, isAtFront, setTransitionIsCompleted]);

    function handleClick() {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            setActiveIndex(cardIndex);
        }
    }

    return (
        <button
            className={classNames(
                'transform-hexagon group pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,filter] duration-[--ui-animation-menu-transition-duration]',

                isAtFront
                    ? transitionIsCompleted
                        ? '' // !translate-x-[calc(var(--hexagon-translate-x)-(33.333%*var(--hexagon-scale-x)))]
                        : ''
                    : 'hover-active:!z-50 hover-active:scale-[calc(var(--hexagon-scale-x)*1.35)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    zIndex: (isAtFront ? (runPanelsTransition ? 20 : 0) : 0) - thisButtonIndex,
                } as CSSProperties
            }
            onTransitionEnd={({ target, currentTarget }) => target === currentTarget && setTransitionIsCompleted(true)}
            onClick={handleClick}
        >
            {isAtFront ? (
                <>
                    {/* Extending wide hexagon */}
                    {/* <div
                        className={classNames(
                            'lighting-gradient glassmorphic-backdrop pointer-events-auto absolute left-[76%] top-[20%] flex h-[60%] w-[calc(60%*1.1547)] origin-left -translate-x-full flex-col items-center justify-center gap-y-[10%] !from-black/15 from-40% !to-white/15 to-60% transition-[backdrop-filter,transform,background-color] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] [clip-path:--hexagon-animated-clip-path]',
                            runPanelsTransition ? '!glassmorphic-level-2 !translate-x-0 bg-theme-secondary/15' : 'glassmorphic-level-none bg-theme-secondary/5',
                        )}
                        style={
                            {
                                '--hexagon-animated-clip-path': `path("${roundedSideHexagonPathRight}")`,
                            } as CSSProperties
                        }
                    >
                        {clients && <Clients clients={clients} dataBlockId=" " extraClassNames="w-1/2 basis-1/3 overflow-hidden" />}

                        <div className="ml-[0%] text-pretty text-left font-fjalla-one leading-[1.1] text-theme-primary [font-size:4px]">{subTitle}</div>
                    </div> */}

                    {/* Extending wide hexagon */}
                    {/* <div
                        className={classNames(
                            'lighting-gradient glassmorphic-backdrop pointer-events-auto absolute right-[87.5%] top-[20%] flex h-[60%] w-[58%] origin-right translate-x-full flex-col items-center justify-center !from-black/15 from-40% !to-white/15 to-60% transition-[backdrop-filter,background-color,transform] duration-[calc(var(--ui-animation-menu-transition-duration)*1.5)] [clip-path:--hexagon-animated-clip-path]',
                            runPanelsTransition ? '!glassmorphic-level-3 !translate-x-0 bg-theme-secondary/15' : 'glassmorphic-level-none bg-theme-secondary/5',
                        )}
                        style={
                            {
                                '--hexagon-animated-clip-path': `path("${roundedSideHexagonPathLeft}")`,
                            } as CSSProperties
                        }
                    >
                        <div
                            className={classNames(
                                'ml-[0%] text-nowrap pt-px text-left font-fjalla-one leading-[1.1] text-theme-text-background [font-size:7px] [text-shadow:0px_0.6px_theme(colors.theme.primary-darker)]',
                            )}
                        >
                            {title}
                        </div>
                    </div> */}

                    <StrokedClipPath
                        wrapperClasses="size-full group before:group-hover-active:matrix-scale-[0.95] before:transition-transform"
                        clipPath="var(--hexagon-clip-path)"
                        strokeColor="rgb(var(--theme-root-background) / 0.5)"
                        strokeWidth={0.08}
                        innerStrokeColor="rgb(var(--theme-text-background) / 1)"
                        middleStrokeColor="rgb(var(--theme-primary) / 1)"
                    >
                        <img src={cardImage} alt={title} className="size-full object-cover transition-transform group-hover-active:matrix-scale-[0.94]" />
                    </StrokedClipPath>
                </>
            ) : (
                <div
                    className={classNames(
                        'relative size-full transform-gpu cursor-zoom-in brightness-75 grayscale transition-[transform,filter] duration-[--ui-animation-menu-transition-duration] matrix-scale-[0.925] [clip-path:--hexagon-clip-path] group-hover-active:brightness-100 group-hover-active:grayscale-0',
                    )}
                >
                    <img src={cardImage} alt={title} className={classNames('size-full object-cover')} />
                </div>
            )}
        </button>
    );
};

const StrokedClipPath: FC<{
    clipPath: string;
    strokeColor: string;
    strokeWidth: number;
    middleStrokeColor?: string;
    innerStrokeColor?: string;
    children?: ReactElement;
    wrapperClasses?: string;
}> = ({ clipPath, strokeColor, strokeWidth, innerStrokeColor, middleStrokeColor, children, wrapperClasses }) => {
    return (
        <div
            className={classNames(
                innerStrokeColor
                    ? 'before:absolute before:left-0 before:top-0 before:size-full before:bg-[--stroked-clip-path-inner-stroke-color] before:matrix-scale-[calc(1-var(--stroked-clip-path-width)+var(--stroked-clip-path-width)/8)] before:[clip-path:--stroked-clip-path]'
                    : '', // inner stroke, or off
                'pointer-events-auto [clip-path:--stroked-clip-path]', // outer stroke
                middleStrokeColor
                    ? 'after:absolute after:left-0 after:top-0 after:-z-10 after:size-full after:bg-[--stroked-clip-path-middle-stroke-color] after:transition-transform after:matrix-scale-[calc(1-(var(--stroked-clip-path-width)/8))] after:[clip-path:--stroked-clip-path]'
                    : '', // middle stroke if 3 strokes, or off
                wrapperClasses,
            )}
            style={
                {
                    '--stroked-clip-path': clipPath,
                    'backgroundColor': strokeColor,
                    '--stroked-clip-path-width': strokeWidth,
                    ...(middleStrokeColor ? { '--stroked-clip-path-middle-stroke-color': middleStrokeColor } : {}),
                    ...(innerStrokeColor ? { '--stroked-clip-path-inner-stroke-color': innerStrokeColor } : {}),
                } as CSSProperties
            }
        >
            {children &&
                cloneElement(children, {
                    ...children.props,
                    className: children.props.className + ' matrix-scale-[calc(1-var(--stroked-clip-path-width))] [clip-path:--stroked-clip-path] ',
                })}
        </div>
    );
};

const BannerTitle: FC<{
    title: string;
    subTitle?: string;
    classes?: string;
}> = ({ title, subTitle, classes }) => {
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        setIsSwitching(true);

        const timer = setTimeout(() => {
            setIsSwitching(false);
        }, transitionDuration_MS / 2);

        return () => {
            clearTimeout(timer);
        };
    }, [title]);

    return (
        <div
            className={classNames(
                'flex transform-gpu flex-col items-center justify-center bg-theme-primary-lighter/10 transition-[transform,opacity]',
                isSwitching ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100',
                classes,
            )}
            style={
                {
                    transitionDuration: isSwitching ? '0ms' : 'var(--ui-animation-menu-transition-duration)',
                } as CSSProperties
            }
        >
            <FitText text={title} className="h-full text-nowrap font-fjalla-one leading-none text-theme-primary-lighter sm:h-1/2" />
            {subTitle && <FitText text={subTitle} className="h-full font-fjalla-one leading-none text-theme-secondary-darker/50 sm:h-1/2" />}
        </div>
    );
};

// TODO rename
/** Match the flipIndex to the correct style preset */
function getGridAreaIndex(flipIndex: number, cardIndex: number, cardCount: number) {
    if (flipIndex > cardCount) return 0;

    if (flipIndex > cardIndex) {
        return cardCount + (cardIndex - flipIndex);
    } else if (flipIndex < cardIndex) {
        return cardIndex - flipIndex;
    } else {
        return 0;
    }
}

import { CSSProperties, FC, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getCategoryHexagons, calcCSSVariables } from '../lib/shapeFunctions';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonTransformData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { useNavigate } from 'react-router-dom';
import FitText from './utilityComponents/FitText';
import { Clients } from './PostDetails';
import { useZustand } from '../lib/zustand';

const CategoryCards: FC<{
    posts: Post[];
    activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ posts, activeIndexState }) => {
    const containerSize = useContext(GetChildSizeContext);
    const categoryHexagons_Memo = useMemo(() => getCategoryHexagons(posts.length), [posts]);

    return (
        <>
            {posts.map((post, idx) => (
                <CategoryHexagon
                    key={`hex-post-card-index-${idx}`}
                    allButtons={categoryHexagons_Memo}
                    post={post}
                    containerSize={containerSize}
                    cardIndex={idx}
                    activeIndexState={activeIndexState}
                />
            ))}
            <TitleClients
                title={posts[activeIndexState[0]]!.title}
                containerSize={containerSize}
                subTitle={posts[activeIndexState[0]]?.subTitle}
                clients={posts[activeIndexState[0]]?.clients}
            />
        </>
    );
};

export default CategoryCards;

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
    const { title, cardImage } = post;
    const [activeIndex, setActiveIndex] = activeIndexState;

    const [parentTransitionCompletedWhenAtFront, setParentTransitionCompletedWhenAtFront] = useState(false);

    const isAtFront = activeIndex === cardIndex;
    const thisButtonIndex = getGridAreaIndex(activeIndex, cardIndex, allButtons.length);

    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = allButtons[thisButtonIndex]!;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: false,
            gutterWidth: 0,
        });
    }, [allButtons, containerSize, thisButtonIndex]);

    useLayoutEffect(() => {
        setParentTransitionCompletedWhenAtFront(false);
        return () => setParentTransitionCompletedWhenAtFront(false);
    }, [activeIndex]);

    return (
        <button
            className={classNames(
                'transform-hexagon glassmorphic-backdrop pointer-events-none absolute aspect-hex-flat w-[--hexagon-clip-path-width] bg-theme-primary/100 transition-[transform,background-color,backdrop-filter] delay-[0ms,var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*2)] duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*3),calc(var(--ui-animation-menu-transition-duration)*2)] [clip-path:--hexagon-clip-path]',
                parentTransitionCompletedWhenAtFront
                    ? '!scale-x-[calc(var(--hexagon-scale-x)*2.125)] !scale-y-[calc(var(--hexagon-scale-y)*2.125)] !bg-theme-primary/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:1.5]'
                    : '[--glassmorphic-backdrop-blur:12px] [--glassmorphic-backdrop-saturate:2.5] hover-active:!z-50 hover-active:scale-x-[calc(var(--hexagon-scale-x)*1.5)] hover-active:scale-y-[calc(var(--hexagon-scale-y)*1.5)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    zIndex: (isAtFront ? 20 : 10) - thisButtonIndex,
                } as CSSProperties
            }
            onClick={handleClick}
            onTransitionEnd={handleTransitionEndWhenAtFront.bind(null, isAtFront)}
        >
            <img
                src={cardImage}
                alt={title}
                className={classNames(
                    'peer pointer-events-auto absolute left-0 top-0 size-full object-cover transition-transform duration-[calc(var(--ui-animation-menu-transition-duration)/2)] [clip-path:--hexagon-clip-path-full]',
                    isAtFront ? 'matrix-scale-[0.635] hover-active:matrix-scale-[0.67]' : 'grayscale matrix-scale-[0.98]',
                )}
            />

            {/* Inner Stroke */}
            <div
                className={classNames(
                    'absolute left-0 top-0 size-full bg-theme-primary transition-[transform,clip-path,filter] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] peer-hover-active:brightness-150 peer-hover-active:!delay-0 peer-hover-active:duration-[--ui-animation-menu-transition-duration]',
                    isAtFront
                        ? parentTransitionCompletedWhenAtFront
                            ? 'matrix-scale-[0.65] [clip-path:--hexagon-clip-path-full-stroked] peer-hover-active:duration-[calc(var(--ui-animation-menu-transition-duration)/2)] peer-hover-active:matrix-scale-[0.675]'
                            : 'delay-[200ms,0ms,0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*2),50ms,var(--ui-animation-menu-transition-duration)] matrix-scale-[1.25] [clip-path:--hexagon-clip-path-full]'
                        : 'bg-theme-primary/50 [clip-path:--hexagon-clip-path-full] peer-hover-active:[clip-path:--hexagon-clip-path-full-stroked]',
                )}
            />

            {/* Outer Stroke */}
            <div
                className={classNames(
                    'absolute left-0 top-0 size-full bg-white/[0.2] matrix-translate-x-[-0.075] matrix-translate-y-[-0.05] matrix-rotate-0 matrix-scale-[1.029] [clip-path:--hexagon-clip-path-full-stroked]',
                )}
            />
        </button>
    );

    function handleClick() {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            setActiveIndex(cardIndex);
        }
    }

    function handleTransitionEndWhenAtFront(isAtFront: boolean, ev: React.TransitionEvent) {
        if (isAtFront && ev.target === ev.currentTarget) {
            setParentTransitionCompletedWhenAtFront(true);
        }
    }
};

const TitleClients: FC<{
    title: Post['title'];
    containerSize: {
        width: number;
        height: number;
    };
    subTitle?: Post['subTitle'];
    clients?: Post['clients'];
    noClip?: boolean;
}> = ({ title, containerSize, subTitle, clients }) => {
    const cardTransition = useZustand((state) => state.values.cardTransition);

    return (
        <div className="fixed bottom-[3.5cqh] left-[20cqw] right-[20cqw] top-[3.5cqh] z-50 flex transform-gpu flex-col items-center justify-start">
            <div className="relative h-[12.5cqh] w-auto min-w-[40cqw] max-w-[45cqw]">
                <FitText
                    text={title}
                    className={classNames(
                        'h-full w-full text-nowrap pt-px font-fjalla-one leading-none tracking-normal drop-shadow-lg transition-[transform,clip-path,color]',
                        cardTransition
                            ? 'translate-y-[200%] text-theme-primary-darker duration-0 clip-inset-b-full'
                            : 'translate-y-0 text-theme-secondary-lighter delay-[calc(var(--ui-animation-menu-transition-duration)*1),calc(var(--ui-animation-menu-transition-duration)*1.5),0ms] duration-500 clip-inset-0',
                    )}
                />

                <div
                    className={classNames(
                        'glassmorphic-backdrop absolute left-[-5%] top-1/2 -z-10 h-[50%] w-[110%] -translate-y-1/2 rounded-sm border text-theme-secondary-lighter transition-[opacity,background-color,backdrop-filter,border-color] [--glassmorphic-backdrop-blur:4px]',
                        cardTransition
                            ? 'border-transparent bg-theme-primary opacity-0 delay-0 duration-[calc(var(--ui-animation-menu-transition-duration)/10)] [--glassmorphic-backdrop-saturate:1]'
                            : 'border-white/5 border-b-black/20 border-t-white/10 bg-theme-primary/40 opacity-100 delay-[calc(var(--ui-animation-menu-transition-duration)/1.25),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2)] duration-[0ms,1000ms,1000ms,1000ms] [--glassmorphic-backdrop-saturate:2]',
                    )}
                />
            </div>

            {(subTitle || clients) && (
                <div className="relative mt-[71.5cqh] flex w-auto min-w-[20cqw] max-w-[30cqw] flex-col items-center justify-start">
                    {clients && (
                        <div
                            className={classNames(
                                'absolute top-[-17.5cqh] flex h-full w-3/4 flex-col transition-[transform,clip-path]',
                                cardTransition
                                    ? 'translate-y-[200%] duration-0 clip-inset-b-full'
                                    : 'translate-y-0 delay-[calc(var(--ui-animation-menu-transition-duration)*1.5),calc(var(--ui-animation-menu-transition-duration)*2),0ms] duration-500 clip-inset-y-[-150%]',
                            )}
                            style={{ '--client-hexagon-scale': `${containerSize.width / 1100}` } as CSSProperties}
                        >
                            <span className="relative mx-auto mt-[-1.25cqh] inline-block scale-y-90 font-fjalla-one tracking-wider text-theme-secondary-lighter [font-size:calc(1cqh*1.75)] [line-height:calc(1cqh*2)] before:absolute before:left-[-10%] before:top-[-15%] before:-z-10 before:h-[125%] before:w-[120%] before:bg-theme-primary-darker">
                                Clients:
                            </span>
                            <Clients
                                clients={clients}
                                dataBlockId={''}
                                extraClassNames="!absolute w-full  [&_.client-hexagon-class]:backdrop-blur-[--glassmorphic-backdrop-blur,4px] [&_.client-hexagon-class]:backdrop-saturate-[--glassmorphic-backdrop-saturate,1.5] [&_.client-hexagon-class]:bg-theme-secondary-darker/10 [&_.client-hexagon-class]:scale-[var(--client-hexagon-scale,1)]"
                            />
                        </div>
                    )}

                    {subTitle && (
                        <div className="relative max-h-[10cqh] w-auto">
                            <span
                                className={classNames(
                                    'inline-block h-full w-full pt-px text-center font-fjalla-one tracking-normal transition-[transform,clip-path,color] [font-size:calc(1cqh*2.5)] [line-height:calc(1cqh*3)]',
                                    cardTransition
                                        ? 'translate-y-[-100%] text-theme-primary-darker duration-0 clip-inset-t-full'
                                        : 'translate-y-0 text-theme-secondary-lighter delay-[calc(var(--ui-animation-menu-transition-duration)*1.5),calc(var(--ui-animation-menu-transition-duration)*2),0ms] duration-500 clip-inset-0',
                                )}
                            >
                                {subTitle}
                            </span>

                            <div
                                className={classNames(
                                    'glassmorphic-backdrop absolute left-[-5%] top-1/2 -z-10 h-full w-[110%] -translate-y-1/2 rounded-sm border text-theme-secondary-lighter transition-[opacity,background-color,backdrop-filter,border-color] [--glassmorphic-backdrop-blur:4px]',
                                    cardTransition
                                        ? 'border-transparent bg-theme-primary opacity-0 delay-0 duration-[calc(var(--ui-animation-menu-transition-duration)/10)] [--glassmorphic-backdrop-saturate:1]'
                                        : 'border-white/5 border-b-black/20 border-t-white/10 bg-theme-primary/40 opacity-100 delay-[calc(var(--ui-animation-menu-transition-duration)/1.25),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2)] duration-[0ms,1000ms,1000ms,1000ms] [--glassmorphic-backdrop-saturate:2]',
                                )}
                            />
                        </div>
                    )}
                </div>
            )}
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

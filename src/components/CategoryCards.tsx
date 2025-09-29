import { cloneElement, CSSProperties, FC, ReactElement, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getCategoryHexagons, calcCSSVariables } from '../lib/shapeFunctions';
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
            <TitleClients post={posts[activeIndexState[0]]!} />
        </>
    );
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

    // const runIrisTransition = useZustand((state) => state.values.runIrisTransition);
    const [parentTransitionCompletedWhenAtFront, setParentTransitionCompletedWhenAtFront] = useState(false);

    const isAtFront = activeIndex === cardIndex;
    const thisButtonIndex = getGridAreaIndex(activeIndex, cardIndex, allButtons.length);

    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = allButtons[thisButtonIndex]!;
        //  runPanelsTransition && isAtFront ? 3 : scale
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: false,
            gutterWidth: 0,
        });
    }, [allButtons, containerSize, thisButtonIndex]);

    useLayoutEffect(() => {
        setParentTransitionCompletedWhenAtFront(false);
    }, [activeIndex]);

    return (
        <button
            className={classNames(
                'transform-hexagon glassmorphic-backdrop pointer-events-none absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,backdrop-filter] delay-[0ms,var(--ui-animation-menu-transition-duration)] duration-[calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*4)] [clip-path:--hexagon-clip-path]',
                parentTransitionCompletedWhenAtFront
                    ? '!scale-x-[calc(var(--hexagon-scale-x)*2.125)] !scale-y-[calc(var(--hexagon-scale-y)*2.125)] [--glassmorphic-backdrop-blur:3px] [--glassmorphic-backdrop-saturate:1.5]'
                    : '[--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1] hover-active:!z-50 hover-active:scale-x-[calc(var(--hexagon-scale-x)*1.35)] hover-active:scale-y-[calc(var(--hexagon-scale-y)*1.35)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    zIndex: (isAtFront ? 20 : 10) - thisButtonIndex,
                } as CSSProperties
            }
            onClick={handleClick}
            onTransitionEnd={isAtFront ? handleTransitionEnd : undefined}
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
                    'absolute left-0 top-0 size-full bg-theme-primary transition-[transform,clip-path,filter] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] peer-hover-active:brightness-150 peer-hover-active:!delay-0',
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
                    'absolute left-0 top-0 size-full bg-white/[0.2] matrix-translate-x-[-0.15] matrix-translate-y-[-0.09] matrix-rotate-0 matrix-scale-[1.029] [clip-path:--hexagon-clip-path-full-stroked]',
                    // isAtFront ? 'opacity-100' : 'opacity-0',
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

    function handleTransitionEnd(ev: React.TransitionEvent) {
        if (ev.target === ev.currentTarget) {
            setParentTransitionCompletedWhenAtFront(true);
        }
    }
};

const TitleClients: FC<{ post: Post }> = ({ post }) => {
    return (
        <>
            <BannerTitle
                title={post.title}
                subTitle={post.subTitle}
                classes=/* tw */ "fixed left-[25cqw] right-[25cqw] top-[3.5cqh] bottom-[18cqh] z-50 transform-gpu flex-col items-center justify-between "
            />
            {/* Clients here somewhere too */}
        </>
    );
};

const BannerTitle: FC<{
    title: string;
    subTitle?: string;
    noClip?: boolean;
    classes?: string;
}> = ({ title, subTitle, classes }) => {
    const [isSwitching, setIsSwitching] = useState(false);
    const [titleText, setTitleText] = useState(title);

    useEffect(() => {
        setIsSwitching(true);

        const timer = setTimeout(() => {
            setIsSwitching(false);
            setTitleText(title);
        }, transitionDuration_MS * 5);

        return () => {
            clearTimeout(timer);
        };
    }, [title]);

    return (
        <div
            className={classNames('flex', classes)}
            style={
                isSwitching
                    ? ({
                          //   '--ui-animation-menu-transition-duration': '0ms',
                      } as CSSProperties)
                    : undefined
            }
        >
            <div className="relative h-[12.5cqh] w-auto min-w-[40cqw] max-w-[45cqw]">
                <FitText
                    text={titleText}
                    className={classNames(
                        'h-full w-full text-nowrap pt-px font-fjalla-one leading-none tracking-normal drop-shadow-lg transition-[transform,clip-path,color]',
                        isSwitching
                            ? 'translate-y-[200%] text-theme-primary-darker duration-0 clip-inset-b-full'
                            : 'translate-y-0 text-theme-secondary-lighter delay-[calc(var(--ui-animation-menu-transition-duration)*1),calc(var(--ui-animation-menu-transition-duration)*1.5),0ms] duration-500 clip-inset-0',
                    )}
                />

                <div
                    className={classNames(
                        'bg-theme-primary-darker',
                        // 'glassmorphic-backdrop bg-theme-primary-darker/10 [--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:0.5]',
                        'absolute left-[-5%] top-1/2 -z-10 h-[50%] w-[110%] rounded-sm shadow-lg transition-[transform]',
                        isSwitching
                            ? 'translate-y-1/2 scale-x-75 scale-y-0 text-theme-primary-darker delay-0 duration-150'
                            : '-translate-y-1/2 scale-100 text-theme-secondary-lighter duration-[calc(var(--ui-animation-menu-transition-duration)*1.5)]',
                    )}
                />
            </div>

            {subTitle && (
                <FitText
                    text={subTitle}
                    className={classNames(
                        'glassmorphic-backdrop h-auto max-h-[30cqh] w-auto max-w-[50cqw] rounded-bl-lg rounded-tr-lg border border-white/5 bg-theme-root-background/30 px-[2%] pb-[0.5%] pt-[1%] font-fjalla-one leading-none text-theme-primary-lighter transition-[transform,clip-path] duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*1.5)] [--glassmorphic-backdrop-blur:12px] [--glassmorphic-backdrop-saturate:1.25]',
                        isSwitching ? 'translate-x-[25%] clip-inset-r-[105%]' : 'translate-x-0 delay-200 clip-inset-[-15%]',
                    )}
                />
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

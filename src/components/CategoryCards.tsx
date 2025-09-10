import { CSSProperties, FC, useContext, useEffect, useMemo, useState } from 'react';
import { getCategoryHexagons, calcCSSVariables, widerRoundedHexagonPath } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonTransformData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { config } from '../types/exportTyped';
import { useNavigate } from 'react-router-dom';
import FitText from './utilityComponents/FitText';

const CategoryCards: FC<{ posts: Post[]; activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>] }> = ({ posts, activeIndexState }) => {
    const containerSize = useContext(GetChildSizeContext);
    const categoryHexagons_Memo = useMemo(() => getCategoryHexagons(posts.length), [posts.length]);

    return (
        <>
            {posts.map((post, idx) => (
                <CategoryHexagons
                    key={`hex-post-card-index-${idx}`}
                    allButtons={categoryHexagons_Memo}
                    post={post}
                    containerSize={containerSize}
                    cardIndex={idx}
                    activeIndexState={activeIndexState}
                />
            ))}

            {/* <BannerTitle
                title={title}
                subTitle={subTitle}
            /> */}
        </>
    );
};

export default CategoryCards;

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const CategoryHexagons: FC<{
    allButtons: HexagonTransformData[];
    post: Post;
    containerSize: {
        width: number;
        height: number;
    };
    cardIndex: number;
    activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ allButtons, post, containerSize, cardIndex, activeIndexState }) => {
    const hamburgerMenuIsActive = useZustand((store) => store.values.hamburgerIsOpen);

    const [activeIndex, setActiveIndex] = activeIndexState;
    const thisButtonIndex = getGridAreaIndex(activeIndex, cardIndex, allButtons.length);

    const { position, rotation, scale } = allButtons[thisButtonIndex]!;
    const { title, subTitle, cardImage } = post;

    const isAtFront = activeIndex === cardIndex;

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, rotation, scale, containerSize, {
                strokeWidth: 0,
            }),
        [position, rotation, scale, containerSize],
    );

    const navigate = useNavigate();
    function handleClick() {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            setActiveIndex(cardIndex);
        }
    }

    // Triggered once transitions on parent element are finished
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(false);
    }, [activeIndex]);

    return (
        <button
            className={classNames(
                // Provides "Stroke" by adding :before element below, clipping, and with bg-color
                'before:pointer-events-auto before:absolute before:left-0 before:top-0 before:size-full before:transition-[background-color] before:duration-[--ui-animation-menu-transition-duration] before:[clip-path:--hexagon-clip-path]',
                'transform-hexagon group absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,filter] duration-[--ui-animation-menu-transition-duration] hover-active:duration-100',
                hamburgerMenuIsActive
                    ? isAtFront
                        ? '!translate-x-[calc(var(--hexagon-translate-x)*0.725)] !translate-y-[calc(var(--hexagon-translate-y)*1.425)] !scale-x-[calc(var(--hexagon-scale-x)*0.75)] !scale-y-[calc(var(--hexagon-scale-y)*0.75)]'
                        : '!translate-y-[calc(var(--hexagon-translate-y)*1)]'
                    : '',
                isAtFront
                    ? 'before:bg-theme-secondary'
                    : 'before:bg-theme-primary-darker hover-active:!z-50 hover-active:scale-[calc(var(--hexagon-scale-x)*1.35)]',
                isAtFront && isLoaded ? '!translate-x-[calc(var(--hexagon-translate-x)*0.615)]' : '',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    zIndex: 20 - thisButtonIndex,
                } as CSSProperties
            }
            onClick={handleClick}
            onTransitionEnd={({ target, currentTarget }) => target === currentTarget && setIsLoaded(true)}
        >
            {isAtFront && (
                <>
                    <div
                        className={classNames(
                            'glassmorphic-backdrop-filter-before before:transition-[backdrop-filter] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)] before:group-hover-active:!backdrop-saturate-200 before:group-hover-active:duration-100 before:group-hover-active:![--glassmorphic-backdrop-blur:3px]',
                            'lighting-gradient pointer-events-auto absolute left-0 top-0 -z-10 h-full w-[160%] !from-black/15 from-40% !to-white/15 to-60% transition-[background-color,clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] [clip-path:--hexagon-animated-clip-path] group-hover-active:duration-100',
                            isLoaded ? 'bg-theme-secondary/15 ![--glassmorphic-backdrop-blur:2px]' : 'bg-theme-secondary/5 ![--glassmorphic-backdrop-blur:0px]',
                            hamburgerMenuIsActive ? '!from-black/5 !to-white/5' : '',
                        )}
                        style={
                            {
                                '--hexagon-animated-clip-path': isLoaded ? `path("${widerRoundedHexagonPath}")` : 'var(--hexagon-clip-path)',
                            } as CSSProperties
                        }
                    ></div>

                    <div className="absolute flex size-full flex-col items-end justify-around">
                        <div
                            className={classNames(
                                'glassmorphic-backdrop-filter-before before:left-[-10%] before:top-[2px] before:-z-10 before:h-[85%] before:w-[120%] before:skew-x-[30deg] before:rounded-sm before:bg-theme-secondary/20 before:![--glassmorphic-backdrop-blur:1px]',
                                'max-w-[40%] px-px text-left font-fjalla-one leading-[1.1] text-theme-primary-lighter transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/2)] duration-[--ui-animation-menu-transition-duration] [font-size:calc(1.4px*var(--hexagon-scale-x))] [text-shadow:0px_0.6px_theme(colors.theme.secondary-darker)]',
                                isLoaded ? 'translate-x-full' : '-translate-x-full',
                            )}
                        >
                            {title}
                        </div>

                        <div
                            className={classNames(
                                'glassmorphic-backdrop-filter-before before:left-[-10%] before:top-[2px] before:-z-10 before:h-[85%] before:w-[120%] before:skew-x-[-30deg] before:rounded-sm before:bg-theme-secondary/20 before:![--glassmorphic-backdrop-blur:1px]',
                                'max-w-[40%] text-pretty px-px pl-1 text-left font-fjalla-one text-[0.275rem] leading-snug text-theme-primary-lighter transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/2)] duration-[--ui-animation-menu-transition-duration]',
                                isLoaded ? 'translate-x-full' : '-translate-x-full',
                            )}
                        >
                            {subTitle}
                        </div>
                    </div>
                </>
            )}

            {/* Card Image, parent again fakes a stroke */}
            <div
                className={classNames(
                    'relative size-full transform-gpu transition-[transform,filter,opacity] duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path]',
                    isAtFront
                        ? 'scale-[0.975] cursor-pointer brightness-100 grayscale-0'
                        : 'scale-[0.925] cursor-zoom-in brightness-75 grayscale group-hover-active:brightness-100 group-hover-active:grayscale-0',
                    hamburgerMenuIsActive ? 'opacity-50 blur-[1px] saturate-[0.25]' : '',
                )}
            >
                <img
                    src={cardImage}
                    alt={title}
                    className={classNames(
                        'absolute transform-gpu object-cover transition-transform duration-[--ui-animation-menu-transition-duration]',
                        isAtFront ? 'left-0 top-0 size-full rotate-0' : 'top-[-10%] size-[120%] rotate-[-30deg]',
                    )}
                />
            </div>
        </button>
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

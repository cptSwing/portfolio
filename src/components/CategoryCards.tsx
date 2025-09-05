import { CSSProperties, FC, useContext, useEffect, useMemo, useState } from 'react';
import { calcCSSVariables, degToRad, postCardHexagons, widerRoundedHexagonPath } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonRouteData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';
import { useNavigate } from 'react-router-dom';
import FitText from './utilityComponents/FitText';

const { clipPathWidth, clipPathHeight } = config.ui.hexMenu;

const numExtraHexagons = 9;
const _tan60 = Math.tan(degToRad(60));

const CategoryCards: FC<{ posts: Post[]; activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>] }> = ({ posts, activeIndexState }) => {
    const containerSize = useContext(GetChildSizeContext);
    const routeName = useZustand((store) => store.values.routeData.name);
    const [activeIndex] = activeIndexState;

    const postCards_Memo = useMemo(() => {
        if (posts.length > 1 && postCardHexagons[0]) {
            const { position, scale } = postCardHexagons[0][routeName];

            const newPostCards = [postCardHexagons[0]];
            const extraHexagons = posts.length - 1;
            const extraHexagonScale = scale / Math.max(extraHexagons, 12);

            const activeHexagonWidthInViewBox = clipPathWidth * scale;
            const activeHexagonHeightInViewBox = clipPathHeight * scale;

            const activeHexagonThreeQuarterWidth = activeHexagonWidthInViewBox * 0.75;
            const activeHexagonHalfWidth = activeHexagonWidthInViewBox / 2;
            const activeHexagonQuarterWidth = activeHexagonWidthInViewBox / 4;
            const activeHexagonHalfHeight = activeHexagonHeightInViewBox / 2;

            const inactiveHexagonWidth = clipPathWidth * extraHexagonScale;
            const inactiveHexagonHeight = clipPathHeight * extraHexagonScale;

            const inactiveHexagonHeightOffset = Math.min(inactiveHexagonHeight, (activeHexagonHalfHeight - inactiveHexagonHeight) / extraHexagons);
            const inactiveHexagonWidthOffset =
                Math.min(inactiveHexagonWidth, (activeHexagonThreeQuarterWidth - inactiveHexagonWidth) / extraHexagons) + inactiveHexagonWidth / 8;

            for (let i = 1; i < posts.length; i++) {
                // const additionalHexagonStartingPositionY = 5 + inactiveHexagonHeightOffset * (i - 1);
                // const additionalHexagonStartingPositionX =
                //     additionalHexagonStartingPositionY / -tan60 + position.x - activeHexagonQuarterWidth - inactiveHexagonWidth;

                const centered = extraHexagons % 2 === 0 ? extraHexagons / 4 : Math.floor(extraHexagons / 2);
                const additionalHexagonStartingPositionX = inactiveHexagonWidthOffset * (i - 1) + (150 - centered * inactiveHexagonWidthOffset);

                newPostCards.push({
                    [ROUTE.home]: {
                        position: {
                            x: 275,
                            y: 186.6,
                        },
                        rotation: 60,
                        isHalf: false,
                        scale: 0,
                        shouldOffset: false,
                    },
                    [ROUTE.category]: {
                        // position: {
                        //     x: additionalHexagonStartingPositionX,
                        //     y: additionalHexagonStartingPositionY,
                        // },
                        position: {
                            x: additionalHexagonStartingPositionX,
                            y: 200,
                        },
                        rotation: 0,
                        isHalf: false,
                        scale: extraHexagonScale,
                        shouldOffset: false,
                    },
                    [ROUTE.post]: {
                        position: {
                            x: 75,
                            y: 173.2,
                        },
                        rotation: 0,
                        isHalf: false,
                        scale: 0,
                        shouldOffset: false,
                    },
                });
            }

            return newPostCards;
        }

        return postCardHexagons;
    }, [posts.length, routeName]);

    return (
        <>
            {posts.map((post, idx, arr) => {
                const shapeIndex = getGridAreaIndex(activeIndex, idx, arr.length);
                // setTitle(post.title);

                return postCards_Memo[idx] ? (
                    <PostHexagonDiv
                        key={`hex-post-card-index-${idx}`}
                        shapeData={postCards_Memo[shapeIndex]!}
                        post={post}
                        containerSize={containerSize}
                        cardIndex={idx}
                        activeIndexState={activeIndexState}
                        shapeIndex={shapeIndex}
                    />
                ) : null;
            })}

            {/* <BannerTitle
                title={title}
                subTitle={subTitle}
                classes="absolute left-[30%] ![--glassmorphic-backdrop-blur:8px]  glassmorphic drop-shadow-lg   top-[20%] px-2 rounded-lg z-50"
            /> */}
        </>
    );
};

export default CategoryCards;

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

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

const PostHexagonDiv: FC<{
    shapeData: HexagonRouteData;
    post: Post;
    containerSize: {
        width: number;
        height: number;
    };
    cardIndex: number;
    activeIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
    shapeIndex: number;
}> = ({ shapeData, post, containerSize, cardIndex, activeIndexState, shapeIndex }) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = activeIndexState;

    const { position, rotation, scale } = shapeData[routeName];
    const { id, title, subTitle, cardImage } = post;

    const isActive = activeIndex === cardIndex;

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, rotation, scale, containerSize, {
                strokeWidth: 0,
            }),
        [position, rotation, scale, containerSize],
    );

    const [zIndex, setZIndex] = useState(20 - shapeIndex);
    useEffect(() => {
        setZIndex(20 - shapeIndex);
    }, [shapeIndex]);

    function handleClick() {
        if (isActive) {
            navigate(post.id.toString());
        } else {
            setActiveIndex(cardIndex);
        }
    }

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(false);
    }, [activeIndex]);

    return (
        <button
            className={classNames(
                'before:pointer-events-auto before:absolute before:left-0 before:top-0 before:size-full before:transition-[background-color] before:duration-[--ui-animation-menu-transition-duration] before:[clip-path:--hexagon-clip-path] before:hover-active:bg-theme-secondary before:hover-active:duration-75',
                'transform-hexagon group absolute aspect-hex-flat w-[--hexagon-clip-path-width] transform-gpu transition-[transform,filter] duration-[--ui-animation-menu-transition-duration] [transform-style:preserve-3d]',
                isActive ? 'before:bg-theme-secondary/50' : 'before:bg-gray-800 hover-active:!z-50 hover-active:[--tw-translate-z:3vw]',
                isActive && isLoaded ? '!translate-x-[calc(var(--hexagon-translate-x)*0.63)]' : '',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    zIndex,
                } as CSSProperties
            }
            onClick={handleClick}
            onTransitionEnd={({ target, currentTarget }) => target === currentTarget && setIsLoaded(true)}
        >
            {isActive && (
                <div
                    className={classNames(
                        'glassmorphic pointer-events-auto absolute left-0 top-0 -z-50 h-full w-[160%] !from-black/15 from-40% !to-white/15 to-60% transition-[background-color,clip-path,backdrop-filter] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] [clip-path:--hexagon-animated-clip-path] group-hover-active:duration-75 group-hover-active:![--glassmorphic-backdrop-blur:3px]',
                        isLoaded ? 'bg-theme-secondary/15 ![--glassmorphic-backdrop-blur:2px]' : 'bg-theme-secondary ![--glassmorphic-backdrop-blur:0px]',
                    )}
                    style={{
                        '--hexagon-animated-clip-path': isLoaded ? `path("${widerRoundedHexagonPath}")` : 'var(--hexagon-clip-path)',
                    }}
                >
                    <div className={classNames('absolute left-[60%] flex h-full w-1/4 flex-col items-start justify-center gap-y-[40%] font-fjalla-one')}>
                        <div
                            className={classNames(
                                'text-pretty text-left text-[calc(1.4px*var(--hexagon-scale-x))] leading-relaxed text-theme-primary-lighter transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/2)] duration-[--ui-animation-menu-transition-duration]',
                                isLoaded ? 'translate-x-0 skew-x-0' : 'translate-x-[-150%] skew-x-[30deg]',
                            )}
                        >
                            {title}
                        </div>
                        <div
                            className={classNames(
                                'text-pretty text-left text-[calc(0.75px*var(--hexagon-scale-x))] leading-relaxed text-theme-secondary-lighter/50 transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/1.25)] duration-[--ui-animation-menu-transition-duration]',
                                isLoaded ? 'translate-x-0 skew-x-0' : 'translate-x-[-150%] skew-x-[-30deg]',
                            )}
                        >
                            {subTitle}
                        </div>
                    </div>
                </div>
            )}

            <div
                className={classNames(
                    'size-full transform-gpu bg-cover object-cover transition-[transform,filter] duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path]',
                    isActive
                        ? 'scale-[0.98] cursor-pointer brightness-100 grayscale-0'
                        : 'scale-[0.95] cursor-zoom-in brightness-75 grayscale group-hover-active:brightness-100 group-hover-active:grayscale-0',
                )}
                style={{ backgroundImage: `url(${cardImage})` }}
            />
        </button>
    );
};

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

function getPostHexagonStyles(index: number, count: number) {
    const style = {
        zIndex: count - index,
    };

    switch (index) {
        case 0:
            return {
                ...style,
            };
            break;

        default:
            break;
    }
}

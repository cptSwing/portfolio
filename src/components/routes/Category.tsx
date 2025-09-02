import { Category as Category_T } from '../../types/types';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { classNames, generateRange, remapRange } from 'cpts-javascript-utilities';
import { Flipper } from 'react-flip-toolkit';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import { Post } from '../../types/types.ts';

import CategoryCard from '../CategoryCard.tsx';
import useMountTransition from '../../hooks/useMountTransition.ts';
import { config } from '../../types/exportTyped.ts';
import FitText from '../utilityComponents/FitText.tsx';
import FlippedBrand from '../Brand.tsx';
import { useNavigate } from 'react-router-dom';
import { usePreviousPersistent } from '../../hooks/usePrevious.ts';

const store_setDebugValues = useZustand.getState().methods.store_setDebugValues;

const Category: FC<{ show: boolean }> = ({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, '!clip-inset-x-[-50%]');

    const flipIndexState = useState(0);
    const [flipIndex, setFlipIndex] = flipIndexState;

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();

    useEffect(() => {
        if (wheelDirection !== null) {
            setFlipIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
        }
    }, [category.posts.length, wheelDirection, setFlipIndex, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    const gridAreaStylesAndPaths_ref = useRef<{ style: CSSProperties; path: string }[]>([]);

    const [title, setTitle] = useState('jens Brandenburg');

    return (
        <Flipper className="contents" flipKey={isMounted} spring={{ stiffness: 500, damping: 300 }}>
            {isMounted ? (
                <div
                    ref={categoryRef}
                    className={classNames(
                        'absolute flex h-full w-[86.66%] flex-row flex-wrap items-center justify-center py-[8%] pl-[2.5%] transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-x-[50%] sm:size-full sm:flex-col sm:p-0', //
                        show ? 'delay-[calc(var(--ui-animation-menu-transition-duration)/2)]' : 'delay-0',
                    )}
                >
                    {/* Info */}
                    <BannerTitle title={title} classes="h-[3%] ml-[17%] self-start sm:h-[7.5%] flex-shrink-0 flex-grow sm:basis-auto basis-full" />

                    <nav className="pointer-events-none flex items-center justify-center sm:h-[85%] sm:w-[90%]">
                        <Carousel posts={category.posts} flipIndexState={flipIndexState} direction={wheelDirection} />

                        <FlippedBrand />
                    </nav>

                    {/* Progress Bar */}
                    <div className="flex h-[97%] w-full flex-shrink-0 flex-grow basis-[7.5%] flex-col items-center justify-between gap-y-[2%] sm:h-[7.5%] sm:w-[80%] sm:basis-auto sm:flex-row sm:gap-x-[2%] sm:gap-y-0">
                        {category.posts.map((post, idx) => {
                            return (
                                <button key={`${post.id}_${idx}`} className="group size-full" onClick={() => setFlipIndex(idx)}>
                                    <div
                                        className={classNames(
                                            'mx-auto h-full w-1/4 border-l border-t-[3px] border-theme-root-background transition-[background-color] duration-300 sm:h-1/3 sm:w-auto md:h-1/4 lg:h-1/5 xl:h-1/6',
                                            idx === flipIndex
                                                ? 'bg-theme-primary-lighter'
                                                : 'bg-black/15 group-hover-active:bg-theme-primary/50 group-hover-active:duration-75',
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Debug! */}
                    {<DebugWrapper category={category} flipIndex={flipIndex} setIndex={setFlipIndex} />}
                </div>
            ) : (
                <FlippedBrand />
            )}
        </Flipper>
    );
};

export default Category;

const Carousel: FC<{ posts: Post[]; flipIndexState: [number, React.Dispatch<React.SetStateAction<number>>]; direction: 'down' | 'up' | null }> = ({
    posts,
    flipIndexState,
}) => {
    const [flipIndex] = flipIndexState;
    const prevFlipIndex = usePreviousPersistent(flipIndex);

    const cellCount = posts.length;
    const cellSize = 400;
    const radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));

    const [rotation, setRotation] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (prevFlipIndex !== null && prevFlipIndex !== flipIndex) {
            setRotation((oldRotation) => {
                const directionDistance = getDirection(prevFlipIndex, flipIndex, cellCount);

                if (directionDistance) {
                    const [direction, distance] = directionDistance;
                    setDistance(distance);
                    const theta = 360 / cellCount;

                    return oldRotation + (direction === 'down' ? -distance : distance) * theta;
                } else {
                    return oldRotation;
                }
            });
        }
    }, [flipIndex, prevFlipIndex, cellCount]);

    return (
        <div
            className="relative mx-auto aspect-hex-flat [perspective:500px]"
            style={
                {
                    width: cellSize + 'px',
                } as CSSProperties
            }
        >
            <div
                className="absolute size-full transition-transform [transform-style:preserve-3d]"
                style={
                    {
                        '--carousel-rotation': `${rotation}deg`,
                        '--carousel-radius': radius + 'px',
                        '--carousel-card-percentage': 1 / Math.ceil(posts.length / 2),
                        'transitionDuration': `calc(var(--ui-animation-menu-transition-duration) + ${distance} * 50ms)`,
                        'transform': 'translateZ(calc(var(--carousel-radius) * -1)) rotateY(var(--carousel-rotation)) ',
                    } as CSSProperties
                }
            >
                {posts.map((post, idx, arr) => (
                    <CatCard key={post.id} post={post} cardIndex={idx} cardCount={arr.length} flipIndexState={flipIndexState} />
                ))}
            </div>
        </div>
    );
};

const CatCard: FC<{
    post: Post;
    cardIndex: number;
    cardCount: number;
    flipIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
}> = ({ post, cardIndex, cardCount, flipIndexState }) => {
    const { id, title, subTitle, cardImage } = post;
    const navigate = useNavigate();
    const [flipIndex, setFlipIndex] = flipIndexState;
    const cardAngle = (360 / cardCount) * cardIndex;

    const carouselIndex = getCarouselIndex(flipIndex, cardIndex, cardCount);

    function handleClick() {
        if (carouselIndex === 0) {
            navigate(post.id.toString());
        } else {
            setFlipIndex(cardIndex);
        }
    }

    return (
        <button
            className={classNames(
                'glassmorphic pointer-events-auto absolute flex size-full items-center justify-center rounded-md p-4 transition-[transform,--carousel-card-opacity] delay-[150ms,0ms] duration-[--ui-animation-menu-transition-duration] [background-color:rgb(var(--theme-primary)/var(--carousel-card-opacity))] [transform-style:preserve-3d]',
                carouselIndex === 0 ? 'cursor-pointer' : 'cursor-zoom-in',
            )}
            style={
                {
                    'zIndex': cardCount - Math.abs(carouselIndex),
                    '--carousel-card-opacity': `calc(${Math.abs(carouselIndex)} * var(--carousel-card-percentage))`,
                    'transform': `rotateY(${cardAngle}deg) translateZ(var(--carousel-radius)) rotateY(calc(${-cardAngle}deg - var(--carousel-rotation))) translateY(calc(${carouselIndex * 100}% * var(--carousel-card-percentage))) scaleX(calc(1 - var(--carousel-card-opacity))) scaleY(calc(1 - var(--carousel-card-opacity)))`,
                } as CSSProperties
            }
            onClick={handleClick}
        >
            <div className="mx-auto h-3/4 w-1/4 bg-gray-700 text-sm text-theme-text-background">
                <span className="block">{title}</span>
                <span className="block">{subTitle}</span>

                <span className="mt-12 block">cardIndex: {cardIndex}</span>
                <span className="block">carouselIndex: {carouselIndex}</span>

                <span className="mt-[10%] block">flipIndex: {flipIndex}</span>
                <span className="block">cardCount: {cardCount}</span>
            </div>
            <img src={cardImage} alt={title} className="size-3/4 object-cover" />
        </button>
    );
};

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const BannerTitle: FC<{
    title: string;
    classes?: string;
}> = ({ title, classes }) => {
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
                'flex transform-gpu items-center justify-center bg-theme-primary-darker/0 transition-[transform,opacity]',
                isSwitching ? 'translate-y-[250%] opacity-0' : 'translate-y-[22.5%] opacity-100',
                classes,
            )}
            style={
                {
                    transitionDuration: isSwitching ? '0ms' : 'calc(var(--ui-animation-menu-transition-duration) / 2)',
                } as CSSProperties
            }
        >
            <FitText text={title} className="h-full text-nowrap font-fjalla-one leading-none text-theme-primary-darker sm:h-1/2" />
        </div>
    );
};

const DebugWrapper: FC<{
    category: Category_T;
    flipIndex: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ category, flipIndex, setIndex }) => {
    useDebugButton(`array.length: ${category.posts.length} flipIndex: ${flipIndex}`, (ev) => {
        switch (ev.button) {
            case 2:
                setIndex((previous) => loopFlipValues(previous, category.posts.length, 'up'));
                break;
            default:
                setIndex((previous) => loopFlipValues(previous, category.posts.length, 'down'));
                break;
        }
    });

    const applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);
    useDebugButton(`Toggle Transform Matrix Fix (${applyTransformMatrixFix})`, () =>
        store_setDebugValues({ applyTransformMatrixFix: !applyTransformMatrixFix }),
    );

    return <></>;
};

/* Local functions */

const loopFlipValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        const nextValue = value + 1;
        return nextValue >= max ? 0 : nextValue;
    } else {
        const previousValue = value - 1;
        return previousValue < 0 ? max - 1 : previousValue;
    }
};

function remapIndex(i: number, count: number) {
    const half = Math.ceil(count / 2);
    if (i < half) {
        return i;
    } else {
        return -(count - i);
    }
}

/** Match the flipIndex to the correct style preset */
function getCarouselIndex(flipIndex: number, cardIndex: number, cardCount: number) {
    // ie flipIndex === cardIndex
    let carouselIndex = 0;

    if (flipIndex > cardIndex) {
        carouselIndex = cardCount + (cardIndex - flipIndex);
    } else if (flipIndex < cardIndex) {
        carouselIndex = cardIndex - flipIndex;
    }

    return remapIndex(carouselIndex, cardCount);
}

function _getFlipIndexFromRotation(rotation: number, cellCount: number) {
    const theta = 360 / cellCount;
    return Math.abs(rotation / theta) % cellCount;
}

function getDirection(previousIndex: number, nextIndex: number, length: number): ['up' | 'down', number] {
    const forwardDistance = (nextIndex - previousIndex + length) % length;
    const backwardDistance = (previousIndex - nextIndex + length) % length;

    const direction = forwardDistance <= length / 2 ? 'down' : 'up';
    const distance = direction === 'down' ? forwardDistance : backwardDistance;
    return [direction, distance];
}

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

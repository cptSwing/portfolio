import { Category as Category_T } from '../../types/types';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
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

const store_setDebugValues = useZustand.getState().methods.store_setDebugValues;

const Category: FC<{ show: boolean }> = ({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, '!clip-inset-x-[-50%]');

    const [flipIndex, setFlipIndex] = useState(0);

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();

    useEffect(() => {
        if (wheelDirection !== null) {
            setFlipIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
        }
    }, [category.posts.length, wheelDirection, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

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

                    {/* <nav className="sm:post-cards-grid-template-desktop post-cards-grid-template-mobile h-[97%] flex-shrink-0 flex-grow basis-[92.5%] origin-center transform gap-x-[2%] gap-y-[1.5%] sm:h-[85%] sm:w-[90%] sm:basis-auto sm:gap-x-[2.5%] sm:gap-y-[3%] 2xl:gap-x-[2.1%]">
                        <Flipper className="contents" flipKey={flipIndex} spring={{ stiffness: 700, damping: 100 }}>
                            {category.posts.map((post, idx, arr) => (
                                <CategoryCard
                                    key={post.id}
                                    post={post}
                                    flipIndex={flipIndex}
                                    cardIndex={idx}
                                    cardCount={arr.length}
                                    gridAreaStylesAndPaths={gridAreaStylesAndPaths_ref}
                                    setFlipIndex={setFlipIndex}
                                    setTitle={setTitle}
                                />
                            ))}
                        </Flipper>

                        <FlippedBrand />
                    </nav> */}

                    <Carousel posts={category.posts} />

                    {/* <div className="flex items-center sm:h-[85%] sm:w-[90%]">
                        <LookDevCard index={0} post={category.posts[0]} width={0.5} height={0.75} />
                        <LookDevCard index={1} post={category.posts[1]} />
                        <LookDevCard index={2} post={category.posts[2]} width={0.5} height={0.75} />
                    </div> */}

                    {/* <FlippedBrand /> */}

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

const Carousel: FC<{ posts: Post[] }> = ({ posts }) => {
    const [rotation, setRotation] = useState(0);

    const cellCount = posts.length;
    const theta = 360 / cellCount;
    const cellSize = 600;
    const radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));

    function handleClick(direction: 'previous' | 'next') {
        switch (direction) {
            case 'previous':
                setRotation((state) => state + theta);
                break;
            case 'next':
                setRotation((state) => state - theta);
                break;
        }
    }

    return (
        <div className="pointer-events-auto flex items-center justify-center overflow-visible sm:h-[85%] sm:w-[90%]">
            <button className="pointer-events-auto z-10 cursor-pointer rounded-md bg-red-500 p-2" onClick={() => handleClick('previous')}>
                previous
            </button>

            <div
                className="relative mx-auto aspect-hex-flat w-[--category-card-width] [perspective:250px]"
                style={
                    {
                        '--category-card-width': cellSize + 'px',
                    } as CSSProperties
                }
            >
                <div
                    className="transform-3d backface-hidden absolute size-full transition-transform duration-[--ui-animation-menu-transition-duration] [transform-style:preserve-3d]"
                    style={
                        {
                            '--tw-translate-z': -radius + 'px',
                            '--tw-rotate-y': rotation + 'deg',
                        } as CSSProperties
                    }
                >
                    {posts.map(({ id, title, subTitle, cardImage }, idx, arr) => {
                        const cellAngle = theta * idx;
                        return (
                            <div
                                key={id}
                                className="glassmorphic backface-hidden absolute size-full rounded-md bg-gray-400/10 transition-transform duration-[--ui-animation-menu-transition-duration] [transform-style:preserve-3d]"
                                style={{
                                    zIndex: arr.length - idx,
                                    transform: `rotateY(${cellAngle}deg) translateZ(${radius}px) rotateY(${-cellAngle - rotation}deg)`,
                                }}
                            >
                                {idx} {title}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="pointer-events-auto z-10 cursor-pointer rounded-md bg-red-500 p-2" onClick={() => handleClick('next')}>
                next
            </button>
        </div>
    );
};

const LookDevCard: FC<{ post?: Post; index: number; width?: number; height?: number }> = ({ post, index, width = 1, height = 1 }) => {
    const { id, title, cardImage, subTitle } = post ?? {};

    return (
        <div
            className="glassmorphic absolute aspect-video w-full transform rounded-xl"
            style={
                {
                    '--tw-scale-x': width,
                    '--tw-scale-y': height,
                    '--tw-translate-x': index > 1 ? '10%' : index < 1 ? '-10%' : '0',
                } as CSSProperties
            }
        ></div>
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

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

import { Category as Category_T } from '../../types/types';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import classNames from '../../lib/classNames';
import { Flipper } from 'react-flip-toolkit';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import CategoryCard from '../CategoryCard.tsx';
import useMountTransition from '../../hooks/useMountTransition.ts';
import { config } from '../../types/exportTyped.ts';

const store_setDebugValues = useZustand.getState().methods.store_setDebugValues;

const Category: FC<{ show: boolean }> = ({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, '!clip-inset-x-0');

    const [flipIndex, setFlipIndex] = useState(0);

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();
    useEffect(() => {
        if (wheelDirection !== null) {
            setFlipIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
        }
    }, [category.posts.length, wheelDirection, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    const gridAreaStylesAndPaths_ref = useRef<{ style: CSSProperties; path: string }[]>([]);

    const [title, setTitle] = useState('jens Brandenburg');

    return isMounted ? (
        <div
            ref={categoryRef}
            className={classNames(
                'flex h-full w-full flex-col items-center justify-center bg-theme-primary/10 px-[0%] py-[0%] transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-x-[50%] mask-edges-y-[7.5%] sm:size-full sm:px-[5%] sm:py-[1%] sm:mask-edges-x-[7.5%] sm:mask-edges-y-0 2xl:px-[3.5%]',
                show ? 'delay-[--ui-animation-menu-transition-duration]' : 'delay-0',
            )}
        >
            {/* Info */}
            <BannerTitle title={title} />

            <Flipper
                element={'nav'}
                className="sm:postcards-grid-template-desktop postcards-grid-template-mobile grid h-[85%] w-[92.5%] origin-center transform grid-cols-[repeat(2,minmax(0,1fr))_0.05fr] grid-rows-[repeat(13,minmax(0,1fr))] gap-x-[2%] gap-y-[1.5%] sm:size-[85%] sm:h-[85%] sm:w-full sm:grid-cols-6 sm:grid-rows-[repeat(7,minmax(0,1fr))_0.1fr] sm:gap-[3%]"
                flipKey={flipIndex}
                spring={{ stiffness: 700, damping: 100 }}
            >
                {/* Animated Grid */}
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

                {/* Progress Bar */}
                <div className="flex w-full flex-col items-center justify-between gap-y-[2%] py-1 [grid-area:track] sm:flex-row sm:gap-x-[2%] sm:gap-y-0 sm:py-0 sm:pl-[7.75%] sm:pr-[4.4%] 2xl:pl-[6.5%] 2xl:pr-[3.5%]">
                    {category.posts.map((post, idx) => {
                        return (
                            <button
                                key={`${post.id}_${idx}`}
                                className={classNames(
                                    'relative h-1/2 w-full flex-1 transition-[background-color] duration-300 sm:h-full',
                                    idx === flipIndex ? 'bg-theme-primary-lighter' : 'bg-black/15 hover-active:bg-theme-primary/50',
                                )}
                                onClick={() => setFlipIndex(idx)}
                            />
                        );
                    })}
                </div>
            </Flipper>

            {/* Brand */}
            <div className="flex flex-1 select-none flex-col items-end justify-center self-end pr-[4.65%] text-theme-primary/30 2xl:pr-[3.65%]">
                <div className="text-nowrap text-right text-2xs sm:text-xs sm:!leading-tight md:text-sm lg:text-base lg:!leading-snug">jens Brandenburg</div>
                <div className="text-nowrap text-right text-3xs md:text-2xs lg:text-xs">webdev & 3d art</div>
            </div>

            {/* Debug! */}
            {<DebugWrapper category={category} flipIndex={flipIndex} setIndex={setFlipIndex} />}
        </div>
    ) : null;
};

export default Category;

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const BannerTitle: FC<{
    title: string;
}> = ({ title }) => {
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        setIsSwitching(true);

        const timer = setTimeout(() => {
            setIsSwitching(false);
        }, transitionDuration_MS / 8);

        return () => {
            clearTimeout(timer);
        };
    }, [title]);

    return (
        <div
            className={classNames(
                'mb-[0.5%] ml-[13%] flex flex-1 transform-gpu flex-col items-start justify-end self-start pr-[10%] transition-[transform,opacity] 2xl:ml-[10%]',
                isSwitching ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
            )}
            style={
                {
                    transitionDuration: `${isSwitching ? 0 : transitionDuration_MS / 2}ms`,
                } as CSSProperties
            }
        >
            <div className="text-nowrap font-fjalla-one text-xs leading-none text-theme-primary-lighter sm:text-sm md:text-base lg:text-xl xl:text-xl 2xl:text-2xl">
                {title}
            </div>
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

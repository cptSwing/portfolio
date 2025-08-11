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
                'flex size-full flex-col items-center justify-center bg-theme-primary/10 px-[0%] py-[0%] transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-x-[50%] mask-edges-x-[7.5%] sm:px-[5%] sm:py-[1%] 2xl:px-[3.5%]',
                show ? 'delay-[--ui-animation-menu-transition-duration]' : 'delay-0',
            )}
        >
            {/* Info */}
            <BannerTitle title={title} />

            <Flipper
                element={'nav'}
                className="postcards-grid-template grid h-[85%] w-full origin-center transform grid-cols-6 grid-rows-[repeat(7,minmax(0,1fr))_0.1fr] gap-[0%] sm:gap-[3%]"
                flipKey={flipIndex}
                spring={{ stiffness: 500, damping: 35 }}
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
                <div className="flex h-2/3 items-center justify-between gap-x-[1.5%] px-[3%] [grid-area:track]">
                    {category.posts.map((post, idx) => {
                        return (
                            <button
                                key={`${post.id}_${idx}`}
                                className={classNames(
                                    'relative h-full flex-1 transition-[background-color] duration-300',
                                    idx === flipIndex ? 'bg-theme-primary-lighter' : 'bg-black/15 hover-active:bg-theme-primary/50',
                                )}
                                onClick={() => setFlipIndex(idx)}
                            />
                        );
                    })}
                </div>
            </Flipper>

            {/* Brand */}
            <div className="flex flex-1 select-none flex-col items-end justify-center self-end px-[3%] text-theme-primary/30">
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
                'ml-[6.75%] flex flex-1 transform-gpu flex-col items-start justify-end self-start pr-[10%] transition-[transform,opacity]',
                isSwitching ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
            )}
            style={
                {
                    transitionDuration: `${isSwitching ? 0 : transitionDuration_MS / 2}ms`,
                } as CSSProperties
            }
        >
            <div className="text-nowrap font-fjalla-one text-2xl leading-none text-theme-secondary-lighter sm:text-sm md:text-base lg:text-lg xl:text-xl">
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

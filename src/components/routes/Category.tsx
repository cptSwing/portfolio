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
import FitText from '../utilityComponents/FitText.tsx';

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

    const gridAreaStylesAndPaths_ref = useRef<{ styleAndIndex: { zIndex: string; style: CSSProperties }; path: string }[]>([]);

    const [title, setTitle] = useState('jens Brandenburg');

    return isMounted ? (
        <div
            ref={categoryRef}
            className={classNames(
                'flex size-full flex-col items-center justify-center bg-theme-primary/10 transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-x-[50%] mask-edges-y-[7.5%] sm:mask-edges-x-[7.5%] sm:mask-edges-y-0',
                show ? 'delay-[--ui-animation-menu-transition-duration]' : 'delay-0',
            )}
        >
            {/* Info */}
            <BannerTitle title={title} classes="h-[7.5%] w-[90%]" />

            <Flipper
                element={'nav'}
                className="sm:post-cards-grid-template-desktop post-cards-grid-template-mobile h-[85%] w-[90%] origin-center transform gap-x-[2%] gap-y-[1.5%] sm:gap-x-[2.5%] sm:gap-y-[3%] 2xl:gap-x-[2.1%]"
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

                {/* Brand */}
                <div className="sm:post-cards-grid-brand-area-desktop relative z-50 flex flex-col items-center justify-center">
                    <div className="select-none rounded-2xl border-4 border-green-500/50 text-theme-primary">
                        <FitText text="jens Brandenburg" classes="h-1/2 mx-auto w-[90%]" />
                        <FitText text="webdev & 3d art" classes="h-1/3 mx-auto w-[90%]" />
                    </div>
                </div>
            </Flipper>

            {/* Progress Bar */}
            <div className="flex h-[7.5%] w-[90%] flex-col items-center justify-between gap-y-[2%] py-1 sm:flex-row sm:gap-x-[2%] sm:gap-y-0 sm:py-0 sm:pl-[7.75%] sm:pr-[4.4%] 2xl:pl-[6.5%] 2xl:pr-[3.5%]">
                {category.posts.map((post, idx) => {
                    return (
                        <button
                            key={`${post.id}_${idx}`}
                            className={classNames(
                                'w-full flex-1 transition-[background-color] duration-300 sm:h-1/3 md:h-1/4 lg:h-1/5 xl:h-1/6',
                                idx === flipIndex ? 'bg-theme-primary-lighter' : 'bg-black/15 hover-active:bg-theme-primary/50',
                            )}
                            onClick={() => setFlipIndex(idx)}
                        />
                    );
                })}
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
    classes?: string;
}> = ({ title, classes }) => {
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
                'flex transform-gpu items-center justify-center transition-[transform,opacity]',
                isSwitching ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
                classes,
            )}
            style={
                {
                    transitionDuration: `${isSwitching ? 0 : transitionDuration_MS / 2}ms`,
                } as CSSProperties
            }
        >
            <FitText text={title} classes="font-fjalla-one text-theme-primary-lighter text-nowrap leading-none h-1/2" />
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

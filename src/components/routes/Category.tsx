import { Category as Category_T, GridAreaPathData } from '../../types/types';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from '../../lib/classNames';
import { Flipper } from 'react-flip-toolkit';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import config from '../../config/config.json';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import remapToRange from '../../lib/remapToRange.ts';
import CategoryCard from '../CategoryCard.tsx';
import { getIndexCategoryCardPath } from '../../lib/hexagonData.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';

const store_setDebugValues = useZustand.getState().methods.store_setDebugValues;
const { cellCount } = config.categoryGrid;
const defaultGridAreaPathData = getIndexCategoryCardPath(-1, 0, 0);

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

const Category: FC<{ show: boolean }> = ({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const shouldMount = useMountTransition(categoryRef, show, '!clip-inset-x-0');

    useEffect(() => {
        console.log('%c[Category]', 'color: #756086', `show :`, show);
    }, [show]);

    useEffect(() => {
        console.log('%c[Category]', 'color: #d2eac6', `shouldMount :`, shouldMount);
    }, [shouldMount]);

    const [flipIndex, setFlipIndex] = useState(0);

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();
    useEffect(() => {
        if (wheelDirection !== null) {
            setFlipIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
        }
    }, [category.posts.length, wheelDirection, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    const gridAreaPathsDataRef = useRef<GridAreaPathData[]>([]);

    const gridAreaStyles_Memo = useMemo(() => {
        const brightnessPercentage = 1 / cellCount;

        const gridStyles = category.posts.map((_, idx, arr) => {
            // NOTE piggybacking off this loop to fill gridAreaPathsDataRef
            console.log('%c[Category]', 'color: #3bf9fb', `piggybacking..`);
            gridAreaPathsDataRef.current[idx] = defaultGridAreaPathData;

            const numGridArea = getGridAreaNumber(idx, cellCount, arr.length);

            const baseStyle = {
                zIndex: Math.max(numGridArea, 0),
            };

            if (numGridArea < 1) {
                const surplusCells = arr.length - cellCount;
                const thisSurplusCell = remapToRange(numGridArea, -surplusCells + 1, 0, surplusCells - 1, 0);
                const r = 2; // ratio

                const total_ratio = (Math.pow(r, surplusCells) - 1) / (r - 1);
                const ratio = Math.pow(r, surplusCells - 1 - thisSurplusCell);
                const widthPercent = (ratio / total_ratio) * 100;

                return {
                    ...baseStyle,
                    'gridArea': 'rest',
                    'position': 'absolute',
                    'width': `${widthPercent * 0.9}%`,
                    'left': `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent + widthPercent * 0.1}%`,
                    '--tw-brightness': `brightness(${brightnessPercentage / 2})`,
                    '--tw-grayscale': `grayscale(${1 - brightnessPercentage / 2})`,
                } as CSSProperties;
            } else {
                return {
                    ...baseStyle,
                    'gridArea': 'area' + numGridArea,
                    '--tw-brightness': `brightness(${numGridArea * brightnessPercentage})`,
                    '--tw-grayscale': `grayscale(${1 - numGridArea * brightnessPercentage})`,
                } as CSSProperties;
            }
        });

        return gridStyles;
    }, [category]);

    const [bannerTitle, setBannerTitle] = useState('jens Brandenburg');

    return shouldMount ? (
        <div
            ref={categoryRef}
            className="relative flex h-[95%] w-full flex-col items-center justify-center bg-theme-primary/10 px-[0%] py-[0%] transition-[clip-path] delay-200 duration-1000 clip-inset-x-[50%] mask-edges-x-[7.5%] sm:px-[8%] sm:py-[1%]"
        >
            {/* Info */}
            <CardTitles bannerTitle={bannerTitle} />

            <Flipper
                element={'nav'}
                className="postcards-grid-template grid w-full basis-[80%] origin-center transform-gpu grid-cols-6 grid-rows-[repeat(7,minmax(0,1fr))_0.1fr] gap-[0%] sm:gap-[3%]"
                flipKey={flipIndex}
                spring={{ stiffness: 600, damping: 40 }}
            >
                {/* Animated Grid */}
                {gridAreaStyles_Memo &&
                    category.posts.map((post, idx, arr) => (
                        <CategoryCard
                            key={post.title + idx}
                            post={post}
                            flipIndex={flipIndex}
                            cardIndex={idx}
                            cardCount={arr.length}
                            gridAreaStyles={gridAreaStyles_Memo}
                            gridAreaPathsData={gridAreaPathsDataRef}
                            setFlipIndex={setFlipIndex}
                            setBannerTitle={setBannerTitle}
                        />
                    ))}

                {/* Progress Bar */}
                <div className="flex items-center justify-between gap-x-[1.5%] px-[3%] [grid-area:track]">
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
            <div className="flex basis-[10%] select-none flex-col items-end justify-center self-end px-[3%] text-theme-primary/30">
                <div className="text-nowrap text-right text-2xs sm:text-xs sm:!leading-tight md:text-sm lg:text-base lg:!leading-snug">jens Brandenburg</div>
                <div className="text-nowrap text-right text-3xs md:text-2xs lg:text-xs">webdev & 3d art</div>
            </div>

            {/* Debug! */}
            {<DebugWrapper category={category} flipIndex={flipIndex} setIndex={setFlipIndex} />}
        </div>
    ) : null;
};

export default Category;

const transitionDuration_MS = 250;

const CardTitles: FC<{
    bannerTitle: string;
}> = ({ bannerTitle }) => {
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        setIsSwitching(true);

        const timer = setTimeout(() => {
            setIsSwitching(false);
        }, transitionDuration_MS / 3);

        return () => {
            clearTimeout(timer);
        };
    }, [bannerTitle]);

    return (
        <div
            className={classNames(
                'ml-[1.5%] flex basis-[10%] transform-gpu flex-col items-start justify-end self-start pr-[10%] transition-[transform,opacity]',
                isSwitching ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
            )}
            style={
                {
                    transitionDuration: `${isSwitching ? 0 : transitionDuration_MS}ms`,
                } as CSSProperties
            }
        >
            <div className="text-nowrap font-fjalla-one text-2xl leading-none text-theme-secondary-lighter sm:text-sm md:text-base lg:text-lg xl:text-xl">
                {bannerTitle}
            </div>
        </div>
    );
};

const loopFlipValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        const nextValue = value + 1;
        return nextValue >= max ? 0 : nextValue;
    } else {
        const previousValue = value - 1;
        return previousValue < 0 ? max - 1 : previousValue;
    }
};

const getGridAreaNumber: (index: number, maxCells: number, arrayLength: number) => number = (index, maxCells, arrayLength) => {
    let numGridArea = maxCells - index;

    if (numGridArea > maxCells) {
        numGridArea = numGridArea - arrayLength;
    }

    return numGridArea;
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

import testDb from '../../queries/testDb.json';
import { useParams } from 'react-router-dom';
import { DataBase, ClipAreaSize } from '../../types/types';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from '../../lib/classNames';
import { Flipper } from 'react-flip-toolkit';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import config from '../../config/config.json';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import remapToRange from '../../lib/remapToRange.ts';
import CategoryCard from '../CategoryCard.tsx';

const testDbTyped = testDb as DataBase;
const categories = Object.values(testDbTyped);
const store_setDebugValues = useZustand.getState().methods.store_setDebugValues;

const { cellCount } = config.categoryGrid;

const Category = () => {
    const { catId } = useParams();
    const [flipIndex, setFlipIndex] = useState(0);

    const categoryData_Memo = useMemo(() => {
        if (catId) {
            const category = categories.find((category) => parseInt(catId) === category.id);
            category && setFlipIndex(0); // reset on category change;
            return category;
        }
    }, [catId]);

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();
    useEffect(() => {
        if (categoryData_Memo && wheelDirection !== null) {
            setFlipIndex((previous) => loopFlipValues(previous, categoryData_Memo.posts.length, wheelDirection));
        }
    }, [categoryData_Memo, wheelDirection, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    const gridAreaStyles_Memo = useMemo(() => {
        if (categoryData_Memo) {
            const brightnessPercentage = 1 / cellCount;

            const gridStyles = categoryData_Memo.posts.map((_, idx, arr) => {
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
        }
    }, [categoryData_Memo]);

    const clipAreaSizes = useRef<ClipAreaSize[]>([]);

    const [infoContent, setInfoContent] = useState({ title: 'jens Brandenburg', subTitle: 'webdev and 3d art' });

    if (!categoryData_Memo) return null;

    return (
        <>
            <Flipper
                element={'nav'}
                className='postcards-grid-template grid size-full origin-center transform grid-cols-6 grid-rows-[0.6fr_repeat(8,minmax(0,1fr))_0.125fr] gap-[0%] overflow-hidden bg-theme-primary/10 px-[0%] py-[0%] transition-[transform,clip-path] delay-200 duration-1000 clip-inset-x-[--clip-category] mask-edges-x-[7.5%] sm:gap-[3%] sm:px-[8%] sm:py-[1%]'
                flipKey={flipIndex}
                spring={{ stiffness: 600, damping: 40 }}
            >
                {/* Info */}
                <CardTitles infoContent={infoContent} />

                {/* Brand */}
                <div className='absolute mb-[2%] size-full select-none text-theme-primary/30 [grid-area:brand]'>
                    <div className='text-nowrap text-right sm:text-sm sm:!leading-tight md:text-base lg:text-lg lg:!leading-snug'>jens Brandenburg</div>
                    <div className='text-nowrap text-right sm:text-2xs md:text-xs lg:text-sm'>webdev & 3d art</div>
                </div>

                {/* Animated Grid */}
                {gridAreaStyles_Memo &&
                    categoryData_Memo.posts.map((post, idx, arr) => (
                        <CategoryCard
                            key={post.title + idx}
                            post={post}
                            flipIndex={flipIndex}
                            cardIndex={idx}
                            cardCount={arr.length}
                            gridAreaStyles={gridAreaStyles_Memo}
                            clipAreaSizes={clipAreaSizes}
                            setFlipIndex={setFlipIndex}
                            setInfoContent={setInfoContent}
                        />
                    ))}

                {/* Progress Bar */}
                <div className='absolute left-[5%] mx-auto flex h-full w-[90%] items-center justify-between gap-x-[1.5%] [grid-area:track]'>
                    {categoryData_Memo.posts.map((post, idx) => {
                        return (
                            <button
                                key={`${post.id}_${idx}`}
                                className={classNames(
                                    'relative mt-[-2%] h-full flex-1 transition-[background-color] duration-300 xl:h-3/4',
                                    idx === flipIndex ? 'bg-theme-primary-lighter' : 'bg-black/15 hover-active:bg-theme-primary/50',
                                )}
                                onClick={() => setFlipIndex(idx)}
                            />
                        );
                    })}
                </div>
            </Flipper>

            {/* Debug! */}
            {<DebugWrapper category={categoryData_Memo} flipIndex={flipIndex} setIndex={setFlipIndex} />}
        </>
    );
};

export default Category;

const transitionDuration_MS = 250;

const CardTitles: FC<{
    infoContent: {
        title: string;
        subTitle: string;
    };
}> = ({ infoContent }) => {
    const { title, subTitle } = infoContent;

    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        setIsSwitching(true);

        const timer = setTimeout(() => {
            setIsSwitching(false);
        }, transitionDuration_MS / 2);

        return () => {
            clearTimeout(timer);
        };
    }, [title, subTitle]);

    return (
        <div
            className={classNames(
                'absolute size-full bg-theme-primary-darker/50 pl-[4.5%] transition-[clip-path] clip-inset-b-[-150%] clip-inset-l-[-100%] [grid-area:info] md:mt-0.5 lg:mt-1 xl:mt-1.5 2xl:mt-2',
                isSwitching ? 'clip-inset-r-[125%]' : 'clip-inset-r-0',
            )}
            style={
                {
                    transitionDuration: `${isSwitching ? 0 : transitionDuration_MS}ms`,
                } as CSSProperties
            }
        >
            <div className='text-nowrap font-fjalla-one text-2xl text-theme-secondary-lighter underline underline-offset-2 sm:text-sm sm:!leading-tight md:text-base lg:text-lg xl:text-xl'>
                {title}
            </div>
            <div className='text-nowrap font-lato text-sm leading-none text-theme-text-background/90 sm:text-2xs md:text-xs lg:text-sm lg:tracking-tight xl:text-sm'>
                {subTitle}
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
    category: (typeof categories)[0];
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

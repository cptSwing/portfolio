import testDb from '../../queries/testDb.json';
import { useParams } from 'react-router-dom';
import SingleCard from '../SingleCard.tsx';
import { DataBase } from '../../types/types';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from '../../lib/classNames';
import { Flipper } from 'react-flip-toolkit';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import config from '../../config/config.json';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import remapToRange from '../../lib/remapToRange.ts';

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
                        'width': `calc(${widthPercent}% - 8px)`,
                        'left': `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent}%`,
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

    const gridAreaSizes = useRef<{ width: number; height: number }[]>([]);

    if (!categoryData_Memo) return null;

    return (
        <>
            <Flipper
                element={'nav'}
                className='postcards-grid-template grid size-full origin-center transform grid-cols-6 grid-rows-[repeat(8,minmax(0,1fr))_1vh] gap-x-[2.5%] gap-y-[5%] overflow-hidden bg-theme-primary/10 px-[8vh] py-[4vh] transition-[transform,clip-path] delay-200 duration-1000 clip-inset-x-[--clip-category] mask-edges-x-[7.5%]'
                flipKey={flipIndex}
                spring={{ stiffness: 600, damping: 40 }}
            >
                {/* Animated Grid */}
                {gridAreaStyles_Memo &&
                    categoryData_Memo.posts.map((post, idx, arr) => (
                        <SingleCard
                            key={post.title + idx}
                            post={post}
                            flipIndex={flipIndex}
                            cardIndex={idx}
                            cardCount={arr.length}
                            gridAreaStyles={gridAreaStyles_Memo}
                            gridAreaSizes={gridAreaSizes}
                            setFlipIndex={setFlipIndex}
                        />
                    ))}

                {/* Progress Bar */}
                <div className='mx-auto flex w-[91.34%] items-center justify-between gap-x-2 [grid-area:tracker]'>
                    {categoryData_Memo.posts.map((post, idx) => {
                        return (
                            <button
                                key={`${post.id}_${idx}`}
                                className={classNames(
                                    'relative h-1.5 flex-1 opacity-100 transition-[background-color,opacity] duration-300',
                                    'before:absolute before:-left-1 before:h-[calc(100%+theme(spacing.2))] before:w-full',
                                    idx === flipIndex
                                        ? 'bg-theme-primary-lighter before:cursor-default'
                                        : 'bg-black/15 before:cursor-pointer hover-active:bg-theme-primary hover-active:opacity-50',
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

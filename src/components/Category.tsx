import testDb from '../queries/testDb.json';
import { useParams } from 'react-router-dom';
import SingleCard from './SingleCard.tsx';
import { DataBase } from '../types/types';
import { FC, useEffect, useMemo, useState } from 'react';
import classNames from '../lib/classNames';
import { Flipper, Flipped } from 'react-flip-toolkit';
import useMouseWheelDirection from '../hooks/useMouseWheelDirection';
import config from '../config/config.json';
import { useZustand } from '../lib/zustand.ts';
import { useDebugButton } from '../hooks/useDebugButton.ts';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);
const store_setPostAnimationStartDimensions = useZustand.getState().methods.store_setPostAnimationStartDimensions;

const { activeCellCount } = config.categoryGrid;

const Category = () => {
    const { catId } = useParams();

    const [cardAnimationIndex, setCardAnimationIndex] = useState(1);

    const categoryData_Memo = useMemo(() => {
        if (catId) {
            const catIdToFloat = parseFloat(catId);
            const category = categoriesArray.find((cat) => catIdToFloat === cat.id);
            return category;
        }
    }, [catId]);

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();

    useEffect(() => {
        if (categoryData_Memo && wheelDirection !== null) {
            setCardAnimationIndex((previous) => loopValues(previous, categoryData_Memo.posts.length, wheelDirection));
        }
    }, [categoryData_Memo, wheelDirection, wheelDistance]);

    return (
        <>
            <Flipper
                element={'nav'}
                className={classNames(
                    'postcards-grid-template relative grid w-full grid-cols-[repeat(6,minmax(0,1fr))_theme(spacing.px)] grid-rows-8 rounded-2xl rounded-tl-none transition-[min-height] duration-500',
                    'bg-[--nav-category-common-color-1]',
                    categoryData_Memo ? 'gap-[calc(var(--category-padding)*2)] p-[--category-padding]' : '',
                )}
                flipKey={cardAnimationIndex}
                spring={{ stiffness: 600, damping: 40 }}
                onComplete={(e) => {
                    [...e.children].find((childElem) => {
                        if ((childElem as HTMLDivElement).style.getPropertyValue('grid-area') === `area${activeCellCount}`) {
                            // Set dimensions once all flip animations have completed
                            store_setPostAnimationStartDimensions(childElem.getBoundingClientRect());
                        }
                    });
                }}
            >
                {/* Animated Grid */}
                {categoryData_Memo &&
                    categoryData_Memo.posts.map((post, idx, arr) => (
                        <SingleCard
                            key={post.title + idx}
                            post={post}
                            arrayIndex={idx}
                            totalCount={arr.length}
                            gridAreaIndex={getGridAreaIndex(cardAnimationIndex, idx, activeCellCount, arr.length)}
                            setToFront={() => setCardAnimationIndex(idx + 1)}
                        />
                    ))}

                {/* Progress Bar */}
                <div className='flex flex-col items-end justify-between gap-y-2 bg-[--nav-category-common-color-1] [grid-area:tracker]'>
                    {categoryData_Memo &&
                        categoryData_Memo.posts.map((post, idx) => {
                            return (
                                <div
                                    key={`${post.id}_${idx}`}
                                    className={classNames(
                                        'relative w-1.5 flex-1 opacity-100 transition-[background-color,opacity] duration-300 first:rounded-tr-md last:rounded-br-md',
                                        'before:absolute before:-left-1 before:h-full before:w-[calc(100%+theme(spacing.2))]',
                                        idx === cardAnimationIndex - 1
                                            ? 'bg-[--color-primary-inactive-cat-bg] before:cursor-default'
                                            : 'bg-black/10 before:cursor-pointer hover-active:bg-[--color-primary-inactive-cat-bg] hover-active:opacity-50',
                                    )}
                                    onClick={() => setCardAnimationIndex(idx + 1)}
                                />
                            );
                        })}
                </div>
            </Flipper>

            {/* Debug! */}
            {categoryData_Memo && <DebugWrapper category={categoryData_Memo} currentIndex={cardAnimationIndex} setIndex={setCardAnimationIndex} />}
        </>
    );
};

export default Category;

const loopValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        return value + 1 > max ? 1 : value + 1;
    } else {
        return value - 1 < 1 ? max : value - 1;
    }
};

const getGridAreaIndex: (viewIndex: number, arrayIndex: number, maxCells: number, arrayLength: number) => number = (
    viewIndex,
    arrayIndex,
    maxCells,
    arrayLength,
) => {
    let area = maxCells - (arrayIndex + 1) + viewIndex;

    if (area > maxCells) {
        area = area - arrayLength;
    }
    return area;
};

const DebugWrapper: FC<{
    category: (typeof categoriesArray)[0];
    currentIndex: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ category, currentIndex, setIndex }) => {
    useDebugButton(`ArrayLength: ${category.posts.length} ViewIndex: ${currentIndex} ArrayIndex: ${currentIndex - 1}`, (ev) => {
        switch (ev.button) {
            case 2:
                setIndex((previous) => loopValues(previous, category.posts.length, 'up'));
                break;
            default:
                setIndex((previous) => loopValues(previous, category.posts.length, 'down'));
                break;
        }
    });

    return <></>;
};

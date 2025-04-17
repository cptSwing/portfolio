import testDb from '../queries/testDb.json';
import { useParams } from 'react-router-dom';
import { SinglePostCard } from './PostCards';
import { DataBase } from '../types/types';
import { LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from '../lib/classNames';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { useMouseWheel } from 'react-use';
import useMouseWheelDirection from '../hooks/useMouseWheelDirection';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const loopValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        return value + 1 > max ? 1 : value + 1;
    } else {
        return value - 1 < 1 ? max : value - 1;
    }
};

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
                flipKey={cardAnimationIndex}
                spring={'stiff'}
                staggerConfig={{
                    default: {
                        speed: 0.0001,
                    },
                }}
                element={'main'}
                className={classNames(
                    '',
                    'postcards-grid-template relative grid w-full transform-gpu grid-cols-[repeat(6,minmax(0,1fr))_theme(spacing.px)] grid-rows-8 overflow-hidden bg-[--nav-category-common-color-1] will-change-transform',
                    categoryData_Memo ? 'gap-[calc(var(--category-padding)*2)] p-[--category-padding]' : '',
                )}
            >
                {categoryData_Memo &&
                    categoryData_Memo.posts.map((post, idx, arr) => {
                        const gridAreaIndex = getGridAreaIndex(cardAnimationIndex, idx, 5, arr.length);
                        return (
                            <Flipped
                                key={post.title + idx}
                                flipId={'grid' + idx}
                                // transformOrigin='750px -500px'
                            >
                                {(flippedProps) => <SinglePostCard post={post} arrayIndex={idx} gridAreaIndex={gridAreaIndex} flippedProps={flippedProps} />}
                            </Flipped>
                        );
                    })}

                <div className='flex flex-col items-end justify-between gap-y-2 bg-[--nav-category-common-color-1] [grid-area:tracker]'>
                    {categoryData_Memo &&
                        categoryData_Memo.posts.map((post, idx) => {
                            return (
                                <div
                                    key={`${post.id}_${idx}`}
                                    className={classNames(
                                        'w-1.5 flex-1 transition-colors duration-300',
                                        idx === cardAnimationIndex - 1 ? 'bg-[--color-primary-inactive-cat-bg]' : 'bg-black/10',
                                    )}
                                />
                            );
                        })}
                </div>
            </Flipper>

            {/* Debug! */}
            {categoryData_Memo && (
                <div
                    className='fixed left-2 right-full top-2 h-fit !min-h-0 min-w-36 cursor-pointer select-none bg-blue-300 text-center'
                    onClick={() =>
                        setCardAnimationIndex((current) => {
                            return current! >= categoryData_Memo.posts.length - 1 ? 0 : (current! += 1);
                        })
                    }
                >
                    Debug: Next Slide
                    <br />
                    Total: {categoryData_Memo.posts.length}
                    <br />
                    Current: {cardAnimationIndex}
                    <br />
                    Array: {cardAnimationIndex - 1}
                </div>
            )}
        </>
    );
};

export default Category;

const getGridAreaIndex: (viewIndex: number, arrayIndex: number, maxCells: number, arrayLength: number) => number = (
    viewIndex,
    arrayIndex,
    maxCells,
    arrayLength,
) => {
    const cell: number | string = maxCells - (arrayIndex + 1) + viewIndex;

    if (cell > maxCells) {
        if (cell <= arrayLength) {
            return -1;
        } else {
            return cell - arrayLength;
        }
    } else if (cell < 1) {
        return -1;
    } else {
        return cell;
    }
};

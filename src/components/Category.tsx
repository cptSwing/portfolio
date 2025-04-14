import testDb from '../queries/testDb.json';
import { useParams } from 'react-router-dom';
import { SinglePostCard } from './PostCards';
import { DataBase } from '../types/types';
import { useMemo, useState } from 'react';
import classNames from '../lib/classNames';
import { Flipper, Flipped } from 'react-flip-toolkit';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Category = () => {
    const { catId } = useParams();
    const [cardAnimationIndex, setCardAnimationIndex] = useState(0);

    const categoryData_Memo = useMemo(() => {
        if (catId) {
            const catIdToFloat = parseFloat(catId);
            const category = categoriesArray.find((cat) => catIdToFloat === cat.id);
            return category;
        }
    }, [catId]);

    return (
        <>
            <Flipper
                flipKey={cardAnimationIndex}
                spring={'veryGentle'}
                staggerConfig={{
                    default: {
                        speed: 0.0001,
                    },
                }}
                element={'main'}
                className={classNames(
                    'postcards-grid-template relative -ml-[--nav-divider-width] grid w-full grid-cols-5 grid-rows-3 self-start overflow-hidden bg-[--color-primary-active-cat-bg]',
                    categoryData_Memo ? 'gap-2 p-2' : '',
                )}
            >
                {categoryData_Memo &&
                    categoryData_Memo.posts.map((post, idx, arr) => {
                        const gridAreaIndex = getGridAreaIndex(cardAnimationIndex, idx, 5, arr.length);
                        return (
                            <Flipped key={post.title + idx} flipId={'grid' + idx} transformOrigin='100 0'>
                                {(flippedProps) => <SinglePostCard post={post} arrayIndex={idx} gridAreaIndex={gridAreaIndex} flippedProps={flippedProps} />}
                            </Flipped>
                        );
                    })}
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
    const cell: number | string = maxCells - arrayIndex + viewIndex;

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

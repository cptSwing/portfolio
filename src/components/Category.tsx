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

    // start with 1 since grid cells are 1-indexed
    const [cardViewIndex, setCardViewIndex] = useState<number | null>(null);

    const categoryData_Memo = useMemo(() => {
        if (catId) {
            const catIdToFloat = parseFloat(catId);
            const category = categoriesArray.find((cat) => catIdToFloat === cat.id);

            if (category) {
                setCardViewIndex(0);
                return category;
            }
        }
    }, [catId]);

    return (
        <>
            <Flipper className='relative -ml-1 self-start bg-[--color-primary-active-cat-bg]' flipKey={cardViewIndex}>
                <main
                    className={classNames(
                        'absolute left-0 top-0 grid size-full grid-cols-[0.5fr_1fr_0.5fr] grid-rows-[0px_repeat(3,1fr)]',
                        categoryData_Memo ? 'gap-2 p-2' : '',
                    )}
                    style={{ gridTemplateAreas: gridTemplate }}
                >
                    {categoryData_Memo &&
                        cardViewIndex !== null &&
                        categoryData_Memo.posts.map((post, idx, arr) => (
                            <Flipped key={post.title + idx} flipId='grid'>
                                {(flippedProps) => (
                                    <SinglePostCard
                                        post={post}
                                        arrayIndex={idx}
                                        viewIndex={getViewIndex(cardViewIndex, idx, 5, arr.length)}
                                        flippedProps={flippedProps}
                                    />
                                )}
                            </Flipped>
                        ))}
                </main>
            </Flipper>

            {categoryData_Memo && cardViewIndex !== null && (
                <div
                    className='fixed left-2 right-full top-2 h-fit !min-h-0 min-w-36 cursor-pointer select-none bg-blue-300 text-center'
                    onClick={() =>
                        setCardViewIndex((current) => {
                            return current! >= categoryData_Memo.posts.length - 1 ? 0 : (current! += 1);
                        })
                    }
                >
                    Debug: Next Slide
                    <br />
                    Total: {categoryData_Memo.posts.length}
                    <br />
                    Current: {cardViewIndex}
                </div>
            )}
        </>
    );
};

export default Category;

const gridTemplate = `
".      .       dump"
"cell5  cell5   cell1"
"cell5  cell5   cell2"
".      cell4   cell3"
`;

// can I assign "." to move to no cell?
/* viewIndex >= 1 */
const getViewIndex = (viewIndex: number, arrayIndex: number, maxCells: number, arrayLength: number) => {
    const cell: number | string = maxCells - arrayIndex + viewIndex;

    if (cell > arrayLength) {
        console.log('%c[Category]', 'color: #52aabc', `arrIndex ${arrayIndex} --> returned 'cell1' --> cell :`, cell);

        return 'cell1';
    } else if (cell > maxCells || cell < 1) {
        console.log('%c[Category]', 'color: #52aabc', `arrIndex ${arrayIndex} --> returned 'dump' --> cell :`, cell);

        return 'dump';
    } else {
        console.log('%c[Category]', 'color: #52aabc', `arrIndex ${arrayIndex} --> returned '${'cell' + cell}' --> cell :`, cell);

        return 'cell' + cell;
    }
};

import testDb from '../queries/testDb.json';
import { useParams } from 'react-router-dom';
import { SinglePostCard } from './PostCards';
import { DataBase } from '../types/types';
import { useMemo, useState } from 'react';
import classNames from '../lib/classNames';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Category = () => {
    const { catId } = useParams();
    const categoryData_Memo = useMemo(() => {
        if (catId) {
            const catIdToFloat = parseFloat(catId);
            return categoriesArray.find((cat) => catIdToFloat === cat.id);
        }
    }, [catId]);

    const [cardViewIndex, setCardViewIndex] = useState(0);

    return (
        <>
            <div
                className={classNames('-ml-1 grid grid-cols-2 grid-rows-2 self-start bg-[--color-primary-active-cat-bg]', categoryData_Memo ? 'gap-2 p-2' : '')}
            >
                {categoryData_Memo &&
                    categoryData_Memo.posts.map((post, idx) => <SinglePostCard key={post.title + idx} post={post} viewIndex={idx + cardViewIndex} />)}
            </div>

            <div
                className='fixed left-2 right-full top-2 h-fit !min-h-0 min-w-36 cursor-pointer select-none bg-blue-300 text-center'
                onClick={() => setCardViewIndex((current) => (current += 1))}
            >
                Debug: Next Slide {cardViewIndex}
            </div>
        </>
    );
};

export default Category;

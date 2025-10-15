import { Category as Category_T } from '../../types/types';
import { FC, memo, useRef } from 'react';
import { useZustand } from '../../lib/zustand.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';
import CategoryCards from '../CategoryCards.tsx';
import useSwitchCategoryCard from '../../hooks/useSwitchCategoryCard.ts';

const Category: FC<{ show: boolean }> = memo(({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;
    useSwitchCategoryCard(category.id);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, ['!clip-inset-[-10%]']);

    return isMounted ? (
        <div ref={categoryRef} className="absolute size-full transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-[50%]">
            <CategoryCards posts={category.posts} />
        </div>
    ) : null;
});

export default Category;

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

import { Category as Category_T } from '../../types/types';
import { FC, memo, useRef } from 'react';
import { useZustand } from '../../lib/zustand.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';
import CategoryCards from '../CategoryCards.tsx';
import useSwitchCategoryCard from '../../hooks/useSwitchCategoryCard.ts';
import { ROUTE } from '../../types/enums.ts';

const Category: FC<{ show: boolean }> = memo(({ show }) => {
    const {
        name: routeName,
        content: { category },
    } = useZustand((store) => store.values.routeData);

    const safeCategory = category ?? emptyCategory;
    useSwitchCategoryCard(safeCategory.id, routeName === ROUTE.category);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, ['!clip-inset-[-10%]']);

    return isMounted ? (
        <div ref={categoryRef} className="absolute size-full transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-[50%]">
            <CategoryCards posts={safeCategory.posts} />
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

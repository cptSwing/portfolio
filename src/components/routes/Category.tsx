import { Category as Category_T, Post } from '../../types/types';
import { FC, useEffect, useRef, useState } from 'react';
import useMouseWheelDirection from '../../hooks/useMouseWheelDirection';
import { useZustand } from '../../lib/zustand.ts';
import useDebugButton from '../../hooks/useDebugButton.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';
import CategoryCards from '../CategoryCards.tsx';
import { usePreviousPersistent } from '../../hooks/usePrevious.ts';

const { store_setDebugValues, store_toggleHamburgerMenu } = useZustand.getState().methods;

const Category: FC<{ show: boolean }> = ({ show }) => {
    const category = useZustand((store) => store.values.routeData.content.category) ?? emptyCategory;
    const previousCategoryId = usePreviousPersistent(category.id);

    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, '!clip-inset-x-[-50%]');

    const activeIndexState = useState(0);
    const [activeIndex, setActiveIndex] = activeIndexState;

    const [wheelDirection, wheelDistance] = useMouseWheelDirection();
    useEffect(() => {
        if (wheelDirection !== null) {
            setActiveIndex((previous) => loopFlipValues(previous, category.posts.length, wheelDirection));
            store_toggleHamburgerMenu(false);
        }
    }, [category.posts.length, wheelDirection, setActiveIndex, wheelDistance]); // wheelDistance needed as dependency to have this useEffect update at all

    /* Run after the wheel-direction effect to ensure activeIndex is at 0 when switching categories/unmounting */
    useEffect(() => {
        if (category.id !== previousCategoryId) {
            setActiveIndex(0);
        }

        return () => {
            setActiveIndex(0);
        };
    }, [category.id, previousCategoryId, setActiveIndex]);

    return isMounted ? (
        <div
            ref={categoryRef}
            className="pointer-events-none absolute size-full transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-x-[50%]"
        >
            <CategoryCards posts={category.posts} activeIndexState={activeIndexState} />

            {/* <div className="mx-auto mt-[40%] flex h-1/4 w-[90%] bg-black/80" /> */}

            {/* {category.posts[activeIndex] && <PostPreview post={category.posts[activeIndex]} />} */}
        </div>
    ) : null;
};

export default Category;

const PostPreview: FC<{ post: Post }> = ({ post }) => {
    const { title, subTitle } = post;

    return (
        <div className="absolute top-1/2 z-50 flex h-1/2 w-full -translate-y-1/2 flex-col items-center justify-around">
            <div className="glassmorphic-backdrop w-fit rounded-xl bg-blue-500/10 p-4 text-3xl text-theme-text-background">{title}</div>
            <div className="glassmorphic-backdrop w-fit rounded-xl bg-blue-500/10 p-4 text-3xl text-theme-text-background">{subTitle}</div>
        </div>
    );
};

const DebugWrapper: FC<{
    category: Category_T;
    activeIndex: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ category, activeIndex, setIndex }) => {
    useDebugButton(`array.length: ${category.posts.length} activeIndex: ${activeIndex}`, (ev) => {
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

/* Local functions */

const loopFlipValues = (value: number, max: number, direction: 'down' | 'up') => {
    if (direction === 'down') {
        const nextValue = value + 1;
        return nextValue >= max ? 0 : nextValue;
    } else {
        const previousValue = value - 1;
        return previousValue < 0 ? max - 1 : previousValue;
    }
};

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

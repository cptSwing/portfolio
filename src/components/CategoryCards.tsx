import { CSSProperties, FC, useContext, useMemo } from 'react';
import { getCategoryHexagons, calcCSSVariables, carouselCssVariables } from '../lib/shapeFunctions';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonTransformData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { useNavigate } from 'react-router-dom';
import { useZustand } from '../lib/zustand';

const CategoryCards: FC<{
    posts: Post[];
}> = ({ posts }) => {
    const containerSize = useContext(GetChildSizeContext);
    const categoryHexagons_Memo = useMemo(() => getCategoryHexagons(posts.length), [posts]);
    const postIndex = useZustand((store) => store.values.postIndex);

    return posts.map((post, idx) => (
        <CategoryHexagon
            key={`hex-post-card-index-${idx}`}
            allButtons={categoryHexagons_Memo}
            post={post}
            containerSize={containerSize}
            cardIndex={idx}
            activePostCardIndex={postIndex}
        />
    ));
};

export default CategoryCards;

const store_setPostIndex = useZustand.getState().methods.store_setPostIndex;

const CategoryHexagon: FC<{
    allButtons: HexagonTransformData[];
    post: Post;
    containerSize: {
        width: number;
        height: number;
    };
    cardIndex: number;
    activePostCardIndex: number;
}> = ({ allButtons, post, containerSize, cardIndex, activePostCardIndex }) => {
    const cardImage = post.cardImage;

    const isAtFront = activePostCardIndex === cardIndex;
    const cardTransition = useZustand((state) => state.values.cardTransition);

    const thisButtonIndex = getThisButtonIndex(activePostCardIndex, cardIndex, allButtons.length);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = allButtons[thisButtonIndex]!;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: false,
            gutterWidth: 0,
        });
    }, [allButtons, containerSize, thisButtonIndex]);

    return (
        <button
            className={classNames(
                'transform-hexagon group pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,background-color,backdrop-filter] hover-active:!duration-75',
                isAtFront
                    ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                        ? '!delay-0 !duration-[--ui-animation-menu-transition-duration]'
                        : '!scale-[--carousel-card-at-front-scale-x] duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*4),calc(var(--ui-animation-menu-transition-duration)*8)]'
                    : 'duration-[--ui-animation-menu-transition-duration] hover-active:!z-50 hover-active:scale-x-[calc(var(--hexagon-scale-x)*1.5)] hover-active:scale-y-[calc(var(--hexagon-scale-y)*1.5)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    ...carouselCssVariables,
                    zIndex: (isAtFront ? 1 : 0) - thisButtonIndex,
                } as CSSProperties
            }
            onClick={handleClick}
        >
            {/* Glassmorphism Segment, thin 'rim' for depth in the :after element */}
            <div
                className={classNames(
                    'glassmorphic-backdrop absolute left-0 top-0 -z-10 aspect-hex-flat size-full w-[--hexagon-clip-path-width] transition-[transform,background-color,backdrop-filter] [clip-path:--hexagon-clip-path-full] group-hover-active:!duration-75',
                    'after:absolute after:left-0 after:top-0 after:size-full after:transition-[transform,clip-path,background-color] after:duration-[--ui-animation-menu-transition-duration]',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? 'bg-theme-primary/20 delay-0 duration-[--ui-animation-menu-transition-duration] [--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1.25] ' +
                              'after:bg-white/10 after:matrix-scale-[1.029] after:[clip-path:--hexagon-clip-path-full-stroke]'
                            : 'bg-theme-primary/10 duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*4),calc(var(--ui-animation-menu-transition-duration)*8)] [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:1.5] ' +
                              'after:bg-white/20 after:matrix-translate-x-[-0.075] after:matrix-translate-y-[-0.05] after:matrix-scale-[1.029] after:[clip-path:--hexagon-clip-path-full-stroke]'
                        : 'bg-none backdrop-filter-none duration-[--ui-animation-menu-transition-duration] ' +
                              'after:bg-theme-primary-darker after:[clip-path:--hexagon-clip-path-full-wider-stroke] after:group-hover-active:bg-theme-primary',
                )}
            />

            {/* Image Element, stroke around image in :after element */}
            <div
                className={classNames(
                    'relative left-0 top-0 z-0 size-full bg-theme-secondary-darker/50 bg-cover bg-center transition-transform duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path-full] group-hover-active:delay-0 group-hover-active:duration-75',
                    'after:absolute after:left-0 after:top-0 after:z-50 after:size-full after:transition-[transform,clip-path,filter,background-color] after:duration-[--ui-animation-menu-transition-duration] after:[background-image:--card-image-background-gradient]',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? '!delay-0 !duration-[--ui-animation-menu-transition-duration] ' +
                              'after:!delay-0 after:!duration-[--ui-animation-menu-transition-duration] after:[clip-path:--hexagon-clip-path-full]'
                            : 'matrix-scale-[--carousel-card-at-front-image-scale] group-hover-active:matrix-scale-[calc(var(--carousel-card-at-front-image-scale)*1.02)] after:group-hover-active:brightness-150 ' +
                              'after:matrix-scale-[1.001] after:[clip-path:--hexagon-clip-path-full-stroke]'
                        : 'z-20 grayscale-[0.75] matrix-scale-[0.925] group-hover-active:grayscale-0 ' +
                              'after:bg-theme-primary/50 after:![background-image:none] after:[clip-path:--hexagon-clip-path-full] after:group-hover-active:bg-theme-primary after:group-hover-active:[clip-path:--hexagon-clip-path-full-stroke]',
                )}
                style={
                    {
                        '--card-image-background-gradient':
                            'radial-gradient(circle, rgb(var(--theme-primary-darker) / 0.65) 0%, rgb(var(--theme-primary)) 70%)',
                        'backgroundImage': `url("${cardImage}"), var(--card-image-background-gradient)`,
                    } as CSSProperties
                }
            />
        </button>
    );

    function handleClick() {
        if (isAtFront) {
            navigate(post.id.toString());
        } else {
            store_setPostIndex(cardIndex);
        }
    }
};

function getThisButtonIndex(activeIndex: number, cardIndex: number, cardCount: number) {
    if (activeIndex > cardCount) return 0;

    if (activeIndex > cardIndex) {
        return cardCount + (cardIndex - activeIndex);
    } else if (activeIndex < cardIndex) {
        return cardIndex - activeIndex;
    } else {
        return 0;
    }
}

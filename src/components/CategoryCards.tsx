import { CSSProperties, FC, useContext, useMemo } from 'react';
import { getCategoryHexagons, calcCSSVariables } from '../lib/shapeFunctions';
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

    return (
        <>
            {/* Stroke, Outer, Fat */}
            <CategoryOuterStroke transformData={categoryHexagons_Memo[0]} containerSize={containerSize} />

            {posts.map((post, idx) => (
                <CategoryHexagon
                    key={`hex-post-card-index-${idx}`}
                    allButtons={categoryHexagons_Memo}
                    post={post}
                    containerSize={containerSize}
                    cardIndex={idx}
                    activePostCardIndex={postIndex}
                />
            ))}
        </>
    );
};

const CategoryOuterStroke: FC<{
    transformData: HexagonTransformData;
    containerSize: {
        width: number;
        height: number;
    };
}> = ({ transformData, containerSize }) => {
    const cardTransition = useZustand((state) => state.values.cardTransition);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = transformData!;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: false,
            gutterWidth: 0,
        });
    }, [containerSize, transformData]);

    return (
        <div
            className={classNames(
                'transform-hexagon absolute -z-50 aspect-hex-flat w-[--hexagon-clip-path-width] transition-[background-color,clip-path,transform] duration-[--ui-animation-menu-transition-duration]',
                cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                    ? '!scale-[calc(var(--card-wrapper-at-front-scaling-x)*1.06)] bg-transparent [clip-path:--hexagon-clip-path-full-wider-stroke]'
                    : '!scale-[calc(var(--card-wrapper-at-front-scaling-x)*1.02)] bg-neutral-400/10 [clip-path:--hexagon-clip-path-full-stroke]',
            )}
            style={{ ...cssVariables_Memo, ...cardWrapperCssVariables } as CSSProperties}
        />
    );
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
                'transform-hexagon absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,background-color,backdrop-filter] hover-active:!duration-75',
                isAtFront
                    ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                        ? '!delay-0 !duration-[--ui-animation-menu-transition-duration]'
                        : '!scale-[--card-wrapper-at-front-scaling-x] duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*4),calc(var(--ui-animation-menu-transition-duration)*8)]'
                    : 'duration-[--ui-animation-menu-transition-duration] hover-active:!z-50 hover-active:scale-x-[calc(var(--hexagon-scale-x)*1.5)] hover-active:scale-y-[calc(var(--hexagon-scale-y)*1.5)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    ...cardWrapperCssVariables,
                    zIndex: (isAtFront ? 1 : 0) - thisButtonIndex,
                } as CSSProperties
            }
            onClick={handleClick}
        >
            {/* Glassmorphism Segment, thin 'rim' for depth in the :after element */}
            <div
                className={classNames(
                    'glassmorphic-backdrop absolute left-0 top-0 -z-10 aspect-hex-flat size-full w-[--hexagon-clip-path-width] transition-[transform,background-color,backdrop-filter] [clip-path:--hexagon-clip-path-full] hover-active:!duration-75',
                    'after:absolute after:left-0 after:top-0 after:size-full after:bg-white/20 after:matrix-translate-x-[-0.075] after:matrix-translate-y-[-0.05] after:matrix-scale-[1.029] after:[clip-path:--hexagon-clip-path-full-stroke]',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? 'bg-theme-primary/20 !delay-0 !duration-[--ui-animation-menu-transition-duration] [--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1.25]'
                            : 'bg-theme-primary/10 duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*4),calc(var(--ui-animation-menu-transition-duration)*8)] [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:1.5]'
                        : 'bg-none backdrop-filter-none duration-[--ui-animation-menu-transition-duration]',
                )}
            />

            {/* Image Element, stroke around image in :after element */}
            <div
                className={classNames(
                    'pointer-events-auto relative left-0 top-0 z-0 size-full bg-theme-secondary-darker/50 bg-cover bg-center transition-transform duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path-full] hover-active:delay-0 hover-active:duration-75',
                    'after:absolute after:left-0 after:top-0 after:z-50 after:size-full after:transition-[transform,clip-path,filter,background-color] after:duration-[--ui-animation-menu-transition-duration] after:[background-image:--card-image-background-gradient] after:hover-active:brightness-150',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? '!delay-0 !duration-[--ui-animation-menu-transition-duration] ' +
                              'after:!delay-0 after:!duration-[--ui-animation-menu-transition-duration] after:[clip-path:--hexagon-clip-path-full]'
                            : 'matrix-scale-[--card-image-at-front-scaling] hover-active:matrix-scale-[calc(var(--card-image-at-front-scaling)*1.025)] ' +
                              'after:[clip-path:--hexagon-clip-path-full-stroke]'
                        : 'z-20 grayscale hover-active:grayscale-0 ' +
                              'after:bg-theme-primary/50 after:![background-image:none] after:[clip-path:--hexagon-clip-path-full] after:hover-active:[clip-path:--hexagon-clip-path-full-stroke]',
                )}
                style={
                    {
                        '--card-image-background-gradient':
                            'radial-gradient(circle, rgb(var(--theme-primary-darker) / 0.75) 0%, rgb(var(--theme-primary)) 70%)',
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

const scaling = {
    wrapperAtFront: 1.75,
    imageAtFront: 0.7,
};

const cardWrapperCssVariables = {
    '--card-wrapper-at-front-scaling-x': `calc(var(--hexagon-scale-x) * ${scaling.wrapperAtFront})`,
    '--card-wrapper-at-front-scaling-y': `calc(var(--hexagon-scale-y) * ${scaling.wrapperAtFront})`,
    '--card-image-at-front-scaling': scaling.imageAtFront,
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

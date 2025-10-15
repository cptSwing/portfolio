import { CSSProperties, FC, useContext, useMemo } from 'react';
import { getCategoryHexagons, calcCSSVariables } from '../lib/shapeFunctions';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonTransformData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { useNavigate } from 'react-router-dom';
import FitText from './utilityComponents/FitText';
import { Clients } from './PostDetails';
import { useZustand } from '../lib/zustand';

const CategoryCards: FC<{
    posts: Post[];
}> = ({ posts }) => {
    const containerSize = useContext(GetChildSizeContext);
    const categoryHexagons_Memo = useMemo(() => getCategoryHexagons(posts.length), [posts]);
    const postIndex = useZustand((store) => store.values.postIndex) ?? 0;

    return (
        <>
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
            <TitleClients
                title={posts[postIndex]?.title}
                containerSize={containerSize}
                subTitle={posts[postIndex]?.subTitle}
                clients={posts[postIndex]?.clients}
            />
        </>
    );
};

export default CategoryCards;

const scaling = {
    wrapperAtFront: 1.75,
    imageAtFront: 0.7,
};

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
    const { title, cardImage } = post;

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
                'transform-hexagon glassmorphic-backdrop absolute aspect-hex-flat w-[--hexagon-clip-path-width] transition-[transform,background-color,backdrop-filter] [clip-path:--hexagon-clip-path] hover-active:!duration-75',
                isAtFront
                    ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                        ? 'bg-theme-primary/100 !delay-0 !duration-[--ui-animation-menu-transition-duration] [--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1]'
                        : '!scale-x-[--card-wrapper-at-front-scaling-x] !scale-y-[--card-wrapper-at-front-scaling-y] bg-theme-primary/10 duration-[var(--ui-animation-menu-transition-duration),calc(var(--ui-animation-menu-transition-duration)*4),calc(var(--ui-animation-menu-transition-duration)*8)] [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:1.5]'
                    : 'bg-none backdrop-filter-none duration-[--ui-animation-menu-transition-duration] hover-active:!z-50 hover-active:scale-x-[calc(var(--hexagon-scale-x)*1.5)] hover-active:scale-y-[calc(var(--hexagon-scale-y)*1.5)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    'zIndex': (isAtFront ? 20 : 10) - thisButtonIndex,
                    '--card-wrapper-at-front-scaling-x': `calc(var(--hexagon-scale-x) * ${scaling.wrapperAtFront})`,
                    '--card-wrapper-at-front-scaling-y': `calc(var(--hexagon-scale-y) * ${scaling.wrapperAtFront})`,
                    '--card-image-at-front-scaling': scaling.imageAtFront,
                } as CSSProperties
            }
            onClick={handleClick}
        >
            <img
                src={cardImage}
                alt={title}
                className={classNames(
                    'peer pointer-events-auto absolute left-0 top-0 z-0 size-full object-cover transition-transform duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path-full] hover-active:delay-0 hover-active:duration-75',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? '!delay-0 !duration-[--ui-animation-menu-transition-duration]'
                            : 'matrix-scale-[--card-image-at-front-scaling] hover-active:matrix-scale-[calc(var(--card-image-at-front-scaling)*1.025)]'
                        : 'grayscale hover-active:grayscale-0',
                )}
            />

            {/* Inner Stroke */}
            <div
                className={classNames(
                    'absolute left-0 top-0 size-full transition-[transform,clip-path,filter,background-color] duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path-full] peer-hover-active:brightness-150',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? 'bg-theme-primary/80 !delay-0 !duration-[--ui-animation-menu-transition-duration]'
                            : 'bg-theme-primary matrix-scale-[calc(var(--card-image-at-front-scaling)*1.01)] ![clip-path:--hexagon-clip-path-full-stroke] peer-hover-active:matrix-scale-[calc(var(--card-image-at-front-scaling)*1.05)]'
                        : 'bg-theme-primary/50 peer-hover-active:[clip-path:--hexagon-clip-path-full-stroke]',
                )}
            />

            {/* Outer Stroke */}
            <div
                className={classNames(
                    'absolute left-0 top-0 size-full transition-[background-color,clip-path] duration-[--ui-animation-menu-transition-duration] [clip-path:--hexagon-clip-path-full-stroke]',
                    isAtFront
                        ? cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? 'bg-white/20 !delay-0 !duration-[--ui-animation-menu-transition-duration]'
                            : 'bg-white/20 matrix-translate-x-[-0.075] matrix-translate-y-[-0.05] matrix-scale-[1.029]'
                        : 'bg-theme-primary/75 matrix-scale-[1.029] ![clip-path:--hexagon-clip-path-full-wider-stroke]',
                )}
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

const TitleClients: FC<{
    title: Post['title'] | undefined;
    containerSize: {
        width: number;
        height: number;
    };
    subTitle?: Post['subTitle'];
    clients?: Post['clients'];
    noClip?: boolean;
}> = ({ title, containerSize, subTitle, clients }) => {
    const cardTransition = useZustand((state) => state.values.cardTransition);

    return (
        <div
            className={classNames(
                'fixed bottom-[3.5cqh] left-[20cqw] right-[20cqw] top-[3.5cqh] z-50 flex transform-gpu flex-col items-center justify-start transition-[filter]',
                cardTransition
                    ? 'blur-xl duration-0'
                    : 'blur-0 delay-[--ui-animation-menu-transition-duration] duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
            )}
        >
            <div className="relative h-[12.5cqh] w-auto min-w-[40cqw] max-w-[45cqw]">
                <FitText
                    text={title ?? ''}
                    className={classNames(
                        'h-full w-full text-nowrap pt-px font-fjalla-one leading-none tracking-normal drop-shadow-lg transition-[transform,clip-path,color]',
                        cardTransition
                            ? 'translate-y-[200%] text-theme-primary-darker duration-0 clip-inset-b-full'
                            : 'translate-y-0 text-theme-secondary-lighter delay-[calc(var(--ui-animation-menu-transition-duration)*1),calc(var(--ui-animation-menu-transition-duration)*1.5),0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] clip-inset-0',
                    )}
                />

                <div
                    className={classNames(
                        'glassmorphic-backdrop absolute left-[-5%] top-1/2 -z-10 h-[50%] w-[110%] -translate-y-1/2 rounded-sm border text-theme-secondary-lighter transition-[opacity,background-color,backdrop-filter,border-color] [--glassmorphic-backdrop-blur:4px]',
                        cardTransition
                            ? 'border-transparent bg-theme-primary opacity-0 delay-0 duration-[calc(var(--ui-animation-menu-transition-duration)/10)] [--glassmorphic-backdrop-saturate:1]'
                            : 'border-white/5 border-b-black/20 border-t-white/10 bg-theme-primary/40 opacity-100 delay-[calc(var(--ui-animation-menu-transition-duration)/1.25),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2)] duration-[0ms,1000ms,1000ms,1000ms] [--glassmorphic-backdrop-saturate:2]',
                    )}
                />
            </div>

            {(subTitle || clients) && (
                <div className="relative mt-[71.5cqh] flex w-auto min-w-[20cqw] max-w-[30cqw] flex-col items-center justify-start">
                    {clients && (
                        <div
                            className={classNames(
                                'absolute top-[-17.5cqh] flex h-full w-3/4 flex-col transition-[transform,clip-path]',
                                cardTransition
                                    ? 'translate-y-[200%] duration-0 clip-inset-b-full'
                                    : 'translate-y-0 delay-[calc(var(--ui-animation-menu-transition-duration)*1.5),calc(var(--ui-animation-menu-transition-duration)*2),0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] clip-inset-y-[-150%]',
                            )}
                            style={{ '--client-hexagon-scale': `${containerSize.width / 1150}` } as CSSProperties}
                        >
                            <span className="relative mx-auto mt-[-1.25cqh] inline-block scale-y-90 font-fjalla-one tracking-wider text-theme-secondary-lighter [font-size:calc(1cqh*1.75)] [line-height:calc(1cqh*2)] before:absolute before:left-[-10%] before:top-[-15%] before:-z-10 before:h-[125%] before:w-[120%] before:bg-theme-primary-darker">
                                Clients:
                            </span>
                            <Clients
                                clients={clients}
                                dataBlockId={''}
                                extraClassNames="[&_.client-hexagon-class]:before:matrix-scale-[var(--client-hexagon-scale,1)]"
                            />
                        </div>
                    )}

                    {subTitle && (
                        <div className="relative max-h-[10cqh] w-auto">
                            <span
                                className={classNames(
                                    'inline-block h-full w-full pt-px text-center font-fjalla-one tracking-normal transition-[transform,clip-path,color] [font-size:calc(1cqh*2.5)] [line-height:calc(1cqh*3)]',
                                    cardTransition
                                        ? 'translate-y-[-100%] text-theme-primary-darker duration-0 clip-inset-t-full'
                                        : 'translate-y-0 text-theme-secondary-lighter delay-[calc(var(--ui-animation-menu-transition-duration)*1.5),calc(var(--ui-animation-menu-transition-duration)*2),0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*2)] clip-inset-0',
                                )}
                            >
                                {subTitle}
                            </span>

                            <div
                                className={classNames(
                                    'glassmorphic-backdrop absolute left-[-5%] top-1/2 -z-10 h-full w-[110%] -translate-y-1/2 rounded-sm border text-theme-secondary-lighter transition-[opacity,background-color,backdrop-filter,border-color] [--glassmorphic-backdrop-blur:4px]',
                                    cardTransition
                                        ? 'border-transparent bg-theme-primary opacity-0 delay-0 duration-[calc(var(--ui-animation-menu-transition-duration)/10)] [--glassmorphic-backdrop-saturate:1]'
                                        : 'border-white/5 border-b-black/20 border-t-white/10 bg-theme-primary/40 opacity-100 delay-[calc(var(--ui-animation-menu-transition-duration)/1.25),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2),calc(var(--ui-animation-menu-transition-duration)*2)] duration-[0ms,1000ms,1000ms,1000ms] [--glassmorphic-backdrop-saturate:2]',
                                )}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
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

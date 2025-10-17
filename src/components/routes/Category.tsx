import { Category as Category_T, Post } from '../../types/types';
import { CSSProperties, FC, memo, useContext, useRef } from 'react';
import { useZustand } from '../../lib/zustand.ts';
import useMountTransition from '../../hooks/useMountTransition.ts';
import CategoryCards from '../CategoryCards.tsx';
import useSwitchCategoryCard from '../../hooks/useSwitchCategoryCard.ts';
import { ROUTE } from '../../types/enums.ts';
import { classNames } from 'cpts-javascript-utilities';
import GetChildSizeContext from '../../contexts/GetChildSizeContext.ts';
import FitText from '../utilityComponents/FitText.tsx';

const Category: FC<{ show: boolean }> = memo(({ show }) => {
    const {
        name: routeName,
        content: { category },
    } = useZustand((store) => store.values.routeData);
    const postIndex = useZustand((store) => store.values.postIndex);
    const containerSize = useContext(GetChildSizeContext);

    const safeCategory = category ?? emptyCategory;
    useSwitchCategoryCard(safeCategory.id, routeName === ROUTE.category);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useMountTransition(categoryRef, show, ['!clip-inset-[-10%]']);

    return isMounted ? (
        <div ref={categoryRef} className="absolute size-full transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-[50%]">
            <CategoryCards posts={safeCategory.posts} />

            <TitleAndClients
                title={safeCategory.posts[postIndex]?.title}
                containerSize={containerSize}
                subTitle={safeCategory.posts[postIndex]?.subTitle}
                clients={safeCategory.posts[postIndex]?.clients}
            />
        </div>
    ) : null;
});

export default Category;

const TitleAndClients: FC<{
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
                'perspective-[500px] fixed bottom-[3.5cqh] left-[20cqw] right-[20cqw] top-[3.5cqh] z-50 flex transform-gpu flex-col items-center justify-start transition-[filter] [transform-style:preserve-3d]',
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
                            <CategoryCardClients clients={clients} />
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

const CategoryCardClients: FC<{ clients: NonNullable<Post['clients']> }> = ({ clients }) => {
    return (
        <div className={'relative grid h-20'} style={{ gridTemplateColumns: `repeat(${clients.length < 4 ? clients.length : 4}, minmax(0, 1fr)` }}>
            {clients.map(({ abbreviation, name, svgUrl }, idx) => (
                <div key={idx + abbreviation + name} className="group relative flex flex-col items-center justify-start">
                    <div
                        className={classNames(
                            'before:absolute before:left-0 before:top-0 before:-z-10 before:size-full before:bg-theme-primary-darker before:matrix-rotate-90 before:matrix-scale-[var(--client-hexagon-scale,1)] before:[clip-path:--hexagon-clip-path-full-stroke]',
                            'pointer-events-auto relative flex aspect-hex-flat w-[--hexagon-clip-path-width] items-center justify-center matrix-scale-[0.9]',
                        )}
                    >
                        {svgUrl ? (
                            <img className="w-2/5" alt={abbreviation} src={svgUrl} />
                        ) : (
                            <span className="flex select-none items-center justify-center rounded-2xl font-lato text-lg text-theme-text-background">
                                {abbreviation}
                            </span>
                        )}
                    </div>

                    <span className="pointer-events-none -mt-[12.5%] scale-y-90 text-center font-fjalla-one text-xs text-theme-text opacity-0 before:absolute before:left-0 before:top-0 before:-z-10 before:-mt-px before:size-full before:rounded-sm before:bg-theme-text-background/50 group-hover-active:opacity-100">
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* Local values */

const emptyCategory: Category_T = {
    id: -1,
    title: '',
    posts: [],
    categoryBlurb: '',
};

import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, Post_Image } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';

const Nav = () => {
    return (
        <nav
            id='nav-cards-wrapper'
            className='group flex size-full flex-col items-center justify-start space-y-8 sm:space-y-6 md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0'
        >
            <NavCard category={MENUTARGET.Updates} cardData={testDb[MENUTARGET.Updates]} />
            <NavCard category={MENUTARGET.Resume} cardData={testDb[MENUTARGET.Resume]} />
            <NavCard category={MENUTARGET.Code} cardData={testDb[MENUTARGET.Code]} />
            <NavCard category={MENUTARGET.Art} cardData={testDb[MENUTARGET.Art]} />
            <NavCard category={MENUTARGET.Contact} cardData={testDb[MENUTARGET.Contact]} />
        </nav>
    );
};

export default Nav;

const store_isOpened = useZustand.getState().methods.store_isOpened;

const NavCard: FC<{
    category: MENUTARGET;
    cardData: DataBase[MENUTARGET];
}> = ({ category, cardData }) => {
    const { posts, headerCardBg } = cardData;
    const isOpened = useZustand((state) => state.nav.isOpened);
    const activePost = useZustand((state) => state.nav.activePost);

    const isThisCategoryChecked = useMemo(() => isOpened === category, [isOpened, category]);

    return (
        <label
            className={classNames(
                'after:nav-card-corners after:hover:[--corner-outline-color:theme(colors.gray.200)]',
                'pointer-events-auto relative h-64 w-full cursor-pointer bg-gradient-to-b shadow-md transition-[flex] md:h-120 md:bg-gradient-to-r',
                'hover:from-gray-300 hover:to-gray-300 hover:text-gray-400',
                isThisCategoryChecked
                    ? 'flex-[5] from-gray-300 to-gray-300 after:[--corner-outline-color:theme(colors.palette.test)]'
                    : 'flex-[1] from-gray-300/75 to-gray-300/25', //  'has-[:checked]:!flex-[5]' not working on FF
            )}
        >
            {/* Hidden checkbox input: */}
            <input
                type='checkbox'
                name='nav-card-input'
                value={category}
                className='peer hidden'
                checked={isThisCategoryChecked}
                onChange={({ currentTarget }) => {
                    const typedValue = currentTarget.value as MENUTARGET;
                    store_isOpened(isOpened === typedValue ? (activePost ? typedValue : null) : typedValue);
                }}
            />

            <div className='pointer-events-none absolute bottom-0 flex size-full cursor-pointer rounded p-3'>
                <span className='title-select md:writing-mode-vert-lr select-none whitespace-nowrap text-3xl first-letter:capitalize md:rotate-180 md:text-5xl'>
                    {category}
                </span>
                <div
                    className='bg-image-select absolute bottom-0 left-0 h-3/4 w-4/5 bg-cover opacity-10 transition-opacity [mask-composite:intersect] [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_30%_60%,rgba(0,0,0,0)_100%),_linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%_80%,rgba(0,0,0,0)_100%)]'
                    style={{ backgroundImage: `url('${headerCardBg}')` }}
                />
            </div>

            <NavCardSubMenu categoryPosts={posts} isVisible={isThisCategoryChecked} />
        </label>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

const staggeredDelayArr = ['delay-[100ms]', 'delay-[200ms]', 'delay-300', 'delay-[400ms]', 'delay-500'];

const NavCardSubMenu: FC<{
    categoryPosts: Post[];
    isVisible: boolean;
}> = ({ categoryPosts, isVisible }) => {
    const [childrenVisible, setChildrenVisible] = useState(isVisible);

    // Delay by just one tick (scientific term) in order for children's opacity transition to trigger
    useEffect(() => {
        setChildrenVisible(isVisible);
    }, [isVisible]);

    return (
        <div
            className={classNames(
                'pointer-events-none relative z-10 h-5/6 w-fit overflow-x-visible p-4 md:ml-auto md:h-full md:w-5/6 md:pl-0',
                isVisible ? 'block' : 'hidden',
            )}
        >
            <div className='size-full scrollbar-thin md:-scale-x-100 md:overflow-y-auto md:overflow-x-visible'>
                {/* Move scrollbar to left side: https://stackoverflow.com/a/45824265 */}
                <div className='flex md:-scale-x-100 md:flex-col md:space-y-2 md:pl-4'>
                    {categoryPosts.map((databasePost, idx, arr) => {
                        const { title, titleCardBg, textContent } = databasePost;

                        return (
                            <div
                                key={title + idx}
                                className={classNames(
                                    'aspect-[3/1] h-full w-fit cursor-pointer opacity-100 transition-opacity md:h-fit md:w-full',
                                    childrenVisible
                                        ? staggeredDelayArr[idx]
                                            ? staggeredDelayArr[idx]
                                            : staggeredDelayArr[staggeredDelayArr.length - 1]
                                        : '!opacity-0 !delay-75',
                                )}
                            >
                                <div
                                    className={
                                        'pointer-events-auto relative size-full bg-gray-400/50 p-1 outline outline-1 -outline-offset-4 outline-gray-300/75 transition-[outline-color,background-color,outline-offset] duration-100 hover:bg-transparent hover:outline-2 hover:-outline-offset-8 hover:outline-gray-300' +
                                        ' after:absolute after:bottom-0 after:truncate after:text-xs after:opacity-0 after:transition-opacity after:delay-300 after:duration-200 hover:after:opacity-100 hover:after:content-[attr(data-after-content)]'
                                    }
                                    data-after-content={textContent[0]}
                                    onClick={() => store_activePost(arr[idx])}
                                >
                                    <div className='text-center text-white'>{title}</div>
                                    <div
                                        className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 -z-10 size-full bg-cover bg-center bg-no-repeat'
                                        style={{ backgroundImage: `url('${titleCardBg}')` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const TopMenuOnOpened: FC<{
    images: Post_Image[] | undefined;
    codeLink: string | undefined;
    setLightbox: React.Dispatch<React.SetStateAction<boolean>>;
    setSlide: React.Dispatch<React.SetStateAction<number>>;
}> = ({ images, codeLink, setLightbox, setSlide }) => {
    return (
        <div className='nav-checked-width relative mx-auto'>
            <div className='absolute right-0 top-[-50px] flex items-end justify-end space-x-1 shadow'>
                {images && (
                    <button
                        type='button'
                        className='cursor-pointer border border-b-0 border-gray-300 p-1 hover:bg-purple-300'
                        onClick={() => {
                            setSlide(0);
                            setLightbox(true);
                        }}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <a className='group block cursor-pointer border border-b-0 p-1 shadow hover:bg-purple-300' href={codeLink} target='_blank' rel='noreferrer'>
                        Code lbr rbr
                        <span className='absolute right-0 z-50 mt-2 hidden whitespace-nowrap text-right text-sm group-hover:block'>
                            Link goes to {codeLink} <br /> bla bla explanatory <br /> new window/tab
                        </span>
                    </a>
                )}

                {/* TODO fade out instead of instantly closing */}
                <div
                    className='aspect-square h-fit cursor-pointer border border-b-0 border-gray-300 p-1 hover:bg-purple-300'
                    onClick={() => store_activePost(null)}
                >
                    X
                </div>
            </div>
        </div>
    );
};

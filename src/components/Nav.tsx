import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useEffect, useState } from 'react';
import testDb from '../queries/testDb.json';

export const navWidthClassesUnchecked = /* tw */ ' w-[90%] sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 ';
export const navWidthClassesChecked = /* tw */ ' w-[95%] sm:w-[90%] md:w-4/5 lg:w-3/4 xl:w-2/3 ';

const Nav: FC<{ categoryIsCheckedState: [string | null, React.Dispatch<React.SetStateAction<string | null>>] }> = ({ categoryIsCheckedState }) => {
    return (
        <nav
            id='nav-cards-wrapper'
            className='group flex size-full flex-col items-center justify-start space-y-8 sm:space-y-6 md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0'
        >
            <NavCard category={MENUTARGET.Updates} cardData={testDb[MENUTARGET.Updates]} categoryIsCheckedState={categoryIsCheckedState} />
            <NavCard category={MENUTARGET.Resume} cardData={testDb[MENUTARGET.Resume]} categoryIsCheckedState={categoryIsCheckedState} />
            <NavCard category={MENUTARGET.Code} cardData={testDb[MENUTARGET.Code]} categoryIsCheckedState={categoryIsCheckedState} />
            <NavCard category={MENUTARGET.Art} cardData={testDb[MENUTARGET.Art]} categoryIsCheckedState={categoryIsCheckedState} />
            <NavCard category={MENUTARGET.Contact} cardData={testDb[MENUTARGET.Contact]} categoryIsCheckedState={categoryIsCheckedState} />
        </nav>
    );
};

export default Nav;

const NavCard: FC<{
    category: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    categoryIsCheckedState: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}> = ({ category, cardData, categoryIsCheckedState }) => {
    const { posts, headerCardBg } = cardData;
    const activePost = useZustand((state) => state.active.post);

    const [isCheckedStr, setIsChecked] = categoryIsCheckedState;
    const isThisCategoryChecked = isCheckedStr === category;

    return (
        <label
            className={classNames(
                'after:nav-card-corners after:hover:[--corner-outline-color:theme(colors.gray.200)]',
                'pointer-events-auto relative h-64 w-full cursor-pointer bg-gradient-to-b from-gray-300/75 to-gray-300/75 shadow-md transition-[flex] md:h-120 md:bg-gradient-to-r',
                'hover:from-gray-300 hover:to-gray-300',
                isThisCategoryChecked
                    ? 'flex-[5] from-gray-300 via-gray-300/80 to-transparent after:[--corner-outline-color:theme(colors.palette.test)]'
                    : 'flex-[1]', //  'has-[:checked]:!flex-[5]' not working on FF
            )}
        >
            {/* Hidden checkbox input: */}
            <input
                type='checkbox'
                name='nav-card-input'
                value={category}
                className='peer hidden'
                checked={isThisCategoryChecked}
                onChange={(e) => setIsChecked((state) => (state === e.target.value ? (activePost ? e.target.value : null) : e.target.value))}
            />

            <div
                className={classNames(
                    'pointer-events-none absolute bottom-0 flex size-full cursor-pointer rounded p-3',
                    'peer-checked:[&>.bg-image-select]:opacity-25 hover:[&>.bg-image-select]:opacity-50',
                )}
            >
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
                                    'aspect-video h-full w-fit cursor-pointer opacity-100 transition-opacity md:h-fit md:w-full',
                                    childrenVisible
                                        ? staggeredDelayArr[idx]
                                            ? staggeredDelayArr[idx]
                                            : staggeredDelayArr[staggeredDelayArr.length - 1]
                                        : '!opacity-0 !delay-75',
                                )}
                            >
                                <div
                                    className={
                                        'pointer-events-auto relative size-full bg-gray-400/50 p-1 outline outline-1 -outline-offset-1 outline-gray-500/50 transition-[outline-color,background-color,outline-offset] duration-100 hover:bg-gray-400/90 hover:-outline-offset-4 hover:outline-gray-300' +
                                        ' after:absolute after:bottom-0 after:truncate after:text-xs after:opacity-0 after:transition-opacity after:delay-300 after:duration-200 hover:after:opacity-100 hover:after:content-[attr(data-after-content)]'
                                    }
                                    data-after-content={textContent[0]}
                                    onClick={() => store_activePost(arr[idx])}
                                >
                                    <div className='text-center'>{title}</div>
                                    <div
                                        className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 -z-10 size-full bg-cover bg-center bg-no-repeat opacity-50'
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

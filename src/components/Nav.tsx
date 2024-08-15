import { useZustand } from '../lib/zustand';
import { DataBase, DataBase_Posts, MENUTARGET } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useEffect, useState } from 'react';
import testDb from '../queries/testDb.json';

const Nav = () => {
    // const {
    //     state: { updates, resume, code, art, contact },
    //     isAnyChecked,
    // } = useZustand((state) => state.menu);

    const isCheckedState = useState<string | null>(null);

    console.log('%c[Nav]', 'color: #c6f2a6', `testDb[MENUTARGET.Updates] :`, testDb[MENUTARGET.Updates]);
    return (
        <nav id='nav-cards-wrapper' className='group flex w-2/5 items-start justify-center space-x-2 sm:space-x-3 md:space-x-4'>
            <NavCard category={MENUTARGET.Updates} cardData={testDb[MENUTARGET.Updates]} isCheckedState={isCheckedState} />
            <NavCard category={MENUTARGET.Resume} cardData={testDb[MENUTARGET.Resume]} isCheckedState={isCheckedState} />
            <NavCard category={MENUTARGET.Code} cardData={testDb[MENUTARGET.Code]} isCheckedState={isCheckedState} />
            <NavCard category={MENUTARGET.Art} cardData={testDb[MENUTARGET.Art]} isCheckedState={isCheckedState} />
            <NavCard category={MENUTARGET.Contact} cardData={testDb[MENUTARGET.Contact]} isCheckedState={isCheckedState} />
        </nav>
    );
};

export default Nav;

const NavCard: FC<{
    category: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    isCheckedState: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}> = ({ category, cardData, isCheckedState }) => {
    const [isChecked, setIsChecked] = isCheckedState;
    const { posts, headerBg } = cardData;

    return (
        <label
            className={classNames(
                'before:fake-border-bg before:-z-10 before:group-hover:[--fake-border-color:theme(colors.gray.600/25%)] before:hover:![--fake-border-color:theme(colors.gray.500)]',
                'after:nav-card-corners after:hover:[--corner-outline-color:theme(colors.gray.200)]',
                'pointer-events-auto relative h-120 cursor-pointer rounded bg-gradient-to-r from-gray-300/75 to-gray-300/75 transition-[flex] duration-700',
                'hover:from-gray-300 hover:to-gray-300',
                isChecked === category
                    ? 'flex-[5] from-gray-300 via-gray-300/80 to-transparent before:to-transparent before:[--fake-border-color:theme(colors.gray.500)] after:[--corner-outline-color:theme(colors.palette.test)]'
                    : 'flex-[1]', //  'has-[:checked]:!flex-[5]' not working on FF
            )}
        >
            {/* Hidden checkbox input: */}
            <input
                type='checkbox'
                name='nav-card-input'
                value={category}
                className='peer hidden'
                checked={isChecked === category}
                onChange={(e) => setIsChecked((state) => (state === e.target.value ? null : e.target.value))}
            />

            <div
                className={classNames(
                    'pointer-events-none absolute bottom-0 flex size-full cursor-pointer rounded p-3',
                    'peer-checked:[&>.bg-image-select]:opacity-25 hover:[&>.bg-image-select]:opacity-50',
                )}
            >
                <span className='title-select writing-mode-vert-lr rotate-180 select-none whitespace-nowrap text-5xl first-letter:capitalize'>{category}</span>
                <div
                    className='bg-image-select absolute bottom-0 left-0 h-3/4 w-4/5 bg-cover opacity-10 transition-opacity [mask-composite:intersect] [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_30%_60%,rgba(0,0,0,0)_100%),_linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%_80%,rgba(0,0,0,0)_100%)]'
                    style={{ backgroundImage: `url('${headerBg}')` }}
                />
            </div>

            <NavCardSubMenu categoryPosts={posts} isVisible={isChecked === category} />
        </label>
    );
};

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const staggeredDelayArr = ['delay-[100ms]', 'delay-[200ms]', 'delay-300', 'delay-[400ms]', 'delay-500'];

const NavCardSubMenu: FC<{
    categoryPosts: DataBase_Posts[];
    isVisible: boolean;
}> = ({ categoryPosts, isVisible }) => {
    const [childrenVisible, setChildrenVisible] = useState(isVisible);

    // Delay by just one tick (scientific term) in order for children's opacity transition to trigger
    useEffect(() => {
        setChildrenVisible(isVisible);
    }, [isVisible]);

    return (
        <div className={classNames('relative z-10 ml-auto h-full w-5/6 overflow-x-visible p-4 pl-0', isVisible ? 'block' : 'hidden')}>
            <div className='size-full -scale-x-100 overflow-y-auto overflow-x-visible scrollbar-thin'>
                {/* Move scrollbar to left side: https://stackoverflow.com/a/45824265 */}
                <div className='-scale-x-100 space-y-2 pl-4'>
                    {categoryPosts.map(({ title, titleBg }, idx) => (
                        <div
                            key={title + idx}
                            className={classNames(
                                'pointer-events-auto relative h-28 w-full cursor-pointer rounded-sm bg-gradient-to-l from-gray-400/90 to-gray-400/60 p-1 text-center outline outline-1 -outline-offset-1 outline-gray-500/50 transition-opacity duration-300 hover:to-gray-400/90 hover:-outline-offset-4 hover:outline-gray-300',
                                staggeredDelayArr[idx] ? staggeredDelayArr[idx] : staggeredDelayArr[staggeredDelayArr.length - 1],
                                childrenVisible ? 'opacity-100' : 'opacity-0 !delay-75',
                            )}

                            // onClick={() => store_toggleMenuItem(thisMenuLink)}
                        >
                            {title}
                            <div
                                className='absolute bottom-0 left-0 right-0 top-0 -z-10 size-full bg-cover bg-center bg-no-repeat opacity-30'
                                style={{ backgroundImage: `url('${titleBg}')` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

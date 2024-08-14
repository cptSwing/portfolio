import { useZustand } from '../lib/zustand';
import { MENUTARGET } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useState } from 'react';

const tempSubMenuItems: { [key in MENUTARGET]: { posts: string[]; cardBg: string } } = {
    updates: { posts: ['Updates 1', 'Updates 2', 'Updates 3', 'Updates 4', 'Updates 5'], cardBg: 'https://picsum.photos/seed/updates/500?grayscale' },
    resume: { posts: ['Resumé', 'About'], cardBg: 'https://picsum.photos/seed/resume/500?grayscale' },
    code: {
        posts: ['Design Your Ring', 'Fader', 'Scrollmersive', 'Hilux Configurator', 'Brotherland', 'Plate Calc'],
        cardBg: 'https://picsum.photos/seed/code/500?grayscale',
    },
    art: { posts: ['Grundwasser', 'BER Tagesspiegel', 'Stasi VR', 'Art 4', 'Art 5'], cardBg: 'https://picsum.photos/seed/art/500?grayscale' },
    contact: { posts: ['Contact', 'Impressum'], cardBg: 'https://picsum.photos/seed/contact/500?grayscale' },
};

const Nav = () => {
    // const {
    //     state: { updates, resume, code, art, contact },
    //     isAnyChecked,
    // } = useZustand((state) => state.menu);

    const isCheckedState = useState<string | null>(null);

    return (
        <nav id='nav-cards-wrapper' className='group flex w-1/2 items-start justify-center space-x-2 sm:space-x-3 md:space-x-4'>
            <NavCard cardData={{ category: MENUTARGET.Updates, data: tempSubMenuItems[MENUTARGET.Updates] }} isCheckedState={isCheckedState} />
            <NavCard cardData={{ category: MENUTARGET.Resume, data: tempSubMenuItems[MENUTARGET.Resume] }} isCheckedState={isCheckedState} />
            <NavCard cardData={{ category: MENUTARGET.Code, data: tempSubMenuItems[MENUTARGET.Code] }} isCheckedState={isCheckedState} />
            <NavCard cardData={{ category: MENUTARGET.Art, data: tempSubMenuItems[MENUTARGET.Art] }} isCheckedState={isCheckedState} />
            <NavCard cardData={{ category: MENUTARGET.Contact, data: tempSubMenuItems[MENUTARGET.Contact] }} isCheckedState={isCheckedState} />
        </nav>
    );
};

export default Nav;

const NavCard: FC<{
    cardData: { category: MENUTARGET; data: { posts: string[]; cardBg: string } };
    isCheckedState: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}> = ({ cardData, isCheckedState }) => {
    const [isChecked, setIsChecked] = isCheckedState;
    const {
        category,
        data: { posts, cardBg },
    } = cardData;

    return (
        <label
            className={
                'before:fake-border-bg before:-z-10 before:hover:![--fake-border-color:theme(colors.green.500)] before:group-hover:[--fake-border-color:theme(colors.green.600/25%)] has-[:checked]:before:to-transparent has-[:checked]:before:[--fake-border-color:theme(colors.green.500)]' +
                ' after:nav-card-border after:hover:nav-card-border-gray-200 has-[:checked]:after:nav-card-border-secondary' +
                ' pointer-events-auto relative h-96 flex-[1] cursor-pointer rounded bg-gradient-to-r from-gray-300/75 to-gray-300/75 transition-[flex] duration-700' +
                ' hover:from-gray-300 hover:to-gray-300 has-[:checked]:!flex-[6] has-[:checked]:from-gray-300 has-[:checked]:via-gray-300/80 has-[:checked]:to-transparent'
            }
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
                    'pointer-events-none absolute bottom-0 cursor-pointer rounded p-3',
                    '[&>div]:hover:opacity-50 peer-checked:[&>div]:opacity-50 peer-checked:[&>span]:decoration-gray-200',

                    // 'backdrop-blur',
                )}
            >
                <span className='writing-mode-vert-lr mb-0 ml-0 mr-auto size-full rotate-180 select-none whitespace-nowrap text-5xl underline decoration-gray-200/0 transition-[text-decoration-color] duration-700 first-letter:capitalize'>
                    {category}
                </span>
                <div
                    className='absolute bottom-0 left-0 h-3/4 w-4/5 bg-cover opacity-10 [mask-composite:intersect] [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_30%_60%,rgba(0,0,0,0)_100%),_linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%_80%,rgba(0,0,0,0)_100%)]'
                    style={{ backgroundImage: `url('${cardBg}')` }}
                />
            </div>

            <NavCardSubMenu categoryPosts={posts} isVisible={isChecked === category} />
        </label>
    );
};

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const staggeredDelayArr = ['delay-[100ms]', 'delay-[200ms]', 'delay-300', 'delay-[400ms]', 'delay-500'];

const NavCardSubMenu: FC<{
    categoryPosts: string[];
    isVisible: boolean;
}> = ({ categoryPosts, isVisible }) => {
    return (
        <div
            className={classNames('relative z-50 ml-auto h-full w-3/4 space-y-2 p-4', isVisible ? '*:block *:opacity-100' : '*:hidden *:opacity-0 *:!delay-75')}
        >
            {categoryPosts.map((item, idx) => (
                <div
                    key={item + idx}
                    className={classNames(
                        'pointer-events-auto h-20 w-full cursor-pointer rounded-sm bg-gradient-to-l from-gray-400/90 to-gray-400/60 p-1 text-center outline outline-1 outline-offset-0 transition-opacity duration-300 hover:to-gray-400/90 hover:outline-offset-2',
                        staggeredDelayArr[idx] ? staggeredDelayArr[idx] : staggeredDelayArr[staggeredDelayArr.length - 1],
                    )}
                    // onClick={() => store_toggleMenuItem(thisMenuLink)}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

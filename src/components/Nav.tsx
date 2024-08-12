import { useZustand } from '../lib/zustand';
import { MENUTARGET, MenuToggleState } from '../types/types';
import classNames from '../lib/classNames';
import { ChangeEvent, FC, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

const Nav = () => {
    const {
        state: { updates, resume, code, art, contact },
        isAnyChecked,
    } = useZustand((state) => state.menu);

    const isCheckedState = useState<string | null>(null);

    return (
        <nav
            id='nav-cards-wrapper'
            className={classNames(
                'group absolute left-1/2 z-10 w-2/5 -translate-x-1/2 transition-[top,transform] duration-300',
                'top-1/2 -translate-y-1/2',
                // isAnyChecked ? 'top-16 lg:top-24' : 'top-1/2 -translate-y-1/2 hover:top-[calc(50%+theme(spacing.16))]',
            )}
            // style={isAnyChecked ? { clipPath: `polygon(0 -1rem, 100% -1rem, 100% 1.55rem, 0 1.55rem)` } : {}}
        >
            <form className='flex h-96 items-end justify-start space-x-2 sm:space-x-3 md:space-x-4'>
                <NavCard isCheckedState={isCheckedState} title='Updates' toggleState={[MENUTARGET.Updates, updates]} />
                <NavCard isCheckedState={isCheckedState} title='Resumé' toggleState={[MENUTARGET.Resume, resume]} />
                <NavCard isCheckedState={isCheckedState} title='Code' toggleState={[MENUTARGET.Code, code]} />
                <NavCard isCheckedState={isCheckedState} title='Art' toggleState={[MENUTARGET.Art, art]} />
                <NavCard isCheckedState={isCheckedState} title='Contact' toggleState={[MENUTARGET.Contact, contact]} />
            </form>
        </nav>
    );
};

export default Nav;

const NavCard: FC<{
    isCheckedState: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
    title: string;
    toggleState: [MENUTARGET, boolean];
}> = ({ isCheckedState, title, toggleState }) => {
    const [isChecked, setIsChecked] = isCheckedState;
    const [menuTarget, targetIsChecked] = toggleState;

    return (
        <label className='relative flex h-full flex-[1] transition-[flex] has-[:checked]:!flex-[5]'>
            <input
                type='checkbox'
                name='nav-card-input'
                value={menuTarget}
                className='peer hidden'
                checked={isChecked === menuTarget}
                onChange={(e) => setIsChecked((cur) => (cur === e.target.value ? null : e.target.value))}
            />
            <div
                className={classNames(
                    'relative flex size-full cursor-pointer items-end justify-start rounded p-3',
                    'bg-gradient-to-r from-gray-300 to-gray-300 transition-[background-position] duration-700 [background-position-x:0] [background-size:200%_100%] peer-checked:via-gray-300/50 peer-checked:to-transparent peer-checked:[background-position-x:100%]',
                    'after:nav-card-border after:hover:nav-card-border-secondary',
                    'before:absolute before:-bottom-0.5 before:-left-0.5 before:-right-0.5 before:-top-0.5 before:-z-50 before:rounded before:bg-gradient-to-r before:from-[--fake-border-color] before:to-[--fake-border-color] before:transition-[linear-gradient] before:[--fake-border-color:theme(colors.gray.500)] peer-checked:before:!bg-gradient-to-r peer-checked:before:from-[--fake-border-color] peer-checked:before:to-transparent',
                )}
            >
                <span className='writing-mode-vert-lr rotate-180 whitespace-nowrap text-5xl'>{title}</span>
            </div>

            {isChecked === menuTarget && <NavCardSubMenu menuTarget={menuTarget} />}
        </label>
    );
};

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const tempSubMenuItems = {
    updates: ['Updates 1', 'Updates 2', 'Updates 3', 'Updates 4', 'Updates 5'],
    resume: ['Resumé', 'About'],
    code: ['Design Your Ring', 'Fader', 'Scrollmersive', 'Car Configurator', 'Plate Calc'],
    art: ['Grundwasser', 'BER Tagesspiegel', 'Stasi VR', 'Art 4', 'Art 5'],
    contact: ['Contact'],
};

const NavCardSubMenu: FC<{
    menuTarget: MENUTARGET;
}> = ({ menuTarget }) => {
    // const { updates, resume, code, art, contact } = menuState;

    return (
        <div className='pointer-events-none absolute flex size-full flex-col items-end justify-end space-y-2 p-4'>
            {tempSubMenuItems[menuTarget].map((item, idx) => (
                <div
                    key={item + idx}
                    className={classNames('pointer-events-auto h-1/4 w-3/4 cursor-pointer rounded-sm bg-green-500/75 p-1 text-center hover:bg-purple-300')}
                    // onClick={() => store_toggleMenuItem(thisMenuLink)}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

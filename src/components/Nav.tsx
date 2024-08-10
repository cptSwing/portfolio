import { useZustand } from '../lib/zustand';
import { MENUTARGET, MenuToggleState } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useMemo, useState } from 'react';

const Nav = () => {
    const {
        state: { updates, resume, code, art, contact },
        isAnyChecked,
    } = useZustand((state) => state.menu);

    return (
        <nav
            id='nav-cards-wrapper'
            className={classNames(
                'group absolute left-1/2 z-10 w-1/3 -translate-x-1/2 transition-[top,transform] duration-300',
                'top-1/2 -translate-y-1/2',
                // isAnyChecked ? 'top-16 lg:top-24' : 'top-1/2 -translate-y-1/2 hover:top-[calc(50%+theme(spacing.16))]',
            )}
            // style={isAnyChecked ? { clipPath: `polygon(0 -1rem, 100% -1rem, 100% 1.55rem, 0 1.55rem)` } : {}}
        >
            {isAnyChecked && <NavCardSubMenu menuState={{ updates, resume, code, art, contact }} />}

            <div className='flex size-full items-end justify-start space-x-2 sm:space-x-3 md:space-x-4'>
                <NavCard title='Updates' toggleState={[MENUTARGET.Updates, updates]} isAnyChecked={isAnyChecked} />
                <NavCard title='Resume' toggleState={[MENUTARGET.Resume, resume]} isAnyChecked={isAnyChecked} />
                <NavCard title='Code' toggleState={[MENUTARGET.Code, code]} isAnyChecked={isAnyChecked} />
                <NavCard title='Art' toggleState={[MENUTARGET.Art, art]} isAnyChecked={isAnyChecked} />
                <NavCard title='Contact' toggleState={[MENUTARGET.Contact, contact]} isAnyChecked={isAnyChecked} />
            </div>
        </nav>
    );
};

export default Nav;

const NavCard: FC<{ title: string; toggleState: [MENUTARGET, boolean]; isAnyChecked: boolean }> = ({ title, toggleState, isAnyChecked }) => {
    const [thisMenuTarget, thisTargetIsChecked] = toggleState;

    return (
        <label id={`nav-card-${title}`} className='relative h-96 w-1/5'>
            <input type='radio' name='nav-card' className='peer hidden' onChange={() => store_toggleMenuItem(thisMenuTarget)} checked={thisTargetIsChecked} />
            <div
                id='nav-card-updates'
                className={classNames(
                    // 'before:absolute before:left-1/2 before:top-1/2 before:size-[120%] before:-translate-x-1/2 before:-translate-y-1/2 hover:before:border-t-2',
                    'size-full cursor-pointer rounded border-2 border-gray-500 bg-gray-300/75',
                    'transform-gpu transition-[background-color,margin,transform,height] duration-300',
                    'hover:border-gray-200 hover:!bg-gray-300 group-hover:bg-gray-300/50 peer-checked:border-gray-700',
                    'after:nav-card-border',
                    isAnyChecked ? '' : '',
                )}
            >
                <div className='absolute bottom-0 origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>
                    {title}
                </div>
            </div>
        </label>
    );
};

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const subMenuItems = {
    updates: ['Updates 1', 'Updates 2', 'Updates 3'],
    resume: ['Resumé 1', 'Resumé 2', 'Resumé 3'],
    code: ['Code 1', 'Code 2', 'Code 3'],
    art: ['Art 1', 'Art 2', 'Art 3'],
    contact: ['Contact 1', 'Contact 2', 'Contact 3'],
};

const NavCardSubMenu: FC<{
    menuState: MenuToggleState;
}> = ({ menuState }) => {
    // const { updates, resume, code, art, contact } = menuState;

    const activeMenuItem = useMemo(() => {
        let key: MENUTARGET;
        for (key in menuState) {
            if (menuState[key]) {
                return key;
            }
        }
    }, [menuState]);

    return (
        <div className='pointer-events-none absolute left-1/2 top-0 flex w-full -translate-x-1/2 items-center justify-center space-x-2 bg-gray-300 sm:space-x-3 md:space-x-4'>
            {activeMenuItem && subMenuItems[activeMenuItem].map((item, idx) => <NavCardSubMenuItem key={item + idx} testContent={item} />)}
        </div>
    );
};

const NavCardSubMenuItem: FC<{ testContent: string }> = ({ testContent }) => {
    return (
        <div
            className={classNames('pointer-events-auto h-16 w-24 cursor-pointer bg-green-500/50 p-1')}
            // onClick={() => store_toggleMenuItem(thisMenuLink)}
        >
            {testContent}
        </div>
    );
};

import { useZustand } from '../lib/zustand';
import { MENUTARGET } from '../types/types';
import classNames from '../lib/classNames';
import { FC } from 'react';

const Nav = () => {
    const {
        state: { updates, resume, code, art, contact },
        isAnyChecked,
    } = useZustand((state) => state.menu);

    return (
        <nav
            id='nav-cards-wrapper'
            className={classNames(
                'group absolute left-1/2 z-10 flex w-fit -translate-x-1/2 items-start justify-center transition-[top,transform] duration-300',
                'space-x-2 sm:space-x-3 md:space-x-4',

                isAnyChecked ? 'top-16 lg:top-24' : 'top-1/2 -translate-y-1/2 hover:top-[calc(50%+theme(spacing.16))]',
            )}
            // style={isAnyChecked ? { clipPath: `polygon(0 -1rem, 100% -1rem, 100% 1.55rem, 0 1.55rem)` } : {}}
        >
            <NavCard title='Updates' toggleState={[MENUTARGET.Updates, updates]} isAnyChecked={isAnyChecked} />
            <NavCard title='Resume' toggleState={[MENUTARGET.Resume, resume]} isAnyChecked={isAnyChecked} />
            <NavCard title='Code' toggleState={[MENUTARGET.Code, code]} isAnyChecked={isAnyChecked} />
            <NavCard title='Art' toggleState={[MENUTARGET.Art, art]} isAnyChecked={isAnyChecked} />
            <NavCard title='Contact' toggleState={[MENUTARGET.Contact, contact]} isAnyChecked={isAnyChecked} />
        </nav>
    );
};

export default Nav;

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const NavCard: FC<{ title: string; toggleState: [MENUTARGET, boolean]; isAnyChecked: boolean }> = ({ title, toggleState, isAnyChecked }) => {
    const [thisMenuTarget, thisTargetIsChecked] = toggleState;

    return (
        <label id={`nav-card-${thisMenuTarget}`}>
            <input
                type='checkbox'
                className='peer pointer-events-none hidden'
                onChange={() => store_toggleMenuItem(thisMenuTarget)}
                checked={thisTargetIsChecked}
            />
            <div
                id='nav-card-updates'
                className={classNames(
                    'h-96 w-20 sm:w-24 md:w-28',
                    'nav-card-border relative flex transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/75 transition-[background-color,margin,transform,width] duration-300',
                    'hover:-mt-16 hover:border-gray-200 hover:!bg-gray-300 group-hover:bg-gray-300/50 peer-checked:w-40 peer-checked:border-gray-700',
                    isAnyChecked ? (thisTargetIsChecked ? '!-mt-8 w-40' : 'hidden') : '',
                )}
            >
                <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>{title}</div>
            </div>
        </label>
    );
};

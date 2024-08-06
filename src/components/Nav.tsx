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
        <div id='nav-cards-wrapper' className='fixed bottom-0 left-0 right-0 top-0 flex size-full items-center justify-center'>
            {/* TODO instead of parallax-bg-clip class, receive dimensions of <Content> and clip? */}
            <div
                className={classNames('flex size-fit items-center justify-center space-x-4 transition-transform delay-200', isAnyChecked && '-translate-y-56')}
                style={isAnyChecked ? { clipPath: `polygon(0 -1rem, 100% -1rem, 100% 1.55rem, 0 1.55rem)` } : {}}
            >
                <NavCard title='Updates' toggleState={[MENUTARGET.Updates, updates]} isAnyChecked={isAnyChecked} />

                <NavCard title='Resume' toggleState={[MENUTARGET.Resume, resume]} isAnyChecked={isAnyChecked} />

                <NavCard title='Code' toggleState={[MENUTARGET.Code, code]} isAnyChecked={isAnyChecked} />

                <NavCard title='Art' toggleState={[MENUTARGET.Art, art]} isAnyChecked={isAnyChecked} />

                <NavCard title='Contact' toggleState={[MENUTARGET.Contact, contact]} isAnyChecked={isAnyChecked} />
            </div>
        </div>
    );
};

export default Nav;

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const NavCard: FC<{ title: string; toggleState: [MENUTARGET, boolean]; isAnyChecked: boolean }> = ({ title, toggleState, isAnyChecked }) => {
    const [menuTarget, menuTargetIsChecked] = toggleState;

    return (
        <label>
            <input
                type='checkbox'
                className='peer pointer-events-none hidden'
                onChange={() => store_toggleMenuItem(menuTarget)}
                checked={menuTargetIsChecked}
            />
            <div
                id='nav-card-updates'
                className={classNames(
                    'nav-card-border relative flex h-96 w-28 origin-center transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-[transform,width] hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:w-40 peer-checked:-translate-y-4 peer-checked:border-gray-700',
                    isAnyChecked ? '!bg-transparent bg-gradient-to-t from-transparent to-gray-300' : '',
                    // menuTargetIsChecked ? 'w-40' : 'hover:w-40',
                )}
            >
                <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>{title}</div>
            </div>
        </label>
    );
};

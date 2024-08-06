import { AdjustmentsHorizontalIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, CodeBracketSquareIcon, HomeIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';
import { MENUTARGET } from '../../types/types';
import { useZustand } from '../../lib/zustand';

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const NavMenu: FC<{
    menuClassNames: string;
}> = ({ menuClassNames }) => {
    const { home, back, forward, settings, viewCode } = useZustand((state) => state.menuState);

    return (
        <nav className={'flex items-center justify-between gap-x-1' + ' ' + menuClassNames}>
            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Home : null)}
                    checked={home}
                />
                <HomeIcon className='pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-pink-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black' />
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Back : null)}
                    checked={back}
                />
                <ArrowUturnLeftIcon className='pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-indigo-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black' />
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Forward : null)}
                    checked={forward}
                />
                <ArrowUturnRightIcon className='pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-indigo-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black' />
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Settings : null)}
                    checked={settings}
                />
                <AdjustmentsHorizontalIcon className='pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-fuchsia-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black' />
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.ViewCode : null)}
                    checked={viewCode}
                />
                <CodeBracketSquareIcon className='pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-fuchsia-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black' />
            </label>
        </nav>
    );
};

export default NavMenu;

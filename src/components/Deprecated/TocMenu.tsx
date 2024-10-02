import { useZustand } from '../../lib/zustand';
import { MENU_CATEGORY } from '../../types/types';
import { FC } from 'react';

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const TocMenu: FC<{
    menuClassNames: string;
}> = ({ menuClassNames }) => {
    const { resume, code, art } = useZustand((state) => state.menuState);

    return (
        <nav className={'flex items-center justify-between gap-x-1' + ' ' + menuClassNames}>
            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENU_CATEGORY.Resume : null)}
                    checked={resume}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-pink-500 p-1 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black hover:bg-blue-500/25'>
                    Resumé
                </div>
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENU_CATEGORY.Code : null)}
                    checked={code}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-indigo-500 p-1 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black hover:bg-blue-500/25'>
                    Code
                </div>
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENU_CATEGORY.Art : null)}
                    checked={art}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-fuchsia-500 p-1 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black hover:bg-blue-500/25'>
                    3D
                </div>
            </label>
        </nav>
    );
};

export default TocMenu;

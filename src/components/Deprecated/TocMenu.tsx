import { useZustand } from '../../lib/zustand';
import { MENUTARGET } from '../../types/types';
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
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Resume : null)}
                    checked={resume}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-pink-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black'>
                    Resumé
                </div>
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Code : null)}
                    checked={code}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-indigo-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black'>
                    Code
                </div>
            </label>

            <label>
                <input
                    type='checkbox'
                    className='peer pointer-events-none hidden'
                    onChange={(e) => store_toggleMenuItem(e.target.checked ? MENUTARGET.Art : null)}
                    checked={art}
                />
                <div className='pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-fuchsia-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black'>
                    3D
                </div>
            </label>
        </nav>
    );
};

export default TocMenu;

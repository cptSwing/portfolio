import { useMemo } from 'react';
import { useZustand } from '../lib/zustand';
import { MENUTARGET } from '../types/types';
import classNames from '../lib/classNames';

const store_toggleMenuItem = useZustand.getState().methods.store_toggleMenuItem;

const Nav = () => {
    const { updates, resume, code, art, contact } = useZustand((state) => state.menuState);
    const isAnyChecked = useMemo(() => [updates, resume, code, art, contact].some((menuItem) => menuItem === true), [updates, resume, code, art, contact]);

    return (
        <div id='nav-cards-wrapper' className='fixed bottom-0 left-0 right-0 top-0 flex size-full items-center justify-center'>
            {/* TODO instead of parallax-bg-clip class, receive dimensions of <Content> and clip? */}
            <div className={classNames('flex size-fit items-center justify-center space-x-4', isAnyChecked && 'parallax-bg-clip -translate-y-56')}>
                <label>
                    <input
                        type='checkbox'
                        className='peer pointer-events-none hidden'
                        onChange={() => store_toggleMenuItem(MENUTARGET.Updates)}
                        checked={updates}
                    />
                    <div
                        id='nav-card-updates'
                        className='nav-card-border relative flex h-96 w-28 transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-transform hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:-translate-y-4 peer-checked:border-gray-700 peer-checked:bg-gray-300'
                    >
                        <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>Updates</div>
                    </div>
                </label>

                <label>
                    <input
                        type='checkbox'
                        className='peer pointer-events-none hidden'
                        onChange={() => store_toggleMenuItem(MENUTARGET.Resume)}
                        checked={resume}
                    />
                    <div
                        id='nav-card-resume'
                        className='nav-card-border relative flex h-96 w-28 transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-transform hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:-translate-y-4 peer-checked:border-gray-700 peer-checked:bg-gray-300'
                    >
                        <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>Resumé</div>
                    </div>
                </label>

                <label>
                    <input type='checkbox' className='peer pointer-events-none hidden' onChange={() => store_toggleMenuItem(MENUTARGET.Code)} checked={code} />
                    <div
                        id='nav-card-code'
                        className='nav-card-border relative flex h-96 w-28 transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-transform hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:-translate-y-4 peer-checked:border-gray-700 peer-checked:bg-gray-300'
                    >
                        <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>Code</div>
                    </div>
                </label>

                <label>
                    <input type='checkbox' className='peer pointer-events-none hidden' onChange={() => store_toggleMenuItem(MENUTARGET.Art)} checked={art} />
                    <div
                        id='nav-card-3d-art'
                        className='nav-card-border relative flex h-96 w-28 transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-transform hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:-translate-y-4 peer-checked:border-gray-700 peer-checked:bg-gray-300'
                    >
                        <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>3D Art</div>
                    </div>
                </label>

                <label>
                    <input
                        type='checkbox'
                        className='peer pointer-events-none hidden'
                        onChange={() => store_toggleMenuItem(MENUTARGET.Contact)}
                        checked={contact}
                    />
                    <div
                        id='nav-card-contact'
                        className='nav-card-border relative flex h-96 w-28 transform-gpu cursor-pointer flex-col items-start justify-end rounded border-2 border-gray-500 bg-gray-300/85 transition-transform hover:-translate-y-4 hover:border-gray-200 hover:bg-gray-300 peer-checked:-translate-y-4 peer-checked:border-gray-700 peer-checked:bg-gray-300'
                    >
                        <div className='origin-bottom-left -translate-y-4 translate-x-24 -rotate-90 transform-gpu whitespace-nowrap text-5xl'>Contact</div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Nav;

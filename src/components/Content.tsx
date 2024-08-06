import { useMemo } from 'react';
import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';

const Content = () => {
    const { updates, resume, code, art, contact } = useZustand((state) => state.menuState);
    const isAnyChecked = useMemo(() => [updates, resume, code, art, contact].some((menuItem) => menuItem === true), [updates, resume, code, art, contact]);

    return (
        <div className='z-0 flex size-full flex-col items-center justify-center'>
            {/* TODO keyframe animation w-0 to w-fit */}
            <div className={classNames('size-4/5 bg-gray-700 transition-[--tw-bg-opacity]', isAnyChecked ? 'bg-opacity-100' : 'bg-opacity-0')}></div>
        </div>
    );
};

export default Content;

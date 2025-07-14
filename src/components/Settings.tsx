import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';

const Settings = () => {
    return (
        <div className='flex flex-col gap-y-3'>
            <SwitchTheme />
            <Admin />
        </div>
    );
};

export default Settings;

const store_cycleTheme = useZustand.getState().methods.store_cycleTheme;

const SwitchTheme = () => {
    const theme = useZustand((state) => state.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div className='group relative flex aspect-hex-flat w-12 cursor-pointer items-center justify-center' onClick={() => store_cycleTheme()}>
            <RoundedHexagonSVG classNames='absolute left-0 top-0 fill-theme-secondary group-hover-active:fill-theme-secondary-darker transition-[fill] duration-300 -z-50' />
            <PaintBrushIcon className='w-2/3 stroke-theme-primary transition-[stroke] duration-300 group-hover-active:stroke-theme-primary-lighter' />
        </div>
    );
};

const Admin = () => {
    return (
        <div className='group relative flex aspect-hex-flat w-12 cursor-pointer items-center justify-center text-sm'>
            <RoundedHexagonSVG classNames='absolute left-0 top-0 fill-theme-secondary -z-50' />
            Login
        </div>
    );
};

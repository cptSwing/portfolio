import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';

const Settings = () => {
    return <SwitchTheme />;
};

export default Settings;

const store_cycleTheme = useZustand.getState().methods.store_cycleTheme;

const SwitchTheme = () => {
    const theme = useZustand((state) => state.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div className='hexagon-clip group flex h-full cursor-pointer items-center justify-center bg-theme-secondary' onClick={() => store_cycleTheme()}>
            <PaintBrushIcon className='h-3/4 stroke-theme-primary group-hover-active:stroke-theme-primary-lighter' />
        </div>
    );
};

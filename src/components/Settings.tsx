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
        <div className='group/brush bg-theme-primary aspect-square w-1/4 cursor-pointer rounded-md p-0.5' onClick={() => store_cycleTheme()}>
            <PaintBrushIcon className='stroke-theme-secondary group-hover-active/brush:stroke-theme-secondary-lighter' />
        </div>
    );
};

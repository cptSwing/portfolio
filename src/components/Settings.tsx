import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';
import { setCssProperties } from '../lib/cssProperties';
import themes from '../lib/themes';

const store_cycleTheme = useZustand.getState().methods.store_cycleTheme;

const Settings = () => {
    const themeIndex = useZustand((state) => state.values.themeIndex);
    useEffect(() => {
        setCssProperties(document.documentElement, themes[themeIndex]);
    }, [themeIndex]);

    return (
        <div className='size-full rounded-full bg-[--color-bars-no-post] p-px' onClick={() => store_cycleTheme()}>
            <Cog8ToothIcon className='stroke-neutral-700 hover:stroke-[--color-bars-post]' />
        </div>
    );
};

export default Settings;

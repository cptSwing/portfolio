import { PaintBrushIcon } from '@heroicons/react/24/outline';
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
        <div className='group/brush aspect-square w-1/4 cursor-pointer rounded-md bg-[--color-bars-no-post] p-0.5' onClick={() => store_cycleTheme()}>
            <PaintBrushIcon className='stroke-neutral-700 group-hover/brush:stroke-[--color-bars-post] group-active/brush:stroke-[--color-bars-post]' />
        </div>
    );
};

export default Settings;

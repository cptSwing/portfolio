import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';

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
        <div
            className='aspect-hex-flat group relative flex w-12 cursor-pointer items-center justify-center' // bg-theme-secondary [clip-path:url(#hex-link-clip-path)]
            style={{ clipPath: `url(#svgtest)` }}
            onClick={() => store_cycleTheme()}
        >
            <RoundedHexagonSVG classNames='absolute left-0 top-0 fill-theme-secondary -z-50' />
            <PaintBrushIcon className='w-2/3 stroke-theme-primary group-hover-active:stroke-theme-primary-lighter' />
        </div>
    );
};

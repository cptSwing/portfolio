import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useZustand } from '../lib/zustand';
import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';
import { ZustandStore } from '../types/types';

const store_toggleMenu = useZustand.getState().methods.store_toggleMenu;

const Settings: FC<{ position?: ZustandStore['values']['menuState']['position'] }> = ({ position }) => {
    const [settingsSize, setSettingsSize] = useState({ width: 0, height: 0 });

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            const { width, height } = elem.getBoundingClientRect();
            setSettingsSize({ width, height });
        }
    }, []);

    return (
        <div
            ref={refCallback}
            className='pointer-events-auto absolute flex -translate-x-1/2 flex-col gap-y-3'
            style={
                position && {
                    left: `${position.x + position.width / 2}px`,
                    top: `calc(${position.y - settingsSize.height}px - ${position.height * 0.25}px)`,
                }
            }
        >
            <SwitchTheme position={position} parentHeight={settingsSize.height} />

            {/* Close */}
            <div
                className='group absolute bottom-0 left-1/2 flex aspect-hex-flat w-[4vw] -translate-x-1/2 cursor-pointer items-center justify-center'
                style={
                    position &&
                    ({
                        'width': `${position.width}px`,
                        '--tw-translate-y': `calc(100% + ${position.height * 0.25}px)`,
                    } as CSSProperties)
                }
                onClick={() => store_toggleMenu({ menuName: null })}
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 stroke-theme-primary-darker fill-theme-secondary/10 group-hover-active:fill-theme-secondary-darker/50 transition-[fill] duration-300 -z-50'
                    style={position && { strokeWidth: settingsSize.height * 0.125 }}
                />
                <div className='size-full bg-theme-primary transition-[background-color] duration-300 [mask-image:url(/svg/XMarkOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:55%] group-hover-active:bg-theme-primary-lighter' />
            </div>
        </div>
    );
};

export default Settings;

const store_cycleTheme = useZustand.getState().methods.store_cycleTheme;

const SwitchTheme: FC<{ position: ZustandStore['values']['menuState']['position']; parentHeight: number }> = ({ position, parentHeight }) => {
    const theme = useZustand((state) => state.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div
            className='group relative flex aspect-hex-flat cursor-pointer items-center justify-center'
            style={{ width: position ? `${position.width * 1.2}px` : '4vw' }}
            onClick={() => store_cycleTheme()}
        >
            <RoundedHexagonSVG
                classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active:fill-theme-secondary-darker transition-[fill] duration-300 -z-50'
                style={position && { strokeWidth: parentHeight * 0.125 }}
            />
            <PaintBrushIcon
                className='w-3/5 stroke-theme-primary transition-[stroke] duration-300 group-hover-active:stroke-theme-primary-lighter'
                style={{ strokeWidth: parentHeight * 0.02 }}
            />
        </div>
    );
};

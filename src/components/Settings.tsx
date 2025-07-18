import { useZustand } from '../lib/zustand';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';
import { CloseSubMenu } from './MenuModal';

const store_cycleTheme = useZustand.getState().methods.store_cycleTheme;

const Settings = () => {
    const menuButtonPosAndSize = useZustand((store) => store.values.activeMenuButton.positionAndSize);

    const [hasMounted, setHasMounted] = useState(false);

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            /* delaying for one tick so <nav>'s transition takes place */
            const timer = setTimeout(() => {
                setHasMounted(true);
                clearTimeout(timer);
            }, 0);
        }
    }, []);

    /* style icons dynamically */
    const subMenuButtonsMargin = menuButtonPosAndSize ? menuButtonPosAndSize.width * 0.1 : 0;

    /* step through theme settings */
    const theme = useZustand((store) => store.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div
            ref={refCallback}
            className='pointer-events-auto absolute aspect-hex-flat'
            style={
                menuButtonPosAndSize &&
                ({
                    width: menuButtonPosAndSize.width,
                    left: menuButtonPosAndSize.x,
                    bottom: `calc(100% - ${menuButtonPosAndSize.y + menuButtonPosAndSize.height}px)`,
                } as CSSProperties)
            }
        >
            {/* empty */}
            <button
                className='group peer absolute size-full rotate-0 cursor-pointer items-center justify-center transition-transform'
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${-75}% - ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                              // '--tw-scale-x': '1.2',
                              // '--tw-scale-y': '1.2',
                          } as CSSProperties)
                        : undefined
                }
                data-title='1'
                title='1'
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active:fill-theme-secondary-darker transition-[fill] -z-50'
                    strokeWidth={subMenuButtonsMargin}
                />
            </button>

            {/* Theme Settings */}
            <button
                className='group peer absolute size-full rotate-0 cursor-pointer items-center justify-center transition-transform'
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `${0}%`,
                              '--tw-translate-y': `calc(${-100}% - ${subMenuButtonsMargin}px)`,
                              // '--tw-scale-x': '1.2',
                              // '--tw-scale-y': '1.2',
                          } as CSSProperties)
                        : undefined
                }
                data-title='Theme'
                title='Theme'
                onClick={() => store_cycleTheme()}
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active:fill-theme-secondary-darker transition-[fill] -z-50'
                    strokeWidth={subMenuButtonsMargin}
                />

                {/* logo */}
                <div className='size-full bg-theme-primary transition-[background-color] [mask-image:url(/svg/PaintBrushOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active/linkedin:bg-theme-primary-lighter' />
            </button>

            {/* empty */}
            <button
                className='group peer absolute size-full rotate-0 cursor-pointer items-center justify-center transition-transform'
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${75}% + ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                              // '--tw-scale-x': '1.2',
                              // '--tw-scale-y': '1.2',
                          } as CSSProperties)
                        : undefined
                }
                data-title='2'
                title='2'
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active:fill-theme-secondary-darker transition-[fill] -z-50'
                    strokeWidth={subMenuButtonsMargin}
                />
            </button>

            {/* Close */}
            <CloseSubMenu />

            {/* Title */}
            <div className='pointer-events-none absolute size-full transform-gpu before:absolute before:top-1/2 before:z-10 before:w-full before:-translate-y-1/2 before:select-none before:text-center before:text-sm before:leading-none before:text-theme-secondary-lighter before:peer-hover-active:peer-data-[title=1]:content-["1"] before:peer-hover-active:peer-data-[title=2]:content-["2"] before:peer-hover-active:peer-data-[title=Theme]:content-["Theme"]' />
        </div>
    );
};

export default Settings;

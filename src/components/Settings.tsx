import { useZustand } from '../lib/zustand';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
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
            className="pointer-events-auto absolute"
            style={
                menuButtonPosAndSize &&
                ({
                    width: menuButtonPosAndSize.width,
                    height: menuButtonPosAndSize.height,
                    left: menuButtonPosAndSize.x,
                    bottom: `calc(100% - ${menuButtonPosAndSize.y + menuButtonPosAndSize.height}px)`,
                } as CSSProperties)
            }
        >
            {/* Radius Settings */}
            <button
                className="group peer absolute flex size-full rotate-0 cursor-pointer items-center justify-center transition-transform"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${-75}% - ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="Radius"
                title="Radius"
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* Radius logo */}
                <div className="absolute aspect-hex-flat w-full bg-theme-primary transition-[background-color] [mask-image:url(/svg/PercentBadgeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter" />
            </button>

            {/* Theme Settings */}
            <button
                className="group peer absolute flex size-full rotate-0 cursor-pointer items-center justify-center transition-transform"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `${0}%`,
                              '--tw-translate-y': `calc(${-100}% - ${subMenuButtonsMargin}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="Theme"
                title="Theme"
                onClick={() => store_cycleTheme()}
            >
                <svg className="fill-theme-secondary bg-blend-multiply transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* Themes logo */}
                <div className="absolute aspect-hex-flat w-full bg-theme-primary transition-[background-color] [mask-image:url(/svg/PaintBrushOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter" />
            </button>

            {/* empty */}
            <button
                className="group peer absolute flex size-full rotate-0 cursor-pointer items-center justify-center transition-transform"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${75}% + ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="2"
                title="2"
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* Themes logo */}
                <div className="absolute aspect-hex-flat w-full bg-theme-primary transition-[background-color] [mask-image:url(/svg/PaintBrushOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter" />
            </button>

            {/* Close */}
            <CloseSubMenu />

            {/* Title */}
            <div className='pointer-events-none absolute size-full transform-gpu font-lato before:absolute before:top-1/2 before:z-10 before:w-full before:-translate-y-1/2 before:select-none before:text-center before:text-sm before:leading-none before:text-theme-secondary-lighter before:peer-hover-active:peer-data-[title=2]:content-["2"] before:peer-hover-active:peer-data-[title=Radius]:content-["Radius"] before:peer-hover-active:peer-data-[title=Theme]:content-["Theme"]' />
        </div>
    );
};

export default Settings;

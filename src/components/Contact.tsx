import { Link } from 'react-router-dom';
import { CSSProperties, useCallback, useState } from 'react';
import { useZustand } from '../lib/zustand';
import useOutsideClick from '../hooks/useOutsideClick'; // TODO replace with useClickAway ?
import { classNames } from 'cpts-javascript-utilities';
import { CloseSubMenu } from './HamburgerMenu';

const Contact = () => {
    const menuButtonPosAndSize = useZustand((store) => store.values.activeSubMenuButton.positionAndSize);
    const [hasMounted, setHasMounted] = useState(false);
    const [_mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
    const clickRef = useOutsideClick(() => setMobileMenuIsOpen(false));

    const refCallback = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                clickRef.current = elem;

                /* delaying for one tick so <nav>'s transition takes place */
                const timer = setTimeout(() => {
                    setHasMounted(true);
                    clearTimeout(timer);
                }, 0);
            }
        },
        [clickRef],
    );

    /* style icons dynamically */
    const subMenuButtonsMargin = menuButtonPosAndSize ? menuButtonPosAndSize.width * 0.1 : 0;

    return (
        <menu
            ref={refCallback}
            className={classNames(
                'pointer-events-auto absolute transform-gpu transition-transform delay-75 duration-300',
                hasMounted ? 'rotate-90' : 'rotate-0',
            )}
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
            {/* Linkedin */}
            <button
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                data-title="LinkedIn"
                title="LinkedIn"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `${0}%`,
                              '--tw-translate-y': `calc(${100}% + ${subMenuButtonsMargin}px)`,
                          } as CSSProperties)
                        : undefined
                }
                onClick={() => (window.location.href = 'https://www.linkedin.com/in/jensbrandenburg')}
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/logo_linkedin.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </button>

            {/* github */}
            <button
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                data-title="GitHub"
                title="GitHub"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${-75}% - ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${50}% + ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                onClick={() => (window.location.href = 'https://github.com/cptSwing')}
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/logo_github.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </button>

            {/* email */}
            <button
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${-75}% - ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="Email"
                title="Email"
                onClick={() => (window.location.href = 'mailto:jens@jbrandenburg.de')}
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/EnvelopeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </button>

            {/* 3D Stores */}
            <label
                htmlFor="menu-stores-input"
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `${0}%`,
                              '--tw-translate-y': `calc(${-100}% - ${subMenuButtonsMargin}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="Stores"
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" strokeWidth={0} viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/CubeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />

                <input id="menu-stores-input" type="checkbox" className="peer/stores-input group/stores-input-group hidden" />

                {/* list of Stores */}
                <div className="absolute top-1/2 size-full -translate-y-1/2 transform-gpu text-xs text-theme-secondary opacity-0 transition-opacity peer-checked/stores-input:opacity-100 peer-checked/stores-input:*:clip-inset-0">
                    <Link
                        to="https://www.cgtrader.com/designers/cptswing"
                        className="absolute block translate-x-[-90%] translate-y-[-62.5%] rotate-[-150deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter"
                    >
                        CGTrader
                    </Link>
                    <Link
                        to="https://www.turbosquid.com/Search/Artists/cptSwing"
                        className="absolute block translate-x-[-1%] translate-y-[-208%] rotate-[-90deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter"
                    >
                        TurboSquid
                    </Link>
                    <Link
                        to="https://www.printables.com/@cptSwing_2552270"
                        className="absolute block translate-x-[102.5%] translate-y-[-66%] rotate-[-30deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter"
                    >
                        Printables
                    </Link>
                    <Link
                        to="https://www.thingiverse.com/cptswing/designs"
                        className="absolute block translate-x-[90%] translate-y-[192.5%] rotate-[210deg] transform-gpu rounded-l-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-l-full hover-active:text-theme-primary-lighter"
                    >
                        Thingiverse
                    </Link>
                </div>
            </label>

            {/* About */}
            <button
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${75}% + ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${-50}% - ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="About"
                title="About"
                // onClick={() => (window.location.href = 'mailto:jens@jbrandenburg.de')}
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/EnvelopeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </button>

            {/* CV */}
            <button
                className="group peer absolute flex size-full translate-x-0 translate-y-0 transform-gpu cursor-pointer items-center justify-center transition-transform duration-500"
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${75}% + ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${50}% + ${subMenuButtonsMargin / 2}px)`,
                          } as CSSProperties)
                        : undefined
                }
                data-title="CV"
                title="CV"
                // onClick={() => (window.location.href = 'mailto:jens@jbrandenburg.de')}
            >
                <svg className="fill-theme-secondary transition-[fill] group-hover-active:fill-theme-secondary-darker" viewBox="0 0 1 0.866">
                    <use href="#svgRoundedHexagon-default-path" />
                </svg>

                {/* logo */}
                <div
                    className={classNames(
                        'absolute aspect-hex-flat w-full transform-gpu bg-theme-primary transition-[transform,background-color] delay-[300ms,0ms] [mask-image:url(/svg/EnvelopeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </button>

            {/* Close */}
            <CloseSubMenu />

            {/* Title */}
            <div
                className={classNames(
                    'transform-gpu font-lato before:peer-hover-active:peer-data-[title=About]:content-["About"] before:peer-hover-active:peer-data-[title=CV]:content-["CV"] before:peer-hover-active:peer-data-[title=Email]:content-["Email"] before:peer-hover-active:peer-data-[title=GitHub]:content-["GitHub"] before:peer-hover-active:peer-data-[title=LinkedIn]:content-["LinkedIn"] before:peer-hover-active:peer-data-[title=Stores]:content-["Stores"]',
                    'before:absolute before:top-1/2 before:z-10 before:w-full before:-translate-y-1/2 before:select-none before:text-center before:text-sm before:leading-none before:text-theme-secondary-lighter',
                    'pointer-events-none absolute size-full transform-gpu',
                    hasMounted ? '-rotate-90' : 'rotate-0',
                )}
            />
        </menu>
    );
};

export default Contact;

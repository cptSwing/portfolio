import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakPoint';
import { CSSProperties, useCallback, useState } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';
import { useZustand } from '../lib/zustand';
import useOutsideClick from '../hooks/useOutsideClick'; // TODO replace with useClickAway ?
import { CloseSubMenu } from './MenuToggle';
import classNames from '../lib/classNames';

const NUM_SUBMENU_ITEMS = 4;
const _shouldRotate = NUM_SUBMENU_ITEMS % 2 === 0;

const Socials = () => {
    const menuButtonPosAndSize = useZustand((store) => store.values.activeMenuButton.positionAndSize);

    const [hasMounted, setHasMounted] = useState(false);

    const _isDesktop = useBreakpoint('sm');
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
        <nav
            ref={refCallback}
            className={classNames(
                'pointer-events-auto absolute aspect-hex-flat origin-center transition-transform delay-75 duration-300',
                hasMounted ? 'rotate-90' : 'rotate-0',
            )}
            style={
                menuButtonPosAndSize &&
                ({
                    width: menuButtonPosAndSize.width,
                    left: menuButtonPosAndSize.x,
                    bottom: `calc(100% - ${menuButtonPosAndSize.y + menuButtonPosAndSize.height}px)`,
                } as CSSProperties)
            }
        >
            {/* Linkedin */}
            <Link
                className='group/linkedin peer absolute size-full translate-x-0 translate-y-0 cursor-pointer transition-transform duration-500'
                data-title='LinkedIn'
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `${0}%`,
                              '--tw-translate-y': `calc(${100}% + ${subMenuButtonsMargin}px)`,
                              // '--tw-scale-x': '1.2',
                              // '--tw-scale-y': '1.2',
                          } as CSSProperties)
                        : undefined
                }
                to='https://www.linkedin.com/in/jensbrandenburg'
            >
                <RoundedHexagonSVG
                    classNames='absolute stroke-theme-secondary-lighter/50 left-0 top-0 fill-theme-secondary group-hover-active/linkedin:fill-theme-secondary-darker transition-[fill] -z-50 h-auto'
                    strokeWidth={subMenuButtonsMargin}
                />
                {/* logo */}
                <div
                    className={classNames(
                        'size-full bg-theme-primary transition-[transform,background-color] delay-[300ms,0] [mask-image:url(/svg/logo_linkedin.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active/linkedin:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </Link>

            {/* github */}
            <Link
                className='group/github peer absolute size-full translate-x-0 translate-y-0 cursor-pointer transition-transform duration-500'
                to='https://github.com/cptSwing'
                data-title='GitHub'
                style={
                    hasMounted
                        ? ({
                              '--tw-translate-x': `calc(${-75}% - ${subMenuButtonsMargin * 0.866}px)`,
                              '--tw-translate-y': `calc(${50}% + ${subMenuButtonsMargin / 2}px)`,
                              // '--tw-scale-x': '1.2',
                              // '--tw-scale-y': '1.2',
                          } as CSSProperties)
                        : undefined
                }
            >
                <RoundedHexagonSVG
                    classNames='absolute stroke-theme-secondary-lighter/50 left-0 top-0  fill-theme-secondary group-hover-active/github:fill-theme-secondary-darker transition-[fill] -z-50 h-auto'
                    strokeWidth={subMenuButtonsMargin}
                />

                {/* logo */}
                <div
                    className={classNames(
                        'size-full bg-theme-primary transition-[transform,background-color] delay-[300ms,0] [mask-image:url(/svg/logo_github.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:60%] group-hover-active/github:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </Link>

            {/* email */}
            <Link
                className='group/email peer absolute size-full translate-x-0 translate-y-0 cursor-pointer transition-transform duration-500'
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
                data-title='Email'
                to='mailto:jens@jbrandenburg.de'
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active/email:fill-theme-secondary-darker transition-[fill]  -z-50 h-auto'
                    strokeWidth={subMenuButtonsMargin}
                />

                {/* logo */}
                <div
                    className={classNames(
                        'size-full bg-theme-primary transition-[transform,background-color] delay-[300ms,0] [mask-image:url(/svg/EnvelopeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:60%] group-hover-active/email:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />
            </Link>

            {/* 3D Stores */}
            <div
                className='group/stores peer absolute size-full translate-x-0 translate-y-0 transition-transform duration-500'
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
                data-title='Stores'
            >
                <RoundedHexagonSVG
                    classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active/stores:fill-theme-secondary-darker transition-[fill]  -z-50 h-auto'
                    strokeWidth={subMenuButtonsMargin}
                />

                {/* logo */}
                <div
                    className={classNames(
                        'size-full bg-theme-primary transition-[transform,background-color] delay-[300ms,0] [mask-image:url(/svg/CubeOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:60%] group-hover-active/stores:bg-theme-primary-lighter',
                        hasMounted ? '-rotate-90' : 'rotate-0',
                    )}
                />

                {/* list of Stores */}
                <div className='absolute top-1/2 size-full -translate-y-1/2 text-xs text-theme-secondary opacity-0 hover-active:opacity-100 group-hover-active/stores:opacity-100'>
                    <Link
                        to='https://www.cgtrader.com/designers/cptswing'
                        className='absolute block translate-x-[-90%] translate-y-[-62.5%] rotate-[-150deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter group-hover-active/stores:clip-inset-0'
                    >
                        CGTrader
                    </Link>
                    <Link
                        to='https://www.turbosquid.com/Search/Artists/cptSwing'
                        className='absolute block translate-x-[-1%] translate-y-[-208%] rotate-[-90deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter group-hover-active/stores:clip-inset-0'
                    >
                        TurboSquid
                    </Link>
                    <Link
                        to='https://www.printables.com/@cptSwing_2552270'
                        className='absolute block translate-x-[102.5%] translate-y-[-66%] rotate-[-30deg] transform-gpu rounded-r-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-r-full hover-active:text-theme-primary-lighter group-hover-active/stores:clip-inset-0'
                    >
                        Printables
                    </Link>
                    <Link
                        to='https://www.thingiverse.com/cptswing/designs'
                        className='absolute block translate-x-[90%] translate-y-[192.5%] rotate-[210deg] transform-gpu rounded-l-lg bg-neutral-500 px-1.5 py-1.5 no-underline transition-[clip-path,background-color] duration-300 clip-inset-l-full hover-active:text-theme-primary-lighter group-hover-active/stores:clip-inset-0'
                    >
                        Thingiverse
                    </Link>
                </div>
            </div>

            {/* Close */}
            <CloseSubMenu />

            {/* Title */}
            <div
                className={classNames(
                    'before:peer-hover-active:peer-data-[title=Email]:content-["Email"] before:peer-hover-active:peer-data-[title=GitHub]:content-["GitHub"] before:peer-hover-active:peer-data-[title=LinkedIn]:content-["LinkedIn"] before:peer-hover-active:peer-data-[title=Stores]:content-["Stores"]',
                    'before:absolute before:top-1/2 before:z-10 before:w-full before:-translate-y-1/2 before:select-none before:text-center before:text-sm before:leading-none before:text-theme-secondary-lighter',
                    'pointer-events-none absolute size-full transform-gpu',
                    hasMounted ? '-rotate-90' : 'rotate-0',
                )}
            />
        </nav>
    );
};

export default Socials;

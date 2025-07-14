import { ChevronDoubleUpIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import classNames from '../lib/classNames';
import { useBreakpoint } from '../hooks/useBreakPoint';
import { CSSProperties, FC, useCallback, useState } from 'react';

const store_toggleMenu = useZustand.getState().methods.store_toggleMenu;

// TODO replace with useClickAway ?
import useOutsideClick from '../hooks/useOutsideClick';
import RoundedHexagonSVG from './RoundedHexagonSVG';
import { ZustandStore } from '../types/types';
import { useZustand } from '../lib/zustand';

const Socials: FC<{ position?: ZustandStore['values']['menuState']['position'] }> = ({ position }) => {
    const [socialsSize, setSocialsSize] = useState({ width: 0, height: 0 });

    const isDesktop = useBreakpoint('sm');
    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

    const clickRef = useOutsideClick(() => setMobileMenuIsOpen(false));

    const refCallback = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                clickRef.current = elem;
                const { width, height } = elem.getBoundingClientRect();
                setSocialsSize({ width, height });
            }
        },
        [clickRef],
    );

    return (
        <nav
            ref={refCallback}
            className={classNames(
                'pointer-events-auto absolute flex -translate-x-1/2 flex-col items-center justify-start',
                mobileMenuIsOpen ? 'pointer-events-auto !fixed h-screen !w-fit flex-col !items-start bg-gray-500/95' : '',
            )}
            style={
                position && {
                    left: `${position.x + position.width / 2}px`,
                    top: `calc(${position.y - socialsSize.height}px - ${position.height * 0.25}px)`,
                }
            }
        >
            {/* Menu Icons */}
            <div
                className={classNames('group flex items-center justify-center')}
                onClick={() => {
                    if (!isDesktop) {
                        setMobileMenuIsOpen(true);
                    }
                }}
            >
                {/* Linkedin */}
                <Link
                    className={classNames('group/linkedin relative aspect-hex-flat translate-x-[0.5vw] translate-y-1/2 cursor-pointer')}
                    style={{ width: position ? `${position.width * 1.2}px` : '4vw' }}
                    to='https://www.linkedin.com/in/jensbrandenburg'
                >
                    <RoundedHexagonSVG
                        classNames='absolute stroke-theme-secondary-lighter/50 left-0 top-0 fill-theme-secondary group-hover-active/linkedin:fill-theme-secondary-darker transition-[fill] duration-300 -z-50 h-auto'
                        style={position && { strokeWidth: socialsSize.height * 0.125 }}
                    />
                    <div className='size-full bg-theme-primary transition-[background-color] duration-300 [mask-image:url(/svg/logo_linkedin.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:50%] group-hover-active/linkedin:bg-theme-primary-lighter' />
                </Link>

                {/* github */}
                <Link
                    className={classNames('group/github relative aspect-hex-flat cursor-pointer')}
                    to='https://github.com/cptSwing'
                    style={{ width: position ? `${position.width * 1.2}px` : '4vw' }}
                >
                    <RoundedHexagonSVG
                        classNames='absolute stroke-theme-secondary-lighter/50 left-0 top-0  fill-theme-secondary group-hover-active/github:fill-theme-secondary-darker transition-[fill] duration-300 -z-50 h-auto'
                        style={position && { strokeWidth: socialsSize.height * 0.125 }}
                    />
                    <div className='size-full bg-theme-primary transition-[background-color] duration-300 [mask-image:url(/svg/logo_github.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:60%] group-hover-active/github:bg-theme-primary-lighter' />
                </Link>

                {/* email */}
                <Link
                    className={classNames(
                        'group/email relative flex aspect-hex-flat translate-x-[-0.5vw] translate-y-1/2 cursor-pointer items-center justify-center',
                    )}
                    style={{ width: position ? `${position.width * 1.2}px` : '4vw' }}
                    to='mailto:jens@jbrandenburg.de'
                >
                    <RoundedHexagonSVG
                        classNames='absolute left-0 top-0 fill-theme-secondary stroke-theme-secondary-lighter/50 group-hover-active/email:fill-theme-secondary-darker transition-[fill] duration-300 -z-50 h-auto'
                        style={position && { strokeWidth: socialsSize.height * 0.125 }}
                    />
                    <EnvelopeIcon
                        className='w-3/5 stroke-theme-primary stroke-[length:2] transition-[stroke] duration-300 group-hover-active/email:stroke-theme-primary-lighter'
                        style={{ strokeWidth: socialsSize.height * 0.025 }}
                    />
                </Link>

                <div className='peer absolute bottom-full left-1/2 mb-[0.333vw] hidden aspect-square w-0 -translate-x-1/2 cursor-pointer transition-[colors,width,padding] delay-[calc(var(--delay)/2)] sm:block sm:group-hover-active:w-[2vw] sm:group-hover-active:delay-500'>
                    <ChevronDoubleUpIcon className='aspect-square h-full stroke-theme-primary-darker stroke-[length:2px] sm:hover:!stroke-theme-primary' />
                </div>

                <div
                    className={classNames(
                        'group/threed absolute bottom-[calc(100%+2vw)] left-1/2 mb-[0.333vw] hidden w-auto -translate-x-1/2 transform-gpu flex-col items-start gap-y-0.5 text-center text-2xs leading-none text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 clip-inset-0 sm:flex sm:w-0 sm:flex-row sm:items-center sm:gap-x-0 sm:clip-inset-t-full sm:peer-hover:w-auto sm:peer-hover:gap-x-1.5 sm:peer-hover:clip-inset-0 sm:hover:w-auto sm:hover:gap-x-1.5 sm:hover:clip-inset-0',

                        mobileMenuIsOpen ? '!flex' : '',
                    )}
                >
                    {mobileMenuIsOpen && <div className='mb-1 mt-4 text-[--theme-text]'>3D Portals:</div>}
                    <Link
                        to='https://www.cgtrader.com/designers/cptswing'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:ml-1 sm:px-1 sm:hover:text-theme-secondary'
                    >
                        CGTrader
                    </Link>
                    <Link
                        to='https://www.turbosquid.com/Search/Artists/cptSwing'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-theme-secondary'
                    >
                        TurboSquid
                    </Link>
                    <Link
                        to='https://www.printables.com/@cptSwing_2552270'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-theme-secondary'
                    >
                        Printables
                    </Link>
                    <Link
                        to='https://www.thingiverse.com/cptswing/designs'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-theme-secondary'
                    >
                        Thingiverse
                    </Link>
                </div>
            </div>

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
                    style={position && { strokeWidth: socialsSize.height * 0.125 }}
                />
                <div className='size-full bg-theme-primary transition-[background-color] duration-300 [mask-image:url(/svg/XMarkOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:55%] group-hover-active:bg-theme-primary-lighter' />
            </div>

            {/* Name */}
            <div
                className={classNames(
                    'absolute select-none italic text-theme-secondary-lighter after:absolute after:left-[-5%] after:top-[-1%] after:-z-10 after:h-[102%] after:w-[110%] after:bg-theme-primary/50 after:p-2',
                    mobileMenuIsOpen ? 'right-0 !mt-2 -mr-1 !block origin-top-right transition-none [transform:rotate(90deg)_translate(100%,0)]' : '',
                )}
                style={position && { top: `calc(100% + ${position.height}px + ${0.666 * 4}vw)` }}
            >
                jens brandenburg
            </div>
        </nav>
    );
};

export default Socials;

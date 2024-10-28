import { ChevronDoubleRightIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import GithubLogo from '../assets/svg/logo_github.svg?react';
import LinkedInLogo from '../assets/svg/logo_linkedin.svg?react';
import classNames from '../lib/classNames';
import { useBreakpoint } from '../hooks/useBreakPoint';
import { useState } from 'react';
import useOutsideClick from '../hooks/useOutsideClick';
import Settings from './Settings';

const Socials = () => {
    const isDesktop = useBreakpoint('sm');
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const { postId } = useParams();

    const clickRef = useOutsideClick(() => setOpenMobileMenu(false));

    return (
        <nav
            ref={clickRef}
            className={classNames(
                'absolute left-0 top-0 z-50 flex w-full items-end justify-start gap-1 pl-0.5 pt-2 sm:bottom-0 sm:top-auto sm:p-0',
                openMobileMenu
                    ? 'pointer-events-auto !fixed h-screen !w-fit flex-col !items-start bg-gray-500/95'
                    : postId
                      ? 'bottom-0 top-auto !w-fit pt-0'
                      : '',
            )}
            // onClick={() => {
            //     if (!isDesktop && openMobileMenu) {
            //         setOpenMobileMenu(false);
            //     }
            // }}
        >
            {/* Name */}
            <div
                className={classNames(
                    'absolute -mb-0.5 hidden whitespace-nowrap text-nowrap font-caveat text-xl tracking-tight text-[--color-secondary-active-cat] transition-[opacity,transform] group-hover/app:translate-y-full group-hover/app:opacity-0 sm:block sm:translate-y-0 sm:hover:translate-y-full',
                    openMobileMenu ? 'right-0 !mt-2 -mr-1 !block origin-top-right transition-none [transform:rotate(90deg)_translate(100%,0)]' : '',
                )}
            >
                jens brandenburg
            </div>

            {/* Menu Icon */}
            <div
                className={classNames(
                    '[--delay:150ms]',
                    'group pointer-events-auto relative mb-1 flex h-8 w-8 transform-gpu cursor-pointer select-none flex-col items-center justify-start gap-0 overflow-hidden rounded-full bg-transparent p-1 outline outline-[--color-bars-post] transition-[clip-path,transform,column-gap,opacity]',
                    'sm:h-10 sm:w-auto sm:translate-y-full sm:flex-row sm:items-center sm:bg-[--color-bars-no-post] sm:opacity-0 sm:outline-0 sm:clip-inset-b-full',
                    'group-hover/app:translate-y-1/3 group-hover/app:opacity-100 group-hover/app:clip-inset-b-1/3 group-hover/app:clip-inset-t-[calc(theme(spacing.1)*-1)] hover:!translate-y-0 hover:gap-x-1.5 hover:!delay-0 hover:!clip-inset-b-0',
                    openMobileMenu
                        ? '!h-screen !w-auto !items-start gap-y-2 !rounded-none opacity-100 outline-0'
                        : postId
                          ? '!-mb-0.5 !rounded-none !rounded-tr-md opacity-100 outline-2 sm:!mb-0.5 sm:!rounded-full'
                          : 'opacity-50 outline-2',
                )}
                onClick={() => {
                    if (!isDesktop) {
                        setOpenMobileMenu(true);
                    }
                }}
            >
                <UserIcon
                    className={classNames(
                        'z-0 aspect-square w-auto cursor-pointer stroke-[--color-bars-post] transition-colors sm:h-full sm:group-hover:stroke-neutral-700 sm:hover:!stroke-[--theme-primary-400]',
                        openMobileMenu ? 'hidden' : '',
                    )}
                />
                {/* {!openMobileMenu && (
                    <div className='-z-10 -mt-[100%] flex size-full flex-col items-center justify-between px-px pb-1 pt-2 opacity-50 sm:hidden'>
                        <div className='h-px w-full bg-[--color-bars-no-post]' />
                        <div className='h-px w-full bg-[--color-bars-no-post]' />
                        <div className='h-px w-full bg-[--color-bars-no-post]' />
                    </div>
                )} */}

                <Link
                    className={classNames(
                        'hidden aspect-square w-0 cursor-pointer rounded-sm bg-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1 sm:block sm:hover:!bg-[--theme-primary-400]',
                        openMobileMenu ? '!block !size-12 !p-2' : '',
                    )}
                    to='https://linkedin.com/cptSwing'
                >
                    <LinkedInLogo className='h-fit w-full max-w-20 fill-neutral-50' />
                </Link>

                <Link
                    className={classNames(
                        'hidden aspect-square w-0 cursor-pointer rounded-sm bg-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1 sm:block sm:hover:!bg-[--theme-primary-400]',
                        openMobileMenu ? '!block !size-12 !p-2' : '',
                    )}
                    to='https://github.com/cptSwing'
                >
                    <GithubLogo className='h-fit w-full max-w-20 fill-neutral-50' />
                </Link>

                <Link
                    className={classNames(
                        'hidden aspect-square w-0 cursor-pointer rounded-sm bg-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1 sm:block sm:hover:!bg-[--theme-primary-400]',
                        openMobileMenu ? '!block !size-12 !p-2' : '',
                    )}
                    to='mailto:jens@jbrandenburg.de'
                >
                    <EnvelopeIcon className='h-fit w-full max-w-20 stroke-neutral-50 stroke-[length:2px]' />
                </Link>

                <div className='peer hidden aspect-square w-0 cursor-pointer p-0 transition-[colors,width,padding] delay-[calc(var(--delay)/2)] group-hover:w-6 group-hover:delay-500 sm:block'>
                    <ChevronDoubleRightIcon className='aspect-square h-full stroke-neutral-600 stroke-[length:2px] sm:hover:!stroke-[--theme-primary-400]' />
                </div>

                <div
                    className={classNames(
                        'group/threed hidden w-auto transform-gpu flex-col items-start gap-y-0.5 p-0 text-center text-2xs leading-none text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 clip-inset-0 peer-hover:w-auto peer-hover:gap-x-1.5 peer-hover:px-0.5 peer-hover:clip-inset-0 hover:w-auto hover:gap-x-1.5 hover:px-0.5 hover:clip-inset-0 sm:flex sm:w-0 sm:-translate-x-2 sm:flex-row sm:items-center sm:gap-x-0 sm:clip-inset-r-full',

                        openMobileMenu ? '!flex' : '',
                    )}
                >
                    {openMobileMenu && <div className='mb-1 mt-4 text-[--theme-text]'>3D Portals:</div>}
                    <Link
                        to='https://www.cgtrader.com/designers/cptswing'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:ml-1 sm:px-1 sm:hover:text-[--theme-primary-400]'
                    >
                        CGTrader
                    </Link>
                    <Link
                        to='https://www.turbosquid.com/Search/Artists/cptSwing'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-[--theme-primary-400]'
                    >
                        TurboSquid
                    </Link>
                    <Link
                        to='https://www.printables.com/@cptSwing_2552270'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-[--theme-primary-400]'
                    >
                        Printables
                    </Link>
                    <Link
                        to='https://www.thingiverse.com/cptswing/designs'
                        className='w-full cursor-pointer rounded-sm bg-neutral-600 px-3 py-1.5 transition-colors sm:px-1 sm:hover:text-[--theme-primary-400]'
                    >
                        Thingiverse
                    </Link>
                </div>
            </div>

            <div
                className={classNames(
                    'group pointer-events-auto relative mb-1 hidden aspect-square h-auto transform-gpu cursor-pointer select-none self-center rounded-full bg-transparent p-1 outline outline-[--theme-primary-400] transition-[clip-path,transform,column-gap,opacity] sm:flex sm:self-auto',
                    'sm:h-8 sm:w-auto sm:translate-y-full sm:flex-row sm:items-center sm:bg-[--color-bars-no-post] sm:opacity-0 sm:outline-0 sm:clip-inset-b-full',
                    'group-hover/app:translate-y-1/3 group-hover/app:opacity-100 group-hover/app:delay-75 group-hover/app:clip-inset-b-1/3 hover:!translate-y-0 hover:gap-x-1.5 hover:!delay-0 hover:!clip-inset-b-0',
                    openMobileMenu ? 'mb-2 mt-[100%] !flex w-12 !items-start opacity-100 outline-0' : postId ? '!mb-0.5' : '',
                )}
            >
                <Settings />
            </div>
        </nav>
    );
};

export default Socials;

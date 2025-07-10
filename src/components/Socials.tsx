import { ChevronDoubleRightIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import classNames from '../lib/classNames';
import { useBreakpoint } from '../hooks/useBreakPoint';
import { useState } from 'react';

// TODO replace with useClickAway ?
import useOutsideClick from '../hooks/useOutsideClick';

const Socials = () => {
    const isDesktop = useBreakpoint('sm');
    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

    const clickRef = useOutsideClick(() => setMobileMenuIsOpen(false));

    return (
        <nav
            ref={clickRef}
            className={classNames(
                'fixed left-1/2 right-0 top-0 z-50 flex items-center justify-start gap-1 pl-0.5 pt-2',
                mobileMenuIsOpen ? 'pointer-events-auto !fixed h-screen !w-fit flex-col !items-start bg-gray-500/95' : '',
            )}
        >
            {/* Name */}
            <div
                className={classNames(
                    mobileMenuIsOpen ? 'right-0 !mt-2 -mr-1 !block origin-top-right transition-none [transform:rotate(90deg)_translate(100%,0)]' : '',
                )}
            >
                jens brandenburg
            </div>

            {/* Menu Icon */}
            <div
                className={classNames('group flex items-center justify-center gap-1')}
                onClick={() => {
                    if (!isDesktop) {
                        setMobileMenuIsOpen(true);
                    }
                }}
            >
                <UserIcon
                    className={classNames(
                        'z-0 aspect-square w-12 cursor-pointer stroke-theme-primary transition-colors sm:h-full sm:hover:!cursor-default sm:group-hover-active:stroke-theme-primary-lighter',
                        mobileMenuIsOpen ? 'hidden' : '',
                    )}
                />

                <Link
                    className={classNames(
                        'aspect-square w-10 cursor-pointer rounded-sm bg-theme-secondary p-0.5 transition-[colors,width,padding] sm:block sm:group-hover:w-[1.75rem] sm:group-hover:p-1',
                        mobileMenuIsOpen ? '!block !size-12 !p-2' : '',
                    )}
                    to='https://www.linkedin.com/in/jensbrandenburg'
                >
                    <div className='size-full bg-theme-primary [mask-image:url(/svg/logo_linkedin.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%]' />
                </Link>

                <Link
                    className={classNames(
                        'aspect-square w-10 cursor-pointer rounded-sm bg-theme-secondary p-0.5 transition-[colors,width,padding] sm:block sm:group-hover:w-[1.75rem] sm:group-hover:p-1',
                        mobileMenuIsOpen ? '!block !size-12 !p-2' : '',
                    )}
                    to='https://github.com/cptSwing'
                >
                    <div className='size-full bg-theme-primary [mask-image:url(/svg/logo_github.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%]' />
                </Link>

                <Link
                    className={classNames(
                        'hidden aspect-square w-10 cursor-pointer rounded-sm bg-theme-secondary p-0.5 transition-[colors,width,padding] active:*:stroke-[--theme-primary-400] sm:block sm:group-hover:w-[1.75rem] sm:group-hover:p-0.5 sm:hover:*:stroke-[--theme-primary-400]',
                        mobileMenuIsOpen ? '!block !size-12 !p-2' : '',
                    )}
                    to='mailto:jens@jbrandenburg.de'
                >
                    <EnvelopeIcon className='h-fit w-full max-w-20 stroke-theme-primary stroke-[length:2px]' />
                </Link>

                <div className='peer hidden aspect-square w-0 cursor-pointer p-0 transition-[colors,width,padding] delay-[calc(var(--delay)/2)] sm:block sm:group-hover:w-6 sm:group-hover:delay-500'>
                    <ChevronDoubleRightIcon className='aspect-square h-full stroke-theme-primary-darker stroke-[length:2px] sm:hover:!stroke-[--theme-primary-400]' />
                </div>

                <div
                    className={classNames(
                        'group/threed hidden w-auto transform-gpu flex-col items-start gap-y-0.5 p-0 text-center text-2xs leading-none text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 clip-inset-0 sm:flex sm:w-0 sm:-translate-x-2 sm:flex-row sm:items-center sm:gap-x-0 sm:clip-inset-r-full sm:peer-hover:w-auto sm:peer-hover:gap-x-1.5 sm:peer-hover:px-0.5 sm:peer-hover:clip-inset-0 sm:hover:w-auto sm:hover:gap-x-1.5 sm:hover:px-0.5 sm:hover:clip-inset-0',

                        mobileMenuIsOpen ? '!flex' : '',
                    )}
                >
                    {mobileMenuIsOpen && <div className='mb-1 mt-4 text-[--theme-text]'>3D Portals:</div>}
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
        </nav>
    );
};

export default Socials;

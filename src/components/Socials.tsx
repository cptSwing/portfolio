import { ChevronDoubleRightIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import GithubLogo from '../assets/svg/logo_github.svg?react';
import LinkedInLogo from '../assets/svg/logo_linkedin.svg?react';
import classNames from '../lib/classNames';

const Socials = () => {
    const { postId } = useParams();

    return (
        <nav
            className={classNames(
                'absolute bottom-full z-50 flex w-full transform-gpu items-end justify-between',
                postId ? 'left-[calc((theme(width.screen)-var(--post-width))/2)]' : 'left-0',
            )}
        >
            <div
                className={classNames(
                    'absolute -mb-1 font-caveat text-xl tracking-tight text-[--color-secondary-active-cat] transition-[opacity,transform] group-hover/bar-parent:translate-y-full group-hover/bar-parent:opacity-0',
                    // postId ? 'order-2 mt-2 self-start' : '',
                )}
            >
                (jens brandenburg)
            </div>

            <div
                className={classNames(
                    '[--delay:150ms]',
                    'group pointer-events-auto relative mb-1 flex h-8 w-auto translate-y-full select-none flex-row items-center gap-x-0 overflow-hidden rounded-full bg-[--color-bars-no-post] p-1 opacity-0 transition-[transform,column-gap,opacity] clip-inset-b-full',
                    'group-hover/bar-parent:translate-y-0 group-hover/bar-parent:opacity-100 group-hover/bar-parent:clip-inset-b-0 hover:gap-x-1.5 hover:!delay-0',
                )}
            >
                <UserIcon className='aspect-square h-full cursor-pointer stroke-[--color-bars-post] transition-colors group-hover:stroke-theme-neutral-600' />

                <Link
                    className='aspect-square w-0 cursor-pointer rounded-sm bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1'
                    to='https://linkedin.com/cptSwing'
                >
                    <LinkedInLogo className='size-full fill-theme-neutral-50' />
                </Link>

                <Link
                    className='aspect-square w-0 cursor-pointer rounded-sm bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1'
                    to='https://github.com/cptSwing'
                >
                    <GithubLogo className='size-full fill-theme-neutral-50' />
                </Link>

                <Link
                    className='aspect-square w-0 cursor-pointer rounded-sm bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-[1.75rem] group-hover:p-1'
                    to='mailto:jens@jbrandenburg.de'
                >
                    <EnvelopeIcon className='size-full stroke-theme-neutral-50 stroke-[length:2px]' />
                </Link>

                <div className='peer aspect-square w-0 cursor-pointer p-0 transition-[colors,width,padding] delay-[calc(var(--delay/2))] group-hover:w-6 group-hover:delay-500'>
                    <ChevronDoubleRightIcon className={classNames('aspect-square h-full stroke-theme-neutral-600 stroke-[length:2px]')} />
                </div>

                <div
                    className={classNames(
                        'group/threed flex w-0 items-center gap-x-0 p-0 text-center text-xs text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 peer-hover:w-auto peer-hover:gap-x-1.5 peer-hover:px-0.5 peer-hover:clip-inset-0 hover:w-auto hover:gap-x-1.5 hover:px-0.5 hover:clip-inset-0',
                        // postId ? 'flex-row-reverse clip-inset-r-full' : 'flex-row clip-inset-l-full',
                        'flex-row-reverse clip-inset-r-full',
                    )}
                >
                    <Link to='https://www.printables.com' className='cursor-pointer rounded-sm bg-theme-neutral-600 px-1 py-1.5 transition-colors'>
                        Printables
                    </Link>
                    <Link to='https://www.thingiverse.com' className='cursor-pointer rounded-sm bg-theme-neutral-600 px-1 py-1.5 transition-colors'>
                        Thingiverse
                    </Link>
                    <Link to='https://www.turbosquid.com' className='cursor-pointer rounded-sm bg-theme-neutral-600 px-1 py-1.5 transition-colors'>
                        TurboSquid
                    </Link>
                    <Link to='https://www.cgtrader.com' className='cursor-pointer rounded-sm bg-theme-neutral-600 px-1 py-1.5 transition-colors'>
                        CGTrader
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Socials;

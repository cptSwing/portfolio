import { ChevronDoubleLeftIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import GithubLogo from '../assets/svg/logo_github.svg?react';
import LinkedInLogo from '../assets/svg/logo_linkedin.svg?react';
import classNames from '../lib/classNames';

const Socials = () => {
    const { postId } = useParams();

    return (
        <nav
            className={classNames(
                'absolute bottom-full z-50 mb-0.5 flex translate-y-full transform-gpu flex-col items-center justify-center transition-[transform,clip-path] delay-[--delay] clip-inset-b-full [--delay:150ms] group-hover/bar-parent:translate-y-1/2 group-hover/bar-parent:clip-inset-b-1/2 hover:!translate-y-0 hover:!delay-0 hover:!clip-inset-b-0',
                postId ? 'left-[calc((theme(width.screen)-var(--post-width))/2)]' : 'right-0',
            )}
        >
            <div
                className={classNames(
                    'group relative flex h-8 select-none items-center gap-x-0 overflow-hidden bg-theme-secondary-400 px-0.5 transition-[column-gap] delay-[--delay] hover:gap-x-1.5',
                    postId ? 'flex-row rounded-tl-md' : 'flex-row-reverse rounded-tr-md',
                )}
            >
                <IdentificationIcon className='aspect-square h-full cursor-pointer stroke-theme-primary-400 transition-colors group-hover:stroke-theme-neutral-600' />

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
                    <ChevronDoubleLeftIcon
                        className={classNames('aspect-square h-full stroke-theme-neutral-600 stroke-[length:2px]', postId ? 'rotate-180' : '')}
                    />
                </div>

                <div
                    className={classNames(
                        'group/threed flex w-0 items-center gap-x-0 p-0 text-center text-xs text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 peer-hover:w-auto peer-hover:gap-x-1.5 peer-hover:px-0.5 peer-hover:clip-inset-0 hover:w-auto hover:gap-x-1.5 hover:px-0.5 hover:clip-inset-0',
                        postId ? 'flex-row-reverse clip-inset-r-full' : 'flex-row clip-inset-l-full',
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

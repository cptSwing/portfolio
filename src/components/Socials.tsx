import { ChevronLeftIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import GithubLogo from '../assets/svg/logo_github.svg?react';
import LinkedInLogo from '../assets/svg/logo_linkedin.svg?react';

const Socials = () => {
    const { postId } = useParams();

    return !postId ? (
        <nav className='absolute bottom-full right-0 mb-0.5 flex translate-y-full flex-col items-center justify-center transition-[transform,clip-path] delay-[--delay] clip-inset-b-full [--delay:150ms] group-hover/bar-parent:translate-y-1/2 group-hover/bar-parent:clip-inset-b-1/2 hover:!translate-y-0 hover:!delay-0 hover:!clip-inset-b-0'>
            <div className='group relative flex h-10 select-none flex-row-reverse items-center gap-x-0 overflow-hidden rounded-t-md bg-theme-secondary-400 px-0.5 transition-[column-gap] delay-[--delay] hover:gap-x-1.5'>
                <IdentificationIcon className='aspect-square h-full cursor-pointer stroke-theme-primary-400 transition-colors group-hover:stroke-theme-neutral-600' />

                <Link
                    className='h-auto w-0 cursor-pointer rounded-md bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-8 group-hover:p-1'
                    to='https://linkedin.com/cptSwing'
                >
                    <LinkedInLogo className='size-full fill-theme-neutral-50' />
                </Link>

                <Link
                    className='h-auto w-0 cursor-pointer rounded-md bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-8 group-hover:p-1'
                    to='https://github.com/cptSwing'
                >
                    <GithubLogo className='size-full fill-theme-neutral-50' />
                </Link>

                <Link
                    className='h-auto w-0 cursor-pointer rounded-md bg-theme-neutral-600 p-0 transition-[colors,width,padding] delay-[--delay] group-hover:w-8 group-hover:p-1'
                    to='mailto:jens@jbrandenburg.de'
                >
                    <EnvelopeIcon className='size-full stroke-theme-neutral-50 stroke-[length:2px]' />
                </Link>

                <div className='peer h-auto w-0 cursor-pointer rounded-md border-0 border-theme-neutral-600 p-0 transition-[colors,border-width,width,padding] delay-[calc(var(--delay/2))] group-hover:w-8 group-hover:border-[3px] group-hover:p-1 group-hover:delay-500'>
                    <ChevronLeftIcon className='aspect-square h-full stroke-theme-neutral-50 stroke-[length:3px]' />
                </div>

                <div className='group/threed flex w-0 items-center gap-x-0 p-0 text-center text-xs text-gray-100/20 transition-[column-gap,clip-path,padding] duration-300 clip-inset-l-full peer-hover:w-auto peer-hover:gap-x-1.5 peer-hover:px-0.5 peer-hover:clip-inset-l-0 hover:w-auto hover:gap-x-1.5 hover:px-0.5 hover:clip-inset-l-0'>
                    <Link to='https://www.printables.com' className='cursor-pointer rounded-md bg-theme-neutral-600 px-1 py-2 transition-colors'>
                        Printables
                    </Link>
                    <Link to='https://www.thingiverse.com' className='cursor-pointer rounded-md bg-theme-neutral-600 px-1 py-2 transition-colors'>
                        Thingiverse
                    </Link>
                    <Link to='https://www.turbosquid.com' className='cursor-pointer rounded-md bg-theme-neutral-600 px-1 py-2 transition-colors'>
                        TurboSquid
                    </Link>
                    <Link to='https://www.cgtrader.com' className='cursor-pointer rounded-md bg-theme-neutral-600 px-1 py-2 transition-colors'>
                        CGTrader
                    </Link>
                </div>
            </div>
        </nav>
    ) : null;
};

export default Socials;

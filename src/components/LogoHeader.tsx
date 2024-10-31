import { useParams } from 'react-router-dom';
import classNames from '../lib/classNames';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import Socials from './Socials';
import { bars_totalDuration } from '../lib/animationValues';

const logoText = 'webdev\n& 3d things';

const LogoHeader = () => {
    const { catId, postId } = useParams();

    const [refCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'text-upwards',
            animationDuration: 250,
            animationDelay: 0,
            animationFillMode: 'forwards',
            animationIterationCount: 1,
        },
        startDelay: bars_totalDuration,
        hiddenAtStart: true,
    });

    return (
        <header
            id='logo'
            ref={refCallback}
            className={classNames(
                'min-h-[--header-height]bars_totalDuration pointer-events-none relative mt-2 flex h-[--header-height] select-none flex-col items-end justify-end transition-[margin,width,height,color] duration-[--header-transition-duration]',
                catId ? (postId ? 'w-[--post-width] !flex-row !justify-start' : 'w-[--checked-width]') : 'w-[--unchecked-width] !cursor-default',
            )}
        >
            <>
                <Socials />
            </>

            <div
                className={classNames(
                    'text-stroke-outer text-theme-accent-300 relative z-10 font-protest-strike sm:[font-size:4rem]',
                    'before:transition-[-webkit-text-stroke-color,-webkit-text-stroke-width,opacity] before:content-[attr(data-title)]',
                    postId
                        ? 'hidden whitespace-nowrap text-left leading-none text-transparent opacity-25 [-webkit-text-stroke-color:--color-bars-post] [-webkit-text-stroke-width:1px] before:!content-[] sm:block'
                        : 'whitespace-pre text-right leading-[0.875] text-[--theme-accent-300] [font-size:3rem] before:absolute before:right-0 before:-z-10 before:whitespace-pre before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:5px]',
                )}
                data-title={postId ? '' : logoText}
            >
                {postId ? '' : logoText}
            </div>
        </header>
    );
};

export default LogoHeader;

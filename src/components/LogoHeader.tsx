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
                    'text-stroke-outer relative z-10 whitespace-pre text-right leading-[0.875] text-[--theme-accent-300] [font-size:3rem] sm:[font-size:4rem]',
                    'before:absolute before:right-0 before:-z-10 before:whitespace-pre before:transition-[-webkit-text-stroke-color,-webkit-text-stroke-width,opacity] before:content-[attr(data-title)] before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:5px]',
                    postId ? 'hidden' : '',
                )}
                data-title={postId ? '' : logoText}
            >
                {postId ? '' : logoText}
            </div>
        </header>
    );
};

export default LogoHeader;

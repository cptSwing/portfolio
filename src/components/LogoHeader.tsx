import { useParams } from 'react-router-dom';
import classNames from '../lib/classNames';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import Socials from './Socials';

const logoText = 'webdev & 3d things';
const logoTextNewLine = 'webdev\n& 3d things';

const LogoHeader = () => {
    const { catId, postId } = useParams();

    const [refCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'text-upwards',
            animationDuration: 250,
            animationDelay: 1000,
            animationFillMode: 'backwards',
        },
        startDelay: 0,
        hiddenAtStart: false,
    });

    return (
        <header
            id='logo'
            ref={refCallback}
            className={classNames(
                'pointer-events-none relative -mb-px mt-2 flex h-[--header-height] select-none flex-col items-end justify-end transition-[margin,width,height,color] duration-[--header-transition-duration]',
                catId ? (postId ? '!mb-0 w-[--post-width] !flex-row !justify-start' : 'w-[--checked-width]') : 'w-[--unchecked-width] !cursor-default',
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
                        : 'whitespace-pre text-right leading-[0.85] text-[--theme-accent-300] [font-size:3rem] before:absolute before:right-0 before:-z-10 before:whitespace-pre before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:5px]',
                )}
                data-title={postId ? logoText : logoTextNewLine}
            >
                {postId ? logoText : logoTextNewLine}
            </div>
        </header>
    );
};

export default LogoHeader;

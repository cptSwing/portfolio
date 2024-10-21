import { useNavigate, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import Socials from './Socials';

const logoText = 'webdev & 3d things';
const logoTextNewLine = 'webdev\n& 3d things';

const LogoHeader = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

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
                'relative -mb-px mt-2 flex cursor-pointer select-none flex-col items-end justify-end transition-[margin,width,height,color] duration-[--header-transition-duration]',
                catId
                    ? postId
                        ? '!z-0 !mb-0 !h-10 w-[--post-width] !flex-row !justify-start sm:!h-16'
                        : 'w-[--checked-width]'
                    : 'w-[--unchecked-width] !cursor-default',
            )}
            onClick={() => {
                navigate('/');
            }}
        >
            <Socials />

            <span
                className={classNames(
                    'text-stroke-outer relative z-10 font-protest-strike text-theme-accent-300 [font-size:4rem]',
                    'before:transition-[-webkit-text-stroke-color,-webkit-text-stroke-width,opacity] before:content-[attr(data-title)]',
                    postId
                        ? 'text-left leading-none text-transparent [-webkit-text-stroke-width:2px] before:left-0 before:whitespace-nowrap before:opacity-0 before:[-webkit-text-stroke-color:--color-bars-post] before:[-webkit-text-stroke-width:1px] sm:before:opacity-25'
                        : 'whitespace-pre-wrap text-right leading-[0.85] before:right-0 before:whitespace-pre-wrap before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:6px]',
                )}
                data-title={postId ? logoText : logoTextNewLine}
            >
                {postId ? logoText : logoTextNewLine}
            </span>
        </header>
    );
};

export default LogoHeader;

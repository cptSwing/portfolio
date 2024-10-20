import { useNavigate, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';

const LogoHeader = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    return (
        <header
            id='logo'
            className={classNames(
                'z-10 -mb-px mt-2 flex transform-gpu cursor-pointer select-none flex-col items-end justify-end transition-[margin,width,height,color] duration-[--header-transition-duration]',
                catId ? (postId ? '!mb-0 !h-16 w-[--post-width] !flex-row !justify-start' : 'w-[--checked-width]') : 'w-[--unchecked-width]',
            )}
            onClick={() => {
                navigate('/');
            }}
        >
            <span
                className={classNames(
                    'text-stroke-outer relative font-protest-strike leading-[0.85] [font-size:4rem]',
                    'before:transition-[-webkit-text-stroke-color,-webkit-text-stroke-width] before:content-[attr(data-title)]',
                    postId
                        ? 'text-left text-transparent before:left-0 before:whitespace-nowrap before:[-webkit-text-stroke-color:theme(colors.red.500)] before:[-webkit-text-stroke-width:1px]'
                        : 'text-right text-theme-accent-300 before:right-0 before:whitespace-pre-wrap before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:6px]',
                )}
                data-title={postId ? 'webdev & 3d things' : 'webdev\n& 3d things'}
            >
                webdev{!postId && <br />}& 3d things
            </span>
            {/* <span
                    className={classNames(
                        'font-caveat text-xl leading-[0] tracking-tight text-[--color-secondary-active-cat] [-webkit-text-stroke-width:0]',
                        postId ? 'order-2 mt-2 self-start' : '',
                    )}
                >
                    (jens brandenburg)
                </span> */}
            {/* <span
                className='text-stroke-outer relative before:content-[attr(data-title)] before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:6px]'
                data-title={'& 3d things'}
            >
                & 3d things
            </span> */}
        </header>
    );
};

export default LogoHeader;

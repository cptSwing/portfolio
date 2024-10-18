import { useNavigate, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';

const LogoHeader = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    return (
        <header
            id='logo'
            className={classNames(
                'z-10 -mb-px mt-2 flex transform-gpu cursor-pointer select-none flex-col items-end justify-end text-right font-protest-strike leading-[0.85] text-theme-accent-300 transition-[margin,width,height,color] duration-[--header-transition-duration] [font-size:4rem]',
                catId
                    ? postId
                        ? '!mb-0 !h-16 w-[--post-width] !flex-row !text-transparent [-webkit-text-stroke-color:theme(colors.red.500)] ![-webkit-text-stroke-width:1px]'
                        : 'w-[--checked-width]'
                    : 'w-[--unchecked-width]',
            )}
            onClick={() => {
                navigate('/');
            }}
        >
            <span>webdev</span>
            <div className='flex w-full items-baseline justify-between'>
                <span
                    className={classNames(
                        'font-caveat text-xl leading-[0] tracking-tight text-[--color-secondary-active-cat] [-webkit-text-stroke-width:0]',
                        postId ? 'order-2 mt-2 self-start' : '',
                    )}
                >
                    (jens brandenburg)
                </span>
                <span
                    className='text-stroke-outer relative before:content-[attr(data-title)] before:[-webkit-text-stroke-color:--bg-color] before:[-webkit-text-stroke-width:6px]'
                    data-title={'& 3d things'}
                >
                    & 3d things
                </span>
            </div>
        </header>
    );
};

export default LogoHeader;

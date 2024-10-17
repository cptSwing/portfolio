import { useNavigate, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';

const LogoHeader = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    return (
        <header
            id='logo'
            className={classNames(
                'mb-1 mt-4 w-[--unchecked-width] transform-gpu cursor-pointer select-none bg-theme-primary-50/50 p-2 pt-4 transition-[margin,height,color] duration-[--header-transition-duration]',
                postId
                    ? 'ml-[calc(theme(width.screen)-var(--post-width))] mr-[100%] h-16 translate-x-3/4 text-theme-primary-400'
                    : 'mx-auto h-24 translate-x-0 py-2 text-theme-accent-400',
            )}
            onClick={() => {
                navigate('/');
            }}
        >
            <div className='text-right'>
                <div className='font-protest-strike text-5xl leading-none text-theme-accent-300'>webdev & 3d things</div>
                <div className='pr-0.5 font-caveat text-xl leading-none text-theme-accent-50'>jens brandenburg</div>
            </div>
            {/* <svg viewBox='0 0 91 23' version='1.1' className='h-full w-fit' preserveAspectRatio='none' id='logo-svg' xmlns='http://www.w3.org/2000/svg'>
                <g x='0' y='0'>
                    <text xmlSpace='preserve' dx='90.5' dy='0' className='' style={{ textAnchor: 'end', textAlign: 'end', dominantBaseline: 'hanging' }}>
                        <tspan className='fill-theme-neutral-800 font-barlow text-3xs font-extrabold uppercase'>Brandenburg</tspan>
                        <tspan dx='-57' dy='3.3' className='fill-theme-accent-400/50 font-protest-revolution lowercase tracking-tight [font-size:0.3rem]'>
                            jens
                        </tspan>
                    </text>

                    <text
                        xmlSpace='preserve'
                        dx='87.75'
                        dy='3'
                        className='fill-theme-secondary-300 text-end font-caveat text-xl tracking-tight drop-shadow-sm [text-anchor:end]'
                        style={{ dominantBaseline: 'hanging' }}
                        data-title='_webdev &amp; 3d'
                    >
                        _webdev &amp; 3d
                    </text>
                </g>
            </svg> */}
        </header>
    );
};

export default LogoHeader;

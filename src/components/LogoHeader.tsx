import { useNavigate, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';

const LogoHeader = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    return (
        <header
            id='logo'
            className={classNames(
                'transform-gpu cursor-pointer select-none pt-1 transition-[margin,height,color] duration-[--header-transition-duration]',
                postId ? 'ml-0 mr-[100%] h-16 translate-x-1/2 text-theme-primary-400' : 'mx-auto h-32 translate-x-0 py-2 text-theme-accent-400',
            )}
            onClick={() => {
                navigate('/');
            }}
        >
            <svg viewBox='0 0 91 23' version='1.1' className='h-full w-fit' preserveAspectRatio='none' id='logo-svg' xmlns='http://www.w3.org/2000/svg'>
                <g x='0' y='0'>
                    <text
                        xmlSpace='preserve'
                        dx='90.5'
                        dy='0'
                        className=''
                        // style='font-size:18.5493px;line-height:0.7;font-family:Calibri;font-variant-position:sub;text-align:end;letter-spacing:-1px;text-anchor:end;fill:#ff0000;stroke-width:1.54411;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.3'
                        style={{ textAnchor: 'end', textAlign: 'end', dominantBaseline: 'hanging' }}
                    >
                        <tspan
                            // style='letter-spacing:-1px;fill:#ff0000;stroke-width:1.54411'
                            className='fill-theme-neutral-800 font-barlow text-3xs font-extrabold uppercase'
                        >
                            Brandenburg
                        </tspan>
                        <tspan
                            dx='-57'
                            dy='3.3'
                            className='fill-theme-accent-400/50 font-protest-revolution lowercase tracking-tight [font-size:0.3rem]'

                            /* style='letter-spacing:-0.756319px;fill:#008000;stroke-width:0.953399' */
                        >
                            jens
                        </tspan>
                    </text>

                    <text
                        xmlSpace='preserve'
                        // style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:32px;line-height:0.7;font-family:Arial;-inkscape-font-specification:'Arial, Normal';font-variant-ligatures:normal;font-variant-position:sub;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;word-spacing:0.02px;text-anchor:end;fill:#000000;stroke-width:3.32976;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.3"
                        dx='87.75'
                        dy='3'
                        className='fill-theme-secondary-300 text-end font-caveat text-xl tracking-tight drop-shadow-sm [text-anchor:end]'
                        style={{ dominantBaseline: 'hanging' }}
                        data-title='_webdev &amp; 3d'
                    >
                        _webdev &amp; 3d
                    </text>
                </g>
            </svg>
        </header>
    );
};

export default LogoHeader;

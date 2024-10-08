import { useParams } from 'react-router-dom';
import classNames from '../lib/classNames';

const LogoHeader = () => {
    const { postId } = useParams();

    return (
        <header
            id='logo'
            className={classNames(
                'w-fit transform-gpu cursor-pointer select-none transition-[margin,transform,height,color] duration-[--header-transition-duration]',
                postId ? 'ml-0 mr-[100%] min-h-20 translate-x-1/2 text-theme-primary-400' : 'ml-0 min-h-28 translate-x-0 py-2 text-theme-accent-400',
            )}
            onClick={() => {}}
        >
            <svg height='100%' viewBox='-36 0 103 25' version='1.1' id='logo-svg' xmlns='http://www.w3.org/2000/svg'>
                <g id='layer1' transform='translate(-77.964769,-127.41715)'>
                    <text xmlSpace='preserve' x='144.90642' y='140.45578' id='text1'>
                        <tspan
                            id='tspan1'
                            className='fill-current stroke-none'
                            style={{
                                fontSize: `${16.9333}px`,
                                lineHeight: 0.7,
                                fontFamily: 'Arial',
                                textAlign: 'end',
                                textAnchor: 'end',
                                // fill: '#000000',
                                fillOpacity: 1,
                                strokeWidth: 0.2,
                                strokeDasharray: 'none',
                            }}
                            x='144.90642'
                            y='140.45578'
                        >
                            <tspan style={{ fontSize: `${16.9333}px`, lineHeight: 0.7, fontFamily: 'Calibri', fontVariantPosition: 'sub' }} id='tspan3'>
                                j
                            </tspan>
                            Brandenburg
                        </tspan>
                        <tspan
                            className='fill-current stroke-none'
                            style={{
                                fontSize: `${10.5833}px`,
                                lineHeight: 0.7,
                                fontFamily: 'Times New Roman',
                                textAlign: 'end',
                                textAnchor: 'end',
                                fillOpacity: 1,
                                strokeWidth: 1,
                                strokeDasharray: 'none',
                            }}
                            x='144.90642'
                            y='150'
                            id='tspan2'
                        >
                            this is a logo
                        </tspan>
                    </text>
                </g>
            </svg>
        </header>
    );
};

export default LogoHeader;

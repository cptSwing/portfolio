import classNames from '../lib/classNames';

const LogoHeader = () => {
    return (
        <header
            id='logo'
            className={classNames(
                'absolute transition-[left,top,transform]',
                'left-1/2 top-[calc(50%-(theme(spacing.96)/2))] -translate-x-1/2 -translate-y-full select-none',
            )}
        >
            <LogoSvg />
            <hr className={classNames('-ml-[50%] mb-3 mt-2 w-[200%]')} />
        </header>
    );
};

export default LogoHeader;

const LogoSvg = () => {
    return (
        <svg width={200} height={75} viewBox='0 0 67 24' version='1.1' id='logo-svg' xmlns='http://www.w3.org/2000/svg'>
            <defs id='defs1' />
            <g id='layer1' transform='translate(-77.964769,-127.41715)'>
                <text xmlSpace='preserve' x='144.90642' y='140.45578' id='text1'>
                    <tspan
                        id='tspan1'
                        style={{
                            fontSize: `${16.9333}px`,
                            lineHeight: 0.7,
                            fontFamily: 'Built Titling',
                            textAlign: 'end',
                            textAnchor: 'end',
                            fill: '#000000',
                            fillOpacity: 1,
                            stroke: 'none',
                            strokeWidth: 0.881,
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
                        style={{
                            fontSize: `${10.5833}px`,
                            lineHeight: 0.7,
                            fontFamily: 'Calibri',
                            textAlign: 'end',
                            textAnchor: 'end',
                            fill: '#000000',
                            fillOpacity: 1,
                            stroke: 'none',
                            strokeWidth: 0.881,
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
    );
};

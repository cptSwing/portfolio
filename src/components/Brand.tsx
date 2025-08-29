import { FC } from 'react';
import FitText from './utilityComponents/FitText';
import { Flipped } from 'react-flip-toolkit';

const FlippedBrand: FC = () => {
    return (
        <Flipped flipId={'brand'} transformOrigin="50% -100%">
            {(flippedProps) => <Brand flippedProps={flippedProps} />}
        </Flipped>
    );
};

const Brand: FC<{ flippedProps: object }> = ({ flippedProps }) => {
    return (
        <div
            {...flippedProps}
            className="sm:post-cards-grid-brand-area-desktop backdrop-glassmorphic post-cards-grid-brand-area-mobile pointer-events-none z-50 mx-auto flex w-auto select-none flex-col items-end justify-center rounded-lg text-theme-primary"
        >
            <FitText text="jens brandenburg" className="h-1/5 w-fit leading-none tracking-tight" />
            <FitText text="web developer" className="h-[12.5%] w-fit leading-none tracking-tight" />
            <FitText text="& 3d artist" className="h-[12.5%] w-fit leading-none tracking-tight" />
        </div>
    );
};

export default FlippedBrand;

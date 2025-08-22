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
            className="sm:post-cards-grid-brand-area-desktop post-cards-grid-brand-area-mobile pointer-events-none relative -z-50 flex select-none flex-col items-center justify-center text-theme-primary"
        >
            <FitText text="jens brandenburg" classes="leading-none tracking-tight h-1/5 mx-auto w-[65%]" />
            <FitText text="webdev / 3d art" classes="leading-none tracking-tight h-[12.5%] mx-auto w-[65%]" />
        </div>
    );
};

export default FlippedBrand;

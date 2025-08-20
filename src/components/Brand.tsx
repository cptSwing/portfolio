import { FC } from 'react';
import FitText from './utilityComponents/FitText';

const Brand: FC<{ flippedProps: object }> = ({ flippedProps }) => {
    return (
        <div
            {...flippedProps}
            className="sm:post-cards-grid-brand-area-desktop post-cards-grid-brand-area-mobile relative z-50 flex select-none flex-col items-center justify-center text-theme-primary"
        >
            <FitText text="jens brandenburg" classes="leading-none tracking-tight h-1/5 mx-auto w-[65%]" />
            <FitText text="webdev / 3d art" classes="leading-none tracking-tight h-[12.5%] mx-auto w-[65%]" />
        </div>
    );
};

export default Brand;

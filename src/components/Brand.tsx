import { CSSProperties, FC, useContext, useMemo } from 'react';
import FitText from './utilityComponents/FitText';
import { calcCSSVariables } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { brandTransformData } from '../lib/hexagonElements';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';

const Brand: FC = () => {
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);
    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = brandTransformData[routeName];
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {});
    }, [containerSize, routeName]);

    return (
        <div
            className={classNames(
                'transform-hexagon pointer-events-none absolute z-50 flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none flex-col justify-center transition-transform duration-[calc(var(--ui-animation-menu-transition-duration)*3)] before:absolute before:left-[-25%] before:top-[34.5%] before:-z-10 before:h-[35%] before:w-[150%] before:rounded-2xl before:mask-edges-x-[5%] before:mask-edges-y-[15%]',
                routeName === ROUTE.home ? 'items-center before:bg-transparent' : 'items-end before:bg-theme-root-background/[0.1]',
            )}
            style={cssVariables_Memo as CSSProperties}
        >
            <FitText text="jens brandenburg" className="h-1/5 w-full font-lato leading-none tracking-tighter text-theme-primary" />
            <FitText
                text="web developer & 3d artist"
                className="-mt-[2%] mr-[2%] h-[10%] w-auto max-w-full font-lato leading-none tracking-tighter text-theme-primary-darker"
            />
        </div>
    );
};

export default Brand;

import { FC } from 'react';
import classNames from '../lib/classNames';
import NavMenu from './NavMenu';
import TocMenu from './TocMenu';
import { ParallaxMenuLayer } from './ParallaxLayers';

const MenuWrapper: FC<{
    isNavMenu: boolean;
    positionClassNames: string;
}> = ({ isNavMenu, positionClassNames }) => {
    const menuClassNames = 'rounded-md bloom-svg pointer-events-none absolute border-2 border-slate-400 p-1.5';

    return (
        <>
            <ParallaxMenuLayer
                key={3.7}
                parallaxLevelClassName={'translate-z-[8.5rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />
            <ParallaxMenuLayer
                key={3.8}
                parallaxLevelClassName={'translate-z-[8.75rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />

            <ParallaxMenuLayer
                key={4}
                parallaxLevelClassName={'translate-z-36'}
                extraClassNames='transform'
                content={
                    isNavMenu ? (
                        <NavMenu menuClassNames={classNames(menuClassNames, positionClassNames)} />
                    ) : (
                        <TocMenu menuClassNames={classNames(menuClassNames, positionClassNames)} />
                    )
                }
            />

            <ParallaxMenuLayer
                key={4.1}
                parallaxLevelClassName={'translate-z-[9.25rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />
        </>
    );
};

export default MenuWrapper;

import { FC, ReactNode } from 'react';
import classNames from '../lib/classNames';
import NavMenu from './NavMenu';
import TocMenu from './TocMenu';
import { parallaxHoleDimensionClassNames } from './ParallaxScene';

const MenuWrapper: FC<{
    isNavMenu: boolean;
    positionClassNames: string;
}> = ({ isNavMenu, positionClassNames }) => {
    const menuClassNames = 'rounded-md bloom-svg pointer-events-none absolute border-2 border-slate-400 p-1.5';

    return (
        <>
            <ParallaxMenuItem
                key={3.7}
                parallaxLevelClassName={'translate-z-[8.5rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />
            <ParallaxMenuItem
                key={3.8}
                parallaxLevelClassName={'translate-z-[8.75rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />

            <ParallaxMenuItem
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

            <ParallaxMenuItem
                key={4.1}
                parallaxLevelClassName={'translate-z-[9.25rem]'}
                extraClassNames='transform'
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
            />
        </>
    );
};

export default MenuWrapper;

export const ParallaxMenuItem: FC<{
    content: ReactNode;
    parallaxLevelClassName: string;
    extraClassNames?: string;
}> = ({ content, parallaxLevelClassName, extraClassNames }) => {
    return (
        <div
            className={classNames(
                'absolute bottom-0 left-0 right-0 top-0 m-auto rounded-md',
                parallaxHoleDimensionClassNames,
                parallaxLevelClassName,
                extraClassNames,
            )}
        >
            {content}
        </div>
    );
};

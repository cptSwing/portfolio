import { CSSProperties, FC, memo, useMemo } from 'react';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { ROUTE } from '../types/enums';
import { useZustand } from '../lib/zustand';
import { calcCSSVariables, hamburgerButton, hexagonRouteOffsetValues, menuButtons } from '../lib/hexagonDataNew';
import { MenuButton, MenuButtonSvg, RegularHexagon } from './HexagonTiles';

const HamburgerMenu: FC<{
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuIsActive: boolean;
}> = memo(({ routeName, containerSize, hamburgerMenuIsActive }) => {
    return (
        <div
            className="transform-3d origin-[50%_35vh] transition-transform duration-[--ui-animation-menu-transition-duration]"
            style={
                {
                    '--tw-rotate': hamburgerMenuIsActive ? 'calc(-1 * var(--home-menu-rotation, 0deg))' : '0deg',
                } as CSSProperties
            }
        >
            <RegularHexagon
                data={{
                    [ROUTE.home]: {
                        position: {
                            x: 150,
                            y: 129.9,
                        },
                        rotation: hamburgerMenuIsActive ? -90 : 0,
                        isHalf: false,
                        scale: hamburgerMenuIsActive ? 1.3 : 1,
                        shouldOffset: false,
                    },
                    [ROUTE.category]: {
                        position: {
                            x: 150,
                            y: hamburgerMenuIsActive ? 10 : 0,
                        },
                        rotation: hamburgerMenuIsActive ? -90 : 30,
                        isHalf: false,
                        scale: hamburgerMenuIsActive ? 1.1 : 0.866,
                        shouldOffset: false,
                    },
                    [ROUTE.post]: {
                        position: {
                            x: 75,
                            y: 0,
                        },
                        rotation: 30,
                        isHalf: true,
                        scale: 0,
                        shouldOffset: false,
                    },
                }}
                routeName={routeName}
                containerSize={containerSize}
            />

            {menuButtons.map((menuButtonData, idx) => {
                return (
                    <MenuButton
                        key={`hex-menu-button-index-${idx}`}
                        buttonData={menuButtonData}
                        routeName={routeName}
                        containerSize={containerSize}
                        hamburgerMenuIsActive={hamburgerMenuIsActive}
                        isHamburgerChild
                    />
                );
            })}

            <HamburgerButton routeName={routeName} containerSize={containerSize} hamburgerMenuIsActive={hamburgerMenuIsActive} />
        </div>
    );
});

export default HamburgerMenu;

const HamburgerButton: FC<{
    routeName: ROUTE;
    hamburgerMenuIsActive: boolean;
    containerSize: {
        width: number;
        height: number;
    };
}> = ({ routeName, hamburgerMenuIsActive, containerSize }) => {
    const { name, svgIconPath, target } = hamburgerButton;
    const { position, rotation, scale, shouldOffset } = hamburgerButton[routeName];

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const hamburgerCssVariables_Memo = useMemo(() => {
        const newPosition = routeName === ROUTE.home && hamburgerMenuIsActive ? { x: position.x, y: 95 } : position;

        const style = calcCSSVariables(newPosition, rotation, hamburgerMenuIsActive ? scale * 0.85 : scale, containerSize, {
            shouldOffset,
            offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        });

        if (routeName === ROUTE.home) {
            style['--hexagon-rotate'] = `calc(${style['--hexagon-rotate']} - var(--home-menu-rotation, 0deg))`;
            if (!hamburgerMenuIsActive) {
                style['--hexagon-lighting-gradient-counter-rotation'] = `calc(var(--hexagon-rotate) + var(--home-menu-rotation, 0deg))`;
            } else {
                style['--hexagon-lighting-gradient-counter-rotation'] = `var(--home-menu-rotation)`;
            }
        }

        return style;
    }, [position, hamburgerMenuIsActive, rotation, scale, containerSize, shouldOffset, routeName, breakpoint]);
    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        target(ev);
    }

    return (
        <GlassmorphicButtonWrapper
            name={name}
            isVisible={isVisible}
            isActive={hamburgerMenuIsActive}
            style={hamburgerCssVariables_Memo}
            innerShadowRadius={hamburgerMenuIsActive ? 8 : 0}
            strokeRadius={0}
            lightingGradient
            clickHandler={handleClick}
        >
            <MenuButtonSvg svgIconPath={svgIconPath} counterRotate={routeName === ROUTE.home ? hamburgerMenuIsActive : true} />
        </GlassmorphicButtonWrapper>
    );
};

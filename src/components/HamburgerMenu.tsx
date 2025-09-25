import { CSSProperties, FC, memo, useContext, useMemo } from 'react';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { ROUTE } from '../types/enums';
import { useZustand } from '../lib/zustand';
import {
    calcCSSVariables,
    hamburgerButton,
    hexagonRouteOffsetValues,
    menuButtons,
    menuButtonsHamburgerTransformOffsets,
    offsetHexagonTransforms,
} from '../lib/hexagonDataNew';
import { HexagonModalMenuButton, MenuButtonSvg } from './HexagonShapes';
import GetChildSizeContext from '../contexts/GetChildSizeContext';

const HamburgerMenu: FC<{
    routeName: ROUTE;
    hamburgerMenuIsActive: boolean;
}> = memo(({ routeName, hamburgerMenuIsActive }) => {
    const menuButtons_Memo = useMemo(() => {
        if (hamburgerMenuIsActive) {
            return offsetHexagonTransforms(menuButtons, menuButtonsHamburgerTransformOffsets);
        } else {
            return menuButtons;
        }
    }, [hamburgerMenuIsActive]);

    return (
        <div
            className="transform-3d origin-[50%_35vh] transition-transform duration-[--ui-animation-menu-transition-duration]"
            style={
                {
                    '--tw-rotate': hamburgerMenuIsActive ? 'calc(-1 * var(--home-menu-rotation, 0deg))' : '0deg',
                } as CSSProperties
            }
        >
            {menuButtons_Memo.map((menuButtonData, idx) => {
                return (
                    <HexagonModalMenuButton
                        key={`hex-menu-button-index-${idx}`}
                        buttonData={menuButtonData}
                        routeName={routeName}
                        hamburgerMenuIsActive={hamburgerMenuIsActive}
                    />
                );
            })}

            {/* <HamburgerButton routeName={routeName} hamburgerMenuIsActive={hamburgerMenuIsActive} /> */}
        </div>
    );
});

export default HamburgerMenu;

const HamburgerButton: FC<{
    routeName: ROUTE;
    hamburgerMenuIsActive: boolean;
}> = ({ routeName, hamburgerMenuIsActive }) => {
    const { name, svgIconPath, target } = hamburgerButton;
    const containerSize = useContext(GetChildSizeContext);

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const hamburgerCssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf, shouldOffset } = hamburgerButton[routeName];

        const newPosition = routeName === ROUTE.home && hamburgerMenuIsActive ? { x: position.x, y: 95 } : position;

        const style = calcCSSVariables(newPosition, rotation, hamburgerMenuIsActive ? scale * 0.85 : scale, isHalf, containerSize, {
            strokeWidth: 0,
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
    }, [hamburgerMenuIsActive, containerSize, routeName, breakpoint]);

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        target(ev);
    }

    return (
        <GlassmorphicButtonWrapper
            name={name}
            isActive={hamburgerMenuIsActive}
            style={hamburgerCssVariables_Memo}
            innerShadowRadius={hamburgerMenuIsActive ? 8 : 0}
            strokeRadius={0.85}
            lightingGradient
            clickHandler={handleClick}
        >
            <MenuButtonSvg svgIconPath={svgIconPath} counterRotate={routeName === ROUTE.home ? hamburgerMenuIsActive : true} />
        </GlassmorphicButtonWrapper>
    );
};

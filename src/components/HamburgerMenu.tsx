import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react';
import { useZustand } from '../lib/zustand';
import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { HamburgerMenuButtonName, ZustandStore } from '../types/types';
import { config } from '../types/exportTyped';
import { getMenuButtonPosition } from '../lib/menuFunctions';
import { roundToPixelRatio } from '../lib/shapeFunctions';

const { clipPathWidth, clipPathHeight } = config.ui.hexGrid;
const { store_toggleHamburgerMenu, store_toggleSubMenu, store_cycleTheme } = useZustand.getState().methods;

const HamburgerMenu = () => {
    const { name, positionAndSize } = useZustand((store) => store.values.activeSubMenuButton);
    const hamburgerMenuPositionAndSize_Ref = useRef<ZustandStore['values']['activeSubMenuButton']['positionAndSize']>();

    const [closeButtonOffset, setCloseButtonOffset] = useState<Offset>();
    const [canTransition, setCanTransition] = useState(false);

    const refCallback = useCallback((elem: HTMLMenuElement | null) => {
        if (elem) {
            /* delaying for one tick so <div>'s transition takes place */
            const timer = setTimeout(() => {
                setCanTransition(true);
                clearTimeout(timer);
            }, 10);
        }
    }, []);

    useEffect(() => {
        if (name === 'root-close' && positionAndSize) {
            hamburgerMenuPositionAndSize_Ref.current = positionAndSize;
            setCloseButtonOffset(getCenterOffset(hamburgerMenuPositionAndSize_Ref.current.width, hamburgerMenuPositionAndSize_Ref.current.height));
        }

        // return () => {
        //     hamburgerMenuPositionAndSize_Ref.current = undefined;
        // };
    }, [name, positionAndSize]);

    return (
        <menu
            ref={refCallback}
            className={classNames(
                'absolute transition-transform delay-75 duration-300',
                // canTransition ? 'matrix-rotate-90' : 'matrix-rotate-0',
            )}
            style={
                hamburgerMenuPositionAndSize_Ref.current &&
                ({
                    'width': hamburgerMenuPositionAndSize_Ref.current.width + 'px',
                    'height': hamburgerMenuPositionAndSize_Ref.current.height + 'px',
                    'left': hamburgerMenuPositionAndSize_Ref.current.x + 'px',
                    'top': hamburgerMenuPositionAndSize_Ref.current.y + 'px',

                    '--hamburger-menu-button-scale': hamburgerMenuPositionAndSize_Ref.current.width / clipPathWidth,
                } as CSSProperties)
            }
        >
            {hamburgerMenuPositionAndSize_Ref.current && closeButtonOffset && (
                <HamburgerMenuButton menuItem={rootHamburgerItem} arrayIndex={-1} centerOffset={closeButtonOffset} canTransition={canTransition} />
            )}
        </menu>
    );
};

export default HamburgerMenu;

const HamburgerMenuButton: FC<{
    arrayIndex: number;
    menuItem: MenuItem;
    centerOffset: Offset;
    canTransition: boolean;
}> = ({ arrayIndex, menuItem, centerOffset, canTransition }) => {
    const { name: menuItemName, iconPath: menuItemIconPath, iconSize: menuIconSize, clickHandler: menuItemClickHandler, subMenuItems: menuSubItems } = menuItem;
    const { name: activeMenuItemName, positionAndSize: activePositionAndSize } = useZustand((store) => store.values.activeSubMenuButton);
    const radialPositionAndSize_Ref = useRef<ZustandStore['values']['activeSubMenuButton']['positionAndSize']>();

    const isRootItem = menuItemName === 'root-close';
    const [isRadialCenter, setIsRadialCenter] = useState(false);
    const [offsets, setOffsets] = useState<Offset>(centerOffset);

    useEffect(() => {
        if (activePositionAndSize && canTransition) {
            if ((menuItemName === activeMenuItemName || isRootItem) && menuSubItems?.length) {
                setIsRadialCenter(true);
                radialPositionAndSize_Ref.current = activePositionAndSize;
            } else {
                setIsRadialCenter(false);
                setOffsets(getRadialOffset(arrayIndex, centerOffset));
            }
        }

        return () => {
            radialPositionAndSize_Ref.current = undefined;
        };
    }, [activeMenuItemName, activePositionAndSize, arrayIndex, canTransition, centerOffset, isRootItem, menuItemName, menuSubItems?.length]);

    return (
        <div
            className={classNames(
                'before:absolute before:left-0 before:top-0 before:-z-20 before:size-full before:bg-red-500',
                'absolute flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none justify-center font-fjalla-one text-sm capitalize tracking-wide text-blue-600 transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/3*var(--hamburger-menu-button-transition-delay-multiplier))] duration-[--ui-animation-menu-transition-duration] matrix-scale-[--hamburger-menu-button-scale] hover-active:after:bg-theme-primary-lighter',
                'after:absolute after:left-0 after:top-0 after:-z-10 after:size-full after:bg-theme-primary-lighter/50 after:transition-[background-color,opacity] after:[mask-image:--hamburger-menu-button-icon-mask] after:[mask-position:center] after:[mask-repeat:no-repeat] after:[mask-size:--hamburger-menu-button-icon-size]',
                menuIconSize ? 'items-end' : 'items-center',
                isRadialCenter ? 'before:[clip-path:--hexagon-clip-path-full-stroked]' : 'before:[clip-path:--hexagon-clip-path-full]',
            )}
            style={
                {
                    '--hamburger-menu-button-icon-mask': menuItemIconPath,
                    '--hamburger-menu-button-icon-size': menuIconSize + '%',
                    '--hamburger-menu-button-transition-delay-multiplier': isRadialCenter ? 0 : arrayIndex,
                    '--tw-matrix-e': `${roundToPixelRatio(offsets.left)}`,
                    '--tw-matrix-f': `${roundToPixelRatio(offsets.top)}`,
                } as CSSProperties
            }
            role="button"
            tabIndex={-1}
            onClick={(ev) => {
                if (ev.target === ev.currentTarget) {
                    menuItemClickHandler(ev);
                }
            }}
            onKeyDown={keyDownA11y(menuItemClickHandler)}
        >
            {menuItemName}
            {isRadialCenter && (
                <RadialMenuButtons
                    menuItems={menuSubItems!}
                    parentWidth={radialPositionAndSize_Ref.current!.width}
                    parentHeight={radialPositionAndSize_Ref.current!.width}
                />
            )}
        </div>
    );
};

const defaultCenterOffset = { left: 0, top: 0 };
const RadialMenuButtons: FC<{ menuItems: MenuItem[]; parentWidth: number; parentHeight: number }> = ({ menuItems }) => {
    const [canTransition, setCanTransition] = useState(false);

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            /* delaying for one tick so <div>'s transition takes place */
            const timer = setTimeout(() => {
                setCanTransition(true);
                clearTimeout(timer);
            }, 10);
        }
    }, []);

    useEffect(() => {
        return () => setCanTransition(false);
    }, []);

    return (
        <div ref={refCallback} className="absolute size-full" style={{ '--hamburger-menu-button-scale': 1 } as CSSProperties}>
            {menuItems.map((menuItem, idx) => (
                <HamburgerMenuButton
                    key={`hamburger-menu-item-key-${idx}`}
                    menuItem={menuItem}
                    arrayIndex={idx}
                    centerOffset={defaultCenterOffset}
                    canTransition={canTransition}
                />
            ))}
        </div>
    );
};

const rootHamburgerItem: MenuItem = {
    name: 'root-close',
    iconPath: 'url(/svg/XMarkOutline.svg)',
    iconSize: 65,
    clickHandler: () => store_toggleHamburgerMenu(false),
    subMenuItems: [
        {
            name: 'config',
            subMenuItems: [
                {
                    name: 'radius',
                    iconPath: 'url(/svg/PercentBadgeOutline.svg)',
                    iconSize: 65,
                    clickHandler: () => {},
                },
                {
                    name: 'theme',
                    iconPath: 'url(/svg/PaintBrushOutline.svg)',
                    iconSize: 65,
                    clickHandler: () => store_cycleTheme(),
                },
            ],
            iconPath: 'url(/svg/AdjustmentsHorizontalOutline.svg)',
            iconSize: 65,
            clickHandler: (ev) => store_toggleSubMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            name: 'contact',
            subMenuItems: [
                {
                    name: 'linkedin',
                    iconPath: 'url(/svg/logo_linkedin.svg)',
                    iconSize: 55,
                    clickHandler: () => (window.location.href = 'https://www.linkedin.com/in/jensbrandenburg'),
                },
                {
                    name: 'github',
                    iconPath: 'url(/svg/logo_github.svg)',
                    iconSize: 55,
                    clickHandler: () => (window.location.href = 'https://github.com/cptSwing'),
                },
                {
                    name: 'email',
                    iconPath: 'url(/svg/EnvelopeOutline.svg)',
                    iconSize: 60,
                    clickHandler: () => (window.location.href = 'mailto:jens@jbrandenburg.de'),
                },
                {
                    name: '3D Stores',
                    iconPath: 'url(/svg/CubeOutline.svg)',
                    iconSize: 65,
                    clickHandler: () => {},
                },
            ],
            iconPath: 'url(/svg/ChatBubbleLeftRightOutline.svg)',
            iconSize: 65,
            clickHandler: (ev) => store_toggleSubMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            name: 'login',
            iconPath: 'url(/svg/UserIconOutline.svg)',
            iconSize: 0,
            clickHandler: () => {},
        },
        {
            name: 'empty1',
            iconPath: 'url(/svg/XMarkOutline.svg)',
            iconSize: 65,
            clickHandler: () => {
                console.log('%c[HamburgerMenu]', 'color: #c4cab8', `oh HAI :`);
            },
        },
        { name: 'empty2', iconPath: 'url(/svg/XMarkOutline.svg)', iconSize: 65, clickHandler: () => {} },
        { name: 'empty3', iconPath: 'url(/svg/XMarkOutline.svg)', iconSize: 65, clickHandler: () => {} },
    ],
};

const radialPositions: Offset[] = [
    { left: -80, top: 45.465 },
    { left: 0, top: 90.93 },
    { left: 80, top: 45.465 },
    { left: 80, top: -45.465 },
    { left: 0, top: -90.93 },
    { left: -80, top: -45.465 },
];

function getCenterOffset(width: number, height: number) {
    return { left: roundToPixelRatio((width - clipPathWidth) / 2), top: roundToPixelRatio((height - clipPathHeight) / 2) };
}

function getRadialOffset(index: number, center: Offset) {
    const { left, top } = radialPositions[index];

    return {
        left: center.left + left,
        top: center.top - top,
    };
}

type MenuItem = {
    name: HamburgerMenuButtonName;
    subMenuItems?: MenuItem[];
    iconPath: string;
    iconSize: number;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Offset = {
    left: number;
    top: number;
};

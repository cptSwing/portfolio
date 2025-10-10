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
            /* delaying for one tick so <div>'s transition is triggered safely after mount */
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
                <HamburgerMenuButton
                    menuItem={rootHamburgerItem}
                    scale={hamburgerMenuPositionAndSize_Ref.current.width / clipPathWidth}
                    arrayIndex={-1}
                    centerOffset={closeButtonOffset}
                    canTransition={canTransition}
                />
            )}
        </menu>
    );
};

export default HamburgerMenu;

const HamburgerMenuButton: FC<{
    arrayIndex: number;
    menuItem: MenuItem;
    centerOffset: Offset;
    scale?: number;
    canTransition: boolean;
}> = ({ arrayIndex, menuItem, centerOffset, scale, canTransition }) => {
    const { name: menuItemName, iconPath: menuItemIconPath, iconSize: menuIconSize, clickHandler: menuItemClickHandler, subMenuItems: menuSubItems } = menuItem;
    const activeMenuItemName = useZustand((store) => store.values.activeSubMenuButton.name);

    const isRootItem = menuItemName === 'root-close';
    const [isRadialCenter, setIsRadialCenter] = useState(false);
    const [isActiveRadialCenter, setIsActiveRadialCenter] = useState(false);
    const [offset, setOffset] = useState<Offset>(centerOffset);

    useEffect(() => {
        if (menuSubItems?.length) {
            setIsRadialCenter(true);
            if (activeMenuItemName === menuItemName) {
                setIsActiveRadialCenter(true);
            } else {
                setIsActiveRadialCenter(false);
            }
        } else {
            setIsRadialCenter(false);
        }
    }, [activeMenuItemName, menuItemName, menuSubItems?.length]);

    useEffect(() => {
        if (canTransition && !isActiveRadialCenter) {
            setOffset(getRadialOffset(arrayIndex, centerOffset));
        }
    }, [arrayIndex, canTransition, centerOffset, isActiveRadialCenter, isRadialCenter]);

    useEffect(() => {
        isRadialCenter &&
            console.log('%c[HamburgerMenu]', 'color: #894f95', `isRadialCenter! --> menuItemName, isActiveRadialCenter :`, menuItemName, isActiveRadialCenter);
    }, [isActiveRadialCenter, isRadialCenter, menuItemName]);

    return (
        <div
            className={classNames(
                'pointer-events-auto absolute flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none justify-center font-fjalla-one text-sm capitalize tracking-wide transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/3*var(--hamburger-menu-button-transition-delay-multiplier))] duration-[--ui-animation-menu-transition-duration] matrix-scale-[--hamburger-menu-button-scale] hover-active:after:bg-theme-primary-lighter',
                menuItemIconPath ? 'items-end' : 'items-center',
                isActiveRadialCenter
                    ? 'text-green-600 [--hamburger-menu-button-color:red] [--hamburger-menu-button-opacity:1]'
                    : isRadialCenter
                      ? 'text-blue-600 [--hamburger-menu-button-color:blue]'
                      : 'text-white [--hamburger-menu-button-color:_]',
            )}
            style={
                {
                    '--hamburger-menu-button-scale': isRootItem ? scale : 1,
                    '--hamburger-menu-button-icon-mask': menuItemIconPath,
                    '--hamburger-menu-button-icon-size': (menuIconSize ?? 50) + '%',
                    '--hamburger-menu-button-transition-delay-multiplier': isRadialCenter ? 0 : arrayIndex,
                    '--tw-matrix-e': `${roundToPixelRatio(offset.left)}`,
                    '--tw-matrix-f': `${roundToPixelRatio(offset.top)}`,
                } as CSSProperties
            }
        >
            {(isActiveRadialCenter || isRootItem) && <RadialMenuButtons menuItems={menuSubItems!} />}

            {/* Hex Background and Hex Stroke */}
            <div
                className={classNames(
                    'absolute left-0 top-0 -z-30 size-full bg-[--hamburger-menu-button-color,transparent] opacity-[--hamburger-menu-button-opacity,0.25] transition-[background-color,clip-path] [clip-path:--hexagon-clip-path-full]',
                    'after:absolute after:left-0 after:top-0 after:-z-10 after:size-full after:transition-[background-color] after:[clip-path:--hexagon-clip-path-full-wider-stroke]',
                    menuItemIconPath
                        ? 'before:absolute before:left-0 before:top-0 before:-z-20 before:size-full before:bg-theme-primary-darker before:transition-[background-color,opacity] before:[mask-image:--hamburger-menu-button-icon-mask] before:[mask-position:center] before:[mask-repeat:no-repeat] before:[mask-size:--hamburger-menu-button-icon-size]'
                        : 'before:content-none',
                    isActiveRadialCenter ? 'after:bg-white' : isRadialCenter ? 'after:bg-blue-800' : 'after:bg-blue-400',
                )}
                role="button"
                tabIndex={-1}
                onClick={(ev) => {
                    if (ev.target === ev.currentTarget) {
                        menuItemClickHandler(ev);
                    }
                }}
                onKeyDown={keyDownA11y(menuItemClickHandler)}
            />
            {menuItemName}
        </div>
    );
};

const defaultCenterOffset = { left: 0, top: 0 };
const RadialMenuButtons: FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
    const [canTransition, setCanTransition] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCanTransition(true);
            clearTimeout(timer);
        }, 100);

        return () => setCanTransition(false);
    }, []);

    return (
        <>
            {menuItems.map((menuItem, idx) => (
                <HamburgerMenuButton
                    key={`hamburger-menu-item-key-${idx}`}
                    menuItem={menuItem}
                    arrayIndex={idx}
                    centerOffset={defaultCenterOffset}
                    canTransition={canTransition}
                />
            ))}
        </>
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
                    iconSize: 60,
                    clickHandler: () => {},
                },
                {
                    name: 'theme',
                    iconPath: 'url(/svg/PaintBrushOutline.svg)',
                    iconSize: 60,
                    clickHandler: () => store_cycleTheme(),
                },
            ],
            iconPath: 'url(/svg/AdjustmentsHorizontalOutline.svg)',
            iconSize: 60,
            clickHandler: (ev) => store_toggleSubMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            name: 'contact',
            subMenuItems: [
                {
                    name: 'linkedin',
                    iconPath: 'url(/svg/logo_linkedin.svg)',
                    iconSize: 50,
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
                    subMenuItems: [
                        {
                            name: 'CGTrader',
                            clickHandler: () => (window.location.href = 'https://www.cgtrader.com/designers/cptswing'),
                        },
                        {
                            name: 'TurboSquid',
                            clickHandler: () => (window.location.href = 'https://www.turbosquid.com/Search/Artists/cptSwing'),
                        },
                        {
                            name: 'Printables',
                            clickHandler: () => (window.location.href = 'https://www.printables.com/@cptSwing_2552270'),
                        },
                        {
                            name: 'Thingiverse',
                            clickHandler: () => (window.location.href = 'https://www.thingiverse.com/cptswing/designs'),
                        },
                    ],
                    iconPath: 'url(/svg/CubeOutline.svg)',
                    iconSize: 60,
                    clickHandler: () => {},
                },
            ],
            iconPath: 'url(/svg/ChatBubbleLeftRightOutline.svg)',
            iconSize: 60,
            clickHandler: (ev) => store_toggleSubMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
        },
        {
            name: 'login',
            iconPath: 'url(/svg/UserIconOutline.svg)',
            iconSize: 60,
            clickHandler: () => {},
        },
        {
            name: 'empty1',
            iconPath: 'url(/svg/XMarkOutline.svg)',
            iconSize: 60,
            clickHandler: () => {
                console.log('%c[HamburgerMenu]', 'color: #c4cab8', `oh HAI :`);
            },
        },
        { name: 'empty2', clickHandler: () => {} },
        { name: 'empty3', iconPath: 'url(/svg/XMarkOutline.svg)', clickHandler: () => {} },
    ],
};

const defaultRadialOffsets: Offset[] = [
    { left: -75, top: 43.3 },
    { left: 0, top: 86.6 },
    { left: 75, top: 43.3 },
    { left: 75, top: -43.3 },
    { left: 0, top: -86.6 },
    { left: -75, top: -43.3 },
];

const radialOffsetsWithGutter = getRadialOffsetsWithGutter(0.1);

function getRadialOffsetsWithGutter(gutter: number) {
    const xGutter = clipPathWidth * gutter;
    const yGutter = clipPathHeight * gutter;

    return defaultRadialOffsets.map((offset, idx) => {
        switch (idx) {
            case 0:
                offset.left -= xGutter;
                offset.top += yGutter / 2;
                break;

            case 1:
                offset.top += yGutter;
                break;

            case 2:
                offset.left += xGutter;
                offset.top += yGutter / 2;
                break;

            case 3:
                offset.left += xGutter;
                offset.top -= yGutter / 2;
                break;

            case 4:
                offset.top -= yGutter;
                break;

            case 5:
                offset.left -= xGutter;
                offset.top -= yGutter / 2;
                break;
        }
        return offset;
    });
}

function getCenterOffset(width: number, height: number) {
    return { left: roundToPixelRatio((width - clipPathWidth) / 2), top: roundToPixelRatio((height - clipPathHeight) / 2) };
}

function getRadialOffset(index: number, center: Offset) {
    if (index === -1) {
        return center;
    } else {
        const { left, top } = radialOffsetsWithGutter[index];

        return {
            left: center.left + left,
            top: center.top - top,
        };
    }
}

type MenuItem = {
    name: HamburgerMenuButtonName;
    subMenuItems?: MenuItem[];
    iconPath?: string;
    iconSize?: number;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Offset = {
    left: number;
    top: number;
};

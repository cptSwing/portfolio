import { CSSProperties, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useZustand } from '../lib/zustand';
import { classNames, generateRange, keyDownA11y } from 'cpts-javascript-utilities';
import { HamburgerMenuButtonName, ZustandStore } from '../types/types';
import { config } from '../types/exportTyped';
import { getMenuButtonPosition } from '../lib/menuFunctions';
import { roundToPixelRatio } from '../lib/shapeFunctions';

const { clipPathWidth, clipPathHeight } = config.ui.hexGrid;
const { store_toggleHamburgerMenu, store_toggleSubMenu, store_cycleTheme } = useZustand.getState().methods;

const HamburgerMenu = () => {
    const { name, positionAndSize } = useZustand((store) => store.values.activeSubMenuButton);
    const hamburgerMenuPositionAndSize_Ref = useRef<ZustandStore['values']['activeSubMenuButton']['positionAndSize']>();

    const [closeButtonPosition, setCloseButtonPosition] = useState<Offset>();
    const [hasMounted, setHasMounted] = useState(false);

    const refCallback = useCallback((elem: HTMLMenuElement | null) => {
        if (elem) {
            /* delaying for one tick so <div>'s transition takes place */
            const timer = setTimeout(() => {
                setHasMounted(true);
                clearTimeout(timer);
            }, 0);
        }
    }, []);

    useEffect(() => {
        if (!name && positionAndSize) {
            hamburgerMenuPositionAndSize_Ref.current = positionAndSize;
            setCloseButtonPosition(getCenterOffset(hamburgerMenuPositionAndSize_Ref.current.width, hamburgerMenuPositionAndSize_Ref.current.height));
        }

        return () => setHasMounted(false);
    }, [name, positionAndSize]);

    /* step through theme settings */
    const theme = useZustand((store) => store.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <menu
            ref={refCallback}
            className={classNames(
                'absolute transition-transform delay-75 duration-300',
                // hasMounted ? 'matrix-rotate-90' : 'matrix-rotate-0',
            )}
            style={
                hamburgerMenuPositionAndSize_Ref.current &&
                ({
                    'width': hamburgerMenuPositionAndSize_Ref.current.width,
                    'height': hamburgerMenuPositionAndSize_Ref.current.height,
                    'left': hamburgerMenuPositionAndSize_Ref.current.x,
                    'bottom': `calc(100% - ${hamburgerMenuPositionAndSize_Ref.current.y + hamburgerMenuPositionAndSize_Ref.current.height}px)`,
                    '--hamburger-menu-button-scale': hamburgerMenuPositionAndSize_Ref.current.width / clipPathWidth,
                } as CSSProperties)
            }
        >
            {hamburgerMenuPositionAndSize_Ref.current && closeButtonPosition && (
                <>
                    <RadialMenu
                        menuItems={hamburgerMenuItems}
                        parentWidth={hamburgerMenuPositionAndSize_Ref.current.width}
                        parentHeight={hamburgerMenuPositionAndSize_Ref.current.height}
                        rootMenu
                    />

                    <HamburgerMenuButton
                        arrayIndex={-1}
                        parentMounted={hasMounted}
                        menuName={closeHamburgerMenu.name}
                        centerOffset={closeButtonPosition}
                        iconPath={closeHamburgerMenu.iconPath}
                        clickHandler={closeHamburgerMenu.clickHandler}
                    />
                </>
            )}
        </menu>
    );
};

export default HamburgerMenu;

const RadialMenu: FC<{ menuItems: MenuItem[]; parentWidth: number; parentHeight: number; rootMenu: boolean }> = ({
    menuItems,
    parentWidth,
    parentHeight,
    rootMenu,
}) => {
    const centerOffset = getCenterOffset(parentWidth, parentHeight);
    const [hasMounted, setHasMounted] = useState(false);

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            /* delaying for one tick so <div>'s transition takes place */
            const timer = setTimeout(() => {
                setHasMounted(true);
                clearTimeout(timer);
            }, 0);
        }
    }, []);

    return (
        <div ref={refCallback} className="absolute size-full" style={!rootMenu ? ({ '--hamburger-menu-button-scale': 1 } as CSSProperties) : undefined}>
            {menuItems.map((menuItem, idx) => (
                <HamburgerMenuButton
                    key={`hamburger-menu-item-key-${idx}`}
                    arrayIndex={idx}
                    menuName={menuItem.name}
                    centerOffset={centerOffset}
                    parentMounted={hasMounted}
                    subMenuItems={menuItem.subMenuItems}
                    iconPath={menuItem.iconPath}
                    clickHandler={menuItem.clickHandler}
                />
            ))}
        </div>
    );
};

const HamburgerMenuButton: FC<{
    arrayIndex: number;
    menuName: HamburgerMenuButtonName;
    centerOffset: Offset;
    parentMounted: boolean;
    subMenuItems?: MenuItem[];
    iconPath: string;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ arrayIndex, menuName, centerOffset, parentMounted, subMenuItems, iconPath, clickHandler }) => {
    const { name, positionAndSize } = useZustand((store) => store.values.activeSubMenuButton);
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const isNotCenter = arrayIndex > -1;
    const [offsets, setOffsets] = useState<Offset>();

    useEffect(() => {
        if (positionAndSize && parentMounted) {
            isNotCenter &&
                setOffsets(getRadialOffset(arrayIndex, positionAndSize.width / clipPathWidth, positionAndSize.height / clipPathHeight, centerOffset));

            if (name === menuName && subMenuItems?.length) {
                setSubMenuOpen(true);
            }
        }

        return () => setOffsets(undefined);
    }, [arrayIndex, centerOffset, parentMounted, isNotCenter, positionAndSize, name, menuName, subMenuItems?.length]);

    return (
        <div
            className={classNames(
                'before:absolute before:left-0 before:top-0 before:-z-20 before:size-full before:bg-red-500/50 before:[clip-path:--hexagon-clip-path-full]',
                'group absolute flex aspect-hex-flat w-[--hexagon-clip-path-width] items-center justify-center capitalize transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)*var(--hamburger-menu-button-transition-delay-multiplier))] duration-[--ui-animation-menu-transition-duration] matrix-scale-[--hamburger-menu-button-scale] hover-active:after:bg-theme-primary-lighter',
                'after:absolute after:left-0 after:top-0 after:-z-10 after:size-full after:bg-theme-primary-lighter/50 after:transition-[background-color,opacity] after:[mask-image:--hamburger-menu-button-icon-mask] after:[mask-position:center] after:[mask-repeat:no-repeat] after:[mask-size:55%]',
            )}
            style={
                {
                    '--hamburger-menu-button-icon-mask': iconPath,
                    '--hamburger-menu-button-transition-delay-multiplier': isNotCenter ? arrayIndex : 0,
                    '--tw-matrix-e': offsets ? `${roundToPixelRatio(offsets.left)}` : `${roundToPixelRatio(centerOffset.left)}`,
                    '--tw-matrix-f': offsets ? `${roundToPixelRatio(offsets.top)}` : `${roundToPixelRatio(centerOffset.top)}`,
                } as CSSProperties
            }
            role="button"
            tabIndex={-1}
            onClick={clickHandler}
            onKeyDown={keyDownA11y(clickHandler)}
        >
            {menuName}
            {subMenuOpen && (
                <RadialMenu menuItems={subMenuItems!} parentWidth={positionAndSize!.width} parentHeight={positionAndSize!.width} rootMenu={false} />
            )}
        </div>
    );
};

export const CloseSubMenu = () => {
    return (
        <button
            className="group absolute flex size-full cursor-pointer items-center justify-center peer-hover-active:[--x-mark-opacity:0]"
            onClick={handleClick}
        >
            <svg
                className="fill-theme-secondary-darker stroke-theme-secondary/25 transition-[fill] group-hover-active:fill-theme-secondary"
                strokeWidth={0.1}
                viewBox="0 0 1 0.866"
            >
                <use href="#svgRoundedHexagon-default-path" clipPath="url(#svgRoundedHexagon-default-clipPath)" />
            </svg>

            {/* XMark */}
            <div className="absolute size-full bg-theme-primary-lighter/50 opacity-[--x-mark-opacity] transition-[background-color,opacity] [mask-image:url(/svg/XMarkOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:55%] group-hover-active:bg-theme-primary-lighter" />
        </button>
    );

    function handleClick() {
        store_toggleSubMenu({ name: null });
    }
};

const hamburgerMenuItems: MenuItem[] = [
    {
        name: 'config',
        subMenuItems: [
            {
                name: 'radius',
                iconPath: 'url(/svg/PercentBadgeOutline.svg)',
                clickHandler: () => {},
            },
            {
                name: 'theme',
                iconPath: 'url(/svg/PaintBrushOutline.svg)',
                clickHandler: () => store_cycleTheme(),
            },
        ],
        iconPath: 'url(/svg/AdjustmentsHorizontalOutline.svg)',
        clickHandler: (ev) => ev.target === ev.currentTarget && store_toggleSubMenu({ name: 'config', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },
    {
        name: 'contact',
        subMenuItems: [
            {
                name: 'linkedin',
                iconPath: 'url(/svg/logo_linkedin.svg)',
                clickHandler: () => (window.location.href = 'https://www.linkedin.com/in/jensbrandenburg'),
            },
            {
                name: 'github',
                iconPath: 'url(/svg/logo_github.svg)',
                clickHandler: () => (window.location.href = 'https://github.com/cptSwing'),
            },
            {
                name: 'email',
                iconPath: 'url(/svg/EnvelopeOutline.svg)',
                clickHandler: () => (window.location.href = 'mailto:jens@jbrandenburg.de'),
            },
            {
                name: '3D Stores',
                iconPath: 'url(/svg/CubeOutline.svg)',
                clickHandler: () => {},
            },
        ],
        iconPath: 'url(/svg/ChatBubbleLeftRightOutline.svg)',
        clickHandler: (ev) => ev.target === ev.currentTarget && store_toggleSubMenu({ name: 'contact', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },
    {
        name: 'login',
        iconPath: 'url(/svg/UserIconOutline.svg)',
        clickHandler: (ev) => ev.target === ev.currentTarget && store_toggleSubMenu({ name: 'login', positionAndSize: ev && getMenuButtonPosition(ev) }),
    },
    { name: 'empty1', iconPath: 'url(/svg/XMarkOutline.svg)', clickHandler: () => store_toggleHamburgerMenu(false) },
    { name: 'empty2', iconPath: 'url(/svg/XMarkOutline.svg)', clickHandler: () => store_toggleHamburgerMenu(false) },
    { name: 'empty3', iconPath: 'url(/svg/XMarkOutline.svg)', clickHandler: () => store_toggleHamburgerMenu(false) },
];

const closeHamburgerMenu: MenuItem = { name: 'close', iconPath: 'url(/svg/XMarkOutline.svg)', clickHandler: () => store_toggleHamburgerMenu(false) };

const radialPositions: Offset[] = [
    { left: -82.5, top: 41 },
    { left: 0, top: 82 },
    { left: 82.5, top: 41 },
    { left: 82.5, top: -40 },
    { left: 0, top: -80 },
    { left: -82.5, top: -40 },
];

function getRadialOffsets(positionCount: number, width: number, height: number) {
    const centered = getCenterOffset(width, height);
    const widthRatio = width / clipPathWidth;
    const heightRatio = height / clipPathHeight;

    const positions = generateRange(positionCount).map((_, idx) => getRadialOffset(idx, widthRatio, heightRatio, centered));

    return positions;
}

function getCenterOffset(width: number, height: number) {
    return { left: (width - clipPathWidth) / 2, top: (height - clipPathHeight) / 2 };
}

function getRadialOffset(index: number, widthRatio: number, heightRatio: number, center: Offset) {
    const { left, top } = radialPositions[index];

    return {
        left: center.left + left * widthRatio,
        top: center.top - top * heightRatio,
    };
}

type MenuItem = {
    name: HamburgerMenuButtonName;
    subMenuItems?: MenuItem[];
    iconPath: string;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Offset = {
    left: number;
    top: number;
};

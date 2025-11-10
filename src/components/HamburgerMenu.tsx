import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import { useZustand } from '../lib/zustand';
import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { config } from '../types/exportTyped';
import hamburgerMenuElements from '../lib/hamburgerMenuElements';
import { HamburgerMenuItem } from '../types/types';
import roundToPixelRatio from '../lib/roundToPixelRatio';

const { clipPathWidth, clipPathHeight } = config.ui.hexagonPaths;

const HamburgerMenu = () => {
    const hamburgerMenuRect = useZustand((store) => store.values.hamburgerMenuRect);

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
        if (hamburgerMenuRect) {
            setCloseButtonOffset(getCenterOffset(hamburgerMenuRect.width, hamburgerMenuRect.height));
        }
    }, [hamburgerMenuRect]);

    return (
        <menu
            ref={refCallback}
            className="absolute left-[50dvw] top-[50dvh]"
            style={
                hamburgerMenuRect
                    ? ({
                          transform: `translate(calc(${hamburgerMenuRect.width}px / -2), calc(${hamburgerMenuRect.height}px / -2))`,
                      } as CSSProperties)
                    : undefined
            }
        >
            {hamburgerMenuRect && closeButtonOffset && (
                <HamburgerMenuButton
                    menuItem={hamburgerMenuElements}
                    scale={hamburgerMenuRect.width / clipPathWidth}
                    arrayIndex={-1}
                    zSortingIndex={0}
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
    menuItem: HamburgerMenuItem;
    centerOffset: Offset;
    zSortingIndex: number;
    scale?: number;
    canTransition: boolean;
}> = ({ arrayIndex, menuItem, centerOffset, zSortingIndex, scale, canTransition }) => {
    const {
        name: menuItemName,
        startOffset,
        iconPath: menuItemIconPath,
        iconSize: menuIconSize,
        clickHandler: menuItemClickHandler,
        subMenuItems: menuSubItems,
        isLink,
        isWorking = true,
    } = menuItem;
    const activeMenuItemName = useZustand((store) => store.values.activeHamburgerMenuItemName);

    const isRootItem = menuItemName === 'DEFAULT';
    const [isRadialCenter, setIsRadialCenter] = useState(false);
    const [isActiveRadialCenter, setIsActiveRadialCenter] = useState(false);
    const [keepTreeOpen, setKeepTreeOpen] = useState(false);
    const [offset, setOffset] = useState<Offset>(centerOffset);
    const [zIndex, setZIndex] = useState(zSortingIndex);

    useEffect(() => {
        if (menuSubItems?.length) {
            if (activeMenuItemName === menuItemName) {
                setIsActiveRadialCenter(true);
                setZIndex((oldIndex) => (oldIndex += 10));
            } else {
                if (menuSubItems.some((subItem) => subItem.name === activeMenuItemName)) {
                    setKeepTreeOpen(true);
                } else {
                    setKeepTreeOpen(false);
                }
                setIsActiveRadialCenter(false);
            }

            setIsRadialCenter(true);
        } else {
            setIsRadialCenter(false);
            setKeepTreeOpen(false);
        }
    }, [activeMenuItemName, menuItemName, menuSubItems]);

    useEffect(() => {
        if (canTransition && !isRootItem && !isActiveRadialCenter) {
            setOffset(getRadialOffset(arrayIndex, centerOffset, startOffset));
        }
    }, [arrayIndex, canTransition, centerOffset, isActiveRadialCenter, startOffset, isRootItem]);

    return (
        <div
            className={classNames(
                'pointer-events-auto absolute flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none items-end justify-center transition-transform delay-[calc(var(--ui-animation-menu-transition-duration)/3*var(--hamburger-menu-button-transition-delay-multiplier))] duration-[--ui-animation-menu-transition-duration] matrix-scale-[--hamburger-menu-button-scale]',
                isActiveRadialCenter ? '[--hamburger-menu-button-opacity:1]' : '',
            )}
            style={
                {
                    zIndex,
                    '--hamburger-menu-button-scale': canTransition ? (isRootItem ? Math.max(scale ?? 0, 0.65) : 1) : 0.75,
                    '--hamburger-menu-button-icon-mask': menuItemIconPath,
                    '--hamburger-menu-button-icon-size': (menuIconSize ?? 50) + '%',
                    '--hamburger-menu-button-transition-delay-multiplier': isRadialCenter ? 0 : arrayIndex,
                    '--tw-matrix-e': `${roundToPixelRatio(offset.left)}`,
                    '--tw-matrix-f': `${roundToPixelRatio(offset.top)}`,
                    '--tw-matrix-rotate-cos': canTransition ? 1 : 0,
                    '--tw-matrix-rotate-sin': canTransition ? 0 : 1,
                } as CSSProperties
            }
        >
            {/* Hex Background shape (main), SVG icon (::before element, z-index +10) , and Hex Stroke shape (::after element, z-index +20)*/}
            <div
                className={classNames(
                    'absolute left-0 top-0 size-full opacity-[--hamburger-menu-button-opacity,0.25] transition-[background-color,clip-path,opacity] [clip-path:--hexagon-clip-path-full]',
                    isWorking ? 'pointer-events-auto' : 'pointer-events-none',
                    'after:absolute after:left-0 after:top-0 after:size-full after:scale-[1.05] after:transition-[background-color] after:[clip-path:--hexagon-clip-path-full-wider-stroke] hover-active:opacity-100',
                    menuItemIconPath
                        ? 'before:absolute before:left-0 before:top-0 before:size-full before:bg-theme-secondary before:transition-[background-color,opacity] before:[mask-image:--hamburger-menu-button-icon-mask] before:[mask-repeat:no-repeat] before:[mask-size:--hamburger-menu-button-icon-size]' +
                              ' ' +
                              (isRootItem ? 'before:[mask-position:50%_50%]' : 'before:[mask-position:50%_35%]') +
                              ' ' +
                              (isWorking ? 'before:bg-theme-secondary' : 'before:bg-theme-secondary/20')
                        : 'before:content-none',
                    isActiveRadialCenter
                        ? 'z-[100] bg-theme-primary-darker before:z-[110] after:z-[120] after:bg-theme-secondary-lighter'
                        : isRadialCenter
                          ? 'z-0 bg-neutral-700 before:z-10 after:z-20 after:bg-theme-primary-darker hover-active:bg-theme-primary-darker after:hover-active:bg-theme-primary'
                          : 'z-0 bg-neutral-700 before:z-10 after:z-20' +
                            ' ' +
                            (isWorking ? 'after:bg-theme-primary-darker after:hover-active:bg-theme-primary' : 'after:bg-theme-primary-darker/50'),
                )}
                role="button"
                tabIndex={-1}
                onClick={(ev) => {
                    if (ev.target === ev.currentTarget) {
                        menuItemClickHandler(ev);
                    }
                }}
                onKeyDown={(ev) => {
                    if (ev.target === ev.currentTarget) {
                        keyDownA11y(menuItemClickHandler);
                    }
                }}
            />
            {/* Text */}
            <span
                className={classNames(
                    'pointer-events-none text-center font-fjalla-one text-sm tracking-widest',
                    menuItemIconPath ? 'pb-0.5' : 'self-center',
                    isActiveRadialCenter
                        ? 'z-[110] text-theme-secondary-darker'
                        : isWorking
                          ? 'z-10 text-neutral-100/[--hamburger-menu-button-opacity,0.25]'
                          : 'z-10 text-neutral-100/10',
                )}
            >
                {menuItemName !== 'DEFAULT' && menuItemName}
            </span>
            {isLink && (
                <div className="pointer-events-none absolute left-0 top-0 size-full translate-x-[3%] translate-y-[2%] rotate-[-7deg] bg-neutral-400/[--hamburger-menu-button-opacity,0.1] [mask-image:url('/svg/LinkMicro.svg')] [mask-repeat:no-repeat] [mask-size:27.5%]" />
            )}
            {(isActiveRadialCenter || isRootItem || keepTreeOpen) && <RadialMenuButtons menuItems={menuSubItems!} zSortingIndex={zIndex} />}
        </div>
    );
};

const defaultCenterOffset = { left: 0, top: 0 };
const RadialMenuButtons: FC<{ menuItems: HamburgerMenuItem[]; zSortingIndex: number }> = ({ menuItems, zSortingIndex }) => {
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
                    zSortingIndex={zSortingIndex}
                    centerOffset={defaultCenterOffset}
                    canTransition={canTransition}
                />
            ))}
        </>
    );
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

function getRadialOffset(index: number, center: Offset, startOffset?: number) {
    const nextOffset = (index + 6 + (startOffset ?? 0)) % 6;

    const { left, top } = radialOffsetsWithGutter[nextOffset];
    return {
        left: center.left + left,
        top: center.top - top,
    };
}

type Offset = {
    left: number;
    top: number;
};

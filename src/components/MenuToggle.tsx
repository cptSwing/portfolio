import { createPortal } from 'react-dom';
import { useZustand } from '../lib/zustand';
import Settings from './Settings';
import Socials from './Socials';
import { CSSProperties, useCallback, useState } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';

const store_toggleMenu = useZustand.getState().methods.store_toggleMenu;

const MenuToggle = () => {
    const name = useZustand((store) => store.values.activeMenuButton.name);
    const [twBgOpacity, setTwBgOpacity] = useState(0);

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            setTwBgOpacity(0.85);
        } else {
            setTwBgOpacity(0);
        }
    }, []);

    const handleClick = ({ target, currentTarget }: React.MouseEvent) => currentTarget === target && store_toggleMenu({ name: null });

    return (
        name &&
        createPortal(
            <div
                ref={refCallback}
                className='fixed bottom-0 left-0 right-0 top-0 z-50 bg-gray-950 transition-[background-color] duration-300'
                style={{ '--tw-bg-opacity': twBgOpacity } as CSSProperties}
                onClick={handleClick}
            >
                {name === 'settings' ? <Settings /> : <Socials />}
            </div>,
            document.getElementById('root')!,
        )
    );
};

export default MenuToggle;

/* Used in child components: */
export const CloseSubMenu = () => {
    const menuButtonPosAndSize = useZustand((store) => store.values.activeMenuButton.positionAndSize);

    const subMenuButtonsMargin = menuButtonPosAndSize ? menuButtonPosAndSize.width * 0.1 : 0;

    const handleClick = () => store_toggleMenu({ name: null });

    return (
        <div
            className='group absolute aspect-hex-flat cursor-pointer peer-hover-active:[--x-mark-opacity:0]'
            style={
                menuButtonPosAndSize && {
                    width: menuButtonPosAndSize.width,
                }
            }
            onClick={handleClick}
        >
            <RoundedHexagonSVG
                classNames='absolute left-0 top-0 stroke-theme-primary-darker fill-theme-secondary/10 group-hover-active:fill-theme-secondary/50 transition-[fill] -z-50'
                strokeWidth={subMenuButtonsMargin}
            />

            {/* XMark */}
            <div className='size-full bg-theme-primary opacity-[--x-mark-opacity] transition-[background-color,opacity] [mask-image:url(/svg/XMarkOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:55%] group-hover-active:bg-theme-primary-lighter' />
        </div>
    );
};

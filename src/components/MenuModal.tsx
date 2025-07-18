import { useZustand } from '../lib/zustand';
import Settings from './Settings';
import Socials from './Socials';
import { useEffect, useRef } from 'react';
import RoundedHexagonSVG from './RoundedHexagonSVG';

const store_toggleMenu = useZustand.getState().methods.store_toggleMenu;

const MenuModal = () => {
    const name = useZustand((store) => store.values.activeMenuButton.name);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (name) {
                dialogRef.current.showModal();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0.9');
            } else {
                dialogRef.current.close();
                dialogRef.current.style.removeProperty('--tw-bg-opacity');
            }
        }
    }, [name]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialogRef}
            className='size-full bg-gray-950 bg-opacity-0 transition-[background-color]' // backdrop-blur-md
            onClick={({ target, currentTarget }) => target === currentTarget && currentTarget.open && store_toggleMenu({ name: null })}
        >
            {name === 'settings' ? <Settings /> : <Socials />}
        </dialog>
    );
};

export default MenuModal;

/* Used in child components: */
export const CloseSubMenu = () => {
    const menuButtonPosAndSize = useZustand((store) => store.values.activeMenuButton.positionAndSize);

    const subMenuButtonsMargin = menuButtonPosAndSize ? menuButtonPosAndSize.width * 0.1 : 0;

    const handleClick = () => store_toggleMenu({ name: null });

    return (
        <button
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
        </button>
    );
};

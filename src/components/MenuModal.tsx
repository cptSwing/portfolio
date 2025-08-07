import { useZustand } from '../lib/zustand';
import Settings from './Settings';
import Contact from './Contact';
import { useEffect, useRef } from 'react';

const store_toggleMenu = useZustand.getState().methods.store_toggleMenu;

const MenuModal = () => {
    const name = useZustand((store) => store.values.activeMenuButton.name);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (name) {
                dialogRef.current.showModal();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0.95');
            } else {
                dialogRef.current.close();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0');
            }
        }
    }, [name]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialogRef}
            className='size-full bg-gray-950 transition-[background-color]' // backdrop-blur-md
            onClick={({ target, currentTarget }) => target === currentTarget && currentTarget.open && store_toggleMenu({ name: null })}
        >
            {name && (name === 'config' ? <Settings /> : <Contact />)}
        </dialog>
    );
};

export default MenuModal;

/* Used in child components: */
export const CloseSubMenu = () => {
    const handleClick = () => store_toggleMenu({ name: null });

    return (
        <button
            className='group absolute flex size-full cursor-pointer items-center justify-center peer-hover-active:[--x-mark-opacity:0]'
            onClick={handleClick}
        >
            <svg
                className='fill-theme-secondary-darker stroke-theme-secondary/25 transition-[fill] group-hover-active:fill-theme-secondary'
                strokeWidth={0.1}
                viewBox='0 0 1 0.866'
            >
                <use href='#svgRoundedHexagon-default-path' clipPath='url(#svgRoundedHexagon-default-clipPath)' />
            </svg>

            {/* XMark */}
            <div className='absolute size-full bg-theme-primary-lighter/50 opacity-[--x-mark-opacity] transition-[background-color,opacity] [mask-image:url(/svg/XMarkOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:55%] group-hover-active:bg-theme-primary-lighter' />
        </button>
    );
};

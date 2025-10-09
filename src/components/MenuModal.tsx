import { useZustand } from '../lib/zustand';
import { useEffect, useRef } from 'react';
import HamburgerMenu from './HamburgerMenu';

const store_toggleHamburgerMenu = useZustand.getState().methods.store_toggleHamburgerMenu;

const MenuModal = () => {
    const hamburgerMenuOpen = useZustand((store) => store.values.hamburgerMenuOpen);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (hamburgerMenuOpen) {
                dialogRef.current.showModal();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0.666');
            } else {
                dialogRef.current.close();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0');
            }
        }
    }, [hamburgerMenuOpen]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialogRef}
            className="glassmorphic-backdrop size-full overflow-hidden bg-gray-950 transition-[background-color] duration-500" // backdrop-blur-md
            onClick={({ target, currentTarget }) => target === currentTarget && currentTarget.open && store_toggleHamburgerMenu(false)}
        >
            {hamburgerMenuOpen && <HamburgerMenu />}
        </dialog>
    );
};

export default MenuModal;

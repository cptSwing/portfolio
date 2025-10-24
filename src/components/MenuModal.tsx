import { useZustand } from '../lib/zustand';
import { useEffect, useRef } from 'react';
import HamburgerMenu from './HamburgerMenu';

const store_toggleHamburgerMenu = useZustand.getState().methods.store_toggleHamburgerMenu;

const MenuModal = () => {
    const hamburgerMenuRect = useZustand((store) => store.values.hamburgerMenuRect);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (hamburgerMenuRect) {
                dialogRef.current.showModal();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0.666');
                dialogRef.current.style.setProperty('--glassmorphic-backdrop-blur', '16px');
                dialogRef.current.style.setProperty('--glassmorphic-backdrop-saturate', '0.5');
            } else {
                dialogRef.current.close();
                dialogRef.current.style.setProperty('--tw-bg-opacity', '0');
                dialogRef.current.style.setProperty('--glassmorphic-backdrop-blur', '0');
                dialogRef.current.style.setProperty('--glassmorphic-backdrop-saturate', '1');
            }
        }
    }, [hamburgerMenuRect]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialogRef}
            className="glassmorphic-backdrop size-full overflow-hidden bg-gray-950 transition-[background-color,backdrop-filter] duration-500"
            onClick={({ target, currentTarget }) => target === currentTarget && currentTarget.open && store_toggleHamburgerMenu(null)}
        >
            {hamburgerMenuRect && <HamburgerMenu />}
        </dialog>
    );
};

export default MenuModal;

import { createPortal } from 'react-dom';
import { useZustand } from '../lib/zustand';
import Settings from './Settings';
import Socials from './Socials';
import { CSSProperties, useCallback, useState } from 'react';

const MenuToggle = () => {
    const { menuName, position } = useZustand((store) => store.values.menuState);
    const [bgOpacity, setBgOpacity] = useState(0);

    const refCallback = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            setBgOpacity(0.95);
        } else {
            setBgOpacity(0);
        }
    }, []);

    return createPortal(
        menuName && (
            <div
                ref={refCallback}
                className='pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-50 bg-black transition-[background-color] duration-300'
                style={{ '--tw-bg-opacity': bgOpacity } as CSSProperties}
            >
                {menuName === 'settings' ? <Settings position={position} /> : <Socials position={position} />}
            </div>
        ),
        document.getElementById('root')!,
    );
};

export default MenuToggle;

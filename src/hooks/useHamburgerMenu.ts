import { useMemo } from 'react';
import { useZustand } from '../lib/zustand';

function useHamburgerMenu() {
    const menuButtonName = useZustand((store) => store.values.activeMenuButton.name);
    const isActive_Memo = useMemo(() => menuButtonName === 'hamburger', [menuButtonName]);

    return isActive_Memo;
}

export default useHamburgerMenu;

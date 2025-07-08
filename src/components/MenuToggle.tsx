import { useZustand } from '../lib/zustand';
import Settings from './Settings';
import Socials from './Socials';

const MenuToggle = () => {
    const menuState = useZustand((store) => store.values.menuState);
    return menuState && <div className='fixed right-1/4 top-[4%] z-50 h-[5%]'>{menuState === 'settings' ? <Settings /> : <Socials />}</div>;
};

export default MenuToggle;

import { useEffect } from 'react';
import { useZustand } from '../lib/zustand';

const useUpdateTheme = () => {
    /* step through theme settings */
    const theme = useZustand((store) => store.values.theme);
    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);
};

export default useUpdateTheme;

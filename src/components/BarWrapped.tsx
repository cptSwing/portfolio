import { FC, useCallback } from 'react';
import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';

const BarWrapped: FC<{ children: React.ReactNode }> = ({ children }) => {
    const activePost = useZustand((state) => state.nav.activePost);
    const activeCategory = useZustand((state) => state.nav.activeCategory);

    const onMount_Cb = useCallback(() => {
        //
    }, []);

    return (
        <div
            ref={onMount_Cb}
            className={classNames(
                'flex flex-col items-center justify-between overflow-hidden [--top-bottom-bar-height:theme(spacing.1)]',
                activePost ? 'h-full w-screen' : 'h-4/5 w-full',
            )}
        >
            {/* Top Bar: */}
            <div
                className={classNames(
                    'h-[--top-bottom-bar-height] transition-[width,background-color] duration-300',
                    activeCategory ? 'nav-checked-width' : 'nav-unchecked-width',
                    activePost ? '!w-full bg-theme-primary-500' : 'bg-theme-secondary-300',
                )}
                onChange={(e) => {
                    console.log('%c[BarWrapped]', 'color: #7071ff', `e :`, e);
                }}
            />

            <div className={classNames('relative z-0 size-full overflow-hidden', activePost ? 'my-0' : 'my-2')}>{children}</div>

            {/* Bottom Bar: */}
            <div
                className={classNames(
                    'h-[--top-bottom-bar-height] bg-theme-primary-500 transition-[width,background-color] delay-200 duration-500',
                    activeCategory ? 'nav-checked-width' : 'nav-unchecked-width',
                    activePost ? '!w-full bg-theme-primary-500' : 'bg-theme-secondary-300',
                )}
            />
        </div>
    );
};

export default BarWrapped;

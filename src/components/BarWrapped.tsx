import { FC } from 'react';
import classNames from '../lib/classNames';
import { useParams } from 'react-router-dom';

const BarWrapped: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { catId, postId } = useParams();

    return (
        <div
            className={classNames(
                'flex flex-col items-center justify-start transition-[width] duration-300 [--bar-height:theme(spacing.1)]',
                postId ? 'h-[90%] w-screen overflow-y-visible' : 'h-4/5 w-full overflow-hidden',
            )}
        >
            {/* Top Bar: */}
            <div
                className={classNames(
                    'min-h-[--bar-height] transition-[width,background-color] duration-300',
                    catId ? 'nav-checked-width' : 'nav-unchecked-width',
                    postId ? '!w-full bg-theme-primary-500' : 'bg-theme-secondary-300',
                )}
            />

            <div className={classNames('relative h-full', postId ? 'my-0 overflow-y-visible' : 'my-1 overflow-hidden')}>{children}</div>

            {/* Bottom Bar: */}
            <div
                className={classNames(
                    'min-h-[--bar-height] bg-theme-primary-500 transition-[width,background-color] delay-200 duration-500',
                    catId ? 'nav-checked-width' : 'nav-unchecked-width',
                    postId ? '!w-full bg-theme-primary-500' : 'bg-theme-secondary-300',
                )}
            />
        </div>
    );
};

export default BarWrapped;

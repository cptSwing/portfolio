import { FC } from 'react';
import classNames from '../lib/classNames';
import { useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount';

const BarWrapped: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { catId, postId } = useParams();

    const [barsRefCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'width-to-full',
            animationDuration: 100,
            animationDelay: 0,
            animationFillMode: 'none',
        },
        startDelay: 0,
        hiddenAtStart: false,
    });

    const [contentRefCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'height-to-full',
            animationDuration: 300,
            animationDelay: 0,
            animationFillMode: 'backwards',
        },
        startDelay: 100,
        hiddenAtStart: true,
    });

    return (
        <div
            className={classNames(
                'flex flex-col items-center justify-center transition-[width] duration-300 sm:[--bar-height:3px]',
                postId ? 'w-screen [--bar-height:theme(spacing.2)]' : 'w-fit [--bar-height:theme(spacing.1)]',
            )}
        >
            {/* Top Bar: */}
            <div
                id='top-bar'
                ref={barsRefCallback}
                className={classNames(
                    'relative -z-10 min-h-[--bar-height] transition-[width,height,background-color] duration-300',
                    catId ? 'w-[--checked-width]' : 'w-[--unchecked-width]',
                    postId ? '!w-full bg-[--color-bars-post] sm:mask-edges-x-20' : 'bg-[--color-bars-no-post]',
                )}
            />

            <div ref={contentRefCallback} className={classNames('relative z-20 size-full', postId ? 'my-0 overflow-y-visible' : 'my-1.5')}>
                {children}
            </div>

            {/* Bottom Bar: */}
            <div
                id='bottom-bar'
                ref={barsRefCallback}
                className={classNames(
                    'min-h-[--bar-height] transition-[width,background-color] delay-100 duration-500',
                    catId ? 'w-[--checked-width]' : 'w-[--unchecked-width]',
                    postId ? '!w-full bg-[--color-bars-post] sm:mask-edges-x-20' : 'bg-[--color-bars-no-post]',
                )}
            />
        </div>
    );
};

export default BarWrapped;

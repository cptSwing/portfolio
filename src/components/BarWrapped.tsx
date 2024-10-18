import { FC } from 'react';
import classNames from '../lib/classNames';
import { useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import Socials from './Socials';

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
                'group/bar-parent flex flex-col items-center justify-center transition-[width] duration-300 [--bar-height:theme(spacing.[1.5])] [--color-bars-no-post:theme(colors.theme.secondary.400)] [--color-bars-post:theme(colors.theme.primary.500)]',
                postId ? 'h-[90%] w-screen' : 'w-fit',
            )}
        >
            {/* Top Bar: */}
            <div
                id='top-bar'
                ref={barsRefCallback}
                className={classNames(
                    'relative min-h-[--bar-height] transition-[width,background-color] duration-300',
                    catId ? 'w-[--checked-width]' : 'w-[--unchecked-width]',
                    postId ? '!w-full bg-[--color-primary-active-cat-bg]' : 'bg-[--color-secondary-active-cat]',
                )}
            >
                <Socials />
            </div>

            <div ref={contentRefCallback} className={classNames('relative size-full', postId ? 'my-0 overflow-y-visible' : 'my-1')}>
                {children}
            </div>

            {/* Bottom Bar: */}
            <div
                id='bottom-bar'
                ref={barsRefCallback}
                className={classNames(
                    'min-h-[--bar-height] transition-[width,background-color] delay-100 duration-500',
                    catId ? 'w-[--checked-width]' : 'w-[--unchecked-width]',
                    postId ? '!w-full bg-[--color-primary-active-cat-bg]' : 'bg-[--color-secondary-active-cat]',
                )}
            />
        </div>
    );
};

export default BarWrapped;

import { FC } from 'react';
import classNames from '../lib/classNames';
import { useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import { bars_heightenDuration, bars_widenDuration } from '../config/animationValues';

const BarWrapped: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { catId, postId } = useParams();

    const [barsRefCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'width-to-full',
            animationDuration: bars_widenDuration,
            animationDelay: 0,
            animationFillMode: 'forwards',
            animationIterationCount: 1,
        },
        startDelay: 0,
        displayAtStart: false,
    });

    const [contentRefCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'height-to-full',
            animationDuration: bars_heightenDuration,
            animationDelay: 0,
            animationFillMode: 'forwards',
            animationIterationCount: 1,
        },
        startDelay: bars_widenDuration / 1.5,
        displayAtStart: false,
    });

    return (
        <div
            className={classNames(
                'flex flex-col items-center justify-center transition-[width] duration-300 [--bar-height:theme(spacing.1)] sm:[--bar-height:3px]',
                postId ? 'w-screen' : 'w-fit',
            )}
        >
            {/* Top Bar: */}
            <div
                id='top-bar'
                ref={barsRefCallback}
                className={classNames(
                    'h-[--bar-height] w-[--bar-width] transition-[width,height,background-color] duration-300',
                    catId ? '[--bar-width:--checked-width]' : '[--bar-width:--unchecked-width]',
                    postId ? 'bg-[--color-bars-post] [--bar-width:100%] sm:mask-edges-x-20' : 'bg-[--color-bars-no-post]',
                )}
            />

            <div
                ref={contentRefCallback}
                className={classNames(
                    'relative z-20 my-1.5 transition-[height,width] [--content-height:calc(98vh-((var(--header-height)*2)+(var(--bar-height)*2)))] sm:[--content-height:calc(100vh-((var(--header-height)*2)+(var(--bar-height)*2)))]',
                    postId
                        ? '!my-0 h-[--content-height] w-[--post-width] overflow-y-visible'
                        : catId
                          ? 'h-[83vh] max-h-[56rem] w-[--checked-width]'
                          : 'h-[50vh] max-h-[28rem] w-[--unchecked-width]',
                )}
            >
                {children}
            </div>

            {/* Bottom Bar: */}
            <div
                id='bottom-bar'
                ref={barsRefCallback}
                className={classNames(
                    'h-[--bar-height] w-[--bar-width] transition-[width,background-color] delay-100 duration-500',
                    catId ? '[--bar-width:--checked-width]' : '[--bar-width:--unchecked-width]',
                    postId ? 'bg-[--color-bars-post] [--bar-width:100%] sm:mask-edges-x-20' : 'bg-[--color-bars-no-post]',
                )}
            />
        </div>
    );
};

export default BarWrapped;

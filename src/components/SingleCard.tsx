import { CSSProperties, FC, useEffect, useMemo, useRef } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.json';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import remapToRange from '../lib/remapToRange.ts';
import { Flipped } from 'react-flip-toolkit';
import MotionBlurImage from './MotionBlurImage.tsx';
import motionBlurElement from '../lib/motionBlurElement.ts';
import useMouseWheelDirection from '../hooks/useMouseWheelDirection.ts';
import useIsCardAtFront from '../hooks/useIsCardAtFront.ts';

const { activeCellCount } = config.categoryGrid;
const store_setPostAnimationStartDimensions = useZustand.getState().methods.store_setPostAnimationStartDimensions;

const SingleCard: FC<{
    post: Post;
    arrayIndex: number;
    totalCount: number;
    gridAreaIndex: number;
    setToFront: () => void;
}> = ({ post, arrayIndex, totalCount, gridAreaIndex, setToFront }) => {
    const { id, title, titleCardBg, subTitle } = post;
    const navigate = useNavigate();

    const gridCardStyle_Memo = useMemo(() => {
        if (gridAreaIndex < 1) {
            const surplusCells = totalCount - activeCellCount;
            const thisSurplusCell = remapToRange(gridAreaIndex, -surplusCells + 1, 0, surplusCells - 1, 0);
            const r = 2; // ratio

            const total_ratio = (Math.pow(r, surplusCells) - 1) / (r - 1);
            const ratio = Math.pow(r, surplusCells - 1 - thisSurplusCell);
            const widthPercent = (ratio / total_ratio) * 100;

            return {
                gridArea: 'rest',
                position: 'absolute' as CSSProperties['position'],
                width: `calc(${widthPercent}% - 8px)`,
                left: `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent}%`,
            };
        } else if (gridAreaIndex >= activeCellCount - 1) {
            return {
                gridArea: 'area' + gridAreaIndex,
            };
        } else {
            return {
                gridArea: 'area' + gridAreaIndex,
            };
        }
    }, [gridAreaIndex, totalCount]);

    const isAtFront = useIsCardAtFront(gridAreaIndex);

    const postCardRef = useRef<HTMLDivElement | null>(null);
    const postCardRect = useZustand((state) => state.values.initialPostDimensions);

    useEffect(() => {
        if (isAtFront && !postCardRect) {
            // Set initial values, further updates are handled in Flipper onComplete
            postCardRef.current && store_setPostAnimationStartDimensions(postCardRef.current.getBoundingClientRect());
        }
    }, [isAtFront, postCardRect]);

    const [wheelDirection] = useMouseWheelDirection();

    const blurElement_Ref = useRef<HTMLDivElement | null>(null);

    return (
        <Flipped
            flipId={arrayIndex}
            transformOrigin='0px 0px'
            // opacity
            translate
            scale
            onSpringUpdate={(springValue) => {
                if (blurElement_Ref.current) {
                    blurElement_Ref.current.style.setProperty('--motion-blur-range', springValue >= 1 ? '0px' : '16px');
                }
            }}
            onStartImmediate={() => {
                blurElement_Ref.current && motionBlurElement(blurElement_Ref.current, 'start', gridCardStyle_Memo.gridArea, wheelDirection);
            }}
            onComplete={() => {
                blurElement_Ref.current && motionBlurElement(blurElement_Ref.current, 'complete', gridCardStyle_Memo.gridArea, wheelDirection);
            }}
        >
            <div
                ref={postCardRef}
                className={classNames(
                    '[--card-animation-blur-multiplier:0] [--card-title-anim-delay:200ms] [--card-title-anim-duration:100ms] [--card-titles-inset-padding:theme(spacing.2)]',
                    'relative flex size-full select-none flex-col items-center justify-between will-change-transform',
                    'transform:matrix(1,0.00001,-0.00001,1,0,0)]',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={{
                    ...gridCardStyle_Memo,
                    zIndex: Math.max(gridAreaIndex, 0),
                }}
                onClick={() => {
                    if (isAtFront) {
                        navigate(id.toString());
                    } else {
                        setToFront();
                    }
                }}
            >
                {/* Title: */}
                <h6
                    className={classNames(
                        'absolute top-[--card-titles-inset-padding] z-10 mx-auto bg-[--color-primary-inactive-cat-bg] text-center drop-shadow transition-[transform,opacity,width]',
                        isAtFront
                            ? 'w-[calc(100%-(var(--card-titles-inset-padding)*2))] translate-y-0 opacity-100 delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]'
                            : 'w-full -translate-y-full opacity-0 delay-0 duration-200',
                    )}
                >
                    {title}
                </h6>

                {/* Image Wrapper: */}
                <SingleCardImage post={post} gridAreaIndex={gridAreaIndex} isAtFront={isAtFront} motionBlurElement={blurElement_Ref} />

                {/* Subtitle: */}
                {subTitle && (
                    <div
                        className={classNames(
                            'absolute bottom-[--card-titles-inset-padding] mx-auto bg-[--color-primary-inactive-cat-bg] text-center text-sm drop-shadow transition-[transform,opacity,width]',
                            isAtFront
                                ? 'w-[calc(100%-(var(--card-titles-inset-padding)*2))] translate-y-0 opacity-100 delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]'
                                : 'w-full translate-y-full opacity-0 delay-0 duration-200',
                        )}
                    >
                        <Markdown>{subTitle}</Markdown>
                    </div>
                )}
            </div>
        </Flipped>
    );
};

export default SingleCard;

const SingleCardImage: FC<{
    post: Post;
    gridAreaIndex: number;
    isAtFront: boolean;
    motionBlurElement: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ post, gridAreaIndex, isAtFront, motionBlurElement }) => {
    const { title, titleCardBg } = post;

    const [wheelDirection] = useMouseWheelDirection();

    const dynamicStyleValues_Memo = useMemo(() => {
        let opacBefore = 0;
        let opacAfter = 1;

        let direction = wheelDirection === 'up' ? 'normal' : 'reverse';
        let fillModeBefore = direction === 'reverse' ? 'backwards' : 'forwards';
        let fillModeAfter = direction === 'reverse' ? 'forwards' : 'backwards';

        let axis;

        switch (gridAreaIndex) {
            case 0:
                axis = 'horizontal';
                break;
            case 1:
                axis = wheelDirection === 'up' ? 'vertical' : 'horizontal';
                direction = 'normal';
                fillModeBefore = 'forwards';

                opacBefore = wheelDirection === 'up' ? 1 : -1;
                opacAfter = wheelDirection === 'up' ? 0 : 0;
                break;
            case 2:
                axis = 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                break;
            case 3:
                axis = 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                break;
            case 4:
                axis = wheelDirection === 'up' ? 'horizontal' : 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                break;
            case 5:
                direction = wheelDirection === 'up' ? 'reverse' : 'reverse';
                axis = wheelDirection === 'up' ? 'vertical' : 'horizontal';
                opacBefore = wheelDirection === 'up' ? 0 : 0;
                opacAfter = wheelDirection === 'up' ? 1 : -1;

                fillModeBefore = 'forwards';
                fillModeAfter = 'forwards';

                break;
            case 6:
                direction = wheelDirection === 'up' ? 'reverse' : 'normal';
                axis = wheelDirection === 'up' ? 'horizontal' : 'vertical';
                fillModeBefore = 'forwards';
                fillModeAfter = 'forwards';
                opacBefore = wheelDirection === 'up' ? 1 : -1;
                opacAfter = wheelDirection === 'up' ? -1 : 0;
                break;

            default:
                axis = 'horizontal';
                break;
        }

        const opacityBefore = Math.max(1 - (gridAreaIndex + opacBefore) / activeCellCount, 0);
        const opacityAfter = Math.max(1 - (gridAreaIndex + opacAfter) / activeCellCount, 0);

        const values = {
            direction,
            directionExit: axis === 'vertical' ? 'wipe-card-down-exit' : 'wipe-card-left-exit',
            directionEnter: axis === 'vertical' ? 'wipe-card-down-enter' : 'wipe-card-left-enter',
            directionFillModeBefore: fillModeBefore,
            directionFillModeAfter: fillModeAfter,
            opacityBefore,
            opacityAfter,
        };

        return values;
    }, [gridAreaIndex, wheelDirection]);

    return (
        <div
            // change key to re-render, meaning the animation runs once each keyswitch
            key={gridAreaIndex + ''}
            className={classNames(
                '[--card-image-anim-duration:250ms] [--card-image-anim-hover-duration:100ms]',

                'relative z-0 size-full transition-transform',
                'hover-active:before:opacity-0 hover-active:before:transition-opacity hover-active:before:duration-[--card-image-anim-hover-duration] hover-active:after:opacity-0 hover-active:after:transition-opacity hover-active:after:duration-[--card-image-anim-hover-duration]',

                isAtFront ? 'animate-[move-up-settle-down] [animation-duration:300ms] hover-active:scale-100' : 'hover-active:scale-[1.025]',

                'before:absolute before:-left-px before:-top-px before:z-10 before:h-[calc(100%+2px)] before:w-[calc(100%+2px)] before:animate-[--card-image-swipe-direction-anim-exit] before:bg-black before:opacity-[--card-image-swipe-opacity-before] before:outline before:outline-2 before:-outline-offset-1 before:outline-[--nav-category-common-color-1] before:[animation-delay:0ms] before:[animation-direction:var(--card-image-swipe-direction)] before:[animation-duration:var(--card-image-anim-duration)] before:[animation-fill-mode:var(--card-image-swipe-direction-fill-mode-before)]',
                'after:absolute after:-left-px after:-top-px after:z-20 after:h-[calc(100%+2px)] after:w-[calc(100%+2px)] after:animate-[--card-image-swipe-direction-anim-enter] after:bg-black after:opacity-[--card-image-swipe-opacity-after] after:outline after:outline-2 after:-outline-offset-1 after:outline-[--nav-category-common-color-1] after:[animation-delay:0ms] after:[animation-direction:var(--card-image-swipe-direction)] after:[animation-duration:var(--card-image-anim-duration)] after:[animation-fill-mode:var(--card-image-swipe-direction-fill-mode-after)]',
            )}
            style={
                {
                    '--card-image-swipe-direction': dynamicStyleValues_Memo.direction,
                    '--card-image-swipe-direction-anim-exit': dynamicStyleValues_Memo.directionExit,
                    '--card-image-swipe-direction-anim-enter': dynamicStyleValues_Memo.directionEnter,
                    '--card-image-swipe-direction-fill-mode-before': dynamicStyleValues_Memo.directionFillModeBefore,
                    '--card-image-swipe-direction-fill-mode-after': dynamicStyleValues_Memo.directionFillModeAfter,
                    '--card-image-swipe-opacity-before': dynamicStyleValues_Memo.opacityBefore,
                    '--card-image-swipe-opacity-after': dynamicStyleValues_Memo.opacityAfter,
                } as CSSProperties
            }
        >
            <div className='fixed left-4 top-1/4 z-50 text-2xs text-red-600'>
                opacityBefore: {dynamicStyleValues_Memo.opacityBefore}
                <br />
                opacityAfter: {dynamicStyleValues_Memo.opacityAfter}
            </div>
            <MotionBlurImage isAtFront={isAtFront} imgUrl={titleCardBg} altText={title} blurElementRef={motionBlurElement} />
        </div>
    );
};

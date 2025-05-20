import { CSSProperties, FC, useMemo, useRef } from 'react';
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

const SingleCard: FC<{
    post: Post;
    arrayIndex: number;
    totalCount: number;
    gridAreaIndex: number;
    setToFront: () => void;
}> = ({ post, arrayIndex, totalCount, gridAreaIndex, setToFront }) => {
    const { id, title, subTitle } = post;
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

    const [wheelDirection] = useMouseWheelDirection();

    const blurElement_Ref = useRef<HTMLDivElement | null>(null);

    // WARN DEBUG
    const applyTransformMatrixFix = useZustand(({ values }) => values.debug.applyTransformMatrixFix);

    return (
        <Flipped
            flipId={arrayIndex}
            transformOrigin='0px 0px'
            opacity
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
                className={classNames(
                    'relative flex size-full select-none flex-col items-center justify-between drop-shadow-md',
                    applyTransformMatrixFix ? '[transform:matrix(1,0.00001,-0.00001,1,0,0)]' : '',
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
                {/* Image Wrapper: */}
                <SingleCardImage post={post} gridAreaIndex={gridAreaIndex} isAtFront={isAtFront} motionBlurElement={blurElement_Ref} />
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
    const { title, titleCardBg, subTitle } = post;

    const [wheelDirection] = useMouseWheelDirection();

    const dynamicStyleValues_Memo = useMemo(() => {
        let opacBefore = 0;
        let opacAfter = 1;

        let direction = wheelDirection === 'up' ? 'normal' : 'reverse';
        let fillModeBefore = direction === 'reverse' ? 'backwards' : 'forwards';
        let fillModeAfter = direction === 'reverse' ? 'forwards' : 'backwards';

        let axis;

        let borderRadius = '3rem';

        switch (gridAreaIndex) {
            case 0:
                axis = 'horizontal';
                direction = wheelDirection === 'up' ? 'reverse' : 'normal';
                fillModeBefore = 'forwards';
                opacBefore = wheelDirection === 'up' ? 0 : 1;
                opacAfter = wheelDirection === 'up' ? 1 : 0;

                borderRadius = '1rem';

                break;
            case 1:
                axis = wheelDirection === 'up' ? 'vertical' : 'horizontal';
                direction = 'normal';
                fillModeBefore = 'forwards';

                opacBefore = wheelDirection === 'up' ? 1 : -1;
                opacAfter = wheelDirection === 'up' ? 0 : 0;
                borderRadius = '1.05rem';

                break;
            case 2:
                axis = 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                borderRadius = '2.5rem';
                break;
            case 3:
                axis = 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                borderRadius = '2.5rem';
                break;
            case 4:
                axis = wheelDirection === 'up' ? 'horizontal' : 'vertical';
                opacBefore = wheelDirection === 'up' ? 1 : 0;
                opacAfter = wheelDirection === 'up' ? 0 : -1;
                borderRadius = '2.75rem';

                break;
            case 5:
                direction = wheelDirection === 'up' ? 'reverse' : 'reverse';
                axis = wheelDirection === 'up' ? 'vertical' : 'horizontal';
                opacBefore = wheelDirection === 'up' ? 0 : 0;
                opacAfter = wheelDirection === 'up' ? 1 : -1;

                fillModeBefore = 'forwards';
                fillModeAfter = 'forwards';
                borderRadius = '2.75rem';

                break;
            case 6:
                direction = wheelDirection === 'up' ? 'reverse' : 'normal';
                axis = wheelDirection === 'up' ? 'horizontal' : 'vertical';
                fillModeBefore = 'forwards';
                fillModeAfter = 'forwards';
                opacBefore = wheelDirection === 'up' ? 1 : -1;
                opacAfter = wheelDirection === 'up' ? -1 : 0;
                borderRadius = '3rem';

                break;

            default:
                // < 0
                axis = 'horizontal';
                borderRadius = '0.85rem';
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
            borderRadius,
        };

        return values;
    }, [gridAreaIndex, wheelDirection]);

    return (
        <div
            // change key to re-render, meaning the animation runs once each keyswitch
            key={gridAreaIndex + ''}
            className={classNames(
                '[--card-image-anim-duration:calc(var(--clip-shape-animation-duration)/1.5)] [--card-image-anim-hover-duration:100ms]',

                'relative z-0 size-full overflow-hidden !rounded-tl-sm transition-[transform,border-radius]',

                'hover-active:before:opacity-0 hover-active:before:transition-opacity hover-active:before:duration-[--card-image-anim-hover-duration] hover-active:after:opacity-0 hover-active:after:transition-opacity hover-active:after:duration-[--card-image-anim-hover-duration]',

                isAtFront ? 'animate-[move-up-settle-down] [animation-duration:300ms] hover-active:scale-100' : 'hover-active:scale-[1.025]',

                'before:absolute before:-left-px before:-top-px before:z-10 before:h-[calc(100%+2px)] before:w-[calc(100%+2px)] before:animate-[--card-image-swipe-direction-anim-exit] before:bg-black before:opacity-[--card-image-swipe-opacity-before] before:[animation-delay:0ms] before:[animation-direction:var(--card-image-swipe-direction)] before:[animation-duration:var(--card-image-anim-duration)] before:[animation-fill-mode:var(--card-image-swipe-direction-fill-mode-before)]',
                'after:absolute after:-left-px after:-top-px after:z-20 after:h-[calc(100%+2px)] after:w-[calc(100%+2px)] after:animate-[--card-image-swipe-direction-anim-enter] after:bg-black after:opacity-[--card-image-swipe-opacity-after] after:[animation-delay:0ms] after:[animation-direction:var(--card-image-swipe-direction)] after:[animation-duration:var(--card-image-anim-duration)] after:[animation-fill-mode:var(--card-image-swipe-direction-fill-mode-after)]',
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
                    'borderRadius': dynamicStyleValues_Memo.borderRadius,
                } as CSSProperties
            }
        >
            {/* Title: */}
            <h6
                className={classNames(
                    'absolute top-[--card-titles-inset-padding] z-10 mx-auto skew-x-[calc(var(--clip-shape-angle-rad)*-1)] text-center',
                    'before:absolute before:left-0 before:-z-10 before:mx-auto before:size-full before:bg-[--color-primary-inactive-cat-bg]',
                    isAtFront ? 'w-full opacity-100' : 'size-0 opacity-0',
                )}
            >
                {title}
            </h6>

            <MotionBlurImage isAtFront={isAtFront} imgUrl={titleCardBg} altText={title} blurElementRef={motionBlurElement} />

            {/* Subtitle: */}
            {subTitle && (
                <div
                    className={classNames(
                        'absolute bottom-[--card-titles-inset-padding] mx-auto skew-x-[calc(var(--clip-shape-angle-rad)*-1)] text-center text-sm',
                        'before:absolute before:left-0 before:-z-10 before:mx-auto before:size-full before:bg-[--color-primary-inactive-cat-bg]',
                        isAtFront ? 'w-full opacity-100' : 'size-0 opacity-0',
                    )}
                >
                    <Markdown>{subTitle}</Markdown>
                </div>
            )}
        </div>
    );
};

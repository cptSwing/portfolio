import { CSSProperties, FC, useMemo, useRef } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.json';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';
import remapToRange from '../lib/remapToRange.ts';
import { Flipped } from 'react-flip-toolkit';
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
    const { id } = post;
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
                <SingleCardImage post={post} gridAreaIndex={gridAreaIndex} isAtFront={isAtFront} />
                {/* <AngleCardFrameSVG className='h-full w-3/4' /> */}
            </div>
        </Flipped>
    );
};

export default SingleCard;

const SingleCardImage: FC<{
    post: Post;
    gridAreaIndex: number;
    isAtFront: boolean;
}> = ({ post, gridAreaIndex, isAtFront }) => {
    const { title, titleCardBg, subTitle } = post;

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
                direction = wheelDirection === 'up' ? 'reverse' : 'normal';
                fillModeBefore = 'forwards';
                opacBefore = wheelDirection === 'up' ? 0 : 1;
                opacAfter = wheelDirection === 'up' ? 1 : 0;

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
                // < 0
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
        // Mock border by clipping parent and child, and insetting child
        <div className='group relative size-full bg-theme-secondary-lighter/90 [clip-path:polygon(0_10%,4.33%_0,95.67%_0,100%_10%,100%_90%,95.67%_100%,4.33%_100%,0_90%)] hover-active:scale-[1.025]'>
            <div
                // change key to re-render, meaning the animation runs once each keyswitch
                key={gridAreaIndex + ''}
                className={classNames(
                    '[--card-image-anim-duration:calc(var(--clip-shape-animation-duration)/1.5)] [--card-image-anim-hover-duration:100ms]',

                    'absolute inset-[2px] transition-[transform] [clip-path:inherit]',

                    'group-hover-active:before:opacity-0 group-hover-active:before:transition-opacity group-hover-active:before:duration-[--card-image-anim-hover-duration] group-hover-active:after:opacity-0 group-hover-active:after:transition-opacity group-hover-active:after:duration-[--card-image-anim-hover-duration]',

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
                    } as CSSProperties
                }
            >
                {/* Title: */}
                <h6
                    className={classNames(
                        'absolute left-1/2 top-[2%] z-10 max-w-[84%] -translate-x-1/2 items-center justify-center text-center text-theme-secondary-lighter',
                        'before:absolute before:left-[-15%] before:-z-10 before:h-full before:w-[130%] before:bg-theme-primary-darker/90 before:pl-[10%] before:[clip-path:polygon(0_50%,6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%)]',
                        isAtFront ? 'flex w-fit' : 'hidden size-0',
                    )}
                >
                    {title}
                </h6>

                <img className='size-full object-cover object-center' src={titleCardBg} alt={title} />

                {/* Subtitle: */}
                {subTitle && (
                    <div
                        className={classNames(
                            'absolute bottom-[2%] left-1/2 z-10 max-w-[84%] -translate-x-1/2 items-center justify-center text-nowrap text-center text-sm text-theme-secondary-lighter',
                            'before:absolute before:left-[-5%] before:-z-10 before:h-full before:w-[110%] before:bg-theme-primary/70 before:pl-[10%] before:[clip-path:polygon(0_50%,5px_0,calc(100%-5px)_0,100%_50%,calc(100%-5px)_100%,5px_100%)]',
                            isAtFront ? 'flex w-fit' : 'hidden size-0',
                        )}
                    >
                        <Markdown>{subTitle}</Markdown>
                    </div>
                )}
            </div>
        </div>
    );
};

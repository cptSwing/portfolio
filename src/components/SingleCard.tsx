import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
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

const { activeCellCount } = config.categoryGrid;
const store_setPostAnimationStartDimensions = useZustand.getState().methods.store_setPostAnimationStartDimensions;

const SingleCard: FC<{
    post: Post;
    arrayIndex: number;
    totalCount: number;
    gridAreaIndex: number;
    setToFront: () => void;
    scrollDirection: 'down' | 'up' | null;
}> = ({ post, arrayIndex, totalCount, gridAreaIndex, setToFront, scrollDirection }) => {
    const { id, title, titleCardBg, subTitle } = post;
    const navigate = useNavigate();

    const gridCardStyle_Memo = useMemo(() => {
        const sharedStyles = {
            gridArea: 'area' + gridAreaIndex,
            zIndex: gridAreaIndex,
        };

        if (gridAreaIndex < 1) {
            const surplusCells = totalCount - activeCellCount;
            const thisSurplusCell = remapToRange(gridAreaIndex, -surplusCells + 1, 0, surplusCells - 1, 0);
            const r = 2; // ratio

            const total_ratio = (Math.pow(r, surplusCells) - 1) / (r - 1);
            const ratio = Math.pow(r, surplusCells - 1 - thisSurplusCell);
            const widthPercent = (ratio / total_ratio) * 100;

            return {
                ...sharedStyles,
                'gridArea': 'rest',
                'zIndex': 0,
                '--card-border-radius': 'var(--card-border-radius-md)',
                'position': 'absolute' as CSSProperties['position'],
                'width': `calc(${widthPercent}% - 8px)`,
                'left': `${100 - widthPercent > widthPercent ? 0 : 100 - widthPercent}%`,
            };
        } else if (gridAreaIndex >= activeCellCount - 1) {
            return {
                ...sharedStyles,
                '--card-border-radius': 'var(--card-border-radius-xl)',
            };
        } else {
            return {
                ...sharedStyles,
                '--card-border-radius': 'var(--card-border-radius-lg)',
            };
        }
    }, [gridAreaIndex, totalCount]);

    const [isAtFront, setIsAtFront] = useState(false);
    useEffect(() => {
        if (gridAreaIndex === activeCellCount) {
            setIsAtFront(true);
        } else {
            setIsAtFront(false);
        }
    }, [gridAreaIndex]);

    const postCardRef = useRef<HTMLDivElement | null>(null);
    const postCardRect = useZustand((state) => state.values.initialPostDimensions);

    useEffect(() => {
        if (isAtFront && !postCardRect) {
            // Set initial values, further updates are handled in Flipper onComplete
            postCardRef.current && store_setPostAnimationStartDimensions(postCardRef.current.getBoundingClientRect());
        }
    }, [isAtFront, postCardRect]);

    const blurElement_Ref = useRef<HTMLDivElement | null>(null);

    return (
        <Flipped
            flipId={arrayIndex}
            transformOrigin='0px 0px'
            opacity
            translate
            scale
            onAppear={() => {
                blurElement_Ref.current && motionBlurElement(blurElement_Ref.current, 'start', gridCardStyle_Memo.gridArea, scrollDirection);
            }}
            onStartImmediate={() => {
                blurElement_Ref.current && motionBlurElement(blurElement_Ref.current, 'start', gridCardStyle_Memo.gridArea, scrollDirection);
            }}
            onComplete={() => {
                blurElement_Ref.current && motionBlurElement(blurElement_Ref.current, 'complete', gridCardStyle_Memo.gridArea, scrollDirection, 200);
            }}
        >
            <div
                ref={postCardRef}
                className={classNames(
                    '[--card-border-radius-lg:theme(borderRadius.lg)] [--card-border-radius-md:theme(borderRadius.md)] [--card-border-radius-xl:theme(borderRadius.xl)] [--card-title-anim-delay:200ms] [--card-title-anim-duration:100ms] [--card-titles-inset-padding:theme(spacing.2)]',
                    'relative flex size-full select-none flex-col items-center justify-between rounded-[--card-border-radius] border border-[--color-primary-inactive-cat-bg] transition-[border-radius,border-color,border-width] duration-500 will-change-transform [transform:matrix(1,0.00001,-0.00001,1,0,0)]',
                    isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
                )}
                style={gridCardStyle_Memo}
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
                        'absolute top-[--card-titles-inset-padding] z-10 mx-auto rounded-t-md bg-[--color-primary-inactive-cat-bg] text-center drop-shadow transition-[transform,opacity,width]',
                        isAtFront
                            ? 'w-[calc(100%-(var(--card-titles-inset-padding)*2))] translate-y-0 opacity-100 delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]'
                            : 'w-full -translate-y-full opacity-0 delay-0 duration-200',
                    )}
                >
                    {title}
                </h6>

                {/* Image: */}
                <div
                    className={classNames(
                        '[--card-image-anim-duration-hover:100ms] [--card-image-anim-duration:500ms]',
                        'relative size-full border-[length:--card-titles-inset-padding] border-transparent transition-[filter,opacity] duration-[--card-image-anim-duration] hover-active:duration-[--card-image-anim-duration-hover]',
                        isAtFront ? 'hover-active:!opacity-100 hover-active:!brightness-100' : 'hover-active:!opacity-90 hover-active:!brightness-90',
                    )}
                    style={{
                        filter: `brightness(${(100 / activeCellCount) * gridAreaIndex}%)`,
                        opacity: `${(100 / activeCellCount) * gridAreaIndex + 20}%`,
                    }}
                >
                    <MotionBlurImage isAtFront={isAtFront} imgUrl={titleCardBg} altText={title} blurElementRef={blurElement_Ref} />
                </div>

                {/* Subtitle: */}
                {subTitle && (
                    <div
                        className={classNames(
                            'absolute bottom-[--card-titles-inset-padding] mx-auto rounded-b-md bg-[--color-primary-inactive-cat-bg] text-center text-sm drop-shadow transition-[transform,opacity,width]',
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

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Post } from '../types/types.ts';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.json';
import classNames from '../lib/classNames.ts';
import { useZustand } from '../lib/zustand.ts';

const { visibleCellCount } = config.categoryGrid;
const store_setPostAnimationStartDimensions = useZustand.getState().methods.store_setPostAnimationStartDimensions;

const SingleCard: FC<{
    post: Post;
    gridAreaIndex: number;
    setToFront: () => void;
    flippedProps: object;
}> = ({ post, gridAreaIndex, setToFront, flippedProps }) => {
    const { id, title, titleCardBg, subTitle } = post;
    const navigate = useNavigate();

    const gridCardStyle_Memo = useMemo(() => {
        if (gridAreaIndex === -1) {
            return { gridArea: 'area1', zIndex: gridAreaIndex };
        } else {
            return { gridArea: 'area' + gridAreaIndex, zIndex: gridAreaIndex };
        }
    }, [gridAreaIndex]);

    const [isAtFront, setIsAtFront] = useState(false);
    useEffect(() => {
        if (gridAreaIndex === visibleCellCount) {
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

    return (
        <div
            ref={postCardRef}
            className={classNames(
                '[--title-anim-delay:500ms] [--title-anim-duration:150ms]',
                'relative flex size-full select-none flex-col items-center justify-between overflow-hidden bg-[--nav-category-common-color-1]',
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
            {...flippedProps}
        >
            {/* Title: */}
            <h6
                className={classNames(
                    'absolute left-0 top-0 z-10 w-full overflow-hidden bg-[--color-primary-inactive-cat-bg] text-center transition-transform',
                    isAtFront
                        ? 'translate-y-0 delay-[--title-anim-delay] duration-[--title-anim-duration] [flex-basis:content]'
                        : '-translate-y-full delay-0 duration-200 [flex-basis:0]',
                )}
            >
                {title}
            </h6>

            {/* Image: */}
            <div
                className={classNames(
                    'size-full bg-cover bg-center transition-[filter] duration-500 hover-active:duration-100',
                    isAtFront ? 'hover-active:![filter:brightness(100%)_grayscale(0)]' : 'hover-active:![filter:brightness(90%)_grayscale(0.1)]',
                )}
                style={{
                    backgroundColor: titleCardBg ? '' : 'lightgray',
                    backgroundImage: titleCardBg ? `url('${titleCardBg}')` : '',
                    filter: `grayscale(${isAtFront ? 0 : 100 - (100 / visibleCellCount) * (gridAreaIndex - 1)}%) brightness(${(100 / visibleCellCount) * gridAreaIndex}%)`,
                }}
            />

            {/* Subtitle: */}
            {subTitle && (
                <div
                    className={classNames(
                        'absolute bottom-0 left-0 w-full select-none bg-[--color-primary-inactive-cat-bg] text-center text-sm transition-transform',
                        isAtFront
                            ? 'translate-y-0 delay-[--title-anim-delay] duration-[--title-anim-duration] [flex-basis:content]'
                            : 'translate-y-full delay-0 duration-200 [flex-basis:0]',
                    )}
                >
                    <Markdown>{subTitle}</Markdown>
                </div>
            )}
        </div>
    );
};

export default SingleCard;

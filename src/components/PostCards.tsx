import { FC, useEffect, useRef, useState } from 'react';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.json';
import classNames from '../lib/classNames';
import { useZustand } from '../lib/zustand.ts';

const { visibleCellCount } = config.categoryGrid;
const store_setInitialPostDimensions = useZustand.getState().methods.store_setInitialPostDimensions;

export const SinglePostCard: FC<{
    post: Post;
    gridAreaIndex: number;
    setToFront: () => void;
    flippedProps: object;
}> = ({ post, gridAreaIndex, setToFront, flippedProps }) => {
    const { id, title, titleCardBg, subTitle } = post;
    const navigate = useNavigate();
    const postCardRef = useRef<HTMLDivElement | null>(null);

    const [isAtFront, setIsAtFront] = useState(false);

    useEffect(() => {
        if (gridAreaIndex === visibleCellCount) {
            setIsAtFront(true);
            postCardRef.current && store_setInitialPostDimensions(postCardRef.current.getBoundingClientRect());
        } else {
            setIsAtFront(false);
        }
    }, [gridAreaIndex]);

    const gridArea = 'cell' + gridAreaIndex;

    return (
        <div
            ref={postCardRef}
            className={classNames(
                'flex select-none flex-col items-center justify-between overflow-hidden bg-[--nav-category-common-color-1]',
                isAtFront ? 'cursor-pointer' : 'cursor-zoom-in',
            )}
            style={gridAreaIndex === -1 ? { display: 'none', zIndex: gridAreaIndex } : { gridArea, zIndex: gridAreaIndex }}
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
            {isAtFront && <h6 className='w-full bg-[--color-primary-inactive-cat-bg] text-center'>{title}</h6>}

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
            {isAtFront && subTitle && (
                <div className='w-full select-none bg-[--color-primary-inactive-cat-bg] text-center text-sm'>
                    <Markdown>{subTitle}</Markdown>
                </div>
            )}
        </div>
    );
};

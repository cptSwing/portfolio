import { FC } from 'react';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

export const SinglePostCard: FC<{
    post: Post;
    arrayIndex: number;
    gridAreaIndex: number;
    flippedProps: object;
}> = ({ post, arrayIndex, gridAreaIndex, flippedProps }) => {
    const { id, title, titleCardBg, subTitle } = post;
    const gridArea = 'cell' + gridAreaIndex;
    const navigate = useNavigate();

    return (
        <div
            className='relative cursor-pointer select-none border-8 border-[--color-primary-inactive-cat-bg]'
            {...flippedProps}
            style={gridAreaIndex === -1 ? { display: 'none', zIndex: gridAreaIndex } : { gridArea, zIndex: gridAreaIndex }}
            onClick={(e) => {
                navigate(id.toString());
                e.stopPropagation();
            }}
        >
            {/* Title: */}
            {gridAreaIndex === 5 && (
                <h4 className='absolute left-0 top-0 z-10 w-full bg-[--color-primary-inactive-cat-bg] text-center'>
                    {title} {gridArea} arrIndex:{arrayIndex} z:{gridAreaIndex}
                </h4>
            )}

            {/* Image: */}
            <div
                className='absolute size-full bg-cover bg-origin-content grayscale-[75%]'
                style={titleCardBg ? { backgroundImage: `url('${titleCardBg}')` } : { backgroundColor: 'lightgray', opacity: 0.666666 }}
            />

            {/* Subtitle: */}
            {gridAreaIndex === 5 && subTitle && (
                <div className='absolute bottom-0 z-10 w-full select-none bg-[--color-primary-inactive-cat-bg] text-center text-sm'>
                    <Markdown>{subTitle}</Markdown>
                </div>
            )}
        </div>
    );
};

// export const SinglePostCard: FC<{
//     post: Post;
//     index: number;
//     dimensions: {
//         postCardsParentWidth: number;
//         postCardsParentHeight: number;
//         cardHeight: number;
//         cardOutline: number;
//         spacingY: number;
//         paddingTop: number;
//         paddingRight: number;
//     };
//     parentScroll: number;
// }> = ({ post, index, dimensions, parentScroll }) => {
//     const { id, title, titleCardBg, subTitle, date } = post;
//     const { postCardsParentWidth, postCardsParentHeight, cardHeight, cardOutline, spacingY, paddingTop, paddingRight } = dimensions;
//     const navigate = useNavigate();

//     const style = useScrollPosition(
//         index,
//         cardHeight,
//         cardOutline,
//         spacingY,
//         paddingTop,
//         paddingRight,
//         postCardsParentWidth,
//         postCardsParentHeight,
//         parentScroll,
//     );

//     return (
//         <div
//             style={style}
//             className='-z-10 mx-auto w-[--postcard-width] sm:ml-auto sm:mr-0'
//             onClick={(e) => {
//                 navigate(id.toString());
//                 e.stopPropagation();
//             }}
//         >
//             <div
//                 style={{ height: cardHeight }}
//                 className={
//                     '[--card-hover-delay:50ms] [--card-hover-duration:100ms] [--card-text-color:--theme-primary-50]' +
//                     ' ' +
//                     'group/this ml-auto mr-0 h-full origin-left transform-gpu cursor-pointer outline outline-[length:--card-outline-width] -outline-offset-[--card-outline-width] outline-[--color-secondary-inactive-cat] drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] delay-[--card-hover-delay] duration-[--card-hover-duration] sm:hover:outline-[length:--card-outline-width] sm:hover:outline-offset-0 sm:active:outline-offset-0'
//                 }
//             >
//                 {/* Title: */}
//                 <div className='relative z-10 mx-auto -mt-3 w-fit select-none px-2 pb-1 text-center leading-none text-[--card-text-color] transition-colors delay-[--card-hover-delay] duration-[--card-hover-duration] before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:-translate-y-0.5 before:bg-[--color-secondary-active-cat] before:shadow before:transition-[background-color] before:delay-[--card-hover-delay] before:duration-[--card-hover-duration] sm:px-4 sm:before:-translate-y-1'>
//                     <h3 className='-translate-y-px sm:-translate-y-1'>{title}</h3>
//                 </div>

//                 <div className='absolute top-0 size-full overflow-hidden'>
//                     {/* Subtitle: */}
//                     {subTitle && (
//                         <div className='absolute bottom-0 left-1/2 z-10 mx-auto h-fit -translate-x-1/2 transform-gpu select-none truncate bg-[--color-secondary-inactive-cat] px-2 pb-0.5 text-center text-xs text-[--card-text-color] opacity-90 transition-[background-color,opacity,color] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:text-[--card-text-color] group-active/this:text-[--card-text-color] hover:delay-[calc(75ms+var(--card-hover-delay))] active:delay-[calc(75ms+var(--card-hover-delay))] sm:left-0 sm:w-full sm:translate-x-0 sm:bg-transparent sm:py-[--card-outline-width] sm:text-sm sm:text-[--color-text-testimonial] sm:opacity-100 sm:group-hover/this:bg-[--color-secondary-inactive-cat]'>
//                             <Markdown>{subTitle}</Markdown>
//                         </div>
//                     )}

//                     {/* Image: */}
//                     <div className='absolute -z-10 size-full transition-[clip-path] delay-[--card-hover-delay] duration-[--card-hover-duration] clip-inset-0 group-active/this:clip-inset-[--card-outline-width]'>
//                         <div
//                             className='h-full w-auto scale-105 transform-gpu bg-cover grayscale-[75%] transition-[filter] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:grayscale-0 group-hover/this:delay-0 group-hover/this:duration-[--card-hover-duration] group-active/this:grayscale-0 group-active/this:delay-0 group-active/this:duration-[--card-hover-duration]'
//                             style={titleCardBg ? { backgroundImage: `url('${titleCardBg}')` } : { backgroundColor: 'lightgray', opacity: 0.666666 }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

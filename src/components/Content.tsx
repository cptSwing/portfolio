import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post } from '../types/types';
import { FC, useCallback, useState } from 'react';
import { navWidthClassesUnchecked } from './Nav';
import { Remark } from 'react-remark';
import Lightbox from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

const store_activePost = useZustand.getState().methods.store_activePost;

const Content = () => {
    const activePost = useZustand((state) => state.active.post);

    return (
        <main
            className={classNames(
                'relative mb-4 flex h-0.5 justify-center bg-gray-700/50 transition-[width] duration-300',
                activePost ? 'w-full' : navWidthClassesUnchecked,
            )}
        >
            <ContentWrapper_Test post={activePost} />
        </main>
    );
};

export default Content;

const ContentWrapper_Test: FC<{
    post: Post | null;
}> = ({ post }) => {
    const [topVal, setTopVal] = useState<number | undefined>();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
        }
    }, []);

    if (!post) return null;

    const { title, images, textContent, codeLink } = post;

    return (
        <div
            id={'lightbox'}
            ref={contentRefCb}
            className={classNames('absolute top-0 w-full overflow-hidden bg-inherit shadow-lg', post ? 'z-10 h-fit' : '-z-10 h-0')}
        >
            <div
                className={
                    'relative mx-auto flex flex-col items-center justify-start overflow-y-auto bg-gray-400 p-4 shadow-md scrollbar-thin' +
                    navWidthClassesUnchecked
                }
                style={{ height: window.innerHeight - (topVal ?? 0) - 32 }}
                // onBlur={() => store_activePost(null)} // TODO
            >
                {codeLink && (
                    <a
                        className='group absolute left-0 block cursor-pointer rounded-full rounded-l-none p-1 pr-2 shadow hover:bg-purple-300'
                        onClick={() => store_activePost(null)}
                        href={codeLink}
                        target='_blank'
                        rel='noreferrer'
                    >
                        Code lbr rbr
                        <span className='absolute mt-2 hidden whitespace-nowrap text-sm group-hover:block'>
                            Link goes to {codeLink} <br /> bla bla explanatory <br /> new window/tab
                        </span>
                    </a>
                )}

                <div className='absolute right-0 flex flex-col items-end justify-start space-y-1'>
                    <div
                        className='cursor-pointer border border-r-0 border-gray-300 p-1 pl-2 shadow hover:bg-purple-300'
                        onClick={() => store_activePost(null)}
                    >
                        X
                    </div>

                    <button
                        type='button'
                        className='cursor-pointer border border-r-0 border-gray-300 p-1 pl-2 shadow hover:bg-purple-300'
                        onClick={() => {
                            setSlideIndex(0);
                            setLightboxOpen(true);
                        }}
                    >
                        Gallery
                    </button>
                </div>

                <h1>{title}</h1>

                {/* Text/Image Blocks */}
                {textContent.map((text, idx) => {
                    const { imgUrl, caption } = images?.[idx] ?? { imgUrl: '', caption: '' };
                    const isIndexEven = idx % 2 === 0;

                    return (
                        <div key={idx}>
                            <br />

                            <div className='relative'>
                                <img
                                    src={imgUrl}
                                    className={classNames(
                                        'peer cursor-pointer',
                                        text ? 'w-2/3' : 'w-full',
                                        isIndexEven ? 'float-left mr-6' : 'float-right ml-6',
                                    )}
                                    onClick={() => {
                                        setSlideIndex(idx);
                                        setLightboxOpen(true);
                                    }}
                                />
                                <div
                                    className={classNames(
                                        'absolute -top-full bg-gray-200/10 p-1 text-sm text-gray-200/50 peer-hover:bg-gray-200/25 peer-hover:text-gray-200',
                                        isIndexEven ? 'left-0' : 'right-0',
                                    )}
                                >
                                    {caption + idx}
                                </div>
                            </div>

                            <Remark>{text}</Remark>

                            <br />
                        </div>
                    );
                })}

                <br />
                <br />

                <Lightbox
                    open={lightboxOpen}
                    index={slideIndex}
                    close={() => setLightboxOpen(false)}
                    slides={images?.map(({ imgUrl, caption }) => ({ src: imgUrl, title: caption }))}
                    plugins={[Captions]}
                />
            </div>
        </div>
    );
};

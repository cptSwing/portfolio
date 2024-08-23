import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post } from '../types/types';
import { FC, useCallback, useState } from 'react';
import { navWidthClassesChecked } from './Nav';
import { Remark } from 'react-remark';
import Lightbox from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

const store_activePost = useZustand.getState().methods.store_activePost;

const Content = () => {
    const activePost = useZustand((state) => state.active.post);

    return (
        <main className={classNames('relative mb-4 flex h-0.5 justify-center bg-gray-700/50', activePost ? 'z-50 w-screen' : 'w-full')}>
            <ContentWrapper_Test post={activePost} />
        </main>
    );
};

export default Content;

const ContentWrapper_Test: FC<{
    post: Post | null;
}> = ({ post }) => {
    const [topVal, setTopVal] = useState<number>(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
            node.classList.toggle('w-screen');
        }
    }, []);

    if (!post) return null;

    const { title, images, textContent, codeLink } = post;

    return (
        <div ref={contentRefCb} className={classNames('absolute top-4 bg-inherit shadow-lg', post ? 'z-10 h-fit' : '-z-10 h-0')}>
            <div className={'relative mx-auto' + navWidthClassesChecked}>
                <div className='absolute right-0 top-[-50px] flex items-end justify-end space-x-1 shadow'>
                    {images && (
                        <button
                            type='button'
                            className='cursor-pointer border border-b-0 border-gray-300 p-1 hover:bg-purple-300'
                            onClick={() => {
                                setSlideIndex(0);
                                setLightboxOpen(true);
                            }}
                        >
                            Gallery
                        </button>
                    )}

                    {codeLink && (
                        <a
                            className='group block cursor-pointer border border-b-0 p-1 shadow hover:bg-purple-300'
                            href={codeLink}
                            target='_blank'
                            rel='noreferrer'
                        >
                            Code lbr rbr
                            <span className='absolute right-0 z-50 mt-2 hidden whitespace-nowrap text-right text-sm group-hover:block'>
                                Link goes to {codeLink} <br /> bla bla explanatory <br /> new window/tab
                            </span>
                        </a>
                    )}

                    {/* TODO fade out instead of instantly closing */}
                    <div
                        className='aspect-square h-fit cursor-pointer border border-b-0 border-gray-300 p-1 hover:bg-purple-300'
                        onClick={() => store_activePost(null)}
                    >
                        X
                    </div>
                </div>
            </div>

            <div className={classNames('absolute flex justify-center overflow-hidden bg-inherit', post ? 'w-screen' : 'w-full')}>
                <div
                    className={classNames(
                        'relative mx-auto flex h-0 flex-col items-center justify-start overflow-y-auto bg-gray-400 p-4 shadow-md scrollbar-thin',
                        navWidthClassesChecked,
                    )}
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    <h1>{title}</h1>

                    {/* Text/Image Blocks */}
                    {textContent?.map((text, idx) => {
                        const { imgUrl, caption } = images?.[idx] ?? {};
                        const isIndexEven = idx % 2 === 0;

                        return (
                            <div key={idx} className='w-full'>
                                <br />

                                {imgUrl && (
                                    <div className='relative'>
                                        <img
                                            src={imgUrl}
                                            className={classNames(
                                                'peer cursor-pointer',
                                                text ? 'w-2/3' : '!mx-0 w-full',
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
                                            {caption}
                                        </div>
                                    </div>
                                )}

                                <div className='text-left'>
                                    <Remark>{text}</Remark>
                                </div>

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
        </div>
    );
};

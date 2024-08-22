import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { DataBase_Post } from '../types/types';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { navWidthClasses } from './Nav';
import { useRemark } from 'react-remark';
import SimpleLightbox from 'simplelightbox';

const store_activePost = useZustand.getState().methods.store_activePost;

const Content = () => {
    const activePost = useZustand((state) => state.active.post);

    return (
        <main
            className={classNames(
                'relative mb-4 flex h-0.5 justify-center bg-gray-700/50 transition-[width] duration-300',
                activePost ? 'w-full' : navWidthClasses,
            )}
        >
            <ContentWrapper_Test post={activePost} />
        </main>
    );
};

export default Content;

const ContentWrapper_Test: FC<{
    post: DataBase_Post | null;
}> = ({ post }) => {
    const [topVal, setTopVal] = useState<number | undefined>();
    const [lightbox, setLightbox] = useState<SimpleLightbox>();

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
            setLightbox(new SimpleLightbox(node.id)); // TODO this is superwrong :)
        }
    }, []);

    if (!post) return null;

    const { title, galleryImages, textContent, codeLink } = post;

    return (
        <div
            id={'lightbox'}
            ref={contentRefCb}
            className={classNames('absolute top-0 w-full overflow-hidden bg-inherit shadow-lg', post ? 'z-10 h-fit' : '-z-10 h-0')}
        >
            <div
                className={
                    'relative mx-auto flex flex-col items-center justify-start overflow-y-auto bg-gray-400 p-4 shadow-md scrollbar-thin' + navWidthClasses
                }
                style={{ height: window.innerHeight - (topVal ?? 0) - 32 }}
                onBlur={() => store_activePost(null)} // TODO
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

                <div
                    className='absolute right-0 cursor-pointer rounded-full rounded-r-none p-1 pl-2 shadow hover:bg-purple-300'
                    onClick={() => store_activePost(null)}
                >
                    X Close
                </div>

                <h1>{title}</h1>

                {textContent.map((text, idx) => (
                    <ContentBlock key={idx} text={text} images={galleryImages} index={idx} />
                ))}
            </div>
        </div>
    );
};

const ContentBlock: FC<{ text: string; index: number; images: string[] | null; key: string | number }> = ({ text, index, images, key }) => {
    const [reactContent, setMarkdownSource] = useRemark();

    useEffect(() => {
        setMarkdownSource(text);
    }, [text, setMarkdownSource]);

    return (
        <div key={key} className='w-full'>
            <br />

            {index % 2 === 0 ? (
                <img src={images?.[index]} className={classNames(text ? 'float-left mr-6 w-2/3' : 'w-full')} />
            ) : (
                <img src={images?.[index]} className={classNames(text ? 'float-right ml-6 w-2/3' : 'w-full')} />
            )}

            <span className='text-left'>{reactContent}</span>

            <br />
        </div>
    );
};

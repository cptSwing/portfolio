import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post } from '../types/types';
import { FC, useCallback, useMemo, useState } from 'react';
import { MenuOpenedPost } from './Nav';
import { Remark } from 'react-remark';
import Lightbox from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

const Content = () => {
    const activePost = useZustand((state) => state.nav.activePost);

    return <main className={classNames('relative z-50 -mb-[2px] flex justify-center')}>{activePost && <ContentWrapper_Test post={activePost} />}</main>;
};

export default Content;

const ContentWrapper_Test: FC<{
    post: Post;
}> = ({ post }) => {
    const { title, images, textContent, codeLink } = post;

    const [topVal, setTopVal] = useState<number>(0);
    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
        }
    }, []);

    const lengthAdjustedTextContent = useMemo(() => {
        return Array.from({ ...textContent, length: Math.max(textContent?.length, images ? images.length : 0) });
    }, [textContent, images]);

    return (
        <div
            ref={contentRefCb}
            className={classNames(
                'transform-[width,opacity] relative bg-palette-neutral-600/75 drop-shadow-lg duration-500',
                post ? 'z-10 h-fit w-screen opacity-100' : '-z-10 h-0 w-auto opacity-10',
            )}
        >
            <MenuOpenedPost hasImages={images ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

            <div className='absolute flex w-full justify-center overflow-hidden bg-inherit'>
                <div
                    className='nav-checked-width relative mx-auto flex flex-wrap items-start justify-center gap-2 overflow-y-auto bg-palette-utility-bg p-4 drop-shadow-lg scrollbar-thin'
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    <br />
                    <h2 className='ml-[10%] w-full text-palette-primary-500'>{title}</h2>

                    {/* Text/Image Blocks */}
                    {lengthAdjustedTextContent?.map((text, idx) => {
                        const { imgUrl, caption } = images?.[idx] ?? {};
                        const isIndexEven = idx % 2 === 0;

                        return imgUrl ? (
                            text ? (
                                <div key={`${idx}-${isIndexEven}`} className='w-full'>
                                    <br />
                                    <div className='relative'>
                                        <img
                                            src={imgUrl}
                                            className={classNames(
                                                'peer cursor-pointer',
                                                text ? 'w-2/3' : '!mx-0 w-full',
                                                isIndexEven ? 'float-left mr-6' : 'float-right ml-6',
                                            )}
                                            onClick={() => setLightboxTo(idx)}
                                        />

                                        <div
                                            className={classNames(
                                                'absolute -top-full bg-palette-neutral-300/20 p-1 text-sm text-palette-neutral-100/75 transition-colors peer-hover:bg-palette-neutral-300 peer-hover:text-palette-accent-300',
                                                isIndexEven ? 'left-0' : 'right-0',
                                            )}
                                        >
                                            {caption}
                                        </div>
                                    </div>

                                    <div className='text-left'>
                                        <Remark>{text}</Remark>
                                    </div>

                                    <br />
                                </div>
                            ) : (
                                <div
                                    key={idx}
                                    className='group relative aspect-video w-[calc(25%-theme(spacing.2)+2px)] cursor-pointer bg-cover'
                                    style={{ backgroundImage: `url(${imgUrl})` }}
                                    onClick={() => setLightboxTo(idx)}
                                >
                                    <div
                                        className={classNames(
                                            'absolute bottom-0 z-10 w-full bg-gray-200/0 p-1 text-center text-2xs text-gray-200/10 group-hover:bg-gray-200/25 group-hover:text-gray-200',
                                        )}
                                    >
                                        {caption}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className='w-full'>
                                <Remark>{text}</Remark>
                            </div>
                        );
                    })}

                    <Lightbox
                        open={Number.isInteger(lightboxTo)}
                        index={lightboxTo ?? 0}
                        close={() => setLightboxTo(null)}
                        slides={images?.map(({ imgUrl, caption }) => ({ src: imgUrl, title: caption }))}
                        plugins={[Captions]}
                    />
                </div>
            </div>
        </div>
    );
};

import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post } from '../types/types';
import { CSSProperties, FC, useCallback, useState } from 'react';
import { MenuOpenedPost } from './Nav';
import { Remark } from 'react-remark';
import Lightbox from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import parseDateString from '../lib/parseDateString';

const Content = () => {
    return (
        <>
            <main className={classNames('relative z-50 -mb-[2px] flex justify-center')}>
                <ContentWrapper_Test />
            </main>
        </>
    );
};

export default Content;

const ContentWrapper_Test: FC<{}> = () => {
    const activePost = useZustand((state) => state.nav.activePost);
    const [topVal, setTopVal] = useState<number>(0);
    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
        }
    }, []);

    if (!activePost) {
        return null;
    }

    const { title, subTitle, toolsUsed, images, textBlocks, codeLink, date } = activePost;
    const { year, month, day } = parseDateString(date);

    return (
        <div
            ref={contentRefCb}
            className={classNames(
                'transform-[width,opacity] bg-theme-bg-base absolute drop-shadow-lg',
                activePost ? 'z-10 h-fit w-screen opacity-100' : '-z-10 h-0 w-full opacity-10',
            )}
        >
            <MenuOpenedPost hasImages={images ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

            <div
                className='nav-checked-width bg-theme-bg-lighter relative mx-auto flex flex-col overflow-hidden'
                style={{ height: window.innerHeight - topVal - 2 }}
            >
                <div className='fixed left-1/2 z-10 -translate-x-1/2 -translate-y-[60%]'>
                    <h2 className='text-theme-neutral-50 before:bg-theme-secondary-400 px-8 before:absolute before:bottom-0 before:left-0 before:-z-10 before:h-3/5 before:w-full'>
                        {title}
                    </h2>
                </div>

                <div
                    className='relative flex flex-col gap-y-6 overflow-y-auto px-14 py-6 scrollbar-thin'
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    <div className='relative mt-2 w-full'>
                        <ToolsUsed tools={toolsUsed} />
                        <h4 className='mx-auto text-center italic'>{subTitle}</h4>
                        <div className='absolute right-0 top-1/2 -translate-y-1/2'>
                            <span>
                                {day}.{month}.{year}
                            </span>
                        </div>
                    </div>

                    {/* Text/Image Blocks */}
                    {textBlocks?.map(({ text, imageIndex }, idx) => {
                        let imgUrl, caption;
                        if (images && typeof imageIndex === 'number') ({ imgUrl, caption } = images[imageIndex]);

                        const isIndexEven = idx % 2 === 0;

                        return (
                            <div key={`${idx}-${isIndexEven}`} className='mt-8 flex items-start justify-between'>
                                {imgUrl && (
                                    <div className={classNames('relative basis-3/5', isIndexEven ? 'order-1 mr-8' : 'order-2 ml-8')}>
                                        <img
                                            src={imgUrl}
                                            className={classNames('peer aspect-video w-full cursor-pointer object-cover')}
                                            onClick={() => setLightboxTo(imageIndex!)}
                                        />

                                        {caption && (
                                            <div
                                                className={classNames(
                                                    'bg-theme-neutral-300/20 text-theme-neutral-100/75 peer-hover:bg-theme-neutral-300 peer-hover:text-theme-accent-300 absolute bottom-0 left-0 right-0 size-min w-full p-1 text-center text-sm transition-colors',
                                                )}
                                            >
                                                {/* [calc(100%-theme(spacing.6))] */}
                                                {caption}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={classNames('text-justify', imgUrl ? 'flex-1' : 'mr-auto basis-4/5', isIndexEven ? 'order-2' : 'order-1')}>
                                    <Remark>{text}</Remark>
                                </div>

                                <br />
                            </div>
                        );
                    })}
                </div>

                <Lightbox
                    open={Number.isInteger(lightboxTo)}
                    index={lightboxTo ?? 0}
                    close={() => setLightboxTo(null)}
                    slides={images?.map(({ imgUrl, caption }) => ({ src: imgUrl, title: caption }))}
                    plugins={[Captions]}
                />
                {/* </div> */}
            </div>
        </div>
    );
};

const ToolsUsed: FC<{ tools: Post['toolsUsed'] }> = ({ tools }) => {
    return tools ? (
        <div className='group absolute left-0 top-1/2 -translate-y-1/2 select-none'>
            <div className='text-theme-primary-400 pb-px text-xs uppercase italic'>Built with</div>
            <div
                /* Using length -1 in variable --tools-count in order to have last element at full size, for 'stacked' look */
                className='text-theme-primary-100 group-hover:text-theme-primary-200 grid grid-flow-col grid-cols-[repeat(var(--tools-count),0.25fr)] gap-x-px transition-[grid-template-columns,column-gap] duration-500 group-hover:grid-cols-[repeat(var(--tools-count),1fr)] group-hover:gap-x-0.5'
                style={{ '--tools-count': tools.length - 1 } as CSSProperties}
            >
                {tools?.map((tool, idx) => {
                    return (
                        <div
                            key={tool + idx}
                            className='bg-theme-neutral-700 overflow-hidden whitespace-nowrap rounded-sm px-1 text-center text-xs leading-tight'
                        >
                            {tool}
                        </div>
                    );
                })}
            </div>
        </div>
    ) : null;
};

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

    return (
        <div
            ref={contentRefCb}
            className={classNames(
                'transform-[width,opacity] absolute bg-black/50 drop-shadow-lg duration-500',
                activePost ? 'z-10 h-fit w-screen opacity-100' : '-z-10 h-0 w-full opacity-10',
            )}
        >
            <MenuOpenedPost hasImages={images ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

            <div
                className='nav-checked-width relative mx-auto flex flex-col overflow-hidden bg-palette-utility-bg'
                style={{ height: window.innerHeight - topVal - 2 }}
            >
                <div className='fixed left-1/2 z-10 -translate-x-1/2 -translate-y-[60%]'>
                    <h2 className='px-8 text-palette-primary-500 before:absolute before:bottom-0 before:left-0 before:-z-10 before:h-3/5 before:w-full before:bg-palette-primary-50'>
                        {title}
                    </h2>
                </div>

                <div
                    className='relative flex flex-col gap-y-6 overflow-y-auto bg-palette-utility-bg px-14 py-6 scrollbar-thin'
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    <div className='relative mt-2 flex w-full items-start justify-center'>
                        <ToolsUsed tools={toolsUsed} />
                        <h4 className='mx-auto text-center italic'>{subTitle}</h4>
                        <div>{Date.parse(date)}</div>
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
                                                    'absolute bottom-0 left-0 right-0 size-min w-full bg-palette-neutral-300/20 p-1 text-center text-sm text-palette-neutral-100/75 transition-colors peer-hover:bg-palette-neutral-300 peer-hover:text-palette-accent-300',
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
        <div className='group select-none'>
            <div className='pb-px text-xs uppercase italic text-neutral-100/75'>Built with</div>
            <div className='relative'>
                <div
                    /* 
						Using length -1 in --tools-count in order to have last element at full size, for 'stacked' look,
						and margin-right -10000px to break out of parent element's width					
					*/
                    className='absolute mr-[-10000px] grid grid-flow-col grid-cols-[repeat(var(--tools-count),0.25fr)] gap-x-px overflow-x-visible text-neutral-400/50 transition-[grid-template-columns,column-gap] duration-500 group-hover:grid-cols-[repeat(var(--tools-count),1fr)] group-hover:gap-x-0.5 group-hover:text-neutral-400'
                    style={{ '--tools-count': tools.length - 1 } as CSSProperties}
                >
                    {tools?.map((tool, idx) => {
                        return (
                            <div
                                key={tool + idx}
                                className='overflow-hidden whitespace-nowrap rounded-sm bg-palette-neutral-700 px-1 text-center text-xs leading-tight'
                            >
                                {tool}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : null;
};

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
                'transform-[width,opacity] absolute bg-theme-bg-base drop-shadow-lg',
                activePost ? 'z-10 h-fit w-screen opacity-100' : '-z-10 h-0 w-full opacity-10',
            )}
        >
            <MenuOpenedPost hasImages={images ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

            <div
                className='nav-checked-width relative mx-auto flex flex-col overflow-hidden bg-[--bg-color] scrollbar-thumb-theme-primary-400 [--bg-color:theme(colors.theme.bg.lighter)]'
                style={{ height: window.innerHeight - topVal - 2 }}
            >
                <div className='fixed left-1/2 z-10 -translate-x-1/2 -translate-y-[60%]'>
                    <h2 className='px-8 text-theme-neutral-50 before:absolute before:bottom-0 before:left-0 before:-z-10 before:h-3/5 before:w-full before:bg-theme-secondary-400'>
                        {title}
                    </h2>
                </div>

                <div
                    className='relative flex flex-col overflow-y-auto px-14 py-8 scrollbar-thin'
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    <div className='mb-6 mt-10 flex items-start justify-between'>
                        <h4 className='relative z-0 -ml-2 px-2 text-center italic leading-none'>{subTitle}</h4>
                        <div className='flex flex-col items-end justify-start'>
                            <h5 className='headline-skewed-bg -mr-0.5 mb-2 w-fit text-[--bg-color] no-underline'>
                                {day}.{month}.{year}
                            </h5>
                            <div className='mb-0.5 text-xs uppercase italic text-theme-primary-400'>Built with</div>
                            <ToolsUsed tools={toolsUsed} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-10'>
                        {/* Text/Image Blocks */}
                        {textBlocks?.map(({ text, imageIndex }, idx) => {
                            let imgUrl, caption;
                            if (images && typeof imageIndex === 'number') ({ imgUrl, caption } = images[imageIndex]);

                            const isIndexEven = idx % 2 === 0;

                            return (
                                <div key={`${idx}-${isIndexEven}`} className='flex items-start justify-between'>
                                    {imgUrl && (
                                        <div className={classNames('relative basis-3/4', isIndexEven ? 'order-2 ml-8' : 'order-1 mr-8')}>
                                            <img
                                                src={imgUrl}
                                                className={classNames('peer aspect-video w-full cursor-pointer object-cover')}
                                                onClick={() => setLightboxTo(imageIndex!)}
                                            />

                                            {caption && (
                                                <div
                                                    className={classNames(
                                                        'absolute bottom-0 left-0 right-0 size-min w-full bg-theme-neutral-300/20 p-1 text-center text-sm text-theme-neutral-100/75 transition-colors peer-hover:bg-theme-neutral-300 peer-hover:text-theme-accent-300',
                                                    )}
                                                >
                                                    {/* [calc(100%-theme(spacing.6))] */}
                                                    {caption}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p
                                        className={classNames(
                                            'mrkdwn -mt-1 text-pretty text-justify text-sm leading-relaxed',
                                            imgUrl ? 'flex-1' : 'mr-auto basis-4/5',
                                            isIndexEven ? 'order-1' : 'order-2',
                                            idx === 0
                                                ? 'first-letter:float-left first-letter:-mt-1 first-letter:mr-1 first-letter:text-5xl first-line:uppercase'
                                                : '',
                                        )}
                                    >
                                        <Remark>{text}</Remark>
                                    </p>

                                    <br />
                                </div>
                            );
                        })}
                    </div>

                    {images && (
                        <div className='mt-14 grid grid-cols-4 gap-4'>
                            {images.slice(textBlocks.length).map(({ imgUrl }, idx) => (
                                <img
                                    key={imgUrl + idx}
                                    src={imgUrl}
                                    className='size-full cursor-pointer object-cover'
                                    onClick={() => setLightboxTo(idx + textBlocks.length)}
                                />
                            ))}
                        </div>
                    )}
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
        <div className='group select-none self-end'>
            <div
                className='grid grid-flow-col grid-cols-[repeat(var(--tools-count),0.2fr)_0.75fr] gap-x-px text-theme-primary-100 transition-[grid-template-columns,column-gap] duration-500 group-hover:grid-cols-[repeat(var(--tools-count),1fr)_1fr] group-hover:gap-x-0.5 group-hover:text-theme-primary-200'
                /* Using length -1 in variable --tools-count in order to have first element at full size, for 'stacked' look */
                style={{ '--tools-count': tools.length - 1 } as CSSProperties}
            >
                {tools?.map((tool, idx) => {
                    return (
                        <div
                            key={tool + idx}
                            className='overflow-hidden whitespace-nowrap rounded-sm bg-theme-primary-800 px-1 text-center text-xs leading-tight'
                        >
                            {tool}
                        </div>
                    );
                })}
            </div>
        </div>
    ) : null;
};

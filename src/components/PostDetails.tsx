import { FC, useEffect, useState } from 'react';
import classNames from '../lib/classNames';
import { PostType } from '../types/types';
import { ToolsUrls } from '../types/enums';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

const PostDetails: FC<{ stack: PostType['stack']; clients: PostType['clients']; viewLive: PostType['viewLive']; viewSource: PostType['viewSource'] }> = ({
    stack,
    clients,
    viewLive,
    viewSource,
}) => {
    const [content, setContent] = useState<JSX.Element | null>(null);

    useEffect(() => () => setContent(null), []);

    return (
        <>
            <div
                className={
                    '[--stack-button-clip-path-polygon-last:polygon(0_var(--stack-button-height),calc(var(--stack-button-height)/var(--stack-button-clip-path-tan-sixty))_0,100%_0,100%_var(--stack-button-height))] [--stack-button-clip-path-polygon:polygon(0_var(--stack-button-height),calc(var(--stack-button-height)/var(--stack-button-clip-path-tan-sixty))_0,100%_0,calc(100%-var(--stack-button-height)/var(--stack-button-clip-path-tan-sixty))_var(--stack-button-height))] [--stack-button-clip-path-tan-sixty:1.73205] [--stack-button-height:1vw]' +
                    ' ' +
                    'flex items-start justify-end leading-none'
                }
            >
                {stack && (
                    <SingleStackBlock
                        title={'Stack'}
                        jsx={
                            <div
                                data-block-id='stack-content-parent'
                                className='grid gap-1'
                                dir='rtl'
                                style={{ gridTemplateColumns: `repeat(${stack.length < 4 ? stack.length : 4}, minmax(0, 1fr)` }}
                            >
                                {stack.map((tool, idx) => (
                                    <a
                                        key={idx}
                                        href={ToolsUrls[tool]}
                                        className='block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline'
                                    >
                                        {tool}
                                    </a>
                                ))}
                            </div>
                        }
                        content={content}
                        setContent={setContent}
                    />
                )}

                {viewLive && (
                    <SingleStackBlock
                        title={'View Live'}
                        jsx={
                            <div data-block-id='view-live-content-parent' dir='rtl' className='grid grid-cols-3 items-start gap-1'>
                                {viewLive.map(({ url, title, description }, idx) => (
                                    <div
                                        key={idx}
                                        className='group max-h-[4vh] bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker outline outline-1 -outline-offset-2 outline-theme-text-background transition-[max-height,color,background-color,outline-color] hover-active:max-h-full hover-active:bg-theme-primary/50 hover-active:text-theme-text-background'
                                    >
                                        <a className='leading-none no-underline group-hover-active:underline' href={url}>
                                            {title}
                                        </a>
                                        <Markdown
                                            className='overflow-hidden pt-px text-left text-theme-text/60 transition-[clip-path] [clip-path:polygon(0%_0%,100%_0%,100%_1.25vh,0%_1.25vh)] group-hover-active:text-theme-text-background/70 group-hover-active:[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]'
                                            remarkPlugins={[remarkBreaks]}
                                        >
                                            {description}
                                        </Markdown>
                                    </div>
                                ))}
                            </div>
                        }
                        content={content}
                        setContent={setContent}
                    />
                )}

                {viewSource && (
                    <SingleStackBlock
                        title={'View Source'}
                        jsx={
                            <div data-block-id='view-source-content-parent' className=''>
                                <a
                                    className='block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline'
                                    href={viewSource.href}
                                >
                                    {viewSource.alt}
                                </a>
                            </div>
                        }
                        content={content}
                        setContent={setContent}
                    />
                )}

                {clients && (
                    <SingleStackBlock
                        title={'Clients / Users'}
                        jsx={
                            <div
                                data-block-id='clients-content-parent'
                                className='relative grid gap-x-0.5'
                                style={{ gridTemplateColumns: `repeat(${clients.length < 4 ? clients.length : 4}, minmax(0, 1fr)` }}
                            >
                                {clients.map(({ abbreviation, name, svgUrl }, idx) => (
                                    <div key={idx + abbreviation + name} className='group relative'>
                                        <div className='relative flex aspect-hex-flat w-12 items-center justify-center bg-theme-secondary-darker/50 text-theme-primary-darker [clip-path:url(#svgRoundedHexagonClipPath-default)] group-hover-active:bg-theme-primary/50 group-hover-active:text-theme-secondary-darker'>
                                            <div className='flex aspect-square w-3/5 select-none items-center justify-center rounded-full bg-theme-text-background text-center text-2xs font-semibold'>
                                                {abbreviation}
                                            </div>
                                        </div>
                                        <div className='pointer-events-none absolute top-full z-10 mt-1 text-center text-2xs text-theme-primary opacity-0 group-hover-active:opacity-100'>
                                            {name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        content={content}
                        setContent={setContent}
                    />
                )}
            </div>

            {/* Line Break in flexbox */}
            <div className='size-0 basis-full' />

            <div
                className={classNames(
                    'relative ml-auto mr-0 text-xs text-theme-primary transition-[clip-path] clip-inset-b-[-100%]',
                    content ? 'clip-inset-l-0' : 'clip-inset-l-full',
                )}
            >
                {content}
            </div>
        </>
    );
};

export default PostDetails;

const SingleStackBlock: FC<{
    title: string;
    jsx: JSX.Element;
    content: JSX.Element | null;
    setContent: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}> = ({ title, jsx, content, setContent }) => {
    const isThisJsx = jsx.props['data-block-id'] === content?.props['data-block-id'];

    return (
        <button
            className={classNames(
                'group flex h-[--stack-button-height] cursor-pointer items-center justify-end pl-3.5 pr-2 [clip-path:--stack-button-clip-path-polygon] last-of-type:pr-1 last-of-type:[clip-path:--stack-button-clip-path-polygon-last] hover-active:bg-theme-primary',
                isThisJsx ? 'bg-theme-primary' : 'bg-theme-primary-lighter',
            )}
            onClick={() => {
                if (!content || !isThisJsx) {
                    setContent(jsx);
                } else {
                    setContent(null);
                }
            }}
        >
            <div
                className={classNames(
                    'inline-block pt-0.5 text-2xs font-semibold uppercase leading-none group-hover-active:text-theme-text-background',
                    isThisJsx ? 'text-theme-text-background' : 'text-theme-primary-darker',
                )}
            >
                {title}
            </div>
            {/* ChevronDown */}
            <div
                className={classNames(
                    'ml-1 inline-block aspect-square h-5/6 transition-transform [mask-image:url(/svg/ChevronDownOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%] group-hover-active:bg-theme-text-background',
                    isThisJsx ? 'rotate-0 bg-theme-text-background' : '-rotate-180 bg-theme-primary-darker',
                )}
            />
        </button>
    );
};

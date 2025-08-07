import { FC, useContext, useEffect, useMemo, useState } from 'react';
import classNames from '../lib/classNames';
import { PostType } from '../types/types';
import { ToolsUrls } from '../types/enums';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import GetChildSize from './GetChildSize';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { getHexagonalClipPath } from '../lib/hexagonData';

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
            <div className="relative flex items-start justify-end font-lato leading-none tracking-tight">
                {stack && (
                    <GetChildSize Context={GetChildSizeContext}>
                        <SingleStackBlock
                            title={'Stack'}
                            jsx={
                                <div
                                    data-block-id="stack-content-parent"
                                    className="grid gap-1"
                                    // dir='rtl'
                                    style={{ gridTemplateColumns: `repeat(${stack.length < 4 ? stack.length : 4}, minmax(0, 1fr)` }}
                                >
                                    {stack.map((tool, idx) => (
                                        <a
                                            key={idx}
                                            href={ToolsUrls[tool]}
                                            className="block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline"
                                        >
                                            {tool}
                                        </a>
                                    ))}
                                </div>
                            }
                            isLast={!viewLive && !viewSource && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {viewLive && (
                    <GetChildSize Context={GetChildSizeContext}>
                        <SingleStackBlock
                            title={'View Live'}
                            jsx={
                                <div data-block-id="view-live-content-parent" dir="rtl" className="grid grid-cols-3 items-start gap-1">
                                    {viewLive.map(({ url, title, description }, idx) => (
                                        <div
                                            key={idx}
                                            className="group max-h-[4vh] bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker outline outline-1 -outline-offset-2 outline-theme-text-background transition-[max-height,color,background-color,outline-color] hover-active:max-h-full hover-active:bg-theme-primary/50 hover-active:text-theme-text-background"
                                        >
                                            <a className="leading-none no-underline group-hover-active:underline" href={url}>
                                                {title}
                                            </a>
                                            <Markdown
                                                className="overflow-hidden pt-px text-left text-theme-text/60 transition-[clip-path] [clip-path:polygon(0%_0%,100%_0%,100%_1.25vh,0%_1.25vh)] group-hover-active:text-theme-text-background/70 group-hover-active:[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"
                                                remarkPlugins={[remarkBreaks]}
                                            >
                                                {description}
                                            </Markdown>
                                        </div>
                                    ))}
                                </div>
                            }
                            isLast={!viewSource && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {viewSource && (
                    <GetChildSize Context={GetChildSizeContext}>
                        <SingleStackBlock
                            title={'View Source'}
                            jsx={
                                <div data-block-id="view-source-content-parent" className="">
                                    <a
                                        className="block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline"
                                        href={viewSource.href}
                                    >
                                        {viewSource.alt}
                                    </a>
                                </div>
                            }
                            isLast={!clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {clients && (
                    <GetChildSize Context={GetChildSizeContext}>
                        <SingleStackBlock
                            title={'Clients / Users'}
                            jsx={
                                <div
                                    data-block-id="clients-content-parent"
                                    className="relative grid gap-x-0.5"
                                    style={{ gridTemplateColumns: `repeat(${clients.length < 4 ? clients.length : 4}, minmax(0, 1fr)` }}
                                >
                                    {clients.map(({ abbreviation, name, svgUrl }, idx) => (
                                        <div key={idx + abbreviation + name} className="group relative">
                                            <div className="relative flex aspect-hex-flat w-12 items-center justify-center bg-theme-secondary-darker/50 text-theme-primary-darker [clip-path:url(#svgRoundedHexagonClipPath-default)] group-hover-active:bg-theme-primary/50 group-hover-active:text-theme-secondary-darker">
                                                <div className="flex aspect-square w-3/5 select-none items-center justify-center rounded-full bg-theme-text-background text-center text-2xs font-semibold">
                                                    {abbreviation}
                                                </div>
                                            </div>
                                            <div className="pointer-events-none absolute top-full z-10 mt-1 text-center text-2xs text-theme-primary opacity-0 group-hover-active:opacity-100">
                                                {name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                            isLast={true}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}
            </div>

            {/* Line Break in flexbox */}
            <div className="size-0 basis-full" />

            <div
                className={classNames(
                    'relative ml-auto mr-0 font-lato text-theme-primary transition-[clip-path] clip-inset-b-[-100%] sm:text-2xs lg:text-xs',
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
    isLast: boolean;
    content: JSX.Element | null;
    setContent: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}> = ({ title, jsx, isLast, content, setContent }) => {
    const isThisJsx = jsx.props['data-block-id'] === content?.props['data-block-id'];

    const parentSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(1, parentSize, { shape: isLast ? 'top-left' : 'slant-right' }), [isLast, parentSize]);

    return (
        <button
            className={classNames(
                'group flex size-full cursor-pointer items-center justify-end pl-4 hover-active:bg-theme-primary sm:-ml-1.5 xl:-ml-1',
                isThisJsx ? 'bg-theme-primary' : 'bg-theme-primary-lighter',
                isLast ? 'pr-1' : 'pr-2',
            )}
            style={{
                clipPath: clipPath_Memo,
            }}
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
                    'inline-block text-nowrap pt-px font-semibold uppercase leading-none group-hover-active:text-theme-text-background sm:text-3xs md:text-2xs xl:text-xs',
                    isThisJsx ? 'text-theme-text-background' : 'text-theme-primary-darker',
                )}
            >
                {title}
            </div>

            {/* ChevronDown */}
            <div
                className={classNames(
                    'ml-1 inline-block aspect-square h-4 transition-transform [mask-image:url(/svg/ChevronDownOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%] group-hover-active:bg-theme-text-background',
                    isThisJsx ? 'rotate-0 bg-theme-text-background' : '-rotate-180 bg-theme-primary-darker',
                )}
            />
        </button>
    );
};

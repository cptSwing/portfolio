import { FC, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import GetChildSize from './utilityComponents/GetChildSize';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { getHexagonalClipPath } from '../lib/shapeFunctions';
import { TOOL } from '../types/enums';
import { useBreakpoint } from '../hooks/useBreakPoint';

const PostDetails: FC<{ stack: Post['stack']; clients: Post['clients']; liveViews: Post['liveViews']; source: Post['source'] }> = ({
    stack,
    clients,
    liveViews,
    source,
}) => {
    const [content, setContent] = useState<PostDetailElementContent | null>(null);
    useEffect(() => setContent(null), [stack, clients, liveViews, source]);

    return (
        <>
            <div className="relative flex select-none flex-col items-stretch justify-start gap-y-1 sm:flex-row sm:items-start sm:justify-end">
                {stack && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'Stack'}
                            jsx={<Stack stack={stack} dataBlockId="stack-entries-content-parent" />}
                            isLast={!liveViews && !source && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {liveViews && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'View Live'}
                            jsx={<ViewLive liveViews={liveViews} dataBlockId="view-live-content-parent" />}
                            isLast={!source && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {source && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'View Source'}
                            jsx={<Source source={source} dataBlockId="source-content-parent" />}
                            isLast={!clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {clients && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'Clients'}
                            jsx={<Clients clients={clients} dataBlockId="clients-content-parent" />}
                            isLast={true}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}
            </div>

            {/* Line Break in flexbox */}
            <div className="w-full sm:size-0 sm:basis-full" />

            <div
                className={classNames(
                    'relative ml-auto mr-0 min-h-fit font-lato text-theme-primary transition-[clip-path] clip-inset-b-[-100%] sm:text-2xs lg:text-xs',
                    content ? 'clip-inset-l-0' : 'clip-inset-l-full',
                )}
            >
                {content}
            </div>
        </>
    );
};

export default PostDetails;

const SinglePostDetailElement: FC<{
    title: string;
    jsx: PostDetailElementContent;
    isLast: boolean;
    content: PostDetailElementContent | null;
    setContent: React.Dispatch<React.SetStateAction<PostDetailElementContent | null>>;
}> = ({ title, jsx, isLast, content, setContent }) => {
    const isSelected = jsx.props.dataBlockId === content?.props.dataBlockId;

    const containerSize = useContext(GetChildSizeContext);
    const breakpoint = useBreakpoint();
    const clipPath_Memo = useMemo(
        () =>
            getHexagonalClipPath(
                1,
                { width: containerSize.width, height: containerSize.height },
                { shape: breakpoint ? (isLast ? 'top-left' : 'slant-right') : 'top-left' },
            ),
        [isLast, breakpoint, containerSize.width, containerSize.height],
    );

    return (
        <div
            className={classNames(
                'group ml-auto flex h-4 cursor-pointer items-center justify-end pb-px pl-4 hover-active:bg-theme-primary/75 sm:-ml-1.5 xl:-ml-1',
                isSelected ? 'bg-theme-primary' : 'bg-theme-primary-lighter',
                isLast ? 'sm:pr-0.5' : 'sm:pr-3',
            )}
            style={{
                clipPath: clipPath_Memo,
            }}
            role="button"
            tabIndex={-1}
            onClick={() => {
                if (!content || !isSelected) {
                    setContent(jsx);
                } else {
                    setContent(null);
                }
            }}
            onKeyDown={() => {
                if (!content || !isSelected) {
                    setContent(jsx);
                } else {
                    setContent(null);
                }
            }}
        >
            <div
                className={classNames(
                    'inline-block text-nowrap pt-px uppercase group-hover-active:text-theme-text-background',
                    isSelected ? 'text-theme-text-background' : 'text-theme-primary-darker',
                )}
            >
                {title}
            </div>

            {/* ChevronDown */}
            <div
                className={classNames(
                    'ml-1 inline-block aspect-square h-[90%] transform-gpu transition-transform [mask-image:url(/svg/ChevronDownOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%] group-hover-active:bg-theme-text-background',
                    isSelected ? 'rotate-0 bg-theme-text-background' : 'rotate-90 bg-theme-primary-darker',
                )}
            />
        </div>
    );
};

const Stack: FC<{ stack: NonNullable<Post['stack']> } & PostDetailElementContentProps> = ({ stack, dataBlockId }) => {
    return (
        <div
            data-block-id={dataBlockId}
            className="mt-2 grid max-h-14 min-h-6 gap-1"
            dir="rtl"
            style={{ gridTemplateColumns: `repeat(${stack.length < 4 ? stack.length : 4}, minmax(0, 1fr)` }}
        >
            {stack.map((stackEntry, idx) => (
                <a
                    key={idx}
                    href={TOOL[stackEntry]}
                    className="flex w-full items-center justify-center bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline hover-active:decoration-theme-text-background"
                >
                    {stackEntry}
                </a>
            ))}
        </div>
    );
};

const ViewLive: FC<{ liveViews: NonNullable<Post['liveViews']> } & PostDetailElementContentProps> = ({ liveViews, dataBlockId }) => {
    return (
        <div data-block-id={dataBlockId} dir="rtl" className="mt-2 grid h-16 grid-cols-3 items-start gap-1">
            {liveViews.map(({ url, title, description }, idx) => (
                <div
                    key={idx}
                    dir="ltr"
                    className="group h-fit bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker outline outline-1 -outline-offset-2 outline-theme-text-background transition-[max-height,color,background-color,outline-color] hover-active:max-h-full hover-active:bg-theme-primary/50 hover-active:text-theme-text-background"
                >
                    <a
                        className="text-theme-primary-darker no-underline hover-active:text-theme-text-background group-hover-active:underline group-hover-active:decoration-theme-text-background"
                        href={url}
                    >
                        {title}
                    </a>

                    <Markdown className="pt-px text-center text-theme-text/60 group-hover-active:text-theme-text-background/70" remarkPlugins={[remarkBreaks]}>
                        {description}
                    </Markdown>
                </div>
            ))}
        </div>
    );
};

const Source: FC<{ source: NonNullable<Post['source']> } & PostDetailElementContentProps> = ({ source, dataBlockId }) => {
    return (
        <div data-block-id={dataBlockId} className="mt-2 h-6">
            <a
                className="block w-full bg-theme-secondary-darker/20 px-2 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline hover-active:decoration-theme-text-background"
                href={source.href}
            >
                {source.alt}
            </a>
        </div>
    );
};

const Clients: FC<{ clients: NonNullable<Post['clients']> } & PostDetailElementContentProps> = ({ clients, dataBlockId }) => {
    return (
        <div
            dir="rtl"
            data-block-id={dataBlockId}
            className="relative grid h-20 gap-x-0"
            style={{ gridTemplateColumns: `repeat(${clients.length < 4 ? clients.length : 4}, minmax(0, 1fr)` }}
        >
            {clients.map(({ abbreviation, name, svgUrl }, idx) => (
                <div key={idx + abbreviation + name} className="group relative size-full">
                    <div
                        className={classNames(
                            'before:absolute before:left-0 before:top-0 before:-z-10 before:size-full before:bg-theme-text-background before:[clip-path:--hexagon-clip-path-full-wider-stroke]',
                            'pointer-events-auto relative -mx-2 flex aspect-hex-flat w-[--hexagon-clip-path-width] items-center justify-center bg-theme-secondary-darker/20 matrix-scale-[0.85] [clip-path:--hexagon-clip-path-full] group-hover-active:bg-theme-primary/50',
                            'after:absolute after:left-0 after:top-0 after:-z-10 after:size-full after:bg-theme-secondary-darker/20 after:[clip-path:--hexagon-clip-path-full-stroke]',
                        )}
                    >
                        {svgUrl ? (
                            <img className="size-[60%]" alt={abbreviation} src={svgUrl} />
                        ) : (
                            <span className="flex select-none items-center justify-center rounded-2xl font-lato text-lg font-normal text-theme-primary-darker before:absolute before:left-[25%] before:top-[25%] before:-z-10 before:size-[50%] before:rounded-2xl before:bg-theme-text-background">
                                {abbreviation}
                            </span>
                        )}
                    </div>

                    <span className="pointer-events-none absolute top-full z-10 w-full text-center font-fjalla-one text-2xs font-light tracking-wide text-theme-root-background/70 opacity-0 group-hover-active:opacity-100">
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* Local Types */

type PostDetailElementContent = ReactElement<PostDetailElementContentProps>;

type PostDetailElementContentProps = {
    dataBlockId: string;
};

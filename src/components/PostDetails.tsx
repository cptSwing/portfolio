import { FC, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import GetChildSize from './utilityComponents/GetChildSize';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { getHexagonalClipPath } from '../lib/hexagonDataNew';
import { TOOL } from '../types/enums';

const PostDetails: FC<{ stack: Post['stack']; clients: Post['clients']; viewLive: Post['viewLive']; viewSource: Post['viewSource'] }> = ({
    stack,
    clients,
    viewLive,
    viewSource,
}) => {
    const [content, setContent] = useState<PostDetailElementContent | null>(null);
    useEffect(() => () => setContent(null), []);

    return (
        <>
            <div className="relative flex items-start justify-end font-lato leading-none tracking-tight">
                {stack && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'Stack'}
                            jsx={<ToolStack stack={stack} dataBlockId="stack-content-parent" />}
                            isLast={!viewLive && !viewSource && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {viewLive && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'View Live'}
                            jsx={<ViewLive viewLive={viewLive} dataBlockId="view-live-content-parent" />}
                            isLast={!viewSource && !clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {viewSource && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'View Source'}
                            jsx={<ViewSource viewSource={viewSource} dataBlockId="view-source-content-parent" />}
                            isLast={!clients}
                            content={content}
                            setContent={setContent}
                        />
                    </GetChildSize>
                )}

                {clients && (
                    <GetChildSize context={GetChildSizeContext}>
                        <SinglePostDetailElement
                            title={'Clients / Users'}
                            jsx={<Clients clients={clients} dataBlockId="clients-content-parent" />}
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

const SinglePostDetailElement: FC<{
    title: string;
    jsx: PostDetailElementContent;
    isLast: boolean;
    content: PostDetailElementContent | null;
    setContent: React.Dispatch<React.SetStateAction<PostDetailElementContent | null>>;
}> = ({ title, jsx, isLast, content, setContent }) => {
    const isSelected = jsx.props.dataBlockId === content?.props.dataBlockId;

    const parentSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(1, parentSize, { shape: isLast ? 'top-left' : 'slant-right' }), [isLast, parentSize]);

    return (
        <button
            className={classNames(
                'group flex size-full cursor-pointer items-center justify-end pl-4 hover-active:bg-theme-primary/75 sm:-ml-1.5 xl:-ml-1',
                isSelected ? 'bg-theme-primary' : 'bg-theme-primary-lighter',
                isLast ? 'pr-1' : 'pr-2',
            )}
            style={{
                clipPath: clipPath_Memo,
            }}
            onClick={() => {
                if (!content || !isSelected) {
                    setContent(jsx);
                } else {
                    setContent(null);
                }
            }}
        >
            <div
                className={classNames(
                    'inline-block text-nowrap pt-px font-semibold uppercase leading-none group-hover-active:text-theme-text-background sm:text-3xs md:text-2xs xl:text-xs',
                    isSelected ? 'text-theme-text-background' : 'text-theme-primary-darker',
                )}
            >
                {title}
            </div>

            {/* ChevronDown */}
            <div
                className={classNames(
                    'ml-1 inline-block aspect-square h-4 transform-gpu transition-transform [mask-image:url(/svg/ChevronDownOutline.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%] group-hover-active:bg-theme-text-background',
                    isSelected ? 'rotate-0 bg-theme-text-background' : 'rotate-90 bg-theme-primary-darker',
                )}
            />
        </button>
    );
};

const ToolStack: FC<{ stack: NonNullable<Post['stack']> } & PostDetailElementContentProps> = ({ stack, dataBlockId }) => {
    return (
        <div
            data-block-id={dataBlockId}
            className="grid gap-1"
            // dir='rtl'
            style={{ gridTemplateColumns: `repeat(${stack.length < 4 ? stack.length : 4}, minmax(0, 1fr)` }}
        >
            {stack.map((enumKey, idx) => (
                <a
                    key={idx}
                    href={TOOL[enumKey]}
                    className="block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline"
                >
                    {enumKey}
                </a>
            ))}
        </div>
    );
};

const ViewLive: FC<{ viewLive: NonNullable<Post['viewLive']> } & PostDetailElementContentProps> = ({ viewLive, dataBlockId }) => {
    return (
        <div data-block-id={dataBlockId} dir="rtl" className="grid grid-cols-3 items-start gap-1">
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
    );
};

const ViewSource: FC<{ viewSource: NonNullable<Post['viewSource']> } & PostDetailElementContentProps> = ({ viewSource, dataBlockId }) => {
    return (
        <div data-block-id={dataBlockId}>
            <a
                className="block w-full bg-theme-secondary-darker/20 px-1.5 py-1 text-center text-theme-primary-darker no-underline outline outline-1 -outline-offset-2 outline-theme-text-background hover-active:bg-theme-primary/50 hover-active:text-theme-text-background hover-active:underline"
                href={viewSource.href}
            >
                {viewSource.alt}
            </a>
        </div>
    );
};

export const Clients: FC<{ clients: NonNullable<Post['clients']>; extraClassNames?: string } & PostDetailElementContentProps> = ({
    clients,
    extraClassNames,
    dataBlockId,
}) => {
    return (
        <div
            data-block-id={dataBlockId}
            className={`relative grid gap-x-0.5 ${extraClassNames}`}
            style={{ gridTemplateColumns: `repeat(${clients.length < 4 ? clients.length : 4}, minmax(0, 1fr)` }}
        >
            {clients.map(({ abbreviation, name, svgUrl }, idx) => (
                <div key={idx + abbreviation + name} className="group relative flex flex-col items-center justify-start gap-y-1">
                    <div className="relative flex aspect-hex-flat w-[100px] items-center justify-center bg-theme-secondary-darker/50 text-theme-primary-darker [clip-path:--hexagon-clip-path] group-hover-active:bg-theme-primary/50 group-hover-active:text-theme-secondary-darker">
                        <div className="flex aspect-square w-3/5 select-none items-center justify-center rounded-full bg-theme-text-background text-center text-lg font-semibold">
                            {abbreviation}
                        </div>
                    </div>
                    <span className="pointer-events-none text-2xs text-theme-primary opacity-0 group-hover-active:opacity-100">{name}</span>
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

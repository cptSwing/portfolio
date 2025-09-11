import { Children, Context, FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { getChildSizeContextDefaultValue } from '../../contexts/GetChildSizeContext';
import useResizeObserver from '../../hooks/useResizeObserver';

const GetChildSize: FC<{ children: ReactElement; context: Context<{ width: number; height: number }> }> = ({ children, context }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const singleChild_Memo = useMemo(() => {
        try {
            return Children.only(children) as ReactElement;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('<GetChildSize> expects a single child, a valid ReactElement!', err);
            return null;
        }
    }, [children]);

    const [size, setSize] = useState<{ width: number; height: number }>();
    const rect = useResizeObserver(wrapperRef.current?.firstElementChild);

    useEffect(() => {
        if (rect) {
            const { width, height } = rect;
            setSize((prevState) => {
                if (!prevState || prevState.width != width || prevState.height != height) {
                    return { width, height };
                }
            });
        }
    }, [rect]);

    return (
        <context.Provider value={size ?? getChildSizeContextDefaultValue}>
            <div ref={wrapperRef} className="contents">
                {singleChild_Memo}
            </div>
        </context.Provider>
    );
};

export default GetChildSize;

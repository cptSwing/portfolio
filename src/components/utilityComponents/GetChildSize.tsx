import { Children, Context, FC, ReactElement, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { getChildSizeContextDefaultValue } from '../../contexts/GetChildSizeContext';
import useResizeObserver from '../../hooks/useResizeObserver';

const GetChildSize: FC<{ children: ReactElement; context: Context<{ width: number; height: number }> }> = ({ children, context }) => {
    const [element, setElement] = useState<Element | null>(null);

    const refCallback_Cb = useCallback((elem: HTMLDivElement | null) => {
        if (elem) {
            setElement(elem.firstElementChild);
        } else {
            setElement(null);
        }
    }, []);

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
    const rect = useResizeObserver(element);

    useLayoutEffect(() => {
        if (rect) {
            const { width, height } = rect;

            setSize((prevState) => {
                if (!prevState || prevState.width != width || prevState.height != height) {
                    return { width, height };
                } else {
                    return prevState;
                }
            });
        }
    }, [rect]);

    return singleChild_Memo ? (
        <context.Provider value={size ?? getChildSizeContextDefaultValue}>
            <div ref={refCallback_Cb} className="contents">
                {singleChild_Memo}
            </div>
        </context.Provider>
    ) : (
        <></>
    );
};

export default GetChildSize;

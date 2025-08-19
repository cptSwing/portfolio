import { Children, Context, FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { getChildSizeContextDefaultValue } from '../../contexts/GetChildSizeContext';

const GetChildSize: FC<{ children: ReactElement; Context: Context<{ width: number; height: number }> }> = ({ children, Context }) => {
    const singleChild_Memo = useMemo(() => {
        try {
            return Children.only(children) as ReactElement;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('<GetChildSize> expects a single child, a valid ReactElement!', err);
            return null;
        }
    }, [children]);

    const [size, setSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (wrapperRef.current) {
            const { width, height } = wrapperRef.current.firstElementChild?.getBoundingClientRect() ?? {};

            setSize((prevState) => {
                if (width && height) {
                    if (!prevState || prevState.width != width || prevState.height != height) {
                        return { width, height };
                    }
                }

                return prevState;
            });
        }
    }, [singleChild_Memo]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <Context.Provider value={size ?? getChildSizeContextDefaultValue}>
            <div ref={wrapperRef} style={{ display: 'contents' }}>
                {singleChild_Memo}
            </div>
        </Context.Provider>
    );
};

export default GetChildSize;

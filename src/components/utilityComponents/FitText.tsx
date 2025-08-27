/* Adapted from https://css-tricks.com/fitting-text-to-a-container/  (last example) */

import { ComponentPropsWithoutRef, FC, memo, useLayoutEffect, useRef, useState } from 'react';

interface FitTextProps extends ComponentPropsWithoutRef<'svg'> {
    text: string;
}

const FitText: FC<FitTextProps> = memo((props) => {
    const { text, ...rest } = props;

    const text_Ref = useRef<SVGTextElement>(null);
    const [viewBox, setViewBox] = useState<string | undefined>();

    useLayoutEffect(() => {
        if (text_Ref.current) {
            const { x, y, width, height } = text_Ref.current.getBBox();
            setViewBox(`${x} ${y} ${width} ${height}`);
        }
    }, [text]);

    return (
        <svg {...rest} width="100%" height="100%" viewBox={viewBox}>
            <text ref={text_Ref} style={{ fill: 'currentColor' }}>
                {text}
            </text>
        </svg>
    );
});

export default FitText;

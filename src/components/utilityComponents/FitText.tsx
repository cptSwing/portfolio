/* Adapted from https://css-tricks.com/fitting-text-to-a-container/  (last example) */

import { CSSProperties, FC, memo, useLayoutEffect, useRef, useState } from 'react';

const FitText: FC<{ text: string; classes: string; style?: CSSProperties }> = memo(({ text, classes, style }) => {
    const text_Ref = useRef<SVGTextElement>(null);
    const [viewBox, setViewBox] = useState<string | undefined>();

    useLayoutEffect(() => {
        if (text_Ref.current) {
            const { x, y, width, height } = text_Ref.current.getBBox();
            setViewBox(`${x} ${y} ${width} ${height}`);
        }
    }, [text]);

    return (
        <svg width="100%" height="100%" viewBox={viewBox} className={classes} style={style}>
            <text ref={text_Ref} style={{ fill: 'currentColor' }}>
                {text}
            </text>
        </svg>
    );
});

export default FitText;

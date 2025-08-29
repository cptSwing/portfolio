import { ComponentPropsWithRef, CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react';

interface GlassmorphicProps extends ComponentPropsWithRef<'div'> {
    children?: ReactNode;
    clipPath: string;
    blurRadius?: number;
    strokeRadius?: number;
}

const GlassmorphicClipped = forwardRef<HTMLDivElement, GlassmorphicProps>((props, ref) => {
    const { children, clipPath, blurRadius = 3, strokeRadius = 1, className, style, ...rest } = props;
    const uuid = useMemo(() => self.crypto.randomUUID(), []);

    return (
        <div
            ref={ref}
            {...rest}
            className={`${className} backdrop-glassmorphic !bg-transparent from-transparent via-transparent to-white/40 [background-image:linear-gradient(var(--hexagon-lighting-gradient-counter-rotation),var(--tw-gradient-stops))] [clip-path:--glassmorphic-clipped-clip-path]`}
            style={{ ...style, '--glassmorphic-clipped-clip-path': clipPath } as CSSProperties}
        >
            <svg width="100%" height="100%">
                <defs>
                    <SvgGlassFilter name={uuid} blurRadius={blurRadius} strokeRadius={strokeRadius} />
                </defs>
            </svg>
            {children}

            <div
                className="absolute left-0 top-0 -z-50 size-full before:absolute before:left-0 before:top-0 before:size-full before:bg-black before:[clip-path:--glassmorphic-clipped-clip-path]"
                style={{ filter: `url(#svg-hexagon-filter-${uuid})` }}
            />
        </div>
    );
});

export default GlassmorphicClipped;

const SvgGlassFilter: FC<{ name?: string; blurRadius: number; strokeRadius: number }> = ({ name, blurRadius, strokeRadius }) => (
    <filter id={`svg-hexagon-filter${name ? '-' + name : ''}`}>
        <feFlood floodColor="var(--hexagon-fill-color)" result="fill-flood" />

        {blurRadius && (
            <>
                <feFlood floodColor="var(--hexagon-blur-color)" result="blur-flood" />
                <feComposite operator="out" in="blur-flood" in2="SourceAlpha" result="blur-composite" />
                <feMorphology operator="dilate" in="blur-composite" radius="1" result="blur-dilate" />
                <feGaussianBlur in="blur-dilate" stdDeviation={blurRadius} result="blur-gaussian" />
            </>
        )}

        {strokeRadius && (
            <>
                <feFlood floodColor="var(--hexagon-stroke-color)" result="stroke-flood" />
                <feComposite operator="out" in="stroke-flood" in2="SourceAlpha" result="stroke-composite" />
                <feMorphology operator="dilate" in="stroke-composite" radius={strokeRadius} result="stroke-dilate" />
            </>
        )}
        <feMerge>
            <feMergeNode in="fill-flood" />
            {blurRadius && <feMergeNode in="blur-gaussian" />}
            {strokeRadius && <feMergeNode in="stroke-dilate" />}
        </feMerge>
    </filter>
);

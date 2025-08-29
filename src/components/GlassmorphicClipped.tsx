import { ComponentPropsWithRef, FC, forwardRef, memo, ReactNode } from 'react';

interface GlassmorphicProps {
    children?: ReactNode;
    outer: ComponentPropsWithRef<'div'>;
    inner: ComponentPropsWithRef<'div'>;
    showGlass?: boolean;
}

const GlassmorphicClipped = forwardRef<HTMLDivElement, GlassmorphicProps>(({ children, outer, inner, showGlass = true }, ref) => {
    const { className: outerClassName, ...outerRest } = outer;
    const { className: innerClassName, ...innerRest } = inner;

    return (
        <div
            ref={ref}
            {...outerRest}
            className={`${outerClassName} [background-image:linear-gradient(var(--gradient-counter-rotation),var(--tw-gradient-stops))] ${showGlass ? 'backdrop-glassmorphic' : 'backdrop-glassmorphic-off !from-transparent !to-transparent'}`}
        >
            {children}

            <div
                {...innerRest}
                className={`${innerClassName} absolute left-0 top-0 -z-50 size-full before:absolute before:left-0 before:top-0 before:size-full before:bg-black ${showGlass ? '[filter:url(#svg-hexagon-filter)]' : 'filter-none'}`}
            />
        </div>
    );
});

export default GlassmorphicClipped;

export const SvgGlassFilter: FC<{ name?: string; withWrapper?: boolean; blurRadius?: number; strokeRadius?: number }> = memo(
    ({ name, withWrapper = true, blurRadius = 3, strokeRadius = 1 }) => {
        return withWrapper ? (
            <svg width="100%" height="100%">
                <defs>
                    <SvgFilter name={name} blurRadius={blurRadius} strokeRadius={strokeRadius} />
                </defs>
            </svg>
        ) : (
            <SvgFilter name={name} blurRadius={blurRadius} strokeRadius={strokeRadius} />
        );
    },
);

const SvgFilter: FC<{ name?: string; blurRadius: number; strokeRadius: number }> = ({ name, blurRadius, strokeRadius }) => (
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

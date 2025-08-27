import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

interface GlassmorphicProps {
    children?: ReactNode;
    outer: ComponentPropsWithoutRef<'div'>;
    inner: ComponentPropsWithoutRef<'div'>;
    showGlass?: boolean;
}

const GlassmorphicClipped: FC<GlassmorphicProps> = ({ children, outer, inner, showGlass = true }) => {
    const { className: outerClassName, ...outerRest } = outer;
    const { className: innerClassName, ...innerRest } = inner;

    return (
        <div
            {...outerRest}
            className={`${outerClassName} [--glassmorphic-backdrop-blur:3px] [background-image:linear-gradient(var(--gradient-counter-rotation),var(--tw-gradient-stops))] ${showGlass ? 'backdrop-glassmorphic' : 'backdrop-glassmorphic-off !from-transparent !to-transparent'}`}
        >
            {children}

            <div
                {...innerRest}
                className={`${innerClassName} absolute left-0 top-0 -z-50 size-full before:absolute before:left-0 before:top-0 before:size-full before:bg-black ${showGlass ? '[filter:url(#svg-hexagon-filter)]' : 'filter-none'}`}
            />
        </div>
    );
};

export default GlassmorphicClipped;

export const SvgGlassFilter: FC<{ name?: string; withWrapper?: boolean }> = ({ name, withWrapper = true }) => {
    return withWrapper ? (
        <svg width="100%" height="100%">
            <defs>
                <SvgFilter name={name} />
            </defs>
        </svg>
    ) : (
        <SvgFilter name={name} />
    );
};

const SvgFilter: FC<{ name?: string }> = ({ name }) => (
    <filter id={`svg-hexagon-filter${name ? '-' + name : ''}`}>
        <feFlood floodColor="var(--hexagon-fill-color)" result="fill-flood" />

        <feFlood floodColor="var(--hexagon-blur-color)" result="blur-flood" />
        <feComposite operator="out" in="blur-flood" in2="SourceAlpha" result="blur-composite" />
        <feMorphology operator="dilate" in="blur-composite" radius="1" result="blur-dilate" />
        <feGaussianBlur in="blur-dilate" stdDeviation="3" result="blur-gaussian" />

        <feFlood floodColor="var(--hexagon-stroke-color)" result="stroke-flood" />
        <feComposite operator="out" in="stroke-flood" in2="SourceAlpha" result="stroke-composite" />
        <feMorphology operator="dilate" in="stroke-composite" radius="1" result="stroke-dilate" />

        <feMerge>
            <feMergeNode in="fill-flood" />
            <feMergeNode in="blur-gaussian" />
            <feMergeNode in="stroke-dilate" />
        </feMerge>
    </filter>
);

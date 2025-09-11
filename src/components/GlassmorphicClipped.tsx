import { ComponentPropsWithRef, CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react';
import { valueof } from '../types/types';
import { useZustand } from '../lib/zustand';
import { classNames, roundNumberToDecimal } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';

interface GlassmorphicProps extends ComponentPropsWithRef<'div'> {
    children?: ReactNode;
    clipPath: string;
    innerShadowRadius?: number;
    strokeRadius?: number;
}

const GlassmorphicClipped = forwardRef<HTMLDivElement, GlassmorphicProps>((props, ref) => {
    const { children, clipPath, innerShadowRadius = 0, strokeRadius = 0, className, style, ...rest } = props;
    const uuid = useMemo(() => self.crypto.randomUUID(), []);

    return (
        <div
            ref={ref}
            {...rest}
            className={`${className} glassmorphic-backdrop-filter relative [clip-path:--glassmorphic-clipped-clip-path]`}
            style={{ ...style, '--glassmorphic-clipped-clip-path': clipPath } as CSSProperties}
        >
            <SvgGlassFilter name={uuid} innerShadowRadius={innerShadowRadius} strokeRadius={strokeRadius} />
            {children}

            <div
                className="absolute left-0 top-0 size-full before:absolute before:left-0 before:top-0 before:-z-50 before:size-full before:bg-black before:[clip-path:--glassmorphic-clipped-clip-path]"
                style={{ filter: `url(#svg-hexagon-filter-${uuid})` }}
            />
        </div>
    );
});

export default GlassmorphicClipped;

export const GlassmorphicButtonWrapper: FC<{
    children: ReactNode;
    name: string;
    title?: string;
    style: Record<string, valueof<CSSProperties>>;
    clickHandler: (ev: React.MouseEvent<HTMLButtonElement>) => void;
    isActive?: boolean;
    isRouteNavigation?: boolean;
    mouseEnterHandler?: () => void;
    innerShadowRadius?: number;
    strokeRadius?: number;
    lightingGradient?: boolean;
}> = ({
    children,
    name,
    title,
    style,
    clickHandler,
    isActive = false,
    isRouteNavigation = false,
    mouseEnterHandler,
    innerShadowRadius,
    strokeRadius,
    lightingGradient = false,
}) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <button
            className="transform-hexagon group absolute transition-transform"
            style={{
                ...style,
                transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
            }}
            onClick={clickHandler}
            onMouseEnter={mouseEnterHandler}
        >
            <GlassmorphicClipped
                clipPath="var(--hexagon-clip-path)"
                innerShadowRadius={innerShadowRadius}
                strokeRadius={strokeRadius}
                className={classNames(
                    '![--glassmorphic-backdrop-blur:4px]',
                    lightingGradient ? 'lighting-gradient' : '',
                    'pointer-events-auto aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transition-[--hexagon-inner-shadow-color,--hexagon-lighting-gradient-counter-rotation]',
                    'group-hover-active:!scale-x-[1.05] group-hover-active:!scale-y-[1.05] group-hover-active:![--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter)]',
                    isActive ? '![--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter)]' : '',
                    routeName === ROUTE.post
                        ? '[--hexagon-fill-color:theme(colors.theme.primary/0.5)] [--hexagon-inner-shadow-color:transparent] [--hexagon-stroke-color:transparent]'
                        : '[--hexagon-fill-color:theme(colors.theme.secondary/0.35)] [--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter/0.25)] [--hexagon-stroke-color:theme(colors.theme.primary-lighter/0.5)]',
                    isRouteNavigation ? `navigation-button-hexagon-class-${name}` : `menu-button-hexagon-class-${name}`,
                )}
                style={
                    {
                        transitionDuration: `150ms, var(--ui-animation-menu-transition-duration)`,
                    } as CSSProperties
                }
            >
                {children}
            </GlassmorphicClipped>

            <span
                className="absolute left-1/2 top-full block -translate-x-1/2 translate-y-1/2 rotate-[calc(var(--hexagon-rotate)*-1)] scale-x-[calc(1/var(--hexagon-scale-x))] scale-y-[calc(1/var(--hexagon-scale-y))] font-lato text-xs leading-none tracking-tighter text-theme-primary transition-transform group-hover-active:text-theme-secondary-lighter" // scale-[calc(0.5/var(--button-scale))]
            >
                {title}
            </span>
        </button>
    );
};

const SvgGlassFilter: FC<{ name?: string; innerShadowRadius: number | undefined; strokeRadius: number | undefined }> = ({
    name,
    innerShadowRadius,
    strokeRadius,
}) => (
    <svg className="invisible absolute">
        <defs>
            <filter id={`svg-hexagon-filter${name ? '-' + name : ''}`}>
                <feFlood floodColor="var(--hexagon-fill-color)" result="fill-flood" />

                {innerShadowRadius && (
                    <>
                        <feFlood floodColor="var(--hexagon-inner-shadow-color)" result="blur-flood" />
                        <feComposite operator="out" in="blur-flood" in2="SourceAlpha" result="blur-composite" />
                        <feMorphology operator="dilate" in="blur-composite" radius="1" result="blur-dilate" />
                        <feGaussianBlur in="blur-dilate" stdDeviation={innerShadowRadius} result="blur-gaussian" />
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
                    {innerShadowRadius && <feMergeNode in="blur-gaussian" />}
                    {strokeRadius && <feMergeNode in="stroke-dilate" />}
                </feMerge>
            </filter>
        </defs>
    </svg>
);

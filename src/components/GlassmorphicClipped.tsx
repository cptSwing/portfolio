import { ComponentPropsWithRef, CSSProperties, FC, ReactNode, useMemo } from 'react';
import { valueof } from '../types/types';
import { useZustand } from '../lib/zustand';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';

interface GlassmorphicProps extends ComponentPropsWithRef<'div'> {
    children?: ReactNode;
    clipPath: string;
    innerShadowRadius?: number;
    strokeRadius?: number;
}

const GlassmorphicClipped: FC<GlassmorphicProps> = (props) => {
    const { children, clipPath, innerShadowRadius = 0, strokeRadius = 0, className, style, ...rest } = props;
    const uuid = useMemo(() => self.crypto.randomUUID(), []);

    return (
        <div
            {...rest}
            className={`${className} glassmorphic-backdrop relative [--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:3] [clip-path:--glassmorphic-clipped-clip-path]`}
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
};

export default GlassmorphicClipped;

export const GlassmorphicButtonWrapper: FC<{
    children: ReactNode;
    name: string;
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
                    isRouteNavigation ? `navigation-button-hexagon-class-${name}` : '',
                    lightingGradient ? 'lighting-gradient' : '',
                    'pointer-events-auto aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transition-[--hexagon-inner-shadow-color,--hexagon-lighting-gradient-counter-rotation,backdrop-filter]',
                    'group-hover-active:!scale-x-[1.05] group-hover-active:!scale-y-[1.05] group-hover-active:![--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter)]',
                    isActive
                        ? '[--glassmorphic-backdrop-blur:16px] [--glassmorphic-backdrop-saturate:1.5] ![--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter)]'
                        : '[--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:3]',
                    routeName === ROUTE.post
                        ? '[--hexagon-fill-color:theme(colors.theme.primary/0.5)] [--hexagon-inner-shadow-color:transparent] [--hexagon-stroke-color:transparent]'
                        : '[--hexagon-fill-color:theme(colors.theme.secondary/0.35)] [--hexagon-inner-shadow-color:theme(colors.theme.primary-lighter/0.25)] [--hexagon-stroke-color:theme(colors.theme.primary-lighter/0.5)]',
                )}
                style={
                    {
                        transitionDuration: `150ms, var(--ui-animation-menu-transition-duration), 150ms`,
                    } as CSSProperties
                }
            >
                {children}
            </GlassmorphicClipped>
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

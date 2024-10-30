import { CSSProperties, useCallback, useRef, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { removeCssProperties, setCssProperties } from '../lib/cssProperties.ts';

const themeTransitionTiming = resolveConfig(tailwindConfig).theme.transitionTimingFunction;

export type AnimationProperties = Record<string, string | number | null>;
const animationProperties: AnimationProperties = {
    'animation-duration': 2000,
    'animation-timing-function': themeTransitionTiming['DEFAULT'],
    'animation-delay': 0,
    'animation-iteration-count': 1,
    'animation-play-state': 'play',
    'animation-name': '',
};

type UseAnimationOnMountProps = {
    animationProps: {
        animationName: string;
        animationDuration: number;
        animationDelay: number;
        animationFillMode: CSSProperties['animationFillMode'];
        animationIterationCount: CSSProperties['animationIterationCount'];
    };
    startDelay?: number;
    hiddenAtStart?: boolean;
};
const useAnimationOnMount = (props: UseAnimationOnMountProps) => {
    const {
        animationProps: { animationName, animationDuration, animationDelay, animationFillMode, animationIterationCount },
        startDelay = 0,
        hiddenAtStart = false,
    } = props;

    const ref = useRef<HTMLElement | null>(null);
    const [hasEnded, setHasEnded] = useState<string | false>(false);

    const animate_Cb = useCallback((element: HTMLElement, animProps: AnimationProperties) => {
        setCssProperties(element, animProps);

        element.addEventListener('animationend', () => {
            const animName = element.style.animationName;
            setHasEnded(animName);
            removeCssProperties(element, animProps);
        });
    }, []);

    const refCallback = useCallback(
        (elem: HTMLElement | null) => {
            if (elem) {
                ref.current = elem;
                if (hiddenAtStart) elem.style.setProperty('display', 'none');

                if (startDelay) {
                    setTimeout(() => {
                        elem.style.removeProperty('display');
                        animate_Cb(elem, {
                            ...animationProperties,
                            'animation-name': animationName,
                            'animation-delay': animationDelay,
                            'animation-duration': animationDuration,
                            'animation-fill-mode': animationFillMode as string,
                            'animation-iteration-count': animationIterationCount?.toString() as string | number,
                        });
                    }, startDelay);
                } else {
                    elem.style.removeProperty('display');
                    animate_Cb(elem, {
                        ...animationProperties,
                        'animation-name': animationName,
                        'animation-delay': animationDelay,
                        'animation-duration': animationDuration,
                        'animation-fill-mode': animationFillMode as string,
                        'animation-iteration-count': animationIterationCount?.toString() as string | number,
                    });
                }
            } else {
                ref.current = null;
            }
        },
        [animationName, animationDuration, animationDelay, animationFillMode, hiddenAtStart, startDelay, animationIterationCount, animate_Cb],
    );

    return [refCallback, hasEnded] as [(elem: HTMLElement | null) => void, boolean];
};

export default useAnimationOnMount;

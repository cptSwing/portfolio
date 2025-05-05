import { setCssProperties } from './cssProperties';

const motionBlurElement = (elem: HTMLDivElement, state: 'start' | 'complete', gridArea: string, scrollDirection: 'down' | 'up' | null, durationMs = 150) => {
    const { parentStyle, childStyle } = blurDirectionStylesByGridArea(gridArea, scrollDirection === 'up');

    if (state === 'start') {
        const elemChild = elem.children[0] as HTMLImageElement;

        setCssProperties(elem, parentStyle);
        setCssProperties(elemChild, childStyle);
    } else {
        setCssProperties(elem, {
            'filter': 'blur(0px)',
            'opacity': '0',
            'transition-duration': `${durationMs}ms`,
        });
    }
};

export default motionBlurElement;

// Much of the following is hardcoded for now, unfortunately
const scaleFactorBlurAxis = 1.25;
const scaleFactorOtherAxis = 1000;
const clipOffsetPercent = 25;

const parentBlur = 'blur(16px)';

const parentHorizontalScale = `scaleX(${scaleFactorBlurAxis}) scaleY(${1 / scaleFactorOtherAxis})`;
const childHorizontalScale = `scaleX(${1 / scaleFactorBlurAxis}) scaleY(${scaleFactorOtherAxis})`;
const childHorizontalClipRight = `inset(0% ${clipOffsetPercent}% 0% 0%)`;
const childHorizontalClipLeft = `inset(0% 0% 0% ${clipOffsetPercent}%)`;

const parentVerticalScale = `scaleX(${1 / scaleFactorOtherAxis}) scaleY(${scaleFactorBlurAxis}) `;
const childVerticalScale = `scaleX(${scaleFactorOtherAxis}) scaleY(${1 / scaleFactorBlurAxis})`;
const childVerticalClipTop = `inset(${clipOffsetPercent}% 0% 0% 0%)`;
const childVerticalClipBottom = `inset(0% 0% ${clipOffsetPercent}% 0%)`;

const defaultHorizontal = {
    parentStyle: {
        'transform': parentHorizontalScale,
        'filter': parentBlur,
        'opacity': '1',
        'transition-duration': `0ms`,
    },
    childStyle: {
        transform: childHorizontalScale,
    },
};

const defaultVertical = {
    parentStyle: {
        'transform': parentVerticalScale,
        'filter': parentBlur,
        'opacity': '1',
        'transition-duration': `0ms`,
    },
    childStyle: {
        transform: childVerticalScale,
    },
};

const blurDirectionStylesByGridArea = (gridArea: string, reverse = false) => {
    switch (gridArea) {
        // gridArea is the target area that will be reached after transitioning

        case 'area6':
            // transitions to top, reverse: to left
            return reverse
                ? {
                      ...defaultHorizontal,
                      childStyle: { ...defaultHorizontal.childStyle, 'clip-path': childHorizontalClipLeft },
                  }
                : {
                      ...defaultVertical,
                      childStyle: { ...defaultVertical.childStyle, 'clip-path': childVerticalClipTop },
                  };
        case 'area5':
            // transitions to left, reverse: to bottom
            return reverse
                ? {
                      ...defaultVertical,
                      childStyle: { ...defaultVertical.childStyle, 'clip-path': childVerticalClipBottom },
                  }
                : {
                      ...defaultHorizontal,
                      childStyle: { ...defaultHorizontal.childStyle, 'clip-path': childHorizontalClipLeft },
                  };
        case 'area4':
            // transitions to bottom, reverse: to right
            return reverse
                ? {
                      ...defaultHorizontal,
                      childStyle: { ...defaultHorizontal.childStyle, 'clip-path': childHorizontalClipRight },
                  }
                : {
                      ...defaultVertical,
                      childStyle: { ...defaultVertical.childStyle, 'clip-path': childVerticalClipBottom },
                  };
        case 'area3':
            // transitions to bottom
            return {
                ...defaultVertical,
                childStyle: { ...defaultVertical.childStyle, 'clip-path': reverse ? childVerticalClipTop : childVerticalClipBottom },
            };
        case 'area2':
            // transitions to bottom,
            return {
                ...defaultVertical,
                childStyle: { ...defaultVertical.childStyle, 'clip-path': reverse ? childVerticalClipTop : childVerticalClipBottom },
            };
        case 'area1':
            // transitions to bottom; reverse: to left
            return reverse
                ? {
                      ...defaultVertical,
                      childStyle: { ...defaultVertical.childStyle, 'clip-path': childVerticalClipTop },
                  }
                : {
                      ...defaultHorizontal,
                      childStyle: { ...defaultHorizontal.childStyle, 'clip-path': childHorizontalClipRight },
                  };
        default:
            // 'rest', transitions to right
            return {
                ...defaultHorizontal,
                childStyle: { ...defaultHorizontal.childStyle, 'clip-path': reverse ? childHorizontalClipLeft : childHorizontalClipRight },
            };
    }
};

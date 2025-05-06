import { removeCssProperties, setCssProperties } from './cssProperties';

const motionBlurElement = (elem: HTMLDivElement, state: 'start' | 'complete', gridArea: string, scrollDirection: 'down' | 'up' | null) => {
    const style = blurDirectionStylesByGridArea(gridArea, scrollDirection === 'up');

    if (state === 'start') {
        setCssProperties(elem, style);
    } else {
        removeCssProperties(elem, ['opacity', '--motion-range-opacity-duration']);
    }
};

export default motionBlurElement;

const blurDirectionStylesByGridArea = (gridArea: string, reverse = false) => {
    switch (gridArea) {
        // gridArea is the target area that will be reached after transitioning

        case 'area6':
            // transitions to top, reverse: to left
            return reverse
                ? {
                      ...defaultHorizontal,
                      'clip-path': bleedRight,
                      'transform': 'skew(0, -5deg)',
                      'transform-origin': 'center right',
                  }
                : {
                      ...defaultVertical,
                      'clip-path': bleedBottom,
                      'transform': 'skew(-5deg, 0)',
                      'transform-origin': 'bottom left',
                  };
        case 'area5':
            // transitions to left, reverse: to bottom
            return reverse
                ? {
                      ...defaultVertical,
                      'clip-path': bleedTop,
                      'transform': 'skew(-10deg, 0)',
                      'transform-origin': '0 var(--card-border-radius)',
                  }
                : {
                      ...defaultHorizontal,
                      'clip-path': bleedRight,
                      'transform': 'skew(0, 0)',
                      'transform-origin': '0 0',
                  };
        case 'area4':
            // transitions to bottom, reverse: to right
            return reverse
                ? {
                      ...defaultHorizontal,
                      'clip-path': bleedLeft,
                      'transform': 'skew(0, 0)',
                      'transform-origin': '0 0',
                  }
                : {
                      ...defaultVertical,
                      'clip-path': bleedTop,
                      'transform': 'skew(-10deg, 0)',
                      'transform-origin': '0 var(--card-border-radius)',
                  };
        case 'area3':
            // transitions to bottom
            return {
                ...defaultVertical,
                'clip-path': reverse ? bleedBottom : bleedTop,
                'transform': reverse ? 'skew(-10deg, 0)' : 'skew(0, 0)',
                'transform-origin': reverse ? 'bottom left' : 'top',
            };
        case 'area2':
            // transitions to bottom,
            return {
                ...defaultVertical,
                'clip-path': reverse ? bleedBottom : bleedTop,
                'transform': reverse ? 'skew(0, 0)' : 'skew(-10deg, 0)',
                'transform-origin': reverse ? 'bottom' : 'top left',
            };
        case 'area1':
            // transitions to bottom; reverse: to left
            return reverse
                ? {
                      ...defaultVertical,
                      'clip-path': bleedBottom,
                  }
                : {
                      ...defaultHorizontal,
                      'clip-path': bleedLeft,
                  };
        default:
            // 'rest', transitions to right
            return {
                ...defaultHorizontal,
                'clip-path': reverse ? bleedRight : bleedLeft,
            };
    }
};

// Much of the following is hardcoded for now, unfortunately
const scaleFactorBlurAxis = 2;
const scaleFactorOtherAxis = 10;

const parentMainAxis = `${scaleFactorBlurAxis}`;
const parentPerpAxis = `${1 / scaleFactorOtherAxis}`;
const childMainAxis = `${1 / scaleFactorBlurAxis}`;
const childPerpAxis = `${scaleFactorOtherAxis}`;

const bleedTop =
    'polygon(0 calc(var(--category-gap) * -1), 100% calc(var(--category-gap) * -1), 100% var(--card-border-radius), 0 var(--card-border-radius), 0 100%, 100% 100%, 0 100%)';
const bleedRight =
    'polygon(calc(100% + var(--category-gap)) 0, calc(100% + var(--category-gap)) 100%, calc(100% - var(--card-border-radius)) 100%, calc(100% - var(--card-border-radius)) 0, 0 0, 0 100%, 0 0)';
const bleedBottom =
    'polygon(0 calc(100% + var(--category-gap)), 100% calc(100% + var(--category-gap)), 100% calc(100% - var(--card-border-radius)), 0 calc(100% - var(--card-border-radius)), 0 0, 0 100%, 0 0)';
const bleedLeft =
    'polygon(calc(var(--category-gap) * -1) 0, calc(var(--category-gap) * -1) 100%, var(--card-border-radius) 100%, var(--card-border-radius) 0, 100% 0, 100% 100%, 100% 0)';

const defaultHorizontal = {
    '--motion-blur-parent-scale-x': parentMainAxis,
    '--motion-blur-parent-scale-y': parentPerpAxis,
    '--motion-blur-child-scale-x': childMainAxis,
    '--motion-blur-child-scale-y': childPerpAxis,

    'opacity': '1',
    '--motion-range-opacity-duration': 0,
};

const defaultVertical = {
    '--motion-blur-parent-scale-x': parentPerpAxis,
    '--motion-blur-parent-scale-y': parentMainAxis,
    '--motion-blur-child-scale-x': childPerpAxis,
    '--motion-blur-child-scale-y': childMainAxis,

    'opacity': '1',
    '--motion-range-opacity-duration': 0,
};

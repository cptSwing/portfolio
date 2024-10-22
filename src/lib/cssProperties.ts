import { AnimationProperties } from '../hooks/useAnimationOnMount';

export const setCssProperties = (element: HTMLElement, styleProperties: AnimationProperties) => {
    for (const property in styleProperties) {
        const value = typeof styleProperties[property] === 'number' ? styleProperties[property].toString() + 'ms' : styleProperties[property];
        element.style.setProperty(property, value);
    }
};

export const removeCssProperties = (element: HTMLElement, styleProperties: AnimationProperties) => {
    for (const property in styleProperties) {
        element.style.removeProperty(property);
    }
};

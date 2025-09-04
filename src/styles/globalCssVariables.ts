import { CSSProperties } from 'react';
import { config } from '../types/exportTyped';
import { halfRoundedHexagonPath, roundedHexagonPath } from '../lib/hexagonDataNew';

const menuTransition_Ms = config.ui.animation.menuTransition_Ms;
const { clipPathWidth, clipPathHeight } = config.ui.hexMenu;

export const globalCssVariables = {
    '--half-hexagon-clip-path': `path("${halfRoundedHexagonPath}")`,
    '--hexagon-clip-path': `path("${roundedHexagonPath}")`,
    '--hexagon-clip-path-width': `${clipPathWidth}px`,
    //  TODO '--hexagon-clip-path-height': `${clipPathHeight}px`,
    '--ui-animation-menu-transition-duration': `${menuTransition_Ms}ms`,
} as CSSProperties;

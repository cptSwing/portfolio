import { CSSProperties } from 'react';
import { config } from '../types/exportTyped';

const menuTransition_Ms = config.ui.animation.menuTransition_Ms;
const { clipPathWidth, clipPathHeight } = config.ui.hexMenu;

export const globalCssVariables = {
    '--hexagon-clip-path-width': `${clipPathWidth}px`,
    '--hexagon-clip-path-height': `${clipPathHeight}px`,
    '--ui-animation-menu-transition-duration': `${menuTransition_Ms}ms`,
} as CSSProperties;

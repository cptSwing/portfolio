import { CSSProperties } from 'react';
import { config } from '../types/exportTyped';
import { hexagonClipPathStatic, strokedHexagonClipPathStatic, halfHexagonClipPathStatic, halfStrokedHexagonClipPathStatic } from '../lib/shapeFunctions';

const menuTransition_Ms = config.ui.animation.menuTransition_Ms;
const { clipPathWidth, clipPathHeight } = config.ui.hexGrid;

export const globalCssVariables = {
    '--hexagon-clip-path-width': `${clipPathWidth}px`,
    '--hexagon-clip-path-height': `${clipPathHeight}px`,
    '--hexagon-clip-path-full': hexagonClipPathStatic,
    '--hexagon-clip-path-full-stroked': strokedHexagonClipPathStatic,
    '--hexagon-clip-path-half': halfHexagonClipPathStatic,
    '--hexagon-clip-path-half-stroked': halfStrokedHexagonClipPathStatic,
    '--ui-animation-menu-transition-duration': `${menuTransition_Ms}ms`,
} as CSSProperties;

import { CSSProperties } from 'react';
import { config } from '../types/exportTyped';
import {
    hexagonClipPathStatic,
    strokedHexagonClipPathStatic,
    wideStrokedHexagonClipPathStatic,
    halfHexagonClipPathStatic,
    halfStrokedHexagonClipPathStatic,
} from '../lib/shapeFunctions';

const menuTransition_Ms = config.ui.animation.menuTransition_Ms;
const { clipPathWidth, clipPathHeight } = config.ui.hexagonPaths;

export const globalCssVariables = {
    '--hexagon-clip-path-width': `${clipPathWidth}px`,
    '--hexagon-clip-path-height': `${clipPathHeight}px`,
    '--hexagon-clip-path-full': hexagonClipPathStatic,
    '--hexagon-clip-path-full-stroke': strokedHexagonClipPathStatic,
    '--hexagon-clip-path-full-wider-stroke': wideStrokedHexagonClipPathStatic,
    '--hexagon-clip-path-half': halfHexagonClipPathStatic,
    '--hexagon-clip-path-half-stroked': halfStrokedHexagonClipPathStatic,
    '--ui-animation-menu-transition-duration': `${menuTransition_Ms}ms`,
} as CSSProperties;

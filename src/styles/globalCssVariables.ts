import { CSSProperties } from 'react';
import { config } from '../types/exportTyped';

const menuTransition_Ms = config.ui.animation.menuTransition_Ms;

export const globalCssVariables = { '--ui-animation-menu-transition-duration': `${menuTransition_Ms}ms` } as CSSProperties;

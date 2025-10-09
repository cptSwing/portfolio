import { ZustandStore } from '../types/types';

export function getMenuButtonPosition(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();

    const position: ZustandStore['values']['activeSubMenuButton']['positionAndSize'] = { x: left, y: top, width, height };
    return position;
}

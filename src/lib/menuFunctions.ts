import { ZustandStore } from '../types/types';

export function getMenuButtonPosition(ev: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>): ZustandStore['values']['hamburgerMenuRect'] {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();

    return { x: left, y: top, width, height };
}

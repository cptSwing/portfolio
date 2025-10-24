import { CATEGORY } from '../types/enums';
import { Category, CategoryName, ZustandStore } from '../types/types';

export function getMenuButtonPosition(ev: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>): ZustandStore['values']['hamburgerMenuRect'] {
    const { left, width, top, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();

    return { x: left, y: top, width, height };
}

export function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}

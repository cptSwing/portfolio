import { CATEGORY } from '../types/enums';
import { Category, CategoryName, ZustandStore } from '../types/types';

export function getMenuButtonPosition(ev: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>): ZustandStore['values']['hamburgerMenuRect'] {
    const { width, height } = ev.currentTarget.firstElementChild
        ? ev.currentTarget.firstElementChild.getBoundingClientRect()
        : ev.currentTarget.getBoundingClientRect();

    return { width, height };
}

export function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}

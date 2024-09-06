/**
 * Used to clean strings of tailwind classnames I send to CSSTransition's classNames prop
 * TODO Can be replaced once build is final, I guess :)
 * https://stackoverflow.com/a/38382243
 */
export const stripSpaces = (str: string) => str.trim().replace(/\s+/g, ' ');

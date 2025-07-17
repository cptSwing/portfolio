/**
 * Removes leading, trailing and multiple spaces within a string
 * https://stackoverflow.com/a/38382243
 */
export const stripExtraSpaces = (str: string) => str.trim().replace(/\s+/g, ' ');

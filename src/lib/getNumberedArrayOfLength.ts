export const getNumberedArrayOfLength = (length: number, start = 0) => Array.from({ length }, (_, i) => i + start + 1);

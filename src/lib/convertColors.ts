import { Color } from 'three';

export function materialHexColor(color: Color): string {
    return `#${color.getHexString()}`;
}

export const hexadecimalToString = (hex: number | string) => {
    if (typeof hex === 'number') {
        return hex.toString().replace('0x', '#');
    } else {
        return hex.replace('0x', '#');
    }
};

export const stringToHexadecimal = (hex: string) => parseInt(hex.substring(1), 16);

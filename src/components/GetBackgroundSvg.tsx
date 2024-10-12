import CodeSvg from '../assets/svg/code.svg?react';
import ThreeDSvg from '../assets/svg/3D.svg?react';
import AboutSvg from '../assets/svg/about.svg?react';
import LogSvg from '../assets/svg/log.svg?react';
import { MENU_CATEGORY } from '../types/enums';

const svgObj = {
    'Code': CodeSvg,
    '3D': ThreeDSvg,
    'About': AboutSvg,
    'Log': LogSvg,
};

const GetBackgroundSvg = (cat: MENU_CATEGORY) => svgObj[cat];

export default GetBackgroundSvg;

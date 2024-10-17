import CodeSvg from '../assets/svg/code.svg?react';
import ThreeDSvg from '../assets/svg/3D.svg?react';
import AboutSvg from '../assets/svg/about.svg?react';
import LogSvg from '../assets/svg/log.svg?react';
import { MENU_CATEGORY } from '../types/enums';
import { FunctionComponent, SVGProps } from 'react';

const svgObj = {
    'Code': [CodeSvg, 'src/assets/svg/code.svg'],
    '3D': [ThreeDSvg, 'src/assets/svg/3D.svg'],
    'About': [AboutSvg, 'src/assets/svg/about.svg'],
    'Log': [LogSvg, 'src/assets/svg/log.svg'],
};

const GetBackgroundSvg = (cat: MENU_CATEGORY) => svgObj[cat] as [FunctionComponent<SVGProps<SVGSVGElement>>, string];

export default GetBackgroundSvg;

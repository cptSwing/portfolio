export enum ROUTE {
    'home',
    'category',
    'post',
}

export enum CATEGORY {
    'code' = 0,
    '3d' = 1,
    'log' = 3,
}

export enum TOOL {
    'react' = 'https://react.dev/',
    'react-postprocessing' = 'https://github.com/pmndrs/react-postprocessing',
    'react-three-fiber' = 'https://r3f.docs.pmnd.rs/',
    'react-three-drei' = 'https://github.com/pmndrs/drei',
    'react-router' = 'https://reactrouter.com',
    'leva-gui' = 'https://github.com/pmndrs/leva',
    'tailwindcss' = 'https://tailwindcss.com/',
    'three.js' = 'https://threejs.org/',
    'three-bvh-csg' = 'https://github.com/gkjohnson/three-bvh-csg',
    '3ds Max' = 'https://www.autodesk.com/products/3ds-max',
    'Substance Designer' = 'https://www.adobe.com/products/substance3d/apps/designer.html',
}

export enum HAMBURGERMENUITEMS {
    '__empty' = '',
    'DEFAULT' = '/svg/XMarkOutline.svg',
    'Config' = '/svg/AdjustmentsHorizontalOutline.svg',
    'Corners' = '/svg/PercentBadgeOutline.svg',
    'Login' = '/svg/KeyOutline.svg',
    'Theme' = '/svg/PaintBrushOutline.svg',
    '_NotDecided' = HAMBURGERMENUITEMS['__empty'],
    'Home' = '/svg/HomeOutline.svg',
    'Contact' = '/svg/ChatBubbleBottomCenterTextOutline.svg',
    'Linkedin' = '/svg/logo_linkedin.svg',
    'Github' = '/svg/logo_github.svg',
    'Email' = '/svg/EnvelopeOutline.svg',
    'Me' = '/svg/UserIconOutline.svg',
    'Bio / CV' = '/svg/AcademicCapOutline.svg',
    'CV (English)' = '/svg/DocumentArrowDownOutline.svg',
    'Bio' = '/svg/UserGroupOutline.svg',
    'Socials' = HAMBURGERMENUITEMS['__empty'],
    'Lebenslauf' = HAMBURGERMENUITEMS['CV (English)'],
    'Imprint' = '/svg/InformationCircleOutline.svg',
    '3D Stores' = '/svg/CubeOutline.svg',
    'CGTrader' = HAMBURGERMENUITEMS['__empty'],
    'TurboSquid' = HAMBURGERMENUITEMS['__empty'],
    'Printables' = HAMBURGERMENUITEMS['__empty'],
    'Thingiverse' = HAMBURGERMENUITEMS['__empty'],
}

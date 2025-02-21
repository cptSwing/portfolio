import { InstancedEntity } from '@three.ez/instanced-mesh';
import { MENU_CATEGORY, ToolsUrls } from './enums';
import { Color } from 'three';

export type ZustandStore = {
    values: {
        themeIndex: number;
    };
    methods: {
        store_cycleTheme: () => void;
    };
};

type Post_ShowCase_Base = {
    caption?: string;
};

export interface Post_ShowCase_Image extends Post_ShowCase_Base {
    imgUrl: string;
}

export interface Post_ShowCase_Youtube extends Post_ShowCase_Base {
    youtubeUrl: string;
}

/* NOTE Easy, if non-generic, method to build a Type that has EITHER key1 OR key2. Mind the "?"" in the key to be excluded in the helper types above. */
export type Post_ShowCase = Post_ShowCase_Image | Post_ShowCase_Youtube;

export type Post = {
    id: number;
    title: string;
    date: string | string[];
    textBlocks: { text: string; useShowCaseIndex?: number }[];
    showCases?: Post_ShowCase[];
    subTitle?: string;
    titleCardBg?: string;
    toolsUsed?: (keyof typeof ToolsUrls)[];
    codeLink?: {
        href: string;
        alt: string;
    };
};

export type DataBase = {
    [key in MENU_CATEGORY]: {
        id: number;
        categoryTitle: MENU_CATEGORY;
        posts: Post[];
        categoryCardBackgroundImage: string;
        categoryBackgroundSvg: 'code' | '3D' | 'about' | 'log';
        categoryBlurb: string;
        categoryBackgroundColor?: string;
    };
};

/* Animation Types */

export type GridData = {
    overallWidth: number;
    overallHeight: number;
    instanceLength: number;
    instancePadding: number;
    gridCount: number;
    gridCountHorizontal: number;
    gridCountVertical: number;
    gridBaseColor: Color;
};

type PatternSettings = {
    instance: InstancedEntity;
    index: number;
    gridData: GridData;
    time_Ms: number;
    timeAlpha: number;
    endDelay_S?: number;
};

export type PatternSettingsAnimation = PatternSettings & {
    pattern: 'tumble' | 'sin-wave' | 'sin-disjointed' | 'none';
};

export type PatternSettingsColor = PatternSettings & {
    pattern: 'sin' | 'none';
};

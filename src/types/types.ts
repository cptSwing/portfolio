import { InstancedEntity, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { MENU_CATEGORY, ToolsUrls } from './enums';
import { BufferGeometry, Color, IUniform, NormalBufferAttributes, Object3DEventMap, ShaderMaterial } from 'three';

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

/* Mesh Types */

export interface GridShaderMaterial extends ShaderMaterial {
    uniforms: {
        diffuse: IUniform<Color>;
        opacity: IUniform<number>;
        specular: IUniform<Color>;
        shininess: IUniform<number>;
        u_Length: IUniform<number>;
        u_FresnelColor: IUniform<Color>;
        u_HighLightColor: IUniform<Color>;
    };
}

export type InstancedGridMesh = InstancedMesh2<{}, BufferGeometry<NormalBufferAttributes>, GridShaderMaterial, Object3DEventMap>;

export type OriginalInstancePosition = {
    x: number;
    y: number;
    z: number;
};

export type OriginalInstancePositions = OriginalInstancePosition[];

/* Animation Types */

export type GridData = {
    overallWidth: number;
    overallHeight: number;
    instanceFlatTop: boolean;
    instanceWidth: number;
    instancePadding: number;
    gridCount: number;
    gridColumns: number;
    gridRows: number;
};

export type DefaultGridData = Omit<GridData, 'instanceWidth'> & { instanceWidth: null };

export type CubeCoordinate = [number, number, number];

/** Where index 0 would contain the center hex's coordinates, index 1 contains coordinates for distance 1, index 2 contains coordinates at distance 2, etc */
export type CubeCoordinateByDistance = CubeCoordinate[][];

export type OffsetCoordinate = [number, number];

type PatternSettings = {
    instance: InstancedEntity;
    index: number;
    gridData: GridData;
    time_S: number;
    timeAlpha: number;
    endDelay_S?: number;
};

export type PatternSettingsAnimation = PatternSettings & {
    originalPosition: OriginalInstancePosition;
    pattern: 'sin' | 'sin-columns' | 'sin-rows' | 'raindrops' | 'none';
};

export type PatternSettingsColor = PatternSettings & {
    pattern: 'sin' | 'none';
};

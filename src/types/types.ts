import { InstancedEntity, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { MENU_CATEGORY, ToolsUrls } from './enums';
import { BufferGeometry, Color, IUniform, Mesh, NormalBufferAttributes, Object3DEventMap, ShaderMaterial } from 'three';
import HexagonalPrismGeometry from '../lib/classes/HexagonalPrismGeometry';

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

        u_Time_S: IUniform<number>;
        u_Animation_Length_S: IUniform<number>;
        u_Instance_Width: IUniform<number>;
        u_Fresnel_Color: IUniform<Color>;
        u_HighLight_Color: IUniform<Color>;
    };
}

export type InstancedGridMesh = InstancedMesh2<{}, BufferGeometry<NormalBufferAttributes>, GridShaderMaterial, Object3DEventMap>;

export type HexMenuMesh = Mesh<HexagonalPrismGeometry>;

export type OriginalInstancePosition = {
    x: number;
    y: number;
    z: number;
};

export type OriginalInstancePositions = OriginalInstancePosition[];

/* Animation Types */

export type GridData = {
    gridWidth: number;
    gridHeight: number;
    gridInstanceCount: number;
    gridColumnCount: number;
    gridRowCount: number;
    instanceFlatTop: boolean;
    instanceWidth: number;
    instancePadding: number;
};

export type DefaultGridData = Omit<GridData, 'instanceWidth'> & { instanceWidth: null };

/** Cube Coordinates as [q, r, s] --> Each of the 3 elements describes one the axes passing through a hexagonal shape */
export type CubeCoordinate = [number, number, number];

/** Where index 0 would contain the center hex's coordinates, index 1 contains coordinates for a distance 1 further, index 2 contains coordinates at distance 2 further, etc */
export type CubeCoordinateByDistance = CubeCoordinate[][];

/** Grid Coordinates as [Column #, Row #] */
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

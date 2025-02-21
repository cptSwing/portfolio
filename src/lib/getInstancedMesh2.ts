import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';

export const originalPositions: { x: number; y: number; z: number }[] = [];

const getInstancedMesh2 = (renderer: WebGLRenderer, gridData: GridData, isSquare: boolean) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, gridBaseColor } = gridData;

    let geometry;

    if (isSquare) {
        geometry = new PlaneGeometry(instanceLength, instanceLength);
    } else {
        geometry = new HexagonGeometry(instanceLength / 2);
    }

    const shaderUniforms = UniformsUtils.merge([
        ShaderLib.phong.uniforms,
        {
            u_Time_Ms: {
                value: 0,
            },
        },
    ]);

    shaderUniforms.shininess.value = 40;
    shaderUniforms.specular.value = new Color(0xffffff);

    const material = new ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
        lights: true,
    });

    const instancedMesh = new InstancedMesh2(geometry, material, { renderer, createEntities: true });
    instancedMesh.initUniformsPerInstance({ vertex: { u_Hit: 'vec2', u_Hit_Color: 'vec3' } });

    const lengthIncludingPadding = instanceLength + instancePadding;
    const extentX = -(overallWidth / 2 - instanceLength / 2); // Negative, so grid is filled from top-left
    const extentY = overallHeight / 2;

    instancedMesh.addInstances(gridCountHorizontal * gridCountVertical, (instancedEntity, index) => {
        let offsetX, offsetY;
        const [column, row] = getColumnAndRowByIndex(index, gridData);

        if (isSquare) {
            offsetX = column * lengthIncludingPadding;
            offsetY = row * lengthIncludingPadding;
        } else {
            [offsetX, offsetY] = (instancedMesh.geometry as HexagonGeometry).getXYOffsets(column, row, instancePadding);
        }

        const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        originalPositions.push(position);

        instancedEntity.position.set(position.x, position.y, position.z);
        instancedEntity.color = gridBaseColor.setHex(0x888888 * Math.random());
    });

    return instancedMesh;
};

export default getInstancedMesh2;

export const getInstanceCount = (params: GridData, isSquare: boolean) => {
    const { overallWidth, overallHeight, instancePadding, gridCount } = params;

    const overallArea = overallWidth * overallHeight;
    const idealInstanceArea = overallArea / gridCount;

    if (isSquare) {
        // Via https://stackoverflow.com/a/1575761
        const idealInstanceLength = Math.sqrt(idealInstanceArea);

        const columns = Math.round(overallWidth / idealInstanceLength);
        let rows = Math.round(overallHeight / idealInstanceLength);

        const minLength = Math.min(overallWidth / columns, overallWidth / rows);
        if (overallHeight > minLength * rows) rows++;

        return { ...params, instanceLength: minLength - instancePadding, gridCount: columns * rows, gridCountHorizontal: columns, gridCountVertical: rows };
    } else {
        const side = Math.sqrt((2 * idealInstanceArea) / (3 * Math.sqrt(3))); // same as radius

        const widthWhenStacked = side * 1.5;
        const columns = Math.round((overallWidth - side / 2 - instancePadding) / widthWhenStacked);

        const newWidthWhenStacked = (overallWidth + side / 2 + instancePadding) / columns;
        const newSide = newWidthWhenStacked * (2 / 3);
        const newDiameter = newSide * 2;

        const apothem = (Math.sqrt(3) / 2) * newSide; // half height
        const height = 2 * apothem;
        const rows = Math.ceil((overallHeight - apothem) / height) + 1; // pad rows beyond screen w/ +1

        return {
            ...params,
            instanceLength: newDiameter - instancePadding,
            gridCount: columns * rows,
            gridCountHorizontal: columns,
            gridCountVertical: rows,
        };
    }
};

export const getAdjacentIndices = (instanceIndex: number, gridData: GridData, isSquare: boolean) => {
    const { gridCountHorizontal, gridCountVertical, gridFillDirection } = gridData;
    const [centerColumn] = getColumnAndRowByIndex(instanceIndex, gridData);

    const isEvenColumn = centerColumn % 2 === 0;

    let adjacentIndices: number[] = [];

    if (isSquare) {
        const above = gridFillDirection === 'vertical' ? instanceIndex - 1 : instanceIndex - gridCountHorizontal;
        const toRight = gridFillDirection === 'vertical' ? instanceIndex + gridCountVertical : instanceIndex + 1;
        const below = gridFillDirection === 'vertical' ? instanceIndex + 1 : instanceIndex + gridCountHorizontal;
        const toLeft = gridFillDirection === 'vertical' ? instanceIndex - gridCountVertical : instanceIndex - 1;

        adjacentIndices.push(above, toRight, below, toLeft);
    } else {
        let above, topRight, bottomRight, below, bottomLeft, topLeft;

        if (gridFillDirection === 'horizontal') {
            above = instanceIndex - gridCountHorizontal;
            topRight = isEvenColumn ? instanceIndex + 1 : instanceIndex - (gridCountHorizontal - 1);
            bottomRight = isEvenColumn ? instanceIndex + gridCountHorizontal + 1 : instanceIndex + 1;
            below = instanceIndex + gridCountHorizontal;
            bottomLeft = isEvenColumn ? instanceIndex + gridCountHorizontal - 1 : instanceIndex - 1;
            topLeft = isEvenColumn ? instanceIndex - 1 : instanceIndex - (gridCountHorizontal + 1);
        } else {
            above = instanceIndex - 1;
            topRight = instanceIndex + gridCountVertical;
            bottomRight = instanceIndex + gridCountVertical;
            below = instanceIndex + 1;
            bottomLeft = instanceIndex - gridCountVertical;
            topLeft = instanceIndex - gridCountVertical;
        }

        if (centerColumn === 0) {
            bottomLeft = -1;
            topLeft = -1;
        } else if (centerColumn === gridCountHorizontal - 1) {
            topRight = -1;
            bottomRight = -1;
        }

        adjacentIndices.push(above, topRight, bottomRight, below, bottomLeft, topLeft);
    }

    return adjacentIndices.filter((adjacent) => adjacent >= 0);
};

export const getColumnAndRowByIndex = (index: number, { gridFillDirection, gridCountVertical, gridCountHorizontal }: GridData) => {
    let column, row;

    if (gridFillDirection === 'vertical') {
        column = Math.floor(index / gridCountVertical);
        row = index % gridCountVertical;
    } else {
        column = index % gridCountHorizontal;
        row = Math.floor(index / gridCountHorizontal);
    }

    return [column, row];
};

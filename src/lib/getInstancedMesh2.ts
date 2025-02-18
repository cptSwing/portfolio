import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, ShaderLib, ShaderMaterial, UniformsUtils, Vector3, WebGLRenderer } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData, PatternSettingsAnimation, PatternSettingsColor } from '../types/types';

const originalPositions: [number, number, number][] = [];

const getInstancedMesh2 = (renderer: WebGLRenderer, gridData: GridData) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, gridBaseColor } = gridData;

    const geometry = new RoundedBoxGeometry(instanceLength, instanceLength, instanceLength / 5, 1, instanceLength / 5);
    geometry.clearGroups();
    geometry.deleteAttribute('uv');

    const shaderUniforms = UniformsUtils.merge([
        ShaderLib.phong.uniforms,
        {
            u_Time_Seconds: {
                value: 0,
            },
            u_hitIndex: {
                value: 0,
            },
            u_Time_Last_Hit: {
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
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    const lengthIncludingPadding = instanceLength + instancePadding;
    const extentX = overallWidth / 2 - lengthIncludingPadding / 2;
    const extentY = overallHeight / 2 - lengthIncludingPadding / 2;

    instancedMesh.addInstances(gridCountHorizontal * gridCountVertical, (instancedEntity, index) => {
        const [column, row] = getDirectionalColumnsRows(index, gridData);

        const offsetX = column * lengthIncludingPadding;
        const offsetY = row * lengthIncludingPadding;

        const position: [number, number, number] = [extentX - offsetX, extentY - offsetY, 0];
        originalPositions.push(position);

        instancedEntity.position.fromArray(position);
        instancedEntity.color = gridBaseColor;
    });

    return instancedMesh;
};

export default getInstancedMesh2;

export const getInstanceCount = (params: GridData) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding } = params;

    const gridCountHorizontal = Math.ceil(overallWidth / (instanceLength + instancePadding));
    const gridCountVertical = Math.ceil(overallHeight / (instanceLength + instancePadding));

    return { ...params, gridCountHorizontal, gridCountVertical };
};

export const getAdjacentIndices = (instanceIndex: number, { gridCountHorizontal, gridCountVertical, gridFillDirection }: GridData) => {
    const above = gridFillDirection === 'vertical' ? instanceIndex - 1 : instanceIndex - gridCountHorizontal;
    const below = gridFillDirection === 'vertical' ? instanceIndex + 1 : instanceIndex + gridCountHorizontal;
    const toLeft = gridFillDirection === 'vertical' ? instanceIndex + gridCountVertical : instanceIndex + 1;
    const toRight = gridFillDirection === 'vertical' ? instanceIndex - gridCountVertical : instanceIndex - 1;

    return { above, below, toLeft, toRight };
};

const getDirectionalColumnsRows = (index: number, { gridFillDirection, gridCountVertical, gridCountHorizontal }: GridData) => {
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

const tempInstancePos = new Vector3();
export const setAnimationPattern = ({ instance, index, time, timeAlpha = 0.1, pattern = 'sin-wave', gridData }: PatternSettingsAnimation) => {
    const [column, row] = getDirectionalColumnsRows(index, gridData);
    const overallCount = gridData.gridCountHorizontal * gridData.gridCountVertical;
    const sin = returnSinValue(overallCount);

    // Using lerp to not instantly cancel other, possibly user-set, transforms on instance.position:
    switch (pattern) {
        case 'tumble':
            if (instance.position.y > originalPositions[index][1]) {
                tempInstancePos.copy(instance.position);
                tempInstancePos.setY(originalPositions[index][1]);
                instance.position.lerp(tempInstancePos, timeAlpha / (column ? column / 2 : 0.5));
            }

            break;

        case 'sin-wave':
            tempInstancePos.copy(instance.position);
            tempInstancePos.setZ(Math.sin(time + tempInstancePos.z * sin) * Math.sin(time + row + index * sin) * (gridData.instanceLength / 3));
            instance.position.lerp(tempInstancePos, timeAlpha);

            break;

        case 'sin-disjointed':
            tempInstancePos.copy(instance.position);
            tempInstancePos.setZ(Math.sin(time + tempInstancePos.z * 0.5) * Math.sin(time + (index / 2) * 0.5) * (gridData.instanceLength / 3));
            instance.position.lerp(tempInstancePos, timeAlpha);

            break;

        // 'none'
        default:
            tempInstancePos.copy(instance.position);
            tempInstancePos.setZ(0);
            instance.position.lerp(tempInstancePos, timeAlpha);

            break;
    }
};

const tempInstanceCol = new Color();
export const setColorPattern = ({ instance, index, time, timeAlpha = 0.1, pattern = 'sin', gridData }: PatternSettingsColor) => {
    const { gridBaseColor } = gridData;

    if (!instance.color.equals(tempInstanceCol)) {
        tempInstanceCol.copy(instance.color);
        tempInstanceCol.lerp(gridBaseColor, timeAlpha);
        instance.owner.setColorAt(index, tempInstanceCol);
    }
};

const returnSinValue = (instanceCount: number) => -0.0008 * instanceCount + 2.1;

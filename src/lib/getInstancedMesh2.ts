import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';

const getInstancedMesh2 = (
    renderer: WebGLRenderer,
    instanceLength: number,
    width: number,
    height: number,
    countHorizontal: number,
    countVertical: number,
    padding: number,
    color: Color,
) => {
    // WARN not loaded when this is run
    const rootElement = document.documentElement;
    const bgGrey = rootElement.style.getPropertyValue('--theme-bg-base');
    color.setStyle(bgGrey);

    const geometry = new RoundedBoxGeometry(instanceLength, instanceLength, instanceLength, 1, instanceLength / 7.5);
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

    shaderUniforms.shininess.value = 30;
    shaderUniforms.specular.value = new Color(0xffffff);

    const material = new ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
        lights: true,
    });

    const instancedMesh = new InstancedMesh2(geometry, material, { renderer });

    const extentX = width / 2;
    const extentY = height / 2;

    instancedMesh.addInstances(countHorizontal * countVertical, (instancedEntity, index) => {
        const column = Math.floor(index / countVertical);
        const row = index % countVertical;

        const offsetX = column * (instanceLength + padding);
        const offsetY = row * (instanceLength + padding);

        instancedEntity.position.set(extentX - offsetX, extentY - offsetY, 0);
        instancedEntity.color = color;
    });

    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    return instancedMesh;
};

export default getInstancedMesh2;

export const getInstanceCount = (width: number, height: number, instanceLength: number, paddingValue: number) => {
    const countHorizontal = Math.ceil(width / (instanceLength + paddingValue));
    const countVertical = Math.ceil(height / (instanceLength + paddingValue));
    return [countHorizontal, countVertical];
};

export const getInstanceNeighbors = (instanceId: number, countVertical: number) => {
    const above = instanceId - 1;
    const below = instanceId + 1;
    const toLeft = instanceId + countVertical;
    const toRight = instanceId - countVertical;

    return { above, below, toLeft, toRight };
};

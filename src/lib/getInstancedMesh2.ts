import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { CircleGeometry, Color, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData } from '../types/types';

export const originalPositions: { x: number; y: number; z: number }[] = [];

const growHexagon = (radius: number) => {
    const a = (2 * Math.PI) / 6; // 60 deg
    const rSin = radius * Math.sin(a);

    console.log('%c[getInstancedMesh2]', 'color: #04dec4', `radius, rSin, radius/rSin :`, radius, rSin, radius / rSin);
    return radius / rSin;
};

const getInstancedMesh2 = (renderer: WebGLRenderer, gridData: GridData) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, gridBaseColor } = gridData;

    // const geometry = new RoundedBoxGeometry( instanceLength, instanceLength, instanceLength / 5, 1, instanceLength / 5 );
    // geometry.clearGroups();
    const square = false;
    let geometry;

    if (square) {
        geometry = new PlaneGeometry(instanceLength, instanceLength);
    } else {
        const growFactor = growHexagon(instanceLength / 2);

        geometry = new CircleGeometry((instanceLength / 2) * growFactor, 6);
        geometry.scale(growFactor, 1, 1);
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
    instancedMesh.initUniformsPerInstance({ vertex: { u_Hit: 'vec2' }, fragment: { u_Hit_Color: 'vec3' } });

    const lengthIncludingPadding = instanceLength + instancePadding;
    const lengthIncludingPaddingHalf = lengthIncludingPadding / 2;
    const extentX = -(overallWidth / 2 - lengthIncludingPaddingHalf); // Negative, so grid is filled from top-left
    const extentY = overallHeight / 2 - lengthIncludingPaddingHalf;

    instancedMesh.addInstances(gridCountHorizontal * gridCountVertical, (instancedEntity, index) => {
        const [column, row] = getColumnAndRowByIndex(index, gridData);

        const offsetX = column * lengthIncludingPadding;
        const offsetY = row * lengthIncludingPadding - (column % 2 === 0 ? lengthIncludingPaddingHalf : 0);

        const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        originalPositions.push(position);

        instancedEntity.position.set(position.x, position.y, position.z);
        instancedEntity.color = gridBaseColor.setHex(0xffffff * Math.random() + 0.5);
        // instancedEntity.setUniform('u_Hit_Color', gridBaseColor.setHex(0x000000));
    });

    return instancedMesh;
};

export default getInstancedMesh2;

export const getInstanceCount = (params: GridData) => {
    const { overallWidth, overallHeight, instancePadding, gridCount } = params;

    // Via https://stackoverflow.com/a/1575761
    const area = overallWidth * overallHeight;
    const idealInstanceArea = area / gridCount;
    const idealInstanceLength = Math.sqrt(idealInstanceArea);

    const columns = Math.round(overallWidth / idealInstanceLength);
    let rows = Math.round(overallHeight / idealInstanceLength);

    const minLength = Math.min(overallWidth / columns, overallWidth / rows);
    if (overallHeight > minLength * rows) rows++;

    return { ...params, instanceLength: minLength - instancePadding, gridCount: columns * rows, gridCountHorizontal: columns, gridCountVertical: rows };
};

export const getAdjacentIndices = (instanceIndex: number, { gridCountHorizontal, gridCountVertical, gridFillDirection }: GridData) => {
    const above = gridFillDirection === 'vertical' ? instanceIndex - 1 : instanceIndex - gridCountHorizontal;
    const below = gridFillDirection === 'vertical' ? instanceIndex + 1 : instanceIndex + gridCountHorizontal;
    const toLeft = gridFillDirection === 'vertical' ? instanceIndex - gridCountVertical : instanceIndex - 1;
    const toRight = gridFillDirection === 'vertical' ? instanceIndex + gridCountVertical : instanceIndex + 1;

    return { above, below, toLeft, toRight };
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

import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { CircleGeometry, Color, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData } from '../types/types';

export const originalPositions: { x: number; y: number; z: number }[] = [];

// With help from https://eperezcosano.github.io/hex-grid/
const getUpsizedHexagon = (radius: number) => {
    const a = (2 * Math.PI) / 6; // 60 deg
    const rSin = radius * Math.sin(a);

    const factor = radius / rSin;
    return factor;
};

const getHexagonOffsets = (index: number, radius: number) => {
    // function drawGrid(width, height) {
    //     for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    //         for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
    //             drawHexagon(x, y);
    //         }
    //     }
    // }
    const a = (2 * Math.PI) / 6;

    let j;
    if (index % 2 === 0) {
        j = 1;
    } else {
        j = -1;
    }

    let x = index * (radius * (1 + Math.cos(a)));
    let y = index * ((-1) ** j++ * radius * Math.sin(a));

    return [x, y];
};

const isSquare = false;

const getInstancedMesh2 = (renderer: WebGLRenderer, gridData: GridData) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, gridBaseColor } = gridData;

    let geometry;

    if (isSquare) {
        geometry = new PlaneGeometry(instanceLength, instanceLength);
    } else {
        const radius = instanceLength / 2;
        const growFactor = getUpsizedHexagon(radius);

        geometry = new CircleGeometry(radius * growFactor, 6);
        geometry.scale(growFactor, 1, 0);
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
    const lengthIncludingPaddingHalf = lengthIncludingPadding / 2;
    const extentX = -(overallWidth / 2 - lengthIncludingPaddingHalf); // Negative, so grid is filled from top-left
    const extentY = overallHeight / 2 - lengthIncludingPaddingHalf;

    instancedMesh.addInstances(gridCountHorizontal * gridCountVertical, (instancedEntity, index) => {
        const [column, row] = getColumnAndRowByIndex(index, gridData, isSquare);

        let offsetX = column * lengthIncludingPadding;
        let offsetY = row * lengthIncludingPadding;

        let position: { x: number; y: number; z: number };
        if (isSquare) {
            position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        } else {
            const [hexX, hexY] = getHexagonOffsets(index, lengthIncludingPaddingHalf);
            offsetX = hexX;
            offsetY = hexY;

            // offsetY -= column % 2 === 0 ? lengthIncludingPaddingHalf : 0;
            position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
        }

        originalPositions.push(position);
        instancedEntity.position.set(position.x, position.y, position.z);
        instancedEntity.color = gridBaseColor.setHex(0x888888 /** Math.random() */);

        switch (index) {
            case 0:
                instancedEntity.color = gridBaseColor.setHex(0xffffff);
                break;
            case 1:
                instancedEntity.color = gridBaseColor.setHex(0xff0000);
                break;
            case 2:
                instancedEntity.color = gridBaseColor.setHex(0x00ff00);
                break;
            case 3:
                instancedEntity.color = gridBaseColor.setHex(0x0000ff);
                break;
            case 4:
                instancedEntity.color = gridBaseColor.setHex(0xffff00);
                break;
            case 5:
                instancedEntity.color = gridBaseColor.setHex(0xff00ff);
                break;
            case 6:
                instancedEntity.color = gridBaseColor.setHex(0x00ffff);
                break;

            default:
                break;
        }
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

export const getColumnAndRowByIndex = (index: number, { gridFillDirection, gridCountVertical, gridCountHorizontal }: GridData, isSquare: boolean) => {
    let column, row;

    if (gridFillDirection === 'vertical') {
        if (isSquare) {
            column = Math.floor(index / gridCountVertical);
            row = index % gridCountVertical;
        } else {
            // WARN for now
            column = Math.floor(index / gridCountVertical);
            row = index % gridCountVertical;
        }
    } else {
        column = index % gridCountHorizontal;

        if (isSquare) {
            row = Math.floor(index / gridCountHorizontal);
        } else {
            row = Math.floor(index / gridCountHorizontal);
        }
    }

    return [column, row];
};

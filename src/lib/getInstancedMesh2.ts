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
        const [column, row] = HexagonGeometry.getColumnAndRowByIndex(index, gridCountHorizontal);

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

export const getAdjacentIndices = (instanceIndex: number, numColumns: number, distance: number, isSquare = false) => {
    const [hexCol, hexRow] = HexagonGeometry.getColumnAndRowByIndex(instanceIndex, numColumns);

    let distance1: number[] = [];

    if (isSquare) {
        const above = instanceIndex - numColumns;
        const toRight = instanceIndex + 1;
        const below = instanceIndex + numColumns;
        const toLeft = instanceIndex - 1;

        distance1.push(above, toRight, below, toLeft);
    } else {
        // 6 = query all six directions
        distance1 = Array.from({ length: 6 }).map((_, idx) => {
            const [nCol, nRow] = HexagonGeometry.getNeighborsEvenQ([hexCol, hexRow], idx);
            let nIndex = nRow * numColumns + nCol;

            if (nCol < 0 || nCol >= numColumns) {
                nIndex = -1; // prevent wrapping to other side, as filtered below
            }
            return nIndex;
        });
    }

    const distance2: number[] = [];

    distance1.forEach((hexIndex, idx) => {
        switch (idx) {
            case 0:
                const [nCol, nRow] = HexagonGeometry.getNeighborsEvenQ([hexCol, hexRow], idx);
                let nIndex = nRow * numColumns + nCol;
                break;

            default:
                break;
        }
    });

    distance1 = distance1.filter((adjacent) => adjacent >= 0);

    return distance1;
};

import { InstancedEntity, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, CubeTextureLoader, Matrix3, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData, InstancedMesh2ShaderMaterial } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { extend, Object3DNode } from '@react-three/fiber';
import { FC, MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import HexagonalPrismGeometry from './classes/HexagonalPrismGeometry';

extend({ InstancedMesh2 });
declare module '@react-three/fiber' {
    interface ThreeElements {
        instancedMesh2: Object3DNode<InstancedMesh2ShaderMaterial, typeof InstancedMesh2>;
    }
}

const instancedMeshTempColor = new Color();

const BackgroundMesh: FC<{
    gridData: GridData;
    meshRef: MutableRefObject<InstancedMesh2ShaderMaterial | null>;
    renderer: WebGLRenderer;
    isSquare: boolean;
}> = ({ gridData, meshRef, renderer, isSquare }) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCount, gridCountHorizontal } = gridData;

    const meshRef_Cb = useCallback((mesh: InstancedMesh2 | null) => {
        if (mesh) {
            meshRef.current = mesh as InstancedMesh2ShaderMaterial;
            mesh.initUniformsPerInstance({ vertex: { u_Hit_Offset: 'vec4', u_Hit_Time: 'float' } });
        }
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            const instancedMesh = meshRef.current;
            const extentX = -(overallWidth / 2 - instanceLength / 2); // Negative, so grid is filled from top-left
            const extentY = overallHeight / 2;

            if (!instancedMesh.instancesCount) {
                console.log('%c[instancedMesh2]', 'color: #b85533', `Creating Instances ${gridCount}`);
                instancedMesh.addInstances(gridCount, (instance, idx) => {
                    updateInstances(instance, idx, gridCountHorizontal, [extentX, extentY], instanceLength, instancePadding, isSquare, instancedMeshTempColor);
                });
            } else {
                const difference = gridCount - instancedMesh.instancesCount;
                if (Math.sign(difference) === 1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Adding Instances ${difference}`);
                    instancedMesh.addInstances(difference, (instance, idx) => {
                        updateInstances(
                            instance,
                            idx,
                            gridCountHorizontal,
                            [extentX, extentY],
                            instanceLength,
                            instancePadding,
                            isSquare,
                            instancedMeshTempColor,
                        );
                        instance.color = instancedMeshTempColor.setHex(0x888888 * Math.random());
                        // instancedMesh.updateInstancesPosition((instance, idx) => {})     // likely need to mess with array id's / instance id's / transforms ???
                    });
                } else if (Math.sign(difference) === -1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Removing Instances ${difference}`);
                    const idsToRemove = Array.from({ length: -difference }).map((_elem, idx) => -difference + idx);
                    instancedMesh.removeInstances(...idsToRemove);
                    // instancedMesh.updateInstancesPosition((instance, idx) => {})     // likely need to mess with array id's / instance id's / transforms ???
                } else {
                    throw new Error('difference is 0');
                }
            }

            meshRef.current = instancedMesh;
        }
    }, [overallWidth, overallHeight, instanceLength, instancePadding, gridCount, gridCountHorizontal, isSquare]);

    const geometry_Memo = useMemo(() => {
        if (isSquare) {
            return new PlaneGeometry(instanceLength, instanceLength);
        } else {
            return new HexagonalPrismGeometry(instanceLength / 2, 0.1);
        }
    }, [isSquare, instanceLength]);

    const material_Memo = useMemo(() => {
        const { diffuse, opacity, reflectivity, envMap, envMapIntensity, envMapRotation, flipEnvMap, fogColor, fogDensity, fogFar, fogNear } =
            ShaderLib.basic.uniforms;
        const veryBasicUniforms = {
            diffuse,
            opacity,
            reflectivity,
            envMap,
            envMapIntensity,
            envMapRotation,
            flipEnvMap,
            fogColor,
            fogDensity,
            fogFar,
            fogNear,
        };

        const shaderUniforms = UniformsUtils.merge([
            veryBasicUniforms,
            {
                u_Time_S: {
                    value: 0,
                },
                u_Anim_Length_S: { value: 2 },
                u_Length: { value: 0.1 },
            },
        ]);

        shaderUniforms.diffuse.value.setHex(0x5a5a5a);

        // not really working:
        shaderUniforms.envMap.value = getEnvMap('/3d/textures/cubemaps/swedishroyalcastle/');
        shaderUniforms.envMapIntensity.value = 1;
        shaderUniforms.envMapRotation.value = new Matrix3().rotate(0.3);
        shaderUniforms.reflectivity.value = 1;

        return new ShaderMaterial({
            uniforms: shaderUniforms,
            defines: {
                USE_UV: '',
                USE_VERTEX_COLOR: '',
                USE_ENVMAP: '',
                ENVMAP_TYPE_CUBE: '',
                // ENVMAP_BLENDING_MULTIPLY: '',
                // ENVMAP_BLENDING_MIX: '',
                ENVMAP_BLENDING_ADD: '',
                USE_ALPHAHASH: '',
                USE_INSTANCING: '',
                USE_INSTANCING_INDIRECT: '',
                USE_INSTANCING_COLOR: '',
                USE_INSTANCING_COLOR_INDIRECT: '',
            },
            vertexShader,
            fragmentShader,
            vertexColors: true,
            wireframe: false,
            // lights: true,
            // combine: MixOperation,
        });
    }, []);

    return <instancedMesh2 ref={meshRef_Cb} args={[geometry_Memo, material_Memo, { renderer, createEntities: true }]} position={[0, 0, 0]} />;
};

export default BackgroundMesh;

const updateInstances = (
    instance: InstancedEntity,
    index: number,
    gridColumns: number,
    [extentX, extentY]: [number, number],
    length: number,
    padding: number,
    isSquare: boolean,
    colorObject: Color,
) => {
    let offsetX, offsetY;
    const [column, row] = HexagonalPrismGeometry.getColumnAndRowByIndex(index, gridColumns);

    if (isSquare) {
        offsetX = column * length + padding;
        offsetY = row * length + padding;
    } else {
        [offsetX, offsetY] = HexagonalPrismGeometry.getXYOffsets(length / 2, padding, column, row);
    }

    const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
    instance.position.set(position.x, position.y, position.z);

    // Set to black to not initially add anything to 'diffuse'
    instance.color = colorObject.setHex(0x000000);
    // instance.color = colorObject.setHex(0x888888 * Math.random());
};

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

    let allNeighbors: number[] = [];

    if (isSquare) {
        const above = instanceIndex - numColumns;
        const toRight = instanceIndex + 1;
        const below = instanceIndex + numColumns;
        const toLeft = instanceIndex - 1;

        allNeighbors.push(above, toRight, below, toLeft);
    } else {
        // 6 = query all six directions
        let neighbors: [number, number][] = Array.from({ length: 6 }).map((_, idx) => HexagonGeometry.getNeighborsEvenQ([hexCol, hexRow], idx));

        distance && getDistantNeighbors(neighbors);

        allNeighbors = neighbors.map(([nCol, nRow]) => {
            let nIndex = nRow * numColumns + nCol;

            if (nCol < 0 || nCol >= numColumns) {
                nIndex = -1; // prevent wrapping to other side, as filtered below
            }

            return nIndex;
        });
    }

    return allNeighbors.filter((adjacent) => adjacent >= 0);
};

// TODO make this recursive?
const getDistantNeighbors = (neighbors: [number, number][]) => {
    const arrLength = neighbors.length;

    for (let i = 0; i < arrLength; i++) {
        const [nHexCol, nHexRow] = neighbors[i];
        const nextI = i < arrLength - 1 ? i + 1 : 0;

        /** neighbor queries two of it's further outwards neighbors: 0 queries 0, 1 --- 1 queries 1, 2 --- etc */

        const nColRow0 = HexagonGeometry.getNeighborsEvenQ([nHexCol, nHexRow], i);
        const nColRow1 = HexagonGeometry.getNeighborsEvenQ([nHexCol, nHexRow], nextI);

        neighbors.push(nColRow0, nColRow1);
    }

    return neighbors;
};

const cubeTextureLoader = new CubeTextureLoader();
const getEnvMap = (path: string) => {
    // const path = '../../examples/textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];

    const reflectionCube = cubeTextureLoader.load(urls);

    return reflectionCube;
};

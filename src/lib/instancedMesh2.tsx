import { createRadixSort, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, CubeTextureLoader, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData, InstancedMesh2ShaderMaterial } from '../types/types';
import { extend, Object3DNode } from '@react-three/fiber';
import { FC, MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import HexagonalPrismGeometry from './classes/HexagonalPrismGeometry';
import { Grid, HexGrid, SquareGrid } from './classes/Grid';

extend({ InstancedMesh2 });
declare module '@react-three/fiber' {
    interface ThreeElements {
        instancedMesh2: Object3DNode<InstancedMesh2ShaderMaterial, typeof InstancedMesh2>;
    }
}

const instancedMeshTempColor = new Color();
const isFlatShaded = false;

const BackgroundMesh: FC<{
    gridData: GridData;
    meshRef: MutableRefObject<InstancedMesh2ShaderMaterial | null>;
    renderer: WebGLRenderer;
    isSquare: boolean;
    useFresnel?: boolean;
}> = ({ gridData, meshRef, renderer, isSquare, useFresnel = false }) => {
    const { overallWidth, overallHeight, instanceFlatTop, instanceWidth, instancePadding, gridCount, gridColumns, gridRows } = gridData;

    const meshRef_Cb = useCallback((mesh: InstancedMesh2 | null) => {
        if (mesh) {
            meshRef.current = mesh as InstancedMesh2ShaderMaterial;
            mesh.initUniformsPerInstance({ vertex: { u_Hit_Offset: 'vec4', u_Hit_Time: 'float', u_Anim_Progress: 'float' } });
            mesh.sortObjects = true;
            mesh.customSort = createRadixSort(mesh);
        }
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            const instancedMesh = meshRef.current;
            const extentX = -(overallWidth / 2); // Negative, so grid is filled from top-left
            const extentY = overallHeight / 2;

            if (!instancedMesh.instancesCount) {
                console.log('%c[instancedMesh2]', 'color: #b85533', `Creating Instances ${gridCount} (cols:${gridColumns} rows:${gridRows})`);
                instancedMesh.addInstances(gridCount, (instance, idx) => {
                    if (isSquare) {
                        SquareGrid.setInstancePosition(instance, idx, gridColumns, [extentX, extentY], instanceWidth, instancePadding);
                    } else {
                        HexGrid.setInstancePosition(instance, idx, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);
                    }
                    Grid.setInstanceColor(instance, instancedMeshTempColor);
                });
            } else {
                const difference = gridCount - instancedMesh.instancesCount;
                if (Math.sign(difference) === 1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Adding Instances ${difference}`);
                    instancedMesh.addInstances(difference, (instance, idx) => {
                        if (isSquare) {
                            SquareGrid.setInstancePosition(instance, idx, gridColumns, [extentX, extentY], instanceWidth, instancePadding);
                        } else {
                            HexGrid.setInstancePosition(instance, idx, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);
                        }
                        Grid.setInstanceColor(instance, instancedMeshTempColor);
                        instance.color = instancedMeshTempColor.setHex(0x888888 * Math.random());
                    });
                } else if (Math.sign(difference) === -1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Removing Instances ${difference}`);
                    const idsToRemove = Array.from({ length: -difference }).map((_elem, idx) => -difference + idx);
                    instancedMesh.removeInstances(...idsToRemove);
                } else {
                    throw new Error('difference is 0');
                }
            }

            meshRef.current = instancedMesh;
        }
    }, [overallWidth, overallHeight, instanceWidth, instancePadding, gridCount, gridColumns, isSquare, instanceFlatTop]);

    const geometry_Memo = useMemo(() => {
        if (isSquare) {
            return new PlaneGeometry(instanceWidth, instanceWidth);
        } else {
            const size = HexGrid.getSizeFromWidth(instanceWidth, instanceFlatTop);
            return new HexagonalPrismGeometry(size, instanceWidth, instanceFlatTop, isFlatShaded);
        }
    }, [isSquare, instanceWidth, instanceFlatTop]);

    const material_Memo = useMemo(() => {
        const shaderUniforms = UniformsUtils.merge([
            ShaderLib.phong.uniforms,
            {
                u_Length: { value: instanceWidth },
            },
        ]);

        shaderUniforms.diffuse.value.setHex(0xff8800);
        shaderUniforms.opacity.value = 1;
        shaderUniforms.shininess.value = 100;
        shaderUniforms.specular.value.setHex(0xdddddd);

        const shaderMaterial = new ShaderMaterial({
            uniforms: shaderUniforms,
            defines: {
                USE_UV: '',
                USE_INSTANCING_COLOR: '',
                USE_INSTANCING_COLOR_INDIRECT: '',
                ...(useFresnel ? { USE_FRESNEL: '' } : {}),
                ...(isFlatShaded ? { FLAT_SHADED: '' } : {}),
            },
            vertexShader,
            fragmentShader,
            wireframe: false,
            lights: true,
            // side: DoubleSide,
            transparent: shaderUniforms.opacity.value >= 1 ? false : true,
        });

        return shaderMaterial;
    }, [instanceWidth, useFresnel]);

    return <instancedMesh2 ref={meshRef_Cb} args={[geometry_Memo, material_Memo, { renderer, createEntities: true }]} position={[0, 0, 0]} />;
};

export default BackgroundMesh;

const cubeTextureLoader = new CubeTextureLoader();
const _getEnvMap = (path: string) => {
    // const path = '../../examples/textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];

    const reflectionCube = cubeTextureLoader.load(urls);

    return reflectionCube;
};

import { forwardRef, MutableRefObject, useCallback, useLayoutEffect, useMemo, memo, useRef } from 'react';
import { extend } from '@react-three/fiber';
import { createRadixSort, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData, GridShaderMaterial, InstancedGridMesh } from '../../types/types';
import { useIsDocumentReady } from '../../hooks/useIsDocumentReady';
import { useZustand } from '../../lib/zustand';
import { getCssProperties } from '../../lib/cssProperties';
import { stringToHexadecimal } from '../../lib/convertColors';
import { Color, MathUtils, Mesh, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { Grid, HexGrid, SquareGrid } from '../../lib/classes/Grid';
import vertexShader from '../../lib/shading/instancedShader_V.glsl';
import fragmentShader from '../../lib/shading/instancedShader_F.glsl';
import { getExtentsInNDC } from '../../lib/ndcFromViewportCoordinates';

extend({ InstancedMesh2 });

const instancedMeshTempColor = new Color();
const isFlatShaded = false;

const InstancedGridMeshFiber = memo(
    forwardRef<
        InstancedGridMesh,
        {
            renderer: WebGLRenderer;
            gridData: GridData;
            // menuItemPositions: number[];
            isSquare?: boolean;
            useFresnel?: boolean;
        }
    >(({ renderer, gridData, isSquare, useFresnel }, ref) => {
        const { overallWidth, overallHeight, instanceFlatTop, instanceWidth, instancePadding, gridCount, gridColumns, gridRows } = gridData;

        const themeIndex = useZustand((state) => state.values.themeIndex);
        const innerRef = useRef<InstancedGridMesh | null>(null);
        const documentIsReady = useIsDocumentReady();

        const geometry_Memo = useMemo(() => {
            if (isSquare) {
                return new PlaneGeometry(instanceWidth, instanceWidth);
            } else {
                const size = HexGrid.getSizeFromWidth(instanceWidth, instanceFlatTop);
                return new HexagonalPrismGeometry(size, instanceWidth, instanceFlatTop).rotateX(MathUtils.degToRad(90)).center();
            }
        }, [isSquare, instanceWidth, instanceFlatTop]);

        const material_Memo = useMemo(() => {
            const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

            const shaderUniforms = UniformsUtils.merge([
                ShaderLib.phong.uniforms,
                {
                    u_Length: { value: instanceWidth },
                    u_FresnelColor: { value: instancedMeshTempColor.setHex(currentActivePrimary) },
                    u_HighLightColor: {
                        value: instancedMeshTempColor.clone().setHex(currentActiveSecondary),
                    },
                },
            ]) as GridShaderMaterial['uniforms'];

            shaderUniforms.diffuse.value.setHex(currentBackground);
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
                // transparent: true,
                // side: DoubleSide,
                // transparent: shaderUniforms.opacity.value >= 1 ? false : true,
            });

            return shaderMaterial as GridShaderMaterial;
        }, [instanceWidth, useFresnel]);

        const meshRef_Cb = useCallback(
            (mesh: InstancedMesh2 | null) => {
                if (mesh) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Creating Instances ${gridCount} (cols:${gridColumns} rows:${gridRows})`);
                    // const indicesUnderMenuItems = menuItemPositions.map((menuItemIndex) => GridAnimations.getRingShape(menuItemIndex, 3, [gridColumns, gridRows]));
                    // const merged = GridAnimations.mergeIndicesDistanceLevels(...indicesUnderMenuItems);
                    // const filtered = GridAnimations.filterIndices(merged, true).flat();

                    const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);

                    if (mesh.instancesCount) mesh.clearInstances();

                    mesh.addInstances(gridCount, (instance) => {
                        if (isSquare) {
                            SquareGrid.setInstancePosition(instance, instance.id, gridColumns, [extentX, extentY], instanceWidth, instancePadding);
                        } else {
                            HexGrid.setInstancePosition(
                                instance,
                                instance.id,
                                gridColumns,
                                [extentX, extentY],
                                instanceWidth,
                                instancePadding,
                                instanceFlatTop,
                            );
                        }

                        Grid.setInstanceColor(instance, instancedMeshTempColor);

                        // if (filtered.includes(instance.id)) {
                        //     instance.position.setZ(-10);
                        //     // instance.color.setHex(0x666666);
                        // }
                    });

                    mesh.initUniformsPerInstance({ vertex: { u_Hit_Offset: 'vec4', u_Hit_Time: 'float', u_Anim_Progress: 'float' } });
                    mesh.sortObjects = true;
                    mesh.customSort = createRadixSort(mesh);

                    innerRef.current = mesh as InstancedGridMesh;
                    if (ref) (ref as MutableRefObject<InstancedGridMesh>).current = innerRef.current;
                }
            },
            [ref, overallWidth, overallHeight, instanceWidth, instancePadding, gridCount, gridColumns, isSquare, instanceFlatTop],
        );

        useLayoutEffect(() => {
            if (documentIsReady && innerRef.current) {
                const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

                innerRef.current.material.uniforms.diffuse.value.setHex(currentBackground);
                innerRef.current.material.uniforms.u_FresnelColor.value.setHex(currentActivePrimary);
                innerRef.current.material.uniforms.u_HighLightColor.value.setHex(currentActiveSecondary);
            }
        }, [themeIndex, documentIsReady]);

        return <instancedMesh2 ref={meshRef_Cb} args={[geometry_Memo, material_Memo, { renderer, createEntities: true }]} />;
    }),
);

export default InstancedGridMeshFiber;

export const getColorsFromTheme = () => {
    const currentBackground = getCssProperties(document.documentElement, '--theme-bg-base');
    const currentActivePrimary = getCssProperties(document.documentElement, '--theme-primary-400');
    const currentActiveSecondary = getCssProperties(document.documentElement, '--theme-secondary-400');

    return [
        currentBackground ? stringToHexadecimal(currentBackground) : 0x0000ff,
        currentActivePrimary ? stringToHexadecimal(currentActivePrimary) : 0xff0000,
        currentActiveSecondary ? stringToHexadecimal(currentActiveSecondary) : 0x00ff00,
    ] as [number, number, number];
};

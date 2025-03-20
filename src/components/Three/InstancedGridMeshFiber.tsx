import { forwardRef, MutableRefObject, useCallback, useLayoutEffect, useMemo, memo, useRef, useEffect } from 'react';
import { extend } from '@react-three/fiber';
import { createRadixSort, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData, GridShaderMaterial, InstancedGridMesh } from '../../types/types';
import { useIsDocumentReady } from '../../hooks/useIsDocumentReady';
import { useZustand } from '../../lib/zustand';
import { getCssProperties } from '../../lib/cssProperties';
import { stringToHexadecimal } from '../../lib/THREE_colorConversions';
import { Color, MathUtils, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { Grid, HexGrid, SquareGrid } from '../../lib/classes/Grid';
import vertexShader from '../../lib/shading/instancedShader_V.glsl';
import fragmentShader from '../../lib/shading/instancedShader_F.glsl';
import { getExtentsFromOrigin } from '../../lib/THREE_coordinateConversions';
import { animationSettings } from '../../config/threeSettings';
import { useSelect } from '@react-three/drei';
import useForwardedRef from '../../hooks/useForwardedRef';

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
        const { gridWidth, gridHeight, instanceFlatTop, instanceWidth, instancePadding, gridInstanceCount, gridColumnCount, gridRowCount } = gridData;

        const themeIndex = useZustand((state) => state.values.themeIndex);
        const documentIsReady = useIsDocumentReady();

        const geometry_Memo = useMemo(() => {
            if (isSquare) {
                return new PlaneGeometry(instanceWidth, instanceWidth);
            } else {
                const size = HexGrid.getSizeFromWidth(instanceWidth, instanceFlatTop);
                const hexGeo = new HexagonalPrismGeometry(size, instanceWidth * 1.5, instanceFlatTop).rotateX(MathUtils.degToRad(90));
                return hexGeo;
            }
        }, [isSquare, instanceWidth, instanceFlatTop]);

        const material_Memo = useMemo(() => {
            const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

            const shaderUniforms = UniformsUtils.merge([
                ShaderLib.phong.uniforms,
                {
                    u_Time_S: { value: 0 },
                    u_Animation_Length_S: { value: animationSettings.intro.length_S },
                    u_Instance_Width: { value: instanceWidth },
                    u_Fresnel_Color: { value: instancedMeshTempColor.setHex(currentActivePrimary) },
                    u_HighLight_Color: {
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
                    if (mesh.instancesCount) {
                        mesh.clearInstances();
                    }

                    console.log(
                        '%c[instancedMesh2]',
                        'color: #b85533',
                        `Creating ${gridInstanceCount} Instances (cols:${gridColumnCount} rows:${gridRowCount}), w:${gridWidth} h:${gridHeight}`,
                    );

                    const [extentX, extentY] = getExtentsFromOrigin(gridWidth, gridHeight);

                    mesh.addInstances(gridInstanceCount, (instance) => {
                        if (isSquare) {
                            SquareGrid.setInstancePosition(instance, instance.id, gridColumnCount, [extentX, extentY], instanceWidth, instancePadding);
                        } else {
                            HexGrid.setInstancePosition(
                                instance,
                                instance.id,
                                gridColumnCount,
                                [extentX, extentY],
                                instanceWidth,
                                instancePadding,
                                instanceFlatTop,
                            );
                        }

                        Grid.setInstanceColor(instance, instancedMeshTempColor);
                    });

                    mesh.initUniformsPerInstance({ vertex: { u_Offset: 'vec3', u_Hit_Time_S: 'float' } });
                    mesh.sortObjects = true;
                    mesh.customSort = createRadixSort(mesh);
                }
            },
            [ref, gridWidth, gridHeight, instanceWidth, instancePadding, gridInstanceCount, gridColumnCount, isSquare, instanceFlatTop],
        );

        const innerRef = useForwardedRef(ref, meshRef_Cb);

        useLayoutEffect(() => {
            if (documentIsReady && innerRef.current) {
                const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

                innerRef.current.material.uniforms.diffuse.value.setHex(currentBackground);
                innerRef.current.material.uniforms.u_Fresnel_Color.value.setHex(currentActivePrimary);
                innerRef.current.material.uniforms.u_HighLight_Color.value.setHex(currentActiveSecondary);
            }
        }, [themeIndex, documentIsReady]);

        const selected = useSelect();
        useEffect(() => {
            console.log('%c[InstancedGridMeshFiber]', 'color: #321dd7', `selected :`, selected);
        }, [selected]);

        return <instancedMesh2 ref={innerRef} args={[geometry_Memo, material_Memo, { renderer, createEntities: true }]} />;
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

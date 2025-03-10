import { forwardRef, useLayoutEffect } from 'react';
import { extend } from '@react-three/fiber';
import { InstancedMesh2, InstancedMesh2Params } from '@three.ez/instanced-mesh';
import { InstancedGridMesh } from '../../types/types';
import { useIsDocumentReady } from '../../hooks/useIsDocumentReady';
import { useZustand } from '../../lib/zustand';
import { getCssProperties } from '../../lib/cssProperties';
import { stringToHexadecimal } from '../../lib/convertColors';

extend({ InstancedMesh2 });

const InstancedGridMeshFiber = forwardRef<
    InstancedGridMesh,
    {
        geometry: InstancedGridMesh['geometry'];
        material: InstancedGridMesh['material'];
        params?: InstancedMesh2Params;
    }
>(({ geometry, material, params }, ref) => {
    const themeIndex = useZustand((state) => state.values.themeIndex);
    const documentIsReady = useIsDocumentReady();

    useLayoutEffect(() => {
        if (documentIsReady) {
            const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

            material.uniforms.diffuse.value.setHex(currentBackground);
            material.uniforms.u_FresnelColor.value.setHex(currentActivePrimary);
            material.uniforms.u_HighLightColor.value.setHex(currentActiveSecondary);
        }
    }, [themeIndex, documentIsReady]);

    return (
        <>
            memo(
            <instancedMesh2 ref={ref} args={[geometry, material, params]} />)
        </>
    );
});

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

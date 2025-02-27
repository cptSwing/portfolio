import { Color, Vector4 } from 'three';
import { GridData, InstancedMesh2ShaderMaterial, PatternSettingsAnimation } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { MutableRefObject } from 'react';

const oldOffsetVector4 = new Vector4();
const newOffsetVector4 = new Vector4();

const oldColor = new Color();
const newColor = new Color();

const testZOffsetValue = 0.25;
const pushUpOffsetVector4 = new Vector4(0, 0, testZOffsetValue, 1);

export const setShaderAnimation = (
    mesh: InstancedMesh2ShaderMaterial,
    gridData: GridData,
    time_S: number,
    intersectionHits_Ref: MutableRefObject<number[] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
    pattern: PatternSettingsAnimation['pattern'] = 'sin-columns',
) => {
    const animationLength_S = mesh.material.uniforms.u_Anim_Length_S.value;

    mesh.updateInstances((instance, idx) => {
        const { overallHeight, gridCount, gridCountHorizontal, instanceLength } = gridData;
        const [column, row] = HexagonGeometry.getColumnAndRowByIndex(idx, gridCountHorizontal);

        const oldTime_S = instance.getUniform('u_Hit_Time') as number;
        const hasExpired = time_S - oldTime_S > animationLength_S;
        const animLengthDivided = animationLength_S / 50;

        mesh.getColorAt(idx, oldColor);

        instance.getUniform('u_Hit_Offset', oldOffsetVector4);
        newOffsetVector4.copy(oldOffsetVector4);

        // Intro of sorts
        if (!hasRunOnce_Ref.current) {
            mesh.material.uniforms.u_Anim_Length_S.value = 2;

            if (hasExpired) {
                mesh.material.uniforms.u_Anim_Length_S.value = 15;
                hasRunOnce_Ref.current = true;
            } else if (idx < gridCount) {
                let sequentialRandomMultiplier = 1;

                if (column % 3 === 0) {
                    sequentialRandomMultiplier = 0.9;
                } else if (column % 5 === 0) {
                    sequentialRandomMultiplier = 0.8;
                } else if (column % 7 === 0) {
                    sequentialRandomMultiplier = 0.7;
                }

                newOffsetVector4.set(0, overallHeight, 0, sequentialRandomMultiplier);
                newOffsetVector4.setY(overallHeight);
            }
        } else {
            const oldStrength = oldOffsetVector4.w;

            let strength;

            if (intersectionHits_Ref.current?.includes(idx)) {
                const hitIndex = intersectionHits_Ref.current.indexOf(idx);

                newOffsetVector4.setZ(pushUpOffsetVector4.z);

                if (hitIndex < 0) {
                    throw new Error('instance id not found in intersects');
                } else if (hitIndex === 0) {
                    strength = 1;
                    newColor.setRGB(1, 1, 1);
                } else {
                    if (hitIndex < 7) {
                        strength = Math.max(oldStrength - animLengthDivided, 0.5);
                        newColor.setRGB(0.75, 0.75, 0.75);
                    } else {
                        strength = Math.max(oldStrength - animLengthDivided, 0.25);
                        newColor.setRGB(0.5, 0.5, 0.5);
                    }

                    // newColor.lerp(oldColor, 1 - Math.min(oldStrength - animLengthDivided, 1));
                }

                instance.setUniform('u_Hit_Time', time_S); // set last
            } else {
                newOffsetVector4.setX(0);
                newOffsetVector4.setY(0);
                newOffsetVector4.setZ(0);

                if (hasExpired) {
                    strength = 0;
                } else {
                    strength = 1;
                }

                switch (pattern) {
                    case 'sin-columns':
                        let sinValCol = Math.sin(oldOffsetVector4.z + (time_S + column * testZOffsetValue));
                        sinValCol = remapToRange(sinValCol, -1, 1, -testZOffsetValue, testZOffsetValue);

                        newOffsetVector4.setZ(sinValCol);

                        break;

                    case 'sin-rows':
                        let sinValRow = Math.sin(oldOffsetVector4.z + (time_S + row / 5));
                        sinValRow = remapToRange(sinValRow, -1, 1, -testZOffsetValue, testZOffsetValue);

                        newOffsetVector4.setZ(sinValRow);

                        break;

                    case 'sin':
                        let sinVal = Math.sin(oldOffsetVector4.z + (row - column) * 0.25 + time_S * 2);
                        sinVal = remapToRange(sinVal, -1, 1, -testZOffsetValue, testZOffsetValue);

                        strength = 0.333;
                        strength = Math.max(oldStrength - animLengthDivided, strength);
                        newOffsetVector4.setZ(sinVal);

                        newColor.setRGB(0, 0, 0);
                        newColor.lerp(oldColor, 1 - Math.min(oldStrength - animLengthDivided, 1));
                        break;

                    // 'none'
                    default:
                }

                instance.setUniform('u_Hit_Time', time_S); // set last
            }

            mesh.setColorAt(idx, newColor);
            // mesh.colorsTexture.needsUpdate = true;
            newOffsetVector4.setW(strength);
        }

        instance.setUniform('u_Hit_Offset', newOffsetVector4);
    });
};

export const meshAnimations: Record<string, Pick<PatternSettingsAnimation, 'pattern' | 'timeAlpha' | 'endDelay_S'>> = {
    sinWave: {
        pattern: 'sin-columns',
        timeAlpha: 0.1,
    },
    sinDisjointed: {
        pattern: 'sin-rows',
        timeAlpha: 0.2,
    },
    none: {
        pattern: 'none',
        timeAlpha: 0.1,
    },
};

const returnSinValue = (instanceCount: number) => -0.0008 * instanceCount + 2.1;

const remapToRange = (value: number, low1: number, high1: number, low2: number, high2: number) => low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);

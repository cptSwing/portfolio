import { Color, MathUtils, Vector4 } from 'three';
import { GridData, InstancedMesh2ShaderMaterial, PatternSettingsAnimation } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { MutableRefObject } from 'react';

const oldOffsetVector4 = new Vector4();
const newOffsetVector4 = new Vector4();

const newColor = new Color();

const testZOffsetValue = 0.25;
const pushUpOffsetVector4 = new Vector4(0, 0, testZOffsetValue, 1);

let animationLength_S = 3;

export const setShaderAnimation = (
    mesh: InstancedMesh2ShaderMaterial,
    gridData: GridData,
    time_S: number,
    intersectionHits_Ref: MutableRefObject<number[] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
    pattern: PatternSettingsAnimation['pattern'] = 'sin-columns',
) => {
    mesh.updateInstances((instance, idx) => {
        const { overallHeight, gridCount, gridCountHorizontal, instanceLength } = gridData;
        const [column, row] = HexagonGeometry.getColumnAndRowByIndex(idx, gridCountHorizontal);

        instance.getUniform('u_Hit_Offset', oldOffsetVector4);
        const oldTime_S = instance.getUniform('u_Hit_Time') as number;
        const animationProgress = MathUtils.clamp((time_S - oldTime_S) / animationLength_S, 0, 1);

        // Intro of sorts
        if (!hasRunOnce_Ref.current) {
            if (animationProgress >= 1) {
                animationLength_S = 3;
                newOffsetVector4.set(0, 0, 0, 1);
                hasRunOnce_Ref.current = true;
            } else {
                let sequentialRandomMultiplier = 1;

                if (column % 3 === 0) {
                    sequentialRandomMultiplier = 0.9;
                } else if (column % 5 === 0) {
                    sequentialRandomMultiplier = 0.8;
                } else if (column % 7 === 0) {
                    sequentialRandomMultiplier = 0.7;
                }

                newOffsetVector4.set(0, 0, 0, 0);

                oldOffsetVector4.setY(overallHeight);
                newOffsetVector4.lerpVectors(oldOffsetVector4, newOffsetVector4, animationProgress);
                newOffsetVector4.setW(sequentialRandomMultiplier);
            }
        } else {
            let strength;

            if (intersectionHits_Ref.current?.includes(idx)) {
                const hitIndex = intersectionHits_Ref.current.indexOf(idx);

                if (hitIndex < 0) {
                    throw new Error('instance id not found in intersects');
                } else if (hitIndex === 0) {
                    strength = 1;
                    newColor.setRGB(1, 1, 1);
                } else {
                    if (hitIndex < 7) {
                        strength = 0.666;
                        newColor.setRGB(0.666, 0.666, 0.666);
                    } else {
                        strength = 0.333;
                        newColor.setRGB(0.333, 0.333, 0.333);
                    }
                }

                mesh.setColorAt(idx, newColor);
                newOffsetVector4.setZ(pushUpOffsetVector4.z);
                newOffsetVector4.setW(strength);
                instance.setUniform('u_Hit_Time', time_S); // set last
            } else {
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
                        sinVal = remapToRange(sinVal, -1, 1, -testZOffsetValue / 5, testZOffsetValue / 5);

                        newOffsetVector4.setZ(sinVal);
                        newOffsetVector4.setW(1);
                        newOffsetVector4.lerpVectors(oldOffsetVector4, newOffsetVector4, animationProgress);
                        break;

                    // 'none'
                    default:
                }
            }
        }

        instance.setUniform('u_Anim_Progress', animationProgress);
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

const _returnSinValue = (instanceCount: number) => -0.0008 * instanceCount + 2.1;

const remapToRange = (value: number, low1: number, high1: number, low2: number, high2: number) => low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);

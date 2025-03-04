import { Color, MathUtils, Vector4 } from 'three';
import { GridData, InstancedMesh2ShaderMaterial, PatternSettingsAnimation } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { MutableRefObject } from 'react';
import { getAdjacentIndices } from './instancedMesh2';

// .w holds offset strength
const prevOffset = new Vector4();
const newOffset = new Vector4();

const newColor = new Color();

const timeScale = 0.75;
const introTargetOffsets = new Vector4(0, 0, 0, 1);

let animationLength_S = 3;

export const setShaderAnimation = (
    mesh: InstancedMesh2ShaderMaterial,
    gridData: GridData,
    time_S: number,
    intersectionHits_Ref: MutableRefObject<number[] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
    pattern: PatternSettingsAnimation['pattern'] = 'sin-columns',
) => {
    const { overallHeight, gridCount, gridColumns, gridRows, instanceFlatTop, instanceWidth } = gridData;

    // TODO write more comprehensive animation system --> background patterns (such as sin-wave etc), overlaid/overwritten by actions such as mousevent, raindrop, shake etc etc
    if (pattern === 'raindrops') {
        if (Math.ceil(time_S) % 2 === 0) {
            const randomDropIndex = Math.ceil(remapToRange(Math.random(), 0, 1, 0, gridCount - 1));
            intersectionHits_Ref.current = [randomDropIndex, ...getAdjacentIndices(randomDropIndex, gridColumns, gridRows, 2, instanceFlatTop)];
        }
    }

    mesh.updateInstances((instance, idx) => {
        const [column, row] = HexagonGeometry.getColumnAndRowByIndex(idx, gridColumns);

        instance.getUniform('u_Hit_Offset', prevOffset);

        const oldTime_S = instance.getUniform('u_Hit_Time') as number;
        const animationProgress = getAnimationProgress(animationLength_S, oldTime_S, time_S);

        // Intro of sorts
        if (!hasRunOnce_Ref.current) {
            newOffset.copy(introTargetOffsets);

            if (animationProgress >= 1) {
                animationLength_S = 3;
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

                prevOffset.setY(overallHeight);
                newOffset.lerpVectors(prevOffset, newOffset, animationProgress);
                newOffset.setW(sequentialRandomMultiplier);
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

                // animationProgress is always 0 since u_Hit_Time is set each frame - so we set values to prevOffset
                prevOffset.setZ(instanceWidth);
                prevOffset.setW(strength);
                instance.setUniform('u_Hit_Time', time_S); // set last
            } else {
                switch (pattern) {
                    case 'sin-columns':
                        let sinValCol = Math.sin(prevOffset.z + (time_S + (column * instanceWidth) / 2));
                        sinValCol = remapToRange(sinValCol, -1, 1, -instanceWidth / 2, instanceWidth / 2);

                        newOffset.setZ(sinValCol);

                        break;

                    case 'sin-rows':
                        let sinValRow = Math.sin(prevOffset.z + (time_S + row / 5));
                        sinValRow = remapToRange(sinValRow, -1, 1, -instanceWidth / 2, instanceWidth / 2);

                        newOffset.setZ(sinValRow);

                        break;

                    case 'sin':
                        let sinVal = Math.sin(time_S * timeScale + (row - column) * 0.25);
                        sinVal = remapToRange(sinVal, -1, 1, -instanceWidth / 2, instanceWidth / 2);

                        newOffset.setZ(sinVal);
                        newOffset.setW(animationProgress);
                        newOffset.lerpVectors(prevOffset, newOffset, animationProgress);
                        break;

                    // case 'raindrops':
                    //     break;

                    // 'none'
                    default:
                        newOffset.copy(introTargetOffsets);
                        break;
                }
            }
        }

        newOffset.lerpVectors(prevOffset, newOffset, animationProgress);
        instance.setUniform('u_Hit_Offset', newOffset);
        instance.setUniform('u_Anim_Progress', animationProgress);
    });
};

const getAnimationProgress = (length: number, startTime: number, currentTime: number) => MathUtils.clamp((currentTime - startTime) / length, 0, 1);

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

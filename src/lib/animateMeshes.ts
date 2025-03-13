import { Color, MathUtils, Vector3 } from 'three';
import { GridData, HexMenuMesh, InstancedGridMesh, PatternSettingsAnimation } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { remapRange } from './remapRange';

// .w holds information on wether offset is a Hit's offset (1 or 0)
const defaultOffset = new Vector3(0, 0, 0);
const newOffset = defaultOffset.clone();
const newColor = new Color();

export const introAnimationLength_S = 0.5;
const standardAnimationLength = 1.5;

let maxBackgroundMovement = 0;

export const setIntroGridAnimation = (mesh: InstancedGridMesh, gridData: GridData, time_S: number) => {
    const { overallHeight, gridColumns, instanceWidth } = gridData;
    let hasRunOnce = false;
    newOffset.copy(defaultOffset);

    mesh.updateInstances((instance) => {
        const [column] = HexagonGeometry.getColumnAndRowByIndex(instance.id, gridColumns);
        const animationProgress = getAnimationProgress(introAnimationLength_S, 0, time_S);

        if (animationProgress >= 1) {
            maxBackgroundMovement = instanceWidth / 2;
            mesh.material.uniforms.u_Animation_Length_S.value = standardAnimationLength;
            hasRunOnce = true;
        } else {
            let sequentialRandomMultiplier = 1;

            if (column % 3 === 0) {
                sequentialRandomMultiplier = 0.9;
            } else if (column % 5 === 0) {
                sequentialRandomMultiplier = 0.8;
            } else if (column % 7 === 0) {
                sequentialRandomMultiplier = 0.7;
            }

            newOffset.setY(overallHeight * sequentialRandomMultiplier);
            instance.setUniform('u_Offset', newOffset);
        }
    });

    return hasRunOnce;
};

const tempHighlightColor = new Color(0.5, 0.75, 0.25);
const minimumAtFarthestDistance = 0.2;
export const setSpecificGridAnimation = (mesh: InstancedGridMesh, gridData: GridData, time_S: number, gridHits: number[][]) => {
    const { instanceWidth } = gridData;

    // const highLightColor = mesh.material.uniforms.u_HighLight_Color.value;
    const highLightColor = tempHighlightColor;

    newOffset.copy(defaultOffset);

    gridHits.forEach((hits, idx) => {
        const relativeDistance = idx;

        hits.forEach((instanceId) => {
            const instance = mesh.instances[instanceId];

            const fractionAtDistance = (gridHits.length - relativeDistance) / gridHits.length;
            const clampedFraction = Math.max(fractionAtDistance, minimumAtFarthestDistance);

            newColor.copy(highLightColor).multiplyScalar(clampedFraction);
            mesh.setColorAt(instanceId, newColor);

            newOffset.setZ(instanceWidth * clampedFraction);

            instance.setUniform('u_Offset', newOffset);
            instance.setUniform('u_Hit_Time_S', time_S); // set last
        });
    });
};

const timeScale = 0.75;

export const setAmbientGridAnimation = (mesh: InstancedGridMesh, gridData: GridData, time_S: number, pattern: PatternSettingsAnimation['pattern'] = 'sin') => {
    const { gridColumns } = gridData;
    newOffset.copy(defaultOffset);

    // TODO write more comprehensive animation system --> background patterns (such as sin-wave etc), overlaid/overwritten by actions such as mousevent, raindrop, shake etc etc
    // if (pattern === 'raindrops') {
    //     if (Math.ceil(time_S) % 2 === 0) {
    //         const randomDropIndex = Math.ceil(remapToRange(Math.random(), 0, 1, 0, gridCount - 1));
    //         gridHits = [randomDropIndex, ...HexGrid.getAdjacentIndices(randomDropIndex, gridColumns, gridRows, 2, instanceFlatTop)];
    //     }
    // }

    mesh.updateInstances((instance) => {
        const [column, row] = HexagonGeometry.getColumnAndRowByIndex(instance.id, gridColumns);

        switch (pattern) {
            case 'sin':
                let sinVal = Math.sin(time_S * timeScale + (row - column) * 0.25);
                sinVal = remapRange(sinVal, -1, 1, -maxBackgroundMovement, maxBackgroundMovement);

                newOffset.setZ(sinVal);
                break;

            // 'none'
            default:
                break;
        }

        instance.setUniform('u_Offset', newOffset);
    });
};

export const setMenuAnimation = (hexMeshes: HexMenuMesh[], hexMeshHit: HexMenuMesh) => {
    hexMeshes.forEach((mesh) => {
        if (mesh === hexMeshHit) {
            mesh.position.setZ(2);
        } else if (mesh.position.z !== 0) {
            mesh.position.setZ(0);
        }
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

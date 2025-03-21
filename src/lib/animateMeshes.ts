import { Color, Group, MathUtils, Vector3 } from 'three';
import { GridData, HexMenuMesh, InstancedGridMesh, PatternSettingsAnimation } from '../types/types';
import { remapRange } from './remapRange';
import { animationSettings } from '../config/threeSettings';
import { Grid } from './classes/Grid';

const defaultOffset = new Vector3(0, 0, -0.1);
const oldOffset = defaultOffset.clone();
const newOffset = defaultOffset.clone();
const newColor = new Color();

let maxBackgroundMovement = 0;

export const setIntroGridAnimation = (mesh: InstancedGridMesh, gridData: GridData, time_S: number) => {
    const { gridHeight, gridColumnCount, instanceWidth } = gridData;
    let hasRunOnce = false;
    // newOffset.copy(defaultOffset);

    mesh.updateInstances((instance) => {
        // if (excludedIndices.includes(instance.id)) {
        //     return;
        // }

        const [column] = Grid.getOffsetCoordFromIndex(instance.id, gridColumnCount);
        const animationProgress = getAnimationProgress(animationSettings.intro.length_S, 0, time_S);

        if (animationProgress >= 1) {
            maxBackgroundMovement = instanceWidth / 2;
            mesh.material.uniforms.u_Animation_Length_S.value = animationSettings.ambient.length_S;
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

            oldOffset.setY(gridHeight * sequentialRandomMultiplier);
            newOffset.lerpVectors(oldOffset, defaultOffset, animationProgress);

            instance.setUniform('u_New_Offset', newOffset);
        }
    });

    return hasRunOnce;
};

export const setAmbientGridAnimation = (
    mesh: InstancedGridMesh,
    gridData: GridData,
    time_S: number,
    excludedIndices: number[],
    pattern: PatternSettingsAnimation['pattern'] = 'sin',
) => {
    // TODO write more comprehensive animation system --> background patterns (such as sin-wave etc), overlaid/overwritten by actions such as mousevent, raindrop, shake etc etc
    // if (pattern === 'raindrops') {
    //     if (Math.ceil(time_S) % 2 === 0) {
    //         const randomDropIndex = Math.ceil(remapToRange(Math.random(), 0, 1, 0, gridCount - 1));
    //         gridHits = [randomDropIndex, ...HexGrid.getAdjacentIndices(randomDropIndex, gridColumnCount, gridRows, 2, instanceFlatTop)];
    //     }
    // }

    const { gridColumnCount } = gridData;
    newOffset.copy(defaultOffset);

    mesh.updateInstances((instance) => {
        // if (excludedIndices.includes(instance.id)) {
        //     return;
        // }

        const [column, row] = Grid.getOffsetCoordFromIndex(instance.id, gridColumnCount);

        switch (pattern) {
            case 'sin':
                let sinVal = Math.sin(time_S * animationSettings.ambient.timeScale + (row - column) * 0.25);
                sinVal = remapRange(sinVal, -1, 1, -maxBackgroundMovement, maxBackgroundMovement);

                newOffset.setZ(sinVal);
                break;

            // 'none'
            default:
                break;
        }

        instance.setUniform('u_New_Offset', newOffset);
    });
};

const tempHighlightColor = new Color(0.5, 0.75, 0.25);
const minimumAtFarthestDistance = 0.2;
export const setBackgroundMouseHitsAnimation = (
    mesh: InstancedGridMesh,
    gridData: GridData,
    time_S: number,
    gridHits: number[][],
    excludedIndices: number[],
) => {
    const { instanceWidth } = gridData;

    // const highLightColor = mesh.material.uniforms.u_HighLight_Color.value;
    const highLightColor = tempHighlightColor;

    newOffset.copy(defaultOffset);

    gridHits.forEach((hits, idx, arr) => {
        const relativeDistance = idx;
        const fractionAtDistance = (arr.length - relativeDistance) / arr.length;

        hits.forEach((instanceId) => {
            // if (excludedIndices.includes(instanceId)) {
            //     return;
            // }

            const instance = mesh.instances[instanceId];

            const clampedFraction = Math.max(fractionAtDistance, minimumAtFarthestDistance);

            newColor.copy(highLightColor).multiplyScalar(clampedFraction);
            mesh.setColorAt(instanceId, newColor);

            newOffset.setZ(instanceWidth * 4 * clampedFraction);
            instance.setUniform('u_New_Offset', newOffset);

            instance.setUniform('u_Hit_Time_S', time_S); // set last
        });
    });
};

export const setMenuMouseHitsAnimation = (menuItems: Group[], wasHit: Group, gridData: GridData) => {
    menuItems.forEach((item) => {
        if (item === wasHit) {
            item.position.setZ(animationSettings.menu.menuItemOffsetZMultiplier * gridData.instanceWidth);
        } else if (item.position.z !== 0) {
            item.position.setZ(0);
        }
    });
};

const menuItemColor = new Color(0.75, 0.75, -0.75);
let menuIntroHasRun = false;

export const setMenuAnimation = (mesh: InstancedGridMesh, gridData: GridData, time_S: number, gridIds: number[][][]) => {
    const { instanceWidth } = gridData;

    // const highLightColor = mesh.material.uniforms.u_HighLight_Color.value;
    const highLightColor = menuItemColor;

    if (!menuIntroHasRun) {
        // Play after intro
        if (time_S > animationSettings.intro.length_S) {
            const animationProgress = getAnimationProgress(animationSettings.intro.length_S, animationSettings.intro.length_S, time_S);

            newColor.copy(highLightColor).multiplyScalar(animationProgress);

            gridIds.forEach((menuItemShape, idx) => {
                const timeDelay = idx / 10;

                menuItemShape.forEach((hitDistances, idx, arr) => {
                    // newColor.multiplyScalar( clampedFraction );

                    hitDistances.forEach((instanceId) => {
                        const instance = mesh.instances[instanceId];

                        mesh.setColorAt(instanceId, newColor);

                        newOffset.setZ(instanceWidth * 2);
                        instance.setUniform('u_New_Offset', newOffset);

                        // instance.setUniform('u_Hit_Time_S', time_S);
                    });
                });
            });

            if (animationProgress >= 1) {
                menuIntroHasRun = true;
            }
        }
    } else {
        gridIds.forEach((menuItemShape) => {
            menuItemShape.forEach((hitDistances, idx, arr) => {
                const relativeDistance = idx;
                const fractionAtDistance = (arr.length - relativeDistance) / arr.length;
                const clampedFraction = Math.max(fractionAtDistance, minimumAtFarthestDistance);

                newColor.copy(highLightColor);
                // newColor.multiplyScalar( clampedFraction );

                hitDistances.forEach((instanceId) => {
                    const instance = mesh.instances[instanceId];

                    mesh.setColorAt(instanceId, newColor);

                    newOffset.setZ(instanceWidth * 2);
                    instance.setUniform('u_New_Offset', newOffset);

                    // instance.setUniform('u_Hit_Time_S', time_S);
                });
            });
        });
    }
};

export const getAnimationProgress = (length: number, startTime: number, currentTime: number) => MathUtils.clamp((currentTime - startTime) / length, 0, 1);

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

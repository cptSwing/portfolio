import { Color, MathUtils, Quaternion, Vector3 } from 'three';
import { PatternSettingsAnimation, PatternSettingsColor } from '../types/types';
import { getColumnAndRowByIndex, originalPositions } from './getInstancedMesh2';

const tempInstancePos = new Vector3();
const tempInstanceQuaternion = new Quaternion();
const tumbleThreshold = 0.05;
let stopTime = 0;
export const setAnimationPattern = ({ instance, index, time_Ms, timeAlpha = 0.1, pattern = 'none', endDelay_S = 0, gridData }: PatternSettingsAnimation) => {
    const { gridCountHorizontal, gridCountVertical, instanceLength } = gridData;
    const overallCount = gridCountHorizontal * gridCountVertical;

    const [column, row] = getColumnAndRowByIndex(index, gridData);
    const sinMultiplier = returnSinValue(overallCount);
    const time_S = time_Ms / 1000;

    const instanceOriginalPosition = originalPositions[index];
    tempInstancePos.set(instanceOriginalPosition.x, instanceOriginalPosition.y, instanceOriginalPosition.z);

    let timing = timeAlpha;
    let forwardAnimationRunning = 0;

    switch (pattern) {
        case 'tumble':
            tempInstancePos.set(instanceOriginalPosition.x, instanceOriginalPosition.y, instanceOriginalPosition.z);
            forwardAnimationRunning = 1;

            if (instance.position.y >= instanceOriginalPosition.y + tumbleThreshold) {
                stopTime = 0;
                let sequentialRandomMultiplier = 1;

                if (column % 3 === 0) {
                    sequentialRandomMultiplier = 0.9;
                } else if (column % 5 === 0) {
                    sequentialRandomMultiplier = 0.8;
                } else if (column % 7 === 0) {
                    sequentialRandomMultiplier = 0.7;
                }

                sequentialRandomMultiplier -= Math.abs(column / (gridCountHorizontal * 2));
                timing = timeAlpha * sequentialRandomMultiplier;
            } else {
                if (!stopTime) {
                    stopTime = time_S;
                } else if (time_S >= stopTime + endDelay_S) {
                    instance.updateMatrixPosition();
                    forwardAnimationRunning = 0;
                }
            }
            break;

        case 'sin-wave':
            tempInstancePos.copy(instance.position);
            tempInstancePos.setZ(
                Math.sin(time_S + tempInstancePos.z * sinMultiplier) * Math.sin(time_S + (index + index / 2) * sinMultiplier) * (instanceLength / 3),
            );
            break;

        case 'sin-disjointed':
            tempInstancePos.copy(instance.position);
            tempInstancePos.setZ(Math.sin(time_S + tempInstancePos.z * 0.5) * Math.sin(time_S + (index + row) * 0.5) * (instanceLength / 3));
            break;

        // 'none'
        default:
            tempInstancePos.set(instanceOriginalPosition.x, instanceOriginalPosition.y, instanceOriginalPosition.z);
            break;
    }

    // Using lerp to not instantly cancel other, possibly user-set, transforms on instance.position:
    instance.position.lerp(tempInstancePos, timing);

    return forwardAnimationRunning;
};

const tempInstanceCol = new Color();
export const setColorPattern = ({ instance, index, time_Ms, timeAlpha = 0.1, pattern = 'sin', gridData }: PatternSettingsColor) => {
    const { gridBaseColor } = gridData;

    if (!instance.color.equals(tempInstanceCol)) {
        tempInstanceCol.copy(instance.color);
        tempInstanceCol.lerp(gridBaseColor, timeAlpha);
        instance.owner.setColorAt(index, tempInstanceCol);
    }
};

export const meshAnimations: Record<string, Pick<PatternSettingsAnimation, 'pattern' | 'timeAlpha' | 'endDelay_S'>> = {
    tumble: {
        pattern: 'tumble',
        timeAlpha: 0.2,
        endDelay_S: 0.2,
    },
    sinWave: {
        pattern: 'sin-wave',
        timeAlpha: 0.1,
    },
    sinDisjointed: {
        pattern: 'sin-disjointed',
        timeAlpha: 0.2,
    },
    none: {
        pattern: 'none',
        timeAlpha: 0.1,
    },
};

const returnSinValue = (instanceCount: number) => -0.0008 * instanceCount + 2.1;

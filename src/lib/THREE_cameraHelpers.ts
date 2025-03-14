import { PerspectiveCamera } from 'three';

/** Calculate the width and height at a given Z depth from a Perspective Camera */
export const getWidthHeight = (depth: number, camera: PerspectiveCamera) => {
    const widthAtZ = visibleWidthAtZDepth(depth, camera);
    const heightAtZ = visibleHeightAtZDepth(depth, camera);
    return [widthAtZ, heightAtZ];
};

/** https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269 */
const visibleHeightAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = (camera.fov * Math.PI) / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

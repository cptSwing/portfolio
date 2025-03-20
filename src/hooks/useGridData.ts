import { useMemo } from 'react';
import { OrthographicCamera, Vector2 } from 'three';
import { SquareGrid, HexGrid } from '../lib/classes/Grid';
import { getWidthHeightAtDepth } from '../lib/THREE_cameraHelpers';
import { DefaultGridData, GridData } from '../types/types';
import { useThree } from '@react-three/fiber';
import { cameraSettings } from '../config/threeSettings';

type UseGridParams = { isSquare?: boolean };

const useGridData = (params?: UseGridParams) => {
    const { isSquare } = params ?? {};
    const camera = useThree((state) => state.camera);

    const gridData_Memo = useMemo<GridData>(() => {
        if ((camera.name = cameraSettings.defaultCameraName)) {
            const [width, height] = getWidthHeightAtDepth(0, camera);
            const [widthAdjusted, heightAdjusted] = adjustDimensionsForCameraAngle(width, height, camera as OrthographicCamera);

            if (isSquare) {
                return SquareGrid.getInstanceCount({ ...gridDataDefaults, gridWidth: widthAdjusted, gridHeight: heightAdjusted });
            } else {
                return HexGrid.getInstanceCount({ ...gridDataDefaults, gridWidth: widthAdjusted, gridHeight: heightAdjusted });
            }
        } else {
            return gridDataDefaults as unknown as GridData;
        }

        // 'Tumble' animation runs again once gridData is updated (likely a resize event / actual first run):
        // hasRunOnce_Ref.current = false;
    }, [camera, isSquare]);

    return gridData_Memo;
};

export default useGridData;

const gridDataDefaults: DefaultGridData = {
    gridWidth: 0,
    gridHeight: 0,
    instanceFlatTop: false,
    instanceWidth: null,
    instancePadding: 0,
    gridInstanceCount: 1000,
    gridColumnCount: 0,
    gridRowCount: 0,
};

/**
 * Adjusts precalculated screen-width dimensions (expressed in it's left, right, top, bottom values) for an orthographic's camera angle if it is not on X:0 or Y:0 while looking at origin. Will only work usefully if either X OR Y are non-zero.
 * @param width width of imagined plane at origin, spanning frustum at origin
 * @param height height of imagined plane at origin, spanning frustum at origin
 * @param camera a camera, looking at origin (orthographic, perspective will not work for now)
 * @returns new width and height values, taking offset position of camera into account.
 */
const adjustDimensionsForCameraAngle = (width: number, height: number, camera: OrthographicCamera) => {
    const tempVector2 = new Vector2();
    let newWidth = width;
    let newHeight = height;

    if (camera.position.x === 0 || camera.position.y === 0) {
        if (camera.position.x !== 0) {
            const distanceToOriginXZ = tempVector2.set(camera.position.x, camera.position.z).length();
            newWidth = 2 * getSimilarHypotenuse(width, camera.position.x, distanceToOriginXZ);
        } else if (camera.position.y !== 0) {
            const distanceToOriginYZ = tempVector2.set(camera.position.y, camera.position.z).length();
            newHeight = 2 * getSimilarHypotenuse(height, camera.position.y, distanceToOriginYZ);
        }
    } else {
        throw new Error('Both camera X and Y are non-zero!');
    }

    return [isNaN(newWidth) ? width : newWidth, isNaN(newHeight) ? height : newHeight] as [number, number];

    /**
     * Assuming an orthographic frustum, eg a rectangle extending from camera, use pythagoras to calculate new dimensions of (half)side when the plane at origin is viewed at an angle.
     * @param side current width or height of imagined plane at origin, facing Z+
     * @param cameraDistanceOnAxis camera position on either X (width), or Y (height)
     * @param cameraDistanceToOrigin camera distance to origin
     * @returns
     */
    function getSimilarHypotenuse(side: number, cameraDistanceOnAxis: number, cameraDistanceToOrigin: number) {
        /* this angle - camera to origin vector - is the same as the angle between imaginary side of the camera's rotated frustum, passing through origin. the angle then describes one tip of a straight-angle triangle, at origin */
        const angleB = Math.asin(cameraDistanceOnAxis / cameraDistanceToOrigin);

        /* half the frustum's length is one known side of the above straight-angle triangle */
        const legA = side / 2;
        /* the other side */
        const legB = legA * Math.tan(angleB);
        /* and length of the hypotenuse, which is half the width the origin plane should be if viewed at an angle */
        const hypo = Math.sqrt(legA * legA + legB * legB);

        return hypo;
    }
};

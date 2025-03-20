import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject, useState } from 'react';
import { useEvent } from 'react-use';
import { WebGLRenderer, Camera, Vector2, Raycaster, Intersection, Object3D, OrthographicCamera } from 'three';
import { setAmbientGridAnimation, setIntroGridAnimation, setMenuAnimation, setMenuHitsAnimation, setSpecificGridHitsAnimation } from '../../lib/animateMeshes';
import { SquareGrid, HexGrid } from '../../lib/classes/Grid';
import { GridAnimations } from '../../lib/classes/GridAnimations';
import { DefaultGridData, InstancedGridMesh, GridData, HexMenuMesh, CubeCoordinate } from '../../types/types';
import { ndcFromViewportCoordinates } from '../../lib/THREE_coordinateConversions';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import InstancedGridMeshFiber from './InstancedGridMeshFiber';
import HexMenuItem from './HexMenuItem';
import { getWidthHeightAtDepth } from '../../lib/THREE_cameraHelpers';
import { useArrayRef } from '../../hooks/useRefArray';
import { Select } from '@react-three/drei';
import { animationSettings } from '../../config/threeSettings';

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

const BackgroundGrid: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const [renderer, camera] = useThree((state) => [state.gl, state.camera]) as [WebGLRenderer, Camera];

    //
    // --> Various refs
    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const hasRunOnce_Ref = useRef(false);
    const gridMesh_Ref = useRef<InstancedGridMesh | null>(null);
    const intersectionHits_Ref = useRef<IntersectionResults | null>(null);

    //
    // --> Assemble the final GridData
    const gridData_Memo = useMemo<GridData>(() => {
        const [width, height] = getWidthHeightAtDepth(0, camera);
        const [widthAdjusted, heightAdjusted] = adjustDimensionsForCameraAngle(width, height, camera as OrthographicCamera);

        const gridData = isSquare
            ? SquareGrid.getInstanceCount({ ...gridDataDefaults, gridWidth: widthAdjusted, gridHeight: heightAdjusted })
            : HexGrid.getInstanceCount({ ...gridDataDefaults, gridWidth: widthAdjusted, gridHeight: heightAdjusted });

        // 'Tumble' animation runs again once gridData is updated (likely a resize event / actual first run):
        hasRunOnce_Ref.current = false;

        return gridData;
    }, [camera, isSquare]);

    //
    // --> Calculate Placement for Menu items
    const hexMenuItemMeshPositions_Memo = useMemo(() => {
        const { gridWidth, gridHeight, gridInstanceCount, gridColumnCount, gridRowCount, instanceWidth } = gridData_Memo;
        const firstIndex = getIndexAtPosition(0.35, 0.25, gridColumnCount, gridRowCount);

        const middleIndex = getIndexAtPosition(0.5, 0.5, gridColumnCount, gridRowCount);
        const middleCubeCoord = HexGrid.getCubeCoordFromInstanceIndex(middleIndex, gridColumnCount);
        const middleAxialCoord = HexGrid.coord_CubeToAxial(middleCubeCoord);
        const middlePixel = HexGrid.coord_AxialToPixel(middleAxialCoord, HexGrid.getSizeFromWidth(instanceWidth, false), [
            gridWidth * gridColumnCount,
            gridHeight * gridColumnCount,
        ]);

        const ndc = ndcFromViewportCoordinates(middlePixel[0], middlePixel[1], window.innerWidth, window.innerHeight);

        console.log(
            '%c[BackgroundGrid]',
            'color: #bde537',
            `middlePixel, ndc, window.innerWidth, window.innerHeight :`,
            middlePixel,
            ndc,
            window.innerWidth,
            window.innerHeight,
        );

        return getDiagonalMenuIndices(firstIndex, animationSettings.menu.menuItemDistanceSize, [gridColumnCount, gridRowCount]);
    }, [gridData_Memo]);

    //
    // --> Select Grid Instances around Menu Item centers
    const hexMenuGridPositions_Memo = useMemo(() => {
        const { gridColumnCount, gridRowCount } = gridData_Memo;

        const gridIds = hexMenuItemMeshPositions_Memo.map((instanceId) => {
            const shapeIds = GridAnimations.getHexagonShape(instanceId, animationSettings.menu.menuItemDistanceSize, [gridColumnCount, gridRowCount]);
            return GridAnimations.filterIndices(shapeIds);
        });

        return gridIds;
    }, [gridData_Memo, hexMenuItemMeshPositions_Memo]);

    const [hexRefs, hexRefCallback] = useArrayRef<HexMenuMesh>();

    //
    // --> Calculate hits only on mousemove instead of in useFrame()
    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            if (raycaster_Ref.current && gridMesh_Ref.current && hexRefs.current) {
                const mouseEvent = ev as MouseEvent;
                mouseEvent.preventDefault();

                // Sets to [-1, 1] values, 0 at center
                const [ndcX, ndcY] = ndcFromViewportCoordinates(mouseEvent.clientX, mouseEvent.clientY, window.innerWidth, window.innerHeight);
                mousePosition_Ref.current.setX(ndcX);
                mousePosition_Ref.current.setY(ndcY);

                raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);

                const allMeshes = [gridMesh_Ref.current, ...hexRefs.current];

                const intersection: Intersection<InstancedMesh2 | HexMenuMesh>[] = raycaster_Ref.current.intersectObjects(allMeshes, false);

                if (intersection.length) {
                    intersectionHits_Ref.current = getIntersectIndices(intersection, [gridData_Memo.gridColumnCount, gridData_Memo.gridRowCount]);
                    console.log(
                        '%c[BackgroundGrid]',
                        'color: #96fce1',
                        `clientX, clientY, ndcX, ndcY, intersection[0] :`,
                        mouseEvent.clientX,
                        mouseEvent.clientY,
                        ndcX,
                        ndcY,
                        intersection[0],
                    );
                }
            }
        },
        document,
    );

    const [selected, setSelected] = useState<Object3D[]>([]);

    // TODO use 'mouse' from here, seen in https://sbcode.net/react-three-fiber/look-at-mouse/ ?
    // --> Animation of all Meshes
    useFrame(({ clock }) => {
        if (gridMesh_Ref.current && hexRefs.current) {
            animate(
                clock.getElapsedTime(),
                gridMesh_Ref.current,
                hexRefs.current,
                hexMenuGridPositions_Memo,
                gridData_Memo,
                intersectionHits_Ref,
                hasRunOnce_Ref,
            );
        }
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            <Select
                onChangePointerUp={(selected) => {
                    setSelected(selected);
                }}
            >
                {hexMenuItemMeshPositions_Memo.map((gridPosition, idx, arr) => (
                    <HexMenuItem
                        key={`key${gridPosition}-${idx}`}
                        ref={hexRefCallback(idx)}
                        gridData={gridData_Memo}
                        positionIndex={selected.length ? (selected[0].uuid === hexRefs.current[idx].uuid ? arr[0] : gridPosition) : gridPosition}
                        scaleXZ={[5, 5]}
                    />
                ))}
            </Select>

            <mesh position={[]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshNormalMaterial />
            </mesh>
            <InstancedGridMeshFiber ref={gridMesh_Ref} renderer={renderer} gridData={gridData_Memo} isSquare={isSquare} useFresnel />
        </>
    );
};

export default BackgroundGrid;

const animate = (
    time_S: number,
    gridMesh: InstancedGridMesh,
    hexMenuMeshes: HexMenuMesh[],
    hexMenuGridIds: number[][][],
    gridData: GridData,
    intersectionHits_Ref: MutableRefObject<IntersectionResults | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    // Set current time for shader calculations
    gridMesh.material.uniforms.u_Time_S.value = time_S;

    // 1. --> Background animation
    setAmbientGridAnimation(gridMesh, gridData, time_S, 'sin');

    // 2. --> Intro, returns 'true' once animation is over
    if (!hasRunOnce_Ref.current) {
        hasRunOnce_Ref.current = setIntroGridAnimation(gridMesh, gridData, time_S);
    }

    // 3. --> React to Hits (overwriting values from setAmbientGridAnimation())
    if (intersectionHits_Ref.current) {
        const [gridHits, hexMeshHit] = intersectionHits_Ref.current;
        gridHits.length && setSpecificGridHitsAnimation(gridMesh, gridData, time_S, gridHits);
        hexMeshHit && setMenuHitsAnimation(hexMenuMeshes, hexMeshHit, gridData);
    }

    // 4. --> Set Menu Animations (overwriting the previous)
    setMenuAnimation(gridMesh, gridData, time_S, hexMenuGridIds);
};

const getDiagonalMenuIndices: (firstIndex: number, menuItemSize: number, gridColsRows: [number, number]) => [number, number, number, number] = (
    firstIndex,
    menuItemSize,
    [gridColumnCount, gridRowCount],
) => {
    const menuIndices = [firstIndex];
    const diagonalDistance = menuItemSize + 1;
    let cubeCoord = HexGrid.getCubeCoordFromInstanceIndex(firstIndex, gridColumnCount);

    for (let i = 1; i < 4; i++) {
        const direction = i % 2 === 0 ? 1 : 2;
        for (let j = 0; j < diagonalDistance; j++) {
            cubeCoord = HexGrid.getNeighborsCubeCoordinates(cubeCoord, direction, true);
        }
        const index = HexGrid.getInstanceIndexFromCubeCoord(cubeCoord, [gridColumnCount, gridRowCount]);
        menuIndices.push(index);
    }

    return menuIndices as [number, number, number, number];
};

let intersected = 0;
let hexMeshHit: HexMenuMesh | null;
let gridHits: number[][] = [];
const getIntersectIndices = (intersection: Intersection<InstancedMesh2 | HexMenuMesh>[], gridColsRows: [number, number]) => {
    const firstHit = intersection[0];

    if (firstHit.instanceId) {
        // Is a submesh of InstancedMesh
        const newInstanceId = firstHit.instanceId ?? intersected;
        if (intersected !== newInstanceId) {
            gridHits = GridAnimations.getRingShape(newInstanceId, 2, gridColsRows);
            gridHits = GridAnimations.filterIndices(gridHits);

            intersected = newInstanceId;
        }

        hexMeshHit = null;
    } else if (firstHit.object.isMesh) {
        // Is a HexMenuItem
        if (hexMeshHit?.uuid !== firstHit.object.uuid) {
            hexMeshHit = firstHit.object as HexMenuMesh;
        }

        gridHits = [];
    }

    // console.log('%c[BackgroundGrid]', 'color: #d49f55', `gridHits, hexMeshHit :`, gridHits, hexMeshHit);

    return [gridHits, hexMeshHit] as IntersectionResults;
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

// TODO change this to use either ndc or actual VP pixels, introducing yet another coord space is not too smart
/** Returns grid index at viewport position (width [0,1], height [0,1]) */
const getIndexAtPosition = (x: number, y: number, columns: number, rows: number) => {
    const xPos = Math.floor(columns * x);
    const yPos = Math.floor(rows * y);
    return xPos + columns * yPos;
};

/** Local Types */

type IntersectionResults = [number[][], HexMenuMesh | null];

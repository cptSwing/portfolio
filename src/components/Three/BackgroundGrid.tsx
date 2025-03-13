import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject, useEffect, createRef } from 'react';
import { useEvent } from 'react-use';
import { WebGLRenderer, Camera, Vector2, Raycaster, PerspectiveCamera, Intersection } from 'three';
import { setAmbientGridAnimation, setIntroGridAnimation, setMenuAnimation, setSpecificGridAnimation } from '../../lib/animateMeshes';
import { SquareGrid, HexGrid } from '../../lib/classes/Grid';
import { GridAnimations } from '../../lib/classes/GridAnimations';
import { getWidthHeight } from '../../lib/threeHelpers';
import { DefaultGridData, InstancedGridMesh, GridData, HexMenuMesh } from '../../types/types';
import { ndcFromViewportCoordinates } from '../../lib/ndcFromViewportCoordinates';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import InstancedGridMeshFiber from './InstancedGridMeshFiber';
import HexMenuItem from './HexMenuItem';

const gridDataDefaults: DefaultGridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceFlatTop: false,
    instanceWidth: null,
    instancePadding: 0,
    gridCount: 1000,
    gridColumns: 0,
    gridRows: 0,
};

const BackgroundGrid: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const [renderer, camera] = useThree((state) => [state.gl, state.camera]) as [WebGLRenderer, Camera];

    // --> Various refs
    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const hasRunOnce_Ref = useRef(false);
    const gridMesh_Ref = useRef<InstancedGridMesh | null>(null);
    const hexMenuMeshes_Ref = useRef<HexMenuMesh[] | null>(null);
    const intersectionHits_Ref = useRef<IntersectionResults | null>(null);

    // --> Assemble the final GridData
    const gridData_Memo = useMemo<GridData>(() => {
        const [width, height] = getWidthHeight(0, camera as PerspectiveCamera);
        const gridData = isSquare
            ? SquareGrid.getInstanceCount({ ...gridDataDefaults, overallWidth: width, overallHeight: height })
            : HexGrid.getInstanceCount({ ...gridDataDefaults, overallWidth: width, overallHeight: height });

        // 'Tumble' animation runs again once gridData is updated (likely a resize event / actual first run):
        hasRunOnce_Ref.current = false;

        return gridData;
    }, [camera, isSquare]);

    // --> Calculate Placement for Menu items
    const hexMenuItemPositions_Memo = useMemo(() => {
        const { gridColumns, gridRows } = gridData_Memo;

        const getIndexAtPosition = (x: number, y: number) => {
            const xPos = Math.floor(gridColumns * x);
            const yPos = Math.floor(gridRows * y);
            return xPos + gridColumns * yPos;
        };

        const positions = [getIndexAtPosition(0.5, 0.25), getIndexAtPosition(0.75, 0.5)];

        return positions;
    }, [gridData_Memo]);

    // --> Create Refs for array of <HexMenuItem>
    const hexMenuItemReferences_Memo = useMemo(
        () => Array.from({ length: hexMenuItemPositions_Memo.length }).map(() => createRef<HexMenuMesh>()),
        [hexMenuItemPositions_Memo],
    );

    // --> Store actual Mesh references for use further below
    useEffect(() => {
        if (!hexMenuMeshes_Ref.current && hexMenuItemReferences_Memo.some((ref) => ref.current)) {
            hexMenuMeshes_Ref.current = hexMenuItemReferences_Memo.map((ref) => ref.current) as HexMenuMesh[];
        }
    }, [hexMenuMeshes_Ref, hexMenuItemReferences_Memo]);

    // --> Calculate hits only on mousemove instead of in useFrame()
    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            if (raycaster_Ref.current && gridMesh_Ref.current && hexMenuMeshes_Ref.current) {
                const mouseEvent = ev as MouseEvent;
                mouseEvent.preventDefault();

                // Sets to [-1, 1] values, 0 at center
                const [ndcX, ndcY] = ndcFromViewportCoordinates([mouseEvent.clientX, mouseEvent.clientY], window.innerWidth, window.innerHeight);
                mousePosition_Ref.current.setX(ndcX);
                mousePosition_Ref.current.setY(ndcY);

                raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);

                const allMeshes = [gridMesh_Ref.current, ...hexMenuMeshes_Ref.current];

                const intersection: Intersection<InstancedMesh2 | HexMenuMesh>[] = raycaster_Ref.current.intersectObjects(allMeshes, false);

                if (intersection.length) {
                    intersectionHits_Ref.current = getIntersectIndices(intersection, [gridData_Memo.gridColumns, gridData_Memo.gridRows]);
                }
            }

            // TODO make helper function
            // How to convert to x,y at Scene Z:0 :
            // const lightPositionX = mousePosition_Ref.current.x * (gridData_Memo.overallWidth / 2);
        },
        document,
    );

    // TODO use 'mouse' from here, seen in https://sbcode.net/react-three-fiber/look-at-mouse/ ?
    // --> Animation of all Meshes
    useFrame(({ clock }) => {
        if (gridMesh_Ref.current && hexMenuMeshes_Ref.current) {
            animate(clock.getElapsedTime(), gridMesh_Ref.current, hexMenuMeshes_Ref.current, gridData_Memo, intersectionHits_Ref, hasRunOnce_Ref);
        }
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            {hexMenuItemPositions_Memo.map((gridPosition, idx) => (
                <HexMenuItem
                    key={`key${gridPosition}-${idx}`}
                    ref={hexMenuItemReferences_Memo[idx]}
                    gridData={gridData_Memo}
                    positionIndex={gridPosition}
                    renderer={renderer}
                />
            ))}
            <InstancedGridMeshFiber ref={gridMesh_Ref} renderer={renderer} gridData={gridData_Memo} isSquare={isSquare} useFresnel />
        </>
    );
};

export default BackgroundGrid;

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

    return [gridHits, hexMeshHit] as IntersectionResults;
};

const animate = (
    time_S: number,
    gridMesh: InstancedGridMesh,
    hexMenuMeshes: HexMenuMesh[],
    gridData: GridData,
    intersectionHits_Ref: MutableRefObject<IntersectionResults | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    gridMesh.material.uniforms.u_Time_S.value = time_S;

    // --> Background animation
    setAmbientGridAnimation(gridMesh, gridData, time_S, 'sin');

    // --> Intro, returns 'true' once animation is over
    if (!hasRunOnce_Ref.current) {
        hasRunOnce_Ref.current = setIntroGridAnimation(gridMesh, gridData, time_S);
    }

    // --> React to Hits (overwriting values from setAmbientAnimation())
    if (intersectionHits_Ref.current) {
        const [gridHits, hexMeshHit] = intersectionHits_Ref.current;
        gridHits.length && setSpecificGridAnimation(gridMesh, gridData, time_S, gridHits);
        hexMeshHit && setMenuAnimation(hexMenuMeshes, hexMeshHit);
    }
};

type IntersectionResults = [number[][], HexMenuMesh | null];

import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject, useEffect, createRef } from 'react';
import { useEvent } from 'react-use';
import { WebGLRenderer, Camera, Vector2, Raycaster, PerspectiveCamera, Intersection, Mesh } from 'three';
import { setShaderAnimation } from '../../lib/animateMeshes';
import { SquareGrid, HexGrid } from '../../lib/classes/Grid';
import { GridAnimations } from '../../lib/classes/GridAnimations';
import { getWidthHeight } from '../../lib/threeHelpers';
import { DefaultGridData, InstancedGridMesh, GridData } from '../../types/types';
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

    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const hasRunOnce_Ref = useRef(true);

    const gridData_Memo = useMemo<GridData>(() => {
        const [width, height] = getWidthHeight(0, camera as PerspectiveCamera);
        const gridData = isSquare
            ? SquareGrid.getInstanceCount({ ...gridDataDefaults, overallWidth: width, overallHeight: height })
            : HexGrid.getInstanceCount({ ...gridDataDefaults, overallWidth: width, overallHeight: height });

        // 'Tumble' animation runs again once gridData is updated (likely a resize event / actual first run):
        hasRunOnce_Ref.current = false;

        return gridData;
    }, [camera, isSquare]);

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

    const hexMenuItemReferences_Memo = useMemo(
        () => Array.from({ length: hexMenuItemPositions_Memo.length }).map(() => createRef<Mesh>()),
        [hexMenuItemPositions_Memo],
    );
    const gridMesh_Ref = useRef<InstancedGridMesh | null>(null);

    const intersectionHits_Ref = useRef<[number[][], Mesh] | null>(null);

    const hexMenuMeshes_Ref = useRef<Mesh[] | null>(null);

    useEffect(() => {
        if (!hexMenuMeshes_Ref.current && hexMenuItemReferences_Memo.some((ref) => ref.current)) {
            hexMenuMeshes_Ref.current = hexMenuItemReferences_Memo.map((ref) => ref.current) as Mesh[];
        }
    }, [hexMenuMeshes_Ref, hexMenuItemReferences_Memo]);

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

                console.log('%c[BackgroundGrid]', 'color: #945f2d', `allMeshes :`, allMeshes);
                const intersection: Intersection<InstancedMesh2 | Mesh>[] = raycaster_Ref.current.intersectObjects(allMeshes, false);

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
    useFrame(({ clock, mouse }) => {
        gridMesh_Ref.current &&
            hexMenuMeshes_Ref.current &&
            animate(clock.getElapsedTime(), gridMesh_Ref.current, hexMenuMeshes_Ref.current, gridData_Memo, intersectionHits_Ref, hasRunOnce_Ref);
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
let hitHexMenuMesh: Mesh | null;
let hitIndices: number[][] = [];
const getIntersectIndices = (intersection: Intersection<InstancedMesh2 | Mesh>[], gridColsRows: [number, number]) => {
    const firstHit = intersection[0];

    console.log('%c[BackgroundGrid]', 'color: #0db788', `firstHit :`, firstHit);
    if (firstHit.instanceId) {
        // Is a submesh of InstancedMesh

        const newInstanceId = firstHit.instanceId ?? intersected;
        if (intersected !== newInstanceId) {
            hitIndices = GridAnimations.getRingShape(newInstanceId, 2, gridColsRows);

            intersected = newInstanceId;
        }

        hitHexMenuMesh = null;
    } else if (firstHit.object.isMesh) {
        // Is a HexMenuItem

        if (hitHexMenuMesh?.uuid !== firstHit.object.uuid) {
            hitHexMenuMesh = firstHit.object;
        }

        hitIndices = [];
    }

    console.log('%c[BackgroundGrid]', 'color: #516b37', `hitHexMenuMesh :`, hitHexMenuMesh);
    return [hitIndices, hitHexMenuMesh] as [typeof hitIndices, Mesh];
};

const animate = (
    time_S: number,
    gridMesh: InstancedGridMesh,
    hexMenuMeshes: Mesh[],
    gridData: GridData,
    intersectionHits_Ref: MutableRefObject<[number[][], Mesh] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    if (intersectionHits_Ref.current) {
        const [gridHits, hitHexMenuMesh] = intersectionHits_Ref.current;
        gridHits.length && setShaderAnimation(gridMesh, gridData, time_S, gridHits, hasRunOnce_Ref, 'sin');
        hitHexMenuMesh && setHexMenuAnimation(hexMenuMeshes, hitHexMenuMesh);
    }
};

const setHexMenuAnimation = (meshes: Mesh[], hitMesh: Mesh) => {
    meshes.forEach((mesh) => {
        if (mesh === hitMesh) {
            mesh.position.setZ(2);
        } else if (mesh.position.z !== 0) {
            mesh.position.setZ(0);
        }
    });
};

import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject } from 'react';
import { useEvent } from 'react-use';
import { WebGLRenderer, Camera, Vector2, Raycaster, PerspectiveCamera, Intersection } from 'three';
import { setShaderAnimation } from '../lib/animateMeshes';
import { SquareGrid, HexGrid } from '../lib/classes/Grid';
import { GridAnimations } from '../lib/classes/GridAnimations';
import BackgroundMesh from '../lib/instancedMesh2';
import { getWidthHeight } from '../lib/threeHelpers';
import { DefaultGridData, InstancedMesh2ShaderMaterial, GridData } from '../types/types';

const gridDataDefaults: DefaultGridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceFlatTop: false,
    instanceWidth: null,
    instancePadding: 0.05,
    gridCount: 2000,
    gridColumns: 0,
    gridRows: 0,
};

export const Background: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const [renderer, camera] = useThree((state) => [state.gl, state.camera]) as [WebGLRenderer, Camera];
    const mesh_Ref = useRef<InstancedMesh2ShaderMaterial | null>(null);
    const intersectionHits_Ref = useRef<number[][] | null>(null);

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

    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            if (mesh_Ref.current && raycaster_Ref.current) {
                const mouseEvent = ev as MouseEvent;
                mouseEvent.preventDefault();

                // Sets to [-1, 1] values, 0 at center
                mousePosition_Ref.current.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
                mousePosition_Ref.current.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

                raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);
                const intersection = raycaster_Ref.current.intersectObject(mesh_Ref.current, false);

                if (intersection.length) {
                    intersectionHits_Ref.current = getIntersectIndices(intersection, [gridData_Memo.gridColumns, gridData_Memo.gridRows]);
                }
            }

            // How to convert to x,y at Scene Z:0
            // const lightPositionX = mousePosition_Ref.current.x * (gridData_Memo.overallWidth / 2);
        },
        document,
    );

    useFrame(({ clock }) => {
        mesh_Ref.current && backgroundAnimate(clock.getElapsedTime(), mesh_Ref.current, gridData_Memo, intersectionHits_Ref, hasRunOnce_Ref);
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            <BackgroundMesh meshRef={mesh_Ref} gridData={gridData_Memo} renderer={renderer} isSquare={isSquare} useFresnel />
        </>
    );
};

const backgroundAnimate = (
    time_S: number,
    mesh: InstancedMesh2ShaderMaterial,
    gridData: GridData,
    intersectionHits_Ref: MutableRefObject<number[][] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    setShaderAnimation(mesh, gridData, time_S, intersectionHits_Ref, hasRunOnce_Ref, 'sin');
};

let intersected = 0;
let hitIndices: number[][] = [];
const getIntersectIndices = (intersection: Intersection[], gridColsRows: [number, number]) => {
    const newInstanceId = intersection[0].instanceId ?? intersected;

    if (intersected !== newInstanceId) {
        const { getHexagonShape, getRingShape, getStarShape, mergeIndicesDistanceLevels, filterIndices } = GridAnimations;
        const hitIndices1 = getHexagonShape(newInstanceId, 2, gridColsRows);
        const hitIndices2 = getRingShape(newInstanceId, [6, 8, 10], gridColsRows);
        const hitIndices3 = getStarShape(newInstanceId, 4, gridColsRows);
        hitIndices = mergeIndicesDistanceLevels(hitIndices1, hitIndices2, hitIndices3);

        hitIndices = filterIndices(hitIndices);

        intersected = newInstanceId;
    }
    return hitIndices;
};

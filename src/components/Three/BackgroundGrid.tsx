import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject, useCallback, useState } from 'react';
import { useEvent } from 'react-use';
import { WebGLRenderer, Camera, Vector2, Raycaster, Intersection, Group, InstancedMesh } from 'three';
import {
    setAmbientGridAnimation,
    setIntroGridAnimation,
    setMenuAnimation,
    setMenuMouseHitsAnimation,
    setBackgroundMouseHitsAnimation,
} from '../../lib/animateMeshes';
import { HexGrid } from '../../lib/classes/Grid';
import { GridAnimations } from '../../lib/classes/GridAnimations';
import { InstancedGridMesh, GridData, HexMenuMesh } from '../../types/types';
import { ndcFromViewportCoordinates } from '../../lib/THREE_coordinateConversions';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import InstancedGridMeshFiber from './InstancedGridMeshFiber';
import HexMenuItem from './HexMenuItem';
import { useArrayRef } from '../../hooks/useRefArray';
import { animationSettings } from '../../config/threeSettings';
import { SelectInstances } from '../../lib/classes/SelectInstances';
import useGridData from '../../hooks/useGridData';

const BackgroundGrid: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const [renderer, camera] = useThree((state) => [state.gl, state.camera]) as [WebGLRenderer, Camera];

    //
    // --> Various refs & states
    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const hasRunOnce_Ref = useRef(false);
    const gridMesh_Ref = useRef<InstancedGridMesh | null>(null);
    const intersectionHits_Ref = useRef<IntersectionResults | null>(null);
    const [excludedIndices, setExcludedIndices] = useState<number[]>([]);

    //
    // --> Assemble the final GridData
    const gridData = useGridData();

    //
    // --> Select Grid Instances around Menu Item centers
    const menuGridIndices_Memo = useMemo(() => {
        const { gridColumnCount, gridRowCount } = gridData;
        const firstIndex = getIndexAtPosition(0.35, 0.25, gridColumnCount, gridRowCount);
        const menuIndices = getDiagonalMenuIndices(firstIndex, animationSettings.menu.menuItemDistanceSize, [gridColumnCount, gridRowCount]);
        const gridIds = menuIndices.map((instanceId) => {
            const shapeIds = GridAnimations.getHexagonShape(instanceId, animationSettings.menu.menuItemDistanceSize, [gridColumnCount, gridRowCount]);
            return GridAnimations.filterIndices(shapeIds);
        });

        setExcludedIndices(gridIds.flat(2));

        return gridIds;
    }, [gridData]);

    const [menuRefs, menuRefsCallback] = useArrayRef<Group>();

    //
    // --> Calculate hits only on mousemove instead of in useFrame()
    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            if (raycaster_Ref.current && gridMesh_Ref.current && menuRefs.current) {
                const mouseEvent = ev as MouseEvent;
                mouseEvent.preventDefault();

                // Sets to [-1, 1] values, 0 at center
                const [ndcX, ndcY] = ndcFromViewportCoordinates(mouseEvent.clientX, mouseEvent.clientY, window.innerWidth, window.innerHeight);
                mousePosition_Ref.current.setX(ndcX);
                mousePosition_Ref.current.setY(ndcY);

                raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);

                // const allMeshes = [gridMesh_Ref.current, ...menuRefs.current];
                const allMeshes = [gridMesh_Ref.current];

                const intersection: Intersection<InstancedMesh2 | HexMenuMesh>[] = raycaster_Ref.current.intersectObjects(allMeshes, false);

                if (intersection.length) {
                    intersectionHits_Ref.current = getIntersectIndices(intersection, [gridData.gridColumnCount, gridData.gridRowCount]);
                }
            }
        },
        document,
    );

    // TODO use 'mouse' from here, seen in https://sbcode.net/react-three-fiber/look-at-mouse/ ?
    // --> Animation of all Meshes
    useFrame(({ clock }) => {
        if (gridMesh_Ref.current && menuRefs.current) {
            animate(
                clock.getElapsedTime(),
                gridMesh_Ref.current,
                menuRefs.current,
                menuGridIndices_Memo,
                excludedIndices,
                gridData,
                intersectionHits_Ref,
                hasRunOnce_Ref,
            );
        }
    });

    const hasMounted = useCallback((elem: InstancedMesh | null) => {
        if (elem) {
        }
    }, []);

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            <SelectInstances
                onChangePointerUp={(selected) => {
                    // setSelection(selected);
                }}
            >
                {menuGridIndices_Memo.map((menuShapeIndices, idx) => (
                    <HexMenuItem
                        key={`key${menuShapeIndices[0]}-${idx}`}
                        ref={menuRefsCallback(idx)}
                        gridData={gridData}
                        gridMesh={gridMesh_Ref}
                        shapeIndices={menuShapeIndices}
                        scaleXZ={[5, 5]}
                    />
                ))}

                <InstancedGridMeshFiber ref={gridMesh_Ref} renderer={renderer} gridData={gridData} isSquare={isSquare} useFresnel />
            </SelectInstances>
        </>
    );
};

export default BackgroundGrid;

const animate = (
    time_S: number,
    gridMesh: InstancedGridMesh,
    menuMeshes: Group[],
    menuGridIndices: number[][][],
    excludedIndices: number[],
    gridData: GridData,
    intersectionHits_Ref: MutableRefObject<IntersectionResults | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    // Set current time for shader calculations
    gridMesh.material.uniforms.u_Time_S.value = time_S;

    // --> Intro, returns 'true' once animation is over
    if (!hasRunOnce_Ref.current) {
        hasRunOnce_Ref.current = setIntroGridAnimation(gridMesh, gridData, time_S);
    } else {
        // 1. --> Background animation
        setAmbientGridAnimation(gridMesh, gridData, time_S, excludedIndices, 'sin');

        // 2. --> React to Hits (overwriting values from setAmbientGridAnimation())
        if (intersectionHits_Ref.current) {
            const [gridHits, wasHit] = intersectionHits_Ref.current;
            gridHits.length && setBackgroundMouseHitsAnimation(gridMesh, gridData, time_S, gridHits, excludedIndices);
            // wasHit && setMenuMouseHitsAnimation(menuMeshes, wasHit, gridData);
        }

        // 3. --> Set Menu Animations (overwriting the previous)
        setMenuAnimation(gridMesh, gridData, time_S, menuGridIndices);
    }
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
let wasHit: Group | null;
let gridHits: number[][] = [];
const getIntersectIndices = (intersection: Intersection<InstancedMesh2 | Group>[], gridColsRows: [number, number]) => {
    const firstHit = intersection[0];

    if (firstHit.instanceId) {
        // Is a submesh of InstancedMesh
        const newInstanceId = firstHit.instanceId ?? intersected;
        if (intersected !== newInstanceId) {
            gridHits = GridAnimations.getRingShape(newInstanceId, 2, gridColsRows);
            gridHits = GridAnimations.filterIndices(gridHits);

            intersected = newInstanceId;
        }

        wasHit = null;
    } else if (firstHit.object.isMesh) {
        // Is a HexMenuItem
        if (wasHit?.uuid !== firstHit.object.uuid) {
            wasHit = firstHit.object as Group;
        }

        gridHits = [];
    }

    // console.log('%c[BackgroundGrid]', 'color: #d49f55', `gridHits, wasHit :`, gridHits, wasHit);

    return [gridHits, wasHit] as IntersectionResults;
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

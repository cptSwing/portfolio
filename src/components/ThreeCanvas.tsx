import { FC, MouseEvent, MutableRefObject, useMemo, useRef } from 'react';
import { Intersection, Vector2, WebGLRenderer, PerspectiveCamera, Camera, Raycaster } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import BackgroundMesh from '../lib/instancedMesh2';
import { DefaultGridData, GridData, InstancedMesh2ShaderMaterial } from '../types/types';
import { setShaderAnimation } from '../lib/animateMeshes';
import { PerspectiveCamera as PerspectiveCameraImpl } from '@react-three/drei';
import { useEvent } from 'react-use';
import { HexGrid, SquareGrid } from '../lib/classes/Grid';
import { getWidthHeight } from '../lib/threeHelpers';

const cameraOffset = 30;

const ThreeCanvas = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 top-0 -z-50'>
            <Canvas gl={{ alpha: true, antialias: true }}>
                <PerspectiveCameraImpl
                    makeDefault
                    position={[0, 0, cameraOffset]}
                    fov={30}
                    aspect={window.innerWidth / window.innerHeight}
                    near={Math.max(0, cameraOffset - 5)}
                    far={cameraOffset + 2}
                />

                <Background isSquare={false} />

                <ambientLight color='white' intensity={1} />
                <directionalLight position={[-1, 2, 1]} color={0xffffff} intensity={1.5} />
                <directionalLight position={[1, 2, 1]} color={0xffffff} intensity={1.5} />
                <directionalLight position={[0, -2, -1]} color={0xbbbbff} intensity={0.25} />
            </Canvas>
        </div>
    );
};

export default ThreeCanvas;

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

const Background: FC<{ isSquare: boolean }> = ({ isSquare }) => {
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
        mesh_Ref.current && threeAnimate(clock.getElapsedTime(), mesh_Ref.current, gridData_Memo, intersectionHits_Ref, hasRunOnce_Ref);
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            <BackgroundMesh meshRef={mesh_Ref} gridData={gridData_Memo} renderer={renderer} isSquare={isSquare} useFresnel />
        </>
    );
};

const threeAnimate = (
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
        const { getHexagonShape, getRingShape, getStarShape, mergeIndicesDistanceLevels, filterIndices } = HitsAnimation;
        const hitIndices1 = getHexagonShape(newInstanceId, 2, gridColsRows);
        const hitIndices2 = getRingShape(newInstanceId, [6, 8, 10], gridColsRows);
        const hitIndices3 = getStarShape(newInstanceId, 4, gridColsRows);
        hitIndices = mergeIndicesDistanceLevels(hitIndices1, hitIndices2, hitIndices3);

        hitIndices = filterIndices(hitIndices);

        intersected = newInstanceId;
    }
    return hitIndices;
};

class HitsAnimation {
    static animationTimer(time: number) {
        // TODO something with the 'time' stamp from useFrame --> do x every 10 seconds, or some such
    }

    static getRingShape(instanceIndex: number, distance: number | number[], gridColsRows: [number, number]) {
        let indicesArray: number[][];

        if (Array.isArray(distance) && distance.length) {
            const rings: number[][][] = distance.map((distanceValue) => HexGrid.getRingIndices(instanceIndex, distanceValue, gridColsRows));
            indicesArray = HitsAnimation.mergeIndicesDistanceLevels(...rings);
        } else {
            indicesArray = HexGrid.getRingIndices(instanceIndex, distance as number, gridColsRows);
        }
        indicesArray[0] = [instanceIndex];
        return indicesArray;
    }

    static getHexagonShape(instanceIndex: number, distance: number, gridColsRows: [number, number]) {
        const indicesArray = HexGrid.getSpiralIndices(instanceIndex, distance, gridColsRows);
        indicesArray[0] = [instanceIndex];
        return indicesArray;
    }

    static getStarShape(instanceIndex: number, distance: number, gridColsRows: [number, number]) {
        const indicesArrayQ = HexGrid.getAxesIndices(instanceIndex, distance, 'q', 'both', gridColsRows);
        const indicesArrayR = HexGrid.getAxesIndices(instanceIndex, distance, 'r', 'both', gridColsRows);
        const indicesArrayS = HexGrid.getAxesIndices(instanceIndex, distance, 's', 'both', gridColsRows);

        const indicesArray = HitsAnimation.mergeIndicesDistanceLevels(indicesArrayQ, indicesArrayR, indicesArrayS);
        indicesArray[0] = [instanceIndex];

        return indicesArray;
    }

    static mergeIndicesDistanceLevels(...arrayOfIndicesByDistance: number[][][]) {
        const longestArrayIndex = arrayOfIndicesByDistance.reduce((prev, current, idx, arr) => (arr[prev].length > current.length ? prev : idx), 0);
        const longestIndicesArray = arrayOfIndicesByDistance.splice(longestArrayIndex, 1)[0];

        arrayOfIndicesByDistance.forEach((indices) => {
            for (let i = 1; i < longestIndicesArray.length; i++) {
                indices[i] && longestIndicesArray[i].push(...indices[i]);
            }
        });

        return longestIndicesArray;
    }

    static filterIndices(indicesArray: number[][]) {
        const filtered = indicesArray.filter((indicesAtDistance) => indicesAtDistance.length);
        const filteredAndDeDuped = filtered.map((indices) => Array.from(new Set(indices)));
        return filteredAndDeDuped;
    }
}

import { FC, MouseEvent, MutableRefObject, useMemo, useRef } from 'react';
import { Intersection, Vector2, WebGLRenderer, PerspectiveCamera, Camera, Raycaster } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import BackgroundMesh, { getAdjacentIndices, getInstanceCount } from '../lib/instancedMesh2';
import { DefaultGridData, GridData, InstancedMesh2ShaderMaterial } from '../types/types';
import { setShaderAnimation } from '../lib/animateMeshes';
import { PerspectiveCamera as PerspectiveCameraImpl } from '@react-three/drei';
import { useEvent } from 'react-use';
import { HexagonalPrismUtilities } from '../lib/classes/HexagonalPrismGeometry';

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
    const intersectionHits_Ref = useRef<number[] | null>(null);

    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const hasRunOnce_Ref = useRef(true);

    const gridData_Memo = useMemo<GridData>(() => {
        const [width, height] = getWidthHeight(0, camera as PerspectiveCamera);
        const gridData = getInstanceCount({ ...gridDataDefaults, overallWidth: width, overallHeight: height }, isSquare);

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
                    intersectionHits_Ref.current = getIntersectIndices(
                        intersection,
                        gridData_Memo.gridColumns,
                        gridData_Memo.gridRows,
                        gridData_Memo.instanceFlatTop,
                    );
                }
            }

            // const lightPositionX = mousePosition_Ref.current.x * (gridData_Memo.overallWidth / 2);   // Converted to x,y at Scene Z:0
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
    intersectionHits_Ref: MutableRefObject<number[] | null>,
    hasRunOnce_Ref: MutableRefObject<boolean>,
) => {
    setShaderAnimation(mesh, gridData, time_S, intersectionHits_Ref, hasRunOnce_Ref, 'sin');
};

let intersected = 0;
let hitIndices: number[] = [];
const getIntersectIndices = (intersection: Intersection[], gridColumns: number, gridRows: number, flatTop: boolean) => {
    const newInstanceId = intersection[0].instanceId ?? intersected;

    if (intersected !== newInstanceId) {
        hitIndices.push(newInstanceId);
        hitIndices = [newInstanceId, ...getAdjacentIndices(newInstanceId, gridColumns, gridRows, 2, flatTop)];

        intersected = newInstanceId;

        console.log(
            '%c[ThreeCanvas]',
            'color: #ed43fd',
            `id: ${intersected} --> col, row :`,
            ...HexagonalPrismUtilities.getColumnAndRowByIndex(intersected, gridColumns),
            hitIndices,
        );
    }
    return hitIndices;
};

const getWidthHeight = (depth: number, camera: PerspectiveCamera) => {
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

import { FC, MouseEvent, useMemo, useRef } from 'react';
import { Color, Intersection, PointLight, Scene, Vector2, WebGLRenderer, PerspectiveCamera, Camera, Raycaster } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import BackgroundMesh, { getAdjacentIndices, getInstanceCount } from '../lib/instancedMesh2';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData, InstancedMesh2ShaderMaterial, OriginalInstancePositions } from '../types/types';
import { meshAnimations, setAnimationPattern } from '../lib/animateMeshes';
import { PerspectiveCamera as PerspectiveCameraImpl } from '@react-three/drei';
import { useEvent } from 'react-use';

const ThreeCanvas = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 top-0 -z-50'>
            <Canvas gl={{ alpha: true, antialias: true }}>
                <PerspectiveCameraImpl makeDefault position={[0, 0, 3]} fov={60} aspect={window.innerWidth / window.innerHeight} near={0.01} far={50} />

                <Background isSquare={false} />

                <ambientLight color='white' intensity={1} />
            </Canvas>
        </div>
    );
};

export default ThreeCanvas;

const gridDataDefaults: GridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceLength: 0.05,
    instancePadding: 0,
    gridCount: 300,
    gridCountHorizontal: 0,
    gridCountVertical: 0,
    gridBaseColor: new Color(0x888888),
};

let time_Ms_Global = 0;

const Background: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const { camera } = useThree();
    const mesh_OrigPositions_Ref = useRef<[InstancedMesh2ShaderMaterial | null, OriginalInstancePositions]>([null, []]);
    const mousePosition_Ref = useRef(new Vector2());
    const raycaster_Ref = useRef<Raycaster | null>(null);
    const pointLight_Ref = useRef<PointLight | null>(null);

    const gridData_Memo = useMemo<GridData>(() => {
        const [width, height] = getWidthHeight(0, camera as PerspectiveCamera);
        let gridData = { ...gridDataDefaults, overallWidth: width, overallHeight: height };

        return getInstanceCount(gridData, isSquare);
    }, [camera, isSquare]);

    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            const mouseEvent = ev as MouseEvent;
            mouseEvent.preventDefault();

            // Sets to [-1, 1] values, 0 at center
            mousePosition_Ref.current.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
            mousePosition_Ref.current.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

            if (mesh_OrigPositions_Ref.current && raycaster_Ref.current) {
                const [mesh_Ref] = mesh_OrigPositions_Ref.current;
                if (mesh_Ref) {
                    raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);
                    const intersection = raycaster_Ref.current.intersectObject(mesh_Ref, false);

                    handleIntersects(intersection, mesh_Ref, gridData_Memo.gridCountHorizontal);
                }
            }

            if (pointLight_Ref.current) {
                // Converted to x,y at Scene Z:0
                const lightPositionX = mousePosition_Ref.current.x * (gridData_Memo.overallWidth / 2);
                const lightPositionY = mousePosition_Ref.current.y * (gridData_Memo.overallHeight / 2);

                pointLight_Ref.current.position.setX(lightPositionX);
                pointLight_Ref.current.position.setY(lightPositionY);
            }
        },
        document,
    );

    useFrame(({ scene, gl, camera, clock }, _delta, frame) => {
        if (mesh_OrigPositions_Ref.current) {
            const [mesh_Ref, originalPositions_Ref] = mesh_OrigPositions_Ref.current;
            mesh_Ref &&
                originalPositions_Ref.length &&
                threeAnimate(gl, clock.getElapsedTime(), frame, scene, camera, mesh_Ref, gridData_Memo, originalPositions_Ref);
        }
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />;
            <pointLight ref={pointLight_Ref} position={[0, 0, 3]} color='white' intensity={0.5} />
            <BackgroundMesh ref={mesh_OrigPositions_Ref} gridData={gridData_Memo} isSquare={isSquare} />
        </>
    );
};

let hasRunOnce = false;
let forwardAnimationRunning = 0;
const threeAnimate = (
    renderer: WebGLRenderer,
    time_Ms: number,
    _frame: XRFrame | undefined,
    scene: Scene,
    camera: Camera,
    mesh: InstancedMesh2ShaderMaterial,
    gridData: GridData,
    originalPositions_Ref: OriginalInstancePositions,
) => {
    mesh.material.uniforms.u_Time_Ms.value = time_Ms;
    time_Ms_Global = time_Ms;

    mesh.updateInstances((instance, idx) => {
        if (!hasRunOnce) {
            instance.position.y += gridData.overallHeight;

            forwardAnimationRunning = 1;
            if (idx >= gridData.gridCountHorizontal * gridData.gridCountVertical - 1) {
                mesh.computeBoundingSphere();
                hasRunOnce = true;
            }
        }

        forwardAnimationRunning = setAnimationPattern({
            instance,
            index: idx,
            time_Ms,
            gridData,
            originalPosition: originalPositions_Ref[idx],
            ...(forwardAnimationRunning ? meshAnimations.tumble : meshAnimations.none),
        });

        // setColorPattern({ instance, index: idx, time_Ms, timeAlpha: 0.03, pattern: 'sin', gridData });
    });

    renderer.render(scene, camera);
};

let intersected = 0;
const tempHitVector = new Vector2(); // Stores current time in x., hit strength in y.
const tempInstanceColor = new Color();

const handleIntersects = (intersection: Intersection[], object: InstancedMesh2, gridCountHorizontal: number) => {
    if (intersection.length > 0) {
        const newInstanceId = intersection[0].instanceId ?? intersected;

        if (intersected !== newInstanceId) {
            const adjacentIndices = getAdjacentIndices(newInstanceId, gridCountHorizontal, 2);

            object.getUniformAt(newInstanceId, 'u_Hit_Color', tempInstanceColor);
            object.setUniformAt(newInstanceId, 'u_Hit_Color', tempInstanceColor.setHex(0xffffff));

            object.getUniformAt(newInstanceId, 'u_Hit', tempHitVector);
            object.setUniformAt(newInstanceId, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 1)));

            adjacentIndices.forEach((instanceIndex) => {
                object.getUniformAt(instanceIndex, 'u_Hit_Color', tempInstanceColor);
                object.setUniformAt(instanceIndex, 'u_Hit_Color', tempInstanceColor.setHex(0xffdddd));

                object.getUniformAt(instanceIndex, 'u_Hit', tempHitVector);
                object.setUniformAt(instanceIndex, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 0.5))); // WARN Math.max needs to be switched to different solution, vals are not cleared
            });

            intersected = newInstanceId;
        }
    }
};

const getWidthHeight = (depth: number, camera: PerspectiveCamera) => [visibleWidthAtZDepth(depth, camera), visibleHeightAtZDepth(depth, camera)];

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

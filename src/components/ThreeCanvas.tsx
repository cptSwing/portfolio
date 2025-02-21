import { MouseEvent,  useEffect, useMemo, useRef, useState } from 'react';
import {
    BufferGeometry,
    Color,
    Intersection,
    PointLight,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderer,
} from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import getInstancedMesh2, { getAdjacentIndices, getInstanceCount } from '../lib/getInstancedMesh2';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData } from '../types/types';
import { meshAnimations, setAnimationPattern } from '../lib/animateMeshes';
import { PerspectiveCamera } from '@react-three/drei';

const mousePosition = new Vector2(0, 0);
const isSquare = false;

let time_Ms_Global = 0;
let hasRunOnce = false;
let forwardAnimationRunning = 0;
let gridData: GridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceLength: 0.05,
    instancePadding: 0.001,
    gridCount: 300,
    gridCountHorizontal: 0,
    gridCountVertical: 0,
    gridBaseColor: new Color(0x888888),
};


const ThreeCanvas = () => {
    const [wh, setWh] = useState([0, 0]);
    const { camera } = useThree();

    const mousePosition_Ref = useRef( new Vector2() )
    const pointLight_Ref = useRef<PointLight>()
    const raycaster_Ref = useRef()

    const gridData_Memo = useMemo<GridData>(() => (), [wh])

    useEffect(() => {
        setWh(getWidthHeight(0, camera));
    }, [ camera ] );
    
    useFrame( ( state, delta, frame ) => {
        
    })

    return (
        <div className='fixed left-0 right-0 bottom-0 top-0 -z-50'>
            <Canvas gl={ { alpha: true, antialias: true } } onMouseMove={  (ev: Event | MouseEvent) => {
        const mouseEvent = ev as MouseEvent;
        mouseEvent.preventDefault();

        // Sets to [-1, 1] values, 0 at center
        mousePosition_Ref.current.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
        mousePosition_Ref.current.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

        raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);
        const intersection = raycaster_Ref.intersectObject(object, false);

        handleIntersects(intersection, object);

        // Converted to x,y at Scene Z:0
        const lightPositionX = mousePosition.x * (gridData.overallWidth / 2);
        const lightPositionY = mousePosition.y * (gridData.overallHeight / 2);

        pointLight_Ref.current.position.setX(lightPositionX);
        pointLight_Ref.current.position.setY(lightPositionY);
    }}>
                <PerspectiveCamera makeDefault position={ [ 0, 0, 3 ] } fov={ 60 } aspect={ window.innerWidth / window.innerHeight } near={ 0.01 } far={ 50 } />

                <raycaster ref={raycaster_Ref} />

                <pointLight ref={pointLight_Ref} position={[0, 0, 3]} color='white' intensity={0.5}  />
                <ambientLight color='white' intensity={ 1 } />
                
            </Canvas>
        </div>
    );
};

export default ThreeCanvas;



const mountThree = (div: HTMLDivElement) => {
    // WARN not loaded when this is run
    // const rootElement = document.documentElement;
    // const bgGrey = rootElement.style.getPropertyValue('--theme-bg-base');
    // color.setStyle(bgGrey);



    gridData = getInstanceCount(gridData, isSquare);

    const object = getInstancedMesh2(renderer, gridData, isSquare);

    renderer.setAnimationLoop((time, frame) => threeAnimate(renderer, time, frame, scene, camera, object));


};




const threeAnimate = (
    renderer: WebGLRenderer,
    time_Ms: number,
    _frame: XRFrame,
    scene: Scene,
    camera: PerspectiveCamera,
    mesh: InstancedMesh2<{}, BufferGeometry, ShaderMaterial>,
) => {
    mesh.material.uniforms.u_Time_Ms.value = time_Ms;
    time_Ms_Global = time_Ms;

    mesh.updateInstances((instance, idx) => {
        if (!hasRunOnce) {
            // instance.position.setY(instance.position.y + gridData.overallHeight);
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
            ...(forwardAnimationRunning ? meshAnimations.tumble : meshAnimations.none),
        });

        // setColorPattern({ instance, index: idx, time_Ms, timeAlpha: 0.03, pattern: 'sin', gridData });
    });

    renderer.render(scene, camera);
};

let intersected = 0;

const tempHitVector = new Vector2(); // Stores current time in x., hit strength in y.
const tempInstanceColor = new Color();

const handleIntersects = (intersection: Intersection[], object: InstancedMesh2) => {
    if (intersection.length > 0) {
        const newInstanceId = intersection[0].instanceId ?? intersected;

        if (intersected !== newInstanceId) {
            const adjacentIndices = getAdjacentIndices(newInstanceId, gridData.gridCountHorizontal, 2);

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

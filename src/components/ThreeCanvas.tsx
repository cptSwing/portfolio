import { MouseEvent, useCallback } from 'react';
import {
    AmbientLight,
    BufferGeometry,
    Clock,
    Color,
    Intersection,
    Object3D,
    PerspectiveCamera,
    PointLight,
    Points,
    Raycaster,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderer,
} from 'three';
import getInstancedMesh2, { getAdjacentIndices, getInstanceCount } from '../lib/getInstancedMesh2';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData } from '../types/types';
import { meshAnimations, setAnimationPattern, setColorPattern } from '../lib/animateMeshes';

const ThreeCanvas = () => {
    const refCb = useCallback((div: HTMLDivElement | null) => {
        if (div) {
            mountThree(div);
        }
    }, []);

    return <div ref={refCb} className='fixed left-0 top-0 -z-50' />;
};

export default ThreeCanvas;

const mousePosition = new Vector2(0, 0);

let gridData: GridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceLength: 0.05,
    instancePadding: 0,
    gridCount: 2000,
    gridCountHorizontal: 0,
    gridCountVertical: 0,
    gridFillDirection: 'horizontal',
    gridBaseColor: new Color(0x888888),
};

const mountThree = (div: HTMLDivElement) => {
    const scene = new Scene();
    const raycaster = new Raycaster();

    // WARN not loaded when this is run
    // const rootElement = document.documentElement;
    // const bgGrey = rootElement.style.getPropertyValue('--theme-bg-base');
    // color.setStyle(bgGrey);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const cameraOffset = 3;
    camera.position.set(0, 0, cameraOffset);

    const [width, height] = getWidthHeight(0, camera);
    gridData.overallWidth = width;
    gridData.overallHeight = height;

    gridData = getInstanceCount(gridData);

    const pointLight = getPointLight(cameraOffset);
    // scene.add(pointLight);

    scene.add(new AmbientLight('white', 1));

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const object = getInstancedMesh2(renderer, gridData);
    scene.add(object);

    renderer.setAnimationLoop((time, frame) => threeAnimate(renderer, time, frame, scene, camera, object));

    div.appendChild(renderer.domElement);

    window.addEventListener('resize', getResizeHandler(renderer, camera));
    document.addEventListener('mousemove', getMouseMoveHandler(pointLight, cameraOffset, camera, raycaster, object));
};

const getPointLight = (offset: number) => {
    const pointLight = new PointLight(0xffffff, 0.5, 0, 0.5);
    pointLight.position.set(0, 0, offset);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 50;
    pointLight.shadow.bias = -0.000512;

    return pointLight;
};

const getResizeHandler: (renderer: WebGLRenderer, camera: PerspectiveCamera) => EventListenerOrEventListenerObject = (renderer, camera) => {
    return (_ev: Event) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // TODO needs to reset InstancedMesh2 as well
        const [width, height] = getWidthHeight(0, camera);
        gridData.overallWidth = width;
        gridData.overallHeight = height;

        renderer.setSize(window.innerWidth, window.innerHeight);
    };
};

const getMouseMoveHandler: (
    pointLight: PointLight,
    lightOffset: number,
    camera: PerspectiveCamera,
    raycaster: Raycaster,
    object: Object3D,
) => EventListenerOrEventListenerObject = (pointLight, lightOffset, camera, raycaster, object) => {
    return (ev: Event | MouseEvent) => {
        const mouseEvent = ev as MouseEvent;
        mouseEvent.preventDefault();

        // Sets to [-1, 1] values, 0 at center
        mousePosition.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
        mousePosition.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mousePosition, camera);
        const intersection = raycaster.intersectObject(object, false);

        handleIntersects(intersection, object);

        // Converted to x,y at Scene Z:0
        const lightPositionX = mousePosition.x * (gridData.overallWidth / 2);
        const lightPositionY = mousePosition.y * (gridData.overallHeight / 2);

        pointLight.position.set(lightPositionX, lightPositionY, lightOffset);
    };
};

let time_Ms_Global = 0;
let hasRunOnce = false;
let forwardAnimationRunning = 0;
const threeAnimate = (
    renderer: WebGLRenderer,
    time_Ms: number,
    frame: XRFrame,
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

const handleIntersects = (intersection: Intersection[], object: Object3D) => {
    if (intersection.length > 0) {
        if ((object as InstancedMesh2).isInstancedMesh2) {
            const objInstanced = object as InstancedMesh2;

            const newInstanceId = intersection[0].instanceId ?? intersected;

            if (intersected !== newInstanceId) {
                const { above, below, toLeft, toRight } = getAdjacentIndices(newInstanceId, gridData);

                // objInstanced.setColorAt(newInstanceId, tempInstanceColor.setHex(0xffffff));
                objInstanced.setUniformAt(newInstanceId, 'u_Hit_Color', tempInstanceColor.setHex(0xffffff));

                objInstanced.getUniformAt(newInstanceId, 'u_Hit', tempHitVector);
                objInstanced.setUniformAt(newInstanceId, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 1)));

                if (objInstanced.instances[above]) {
                    objInstanced.setColorAt(above, tempInstanceColor.setHex(0xdddddd));

                    objInstanced.getUniformAt(above, 'u_Hit', tempHitVector);
                    objInstanced.setUniformAt(above, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 0.5)));
                }
                if (objInstanced.instances[below]) {
                    objInstanced.setColorAt(below, tempInstanceColor.setHex(0xdddddd));

                    objInstanced.getUniformAt(below, 'u_Hit', tempHitVector);
                    objInstanced.setUniformAt(below, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 0.5)));
                }
                if (objInstanced.instances[toLeft]) {
                    objInstanced.setColorAt(toLeft, tempInstanceColor.setHex(0xdddddd));

                    objInstanced.getUniformAt(toLeft, 'u_Hit', tempHitVector);
                    objInstanced.setUniformAt(toLeft, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 0.5)));
                }
                if (objInstanced.instances[toRight]) {
                    objInstanced.setColorAt(toRight, tempInstanceColor.setHex(0xdddddd));

                    objInstanced.getUniformAt(toRight, 'u_Hit', tempHitVector);
                    objInstanced.setUniformAt(toRight, 'u_Hit', tempHitVector.set(time_Ms_Global, Math.max(tempHitVector.y, 0.5)));
                }

                intersected = newInstanceId;
            }
        } else {
            const intersectionIndex = intersection[0].index ?? 0;

            if (!(intersected === intersectionIndex)) {
                const points = object as Points;
                const positions = points.geometry.getAttribute('position');

                positions.array[intersectionIndex + 2] += 0.05;
                positions.needsUpdate = true;

                intersected = intersectionIndex;
            }
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

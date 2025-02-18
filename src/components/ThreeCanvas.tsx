import { MouseEvent, useCallback } from 'react';
import {
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
import getInstancedMesh2, { getAdjacentIndices, getInstanceCount, setAnimationPattern, setColorPattern } from '../lib/getInstancedMesh2';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { GridData } from '../types/types';

const ThreeCanvas = () => {
    const refCb = useCallback((div: HTMLDivElement | null) => {
        if (div) {
            mountThree(div);
        }
    }, []);

    return <div ref={refCb} className='fixed left-0 top-0 -z-50' />;
};

export default ThreeCanvas;

const clock = new Clock();
const mousePosition = new Vector2(0, 0);

let gridData: GridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceLength: 0.075,
    instancePadding: 0.005,
    gridCountHorizontal: 0,
    gridCountVertical: 0,
    gridFillDirection: 'horizontal',
    gridBaseColor: new Color('grey'),
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

    const pointLight = getPointLight();
    scene.add(pointLight);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const object = getInstancedMesh2(renderer, gridData);
    scene.add(object);

    renderer.setAnimationLoop(() => threeAnimate(renderer, scene, camera, object));

    div.appendChild(renderer.domElement);

    window.addEventListener('resize', getResizeHandler(renderer, camera));
    document.addEventListener('mousemove', getMouseMoveHandler(pointLight, camera, raycaster, object));

    // // run 'tumble' once
    // object.updateInstancesPosition((instance, idx) => {
    //     instance.position.setY(5);
    // });
};

const getPointLight = () => {
    const pointLight = new PointLight(0xffffff, 0.5, 10, 0.5);
    pointLight.position.set(0, 0, 3);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 500;
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

const getMouseMoveHandler: (pointLight: PointLight, camera: PerspectiveCamera, raycaster: Raycaster, object: Object3D) => EventListenerOrEventListenerObject = (
    pointLight,
    camera,
    raycaster,
    object,
) => {
    return (ev: Event | MouseEvent) => {
        const mouseEvent = ev as MouseEvent;
        mouseEvent.preventDefault();

        mousePosition.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
        mousePosition.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mousePosition, camera);
        const intersection = raycaster.intersectObject(object, false);

        handleIntersects(intersection, object);

        const lightPositionX = mousePosition.x * (gridData.overallWidth / 2);
        const lightPositionY = mousePosition.y * (gridData.overallHeight / 2);

        pointLight.position.set(lightPositionX, lightPositionY, 0.5);
    };
};

let hasRunOnce = false;
const threeAnimate = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, mesh: InstancedMesh2<{}, BufferGeometry, ShaderMaterial>) => {
    const time = clock.getElapsedTime();
    mesh.material.uniforms.u_Time_Seconds.value = time;

    mesh.updateInstances((instance, idx) => {
        if (!hasRunOnce) {
            instance.position.y += gridData.overallHeight;
        }
        setAnimationPattern({ instance, index: idx, time, timeAlpha: 0.2, pattern: 'tumble', gridData });
        setColorPattern({ instance, index: idx, time, timeAlpha: 0.03, pattern: 'sin', gridData });
    });
    hasRunOnce = true;

    renderer.render(scene, camera);
};

const tempInstanceColor = new Color();
let intersected = 0;
const handleIntersects = (intersection: Intersection[], object: Object3D) => {
    if (intersection.length > 0) {
        if ((object as InstancedMesh2).isInstancedMesh2) {
            const objInstanced = object as InstancedMesh2;

            const newInstanceId = intersection[0].instanceId ?? intersected;

            if (intersected !== newInstanceId) {
                // (objInstanced.material as ShaderMaterial).uniforms.u_hitIndex.value = newInstanceId;
                // (objInstanced.material as ShaderMaterial).uniforms.u_Time_Last_Hit.value = elapsed;

                objInstanced.instances[newInstanceId].position.z += gridData.instanceLength;
                objInstanced.setColorAt(newInstanceId, tempInstanceColor.setHex(0xffffff));

                const { above, below, toLeft, toRight } = getAdjacentIndices(newInstanceId, gridData);

                if (objInstanced.instances[above]) {
                    objInstanced.instances[above].position.z += 0.025;
                    objInstanced.setColorAt(above, tempInstanceColor.setHex(0xeeeeee));
                }
                if (objInstanced.instances[below]) {
                    objInstanced.instances[below].position.z += 0.025;
                    objInstanced.setColorAt(below, tempInstanceColor.setHex(0xeeeeee));
                }
                if (objInstanced.instances[toLeft]) {
                    objInstanced.instances[toLeft].position.z += 0.025;
                    objInstanced.setColorAt(toLeft, tempInstanceColor.setHex(0xeeeeee));
                }
                if (objInstanced.instances[toRight]) {
                    objInstanced.instances[toRight].position.z += 0.025;
                    objInstanced.setColorAt(toRight, tempInstanceColor.setHex(0xeeeeee));
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

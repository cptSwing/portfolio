import { MouseEvent, useCallback } from 'react';
import {
    Clock,
    Color,
    Intersection,
    Matrix4,
    Object3D,
    PerspectiveCamera,
    PointLight,
    Points,
    Raycaster,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three';
import getInstancedMesh2, { getInstanceCount, getInstanceNeighbors } from '../lib/getInstancedMesh2';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';

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
let [width, height]: [number, number] = [0, 0];
let [countHorizontal, countVertical]: [number, number] = [0, 0];
const roundedBoxSideLength = 0.075;
const padding = roundedBoxSideLength / 15;

const mountThree = (div: HTMLDivElement) => {
    const scene = new Scene();
    const raycaster = new Raycaster();
    const color = new Color();

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const cameraOffset = 3;
    camera.position.set(0, 0, cameraOffset);

    [width, height] = getWidthHeight(0, camera);

    [countHorizontal, countVertical] = getInstanceCount(width, height, roundedBoxSideLength, padding);

    const pointLight = getPointLight();
    scene.add(pointLight);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const object = getInstancedMesh2(renderer, roundedBoxSideLength, width, height, countHorizontal, countVertical, padding, color);
    scene.add(object);

    renderer.setAnimationLoop(() => threeAnimate(renderer, scene, camera, object.material));

    div.appendChild(renderer.domElement);

    window.addEventListener('resize', getResizeHandler(renderer, camera));
    document.addEventListener('mousemove', getMouseMoveHandler(pointLight, camera, raycaster, object, color));
};

const getPointLight = () => {
    const pointLight = new PointLight(0xffffff, 0.075, 10, 0.5);
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
        [width, height] = getWidthHeight(0, camera);

        renderer.setSize(window.innerWidth, window.innerHeight);
    };
};

const getMouseMoveHandler: (
    pointLight: PointLight,
    camera: PerspectiveCamera,
    raycaster: Raycaster,
    object: Object3D,
    color: Color,
) => EventListenerOrEventListenerObject = (pointLight, camera, raycaster, object, color) => {
    return (ev: Event | MouseEvent) => {
        const mouseEvent = ev as MouseEvent;
        mouseEvent.preventDefault();

        mousePosition.setX((mouseEvent.clientX / window.innerWidth) * 2 - 1);
        mousePosition.setY(-(mouseEvent.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mousePosition, camera);
        const intersection = raycaster.intersectObject(object, false);

        handleIntersects(intersection, object, color);

        const lightPositionX = mousePosition.x * (width / 2);
        const lightPositionY = mousePosition.y * (height / 2);

        pointLight.position.set(lightPositionX, lightPositionY, 0.5);
    };
};

const threeAnimate = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, material: ShaderMaterial) => {
    material.uniforms.u_Time_Seconds.value = clock.getElapsedTime();
    renderer.render(scene, camera);
};

const timespan = 2;
let matrix = new Matrix4();
const positionVector = new Vector3();
let intersected = 0;
const handleIntersects = (intersection: Intersection[], object: Object3D, color: Color) => {
    if (intersection.length > 0) {
        if ((object as InstancedMesh2).isInstancedMesh2) {
            const objInstanced = object as InstancedMesh2;

            const newInstanceId = intersection[0].instanceId ?? intersected;

            if (intersected !== newInstanceId) {
                const elapsed = clock.getElapsedTime() / timespan;
                (objInstanced.material as ShaderMaterial).uniforms.u_hitIndex.value = newInstanceId;
                (objInstanced.material as ShaderMaterial).uniforms.u_Time_Last_Hit.value = elapsed;

                const { above, below, toLeft, toRight } = getInstanceNeighbors(newInstanceId, countVertical);

                objInstanced.getMatrixAt(newInstanceId, matrix);
                positionVector.set(matrix.elements[12], matrix.elements[13], matrix.elements[14]);
                positionVector.setZ(Math.sin((elapsed * Math.PI) / 180));
                matrix.setPosition(positionVector);
                objInstanced.setMatrixAt(newInstanceId, matrix);

                objInstanced.setColorAt(newInstanceId, color.setHex(0xffffff));
                objInstanced.setColorAt(above, color.setHex(0xff0000));
                objInstanced.setColorAt(below, color.setHex(0x00ff00));
                objInstanced.setColorAt(toLeft, color.setHex(0x0000ff));
                objInstanced.setColorAt(toRight, color.setHex(0x000000));

                intersected = newInstanceId;

                // const timeoutHandler = () => {
                //     objInstanced.setUniformAt(newInstanceId, 'u_isHit', 0);
                //     clearTimeout(timeout);
                // };
                // const timeout = setTimeout(timeoutHandler, 1000);
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

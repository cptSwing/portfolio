import { MouseEvent, useCallback } from 'react';
import {
    Color,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Raycaster,
    Scene,
    ShadowMaterial,
    Vector2,
    WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const ThreeCanvas = () => {
    const refCb = useCallback((div: HTMLDivElement | null) => {
        if (div) {
            mountThree(div);
        }
    }, []);

    return <div ref={refCb} className='fixed left-0 top-0 -z-50' />;
};

export default ThreeCanvas;

let [width, height]: [number, number] = [0, 0];
const mountThree = (div: HTMLDivElement) => {
    const mousePosition = new Vector2(1, 1);
    const cameraOffset = 3;

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, cameraOffset);
    // camera.lookAt(0, 0, 0);

    [width, height] = getWidthHeight(0, camera);
    console.log('%c[ThreeCanvas]', 'color: #06d142', `width, height :`, width, height);

    const pointLight = getPointLight();
    scene.add(pointLight);

    const raycaster = new Raycaster();

    const color = new Color();
    const whiteColor = new Color().setHex(0xffffff);

    const instancedMesh = getInstancedMesh(color);
    scene.add(instancedMesh);

    const shadowBackPlate = getShadowPlane();
    scene.add(shadowBackPlate);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(() => threeAnimate(renderer, scene, camera, raycaster, instancedMesh, mousePosition, color, whiteColor));
    div.appendChild(renderer.domElement);

    window.addEventListener('resize', getResizeHandler(renderer, camera));
    document.addEventListener('mousemove', getMouseMoveHandler(mousePosition, pointLight));
};

const getPointLight = () => {
    const pointLight = new PointLight(0xffffff, 1, 10);
    pointLight.position.set(0, 0, 3);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 500;
    pointLight.shadow.bias = -0.000512;

    return pointLight;
};

const matrix = new Matrix4();

const getInstancedMesh = (color: Color) => {
    const roundedBoxSideLength = 0.075;
    const countHorizontal = Math.ceil(width / roundedBoxSideLength);
    const countVertical = Math.ceil(height / roundedBoxSideLength);

    // WARN not loaded when this is run
    const rootElement = document.documentElement;
    const bgGrey = rootElement.style.getPropertyValue('--theme-bg-base');
    color.setStyle(bgGrey);

    const geometry = new RoundedBoxGeometry(roundedBoxSideLength, roundedBoxSideLength, roundedBoxSideLength, 1, roundedBoxSideLength / 10);
    const material = new MeshPhongMaterial({ specular: 'yellow', shininess: 10 });
    const instancedMesh = new InstancedMesh(geometry, material, countHorizontal * countVertical);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    let i = 0;
    const extentX = width / 2;
    const extentY = height / 2;
    const padding = roundedBoxSideLength / 100;

    for (let x = 0; x < countHorizontal; x++) {
        for (let y = 0; y < countVertical; y++) {
            const offsetX = x * (roundedBoxSideLength + padding);
            const offsetY = y * (roundedBoxSideLength + padding);
            matrix.setPosition(extentX - offsetX, extentY - offsetY, 0);

            instancedMesh.setMatrixAt(i, matrix);
            instancedMesh.setColorAt(i, color);

            i++;
        }
    }

    return instancedMesh;
};

const getShadowPlane = () => {
    const planeGeometry = new PlaneGeometry(width, height);
    const shadowMaterial = new ShadowMaterial({ color: 'red' });
    const shadowPlane = new Mesh(planeGeometry, shadowMaterial);
    shadowPlane.receiveShadow = true;
    shadowPlane.position.setZ(-0.25);

    return shadowPlane;
};

const getResizeHandler: (renderer: WebGLRenderer, camera: PerspectiveCamera) => EventListenerOrEventListenerObject = (renderer, camera) => {
    return (_ev: Event) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    };
};

const getMouseMoveHandler: (mousePosition: Vector2, pointLight: PointLight) => EventListenerOrEventListenerObject = (mousePosition, pointLight) => {
    return (ev: Event | MouseEvent) => {
        const mouseEvent = ev as MouseEvent;
        mouseEvent.preventDefault();

        mousePosition.x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;

        const lightPositionX = mousePosition.x * (width / 2);
        const lightPositionY = mousePosition.y * (height / 2);

        pointLight.position.set(lightPositionX, lightPositionY, 0.5);
    };
};

let instanceId = 0;
const threeAnimate = (
    renderer: WebGLRenderer,
    scene: Scene,
    camera: PerspectiveCamera,
    raycaster: Raycaster,
    instancedMesh: InstancedMesh,
    mousePosition: Vector2,
    color: Color,
    whiteColor: Color,
) => {
    raycaster.setFromCamera(mousePosition, camera);

    const intersection = raycaster.intersectObject(instancedMesh);

    if (intersection.length > 0) {
        const newInstanceId = intersection[0].instanceId ?? instanceId;

        if (!(instanceId === newInstanceId)) {
            instancedMesh.getMatrixAt(newInstanceId, matrix);

            const b = matrix.elements;
            b[14] += 0.0125; // Z axis

            instancedMesh.setMatrixAt(newInstanceId, matrix);
            instancedMesh.instanceMatrix.needsUpdate = true;

            instancedMesh.getColorAt(newInstanceId, color);

            if (color.equals(whiteColor)) {
                instancedMesh.setColorAt(newInstanceId, color.setHex(Math.random() * 0xffffff));
                instancedMesh.instanceColor!.needsUpdate = true;
            }

            instanceId = newInstanceId;
        }
    }

    renderer.render(scene, camera);
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

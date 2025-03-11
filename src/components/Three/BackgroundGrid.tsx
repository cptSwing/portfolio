import { useThree, useFrame } from '@react-three/fiber';
import { FC, useRef, useMemo, MutableRefObject, useEffect, useCallback } from 'react';
import { useEvent } from 'react-use';
import {
    WebGLRenderer,
    Camera,
    Vector2,
    Raycaster,
    PerspectiveCamera,
    Intersection,
    ShaderMaterial,
    UniformsUtils,
    ShaderLib,
    PlaneGeometry,
    Color,
    MathUtils,
} from 'three';
import { setShaderAnimation } from '../../lib/animateMeshes';
import { SquareGrid, HexGrid, Grid } from '../../lib/classes/Grid';
import { GridAnimations } from '../../lib/classes/GridAnimations';
import { getWidthHeight } from '../../lib/threeHelpers';
import { DefaultGridData, InstancedGridMesh, GridData, GridShaderMaterial } from '../../types/types';
import { getExtentsInNDC, ndcFromViewportCoordinates } from '../../lib/ndcFromViewportCoordinates';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { createRadixSort, InstancedMesh2 } from '@three.ez/instanced-mesh';
import vertexShader from '../../lib/shading/instancedShader_V.glsl';
import fragmentShader from '../../lib/shading/instancedShader_F.glsl';
import InstancedGridMeshFiber, { getColorsFromTheme } from './InstancedGridMeshFiber';
import HexMenuItem from './HexMenuItem';

const gridDataDefaults: DefaultGridData = {
    overallWidth: 0,
    overallHeight: 0,
    instanceFlatTop: false,
    instanceWidth: null,
    instancePadding: 0,
    gridCount: 1000,
    gridColumns: 0,
    gridRows: 0,
};

const BackgroundGrid: FC<{ isSquare: boolean }> = ({ isSquare }) => {
    const [renderer, camera] = useThree((state) => [state.gl, state.camera]) as [WebGLRenderer, Camera];
    const mesh_Ref = useRef<InstancedGridMesh | null>(null);
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

    const hexMenuItemPositions_Memo = useMemo(() => {
        const { gridColumns, gridRows } = gridData_Memo;

        const getIndexAtPosition = (x: number, y: number) => {
            const xPos = Math.floor(gridColumns * x);
            const yPos = Math.floor(gridRows * y);
            return xPos + gridColumns * yPos;
        };

        return [getIndexAtPosition(0.5, 0.25), getIndexAtPosition(0.75, 0.5)];
    }, [gridData_Memo]);

    useEvent(
        'mousemove',
        (ev: Event | MouseEvent) => {
            if (mesh_Ref.current && raycaster_Ref.current) {
                const mouseEvent = ev as MouseEvent;
                mouseEvent.preventDefault();

                // Sets to [-1, 1] values, 0 at center
                const [ndcX, ndcY] = ndcFromViewportCoordinates([mouseEvent.clientX, mouseEvent.clientY], window.innerWidth, window.innerHeight);
                mousePosition_Ref.current.setX(ndcX);
                mousePosition_Ref.current.setY(ndcY);

                raycaster_Ref.current.setFromCamera(mousePosition_Ref.current, camera);
                const intersection = raycaster_Ref.current.intersectObject(mesh_Ref.current, false);

                if (intersection.length) {
                    intersectionHits_Ref.current = getIntersectIndices(intersection, [gridData_Memo.gridColumns, gridData_Memo.gridRows]);
                }
            }

            // TODO make helper function
            // How to convert to x,y at Scene Z:0 :
            // const lightPositionX = mousePosition_Ref.current.x * (gridData_Memo.overallWidth / 2);
        },
        document,
    );

    // TODO use 'mouse' from here, seen in https://sbcode.net/react-three-fiber/look-at-mouse/ ?
    useFrame(({ clock }) => {
        mesh_Ref.current && backgroundAnimate(clock.getElapsedTime(), mesh_Ref.current, gridData_Memo, intersectionHits_Ref, hasRunOnce_Ref);
    });

    return (
        <>
            <raycaster ref={raycaster_Ref} />
            {hexMenuItemPositions_Memo.map((gridPosition) => (
                <HexMenuItem gridData={gridData_Memo} positionIndex={gridPosition} renderer={renderer} />
            ))}
            <BackgroundMesh meshRef={mesh_Ref} gridData={gridData_Memo} menuItemPositions={hexMenuItemPositions_Memo} renderer={renderer} useFresnel />
        </>
    );
};

export default BackgroundGrid;

const backgroundAnimate = (
    time_S: number,
    mesh: InstancedGridMesh,
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
        hitIndices = GridAnimations.getRingShape(newInstanceId, 2, gridColsRows);

        // console.log('%c[BackgroundGrid]', 'color: #912e76', `newInstanceId :`, newInstanceId);
        intersected = newInstanceId;
    }
    return hitIndices;
};

const instancedMeshTempColor = new Color();
const isFlatShaded = false;

const BackgroundMesh: FC<{
    gridData: GridData;
    meshRef: MutableRefObject<InstancedGridMesh | null>;
    menuItemPositions: number[];
    renderer: WebGLRenderer;
    isSquare?: boolean;
    useFresnel?: boolean;
}> = ({ gridData, meshRef, menuItemPositions, renderer, isSquare = false, useFresnel = false }) => {
    const { overallWidth, overallHeight, instanceFlatTop, instanceWidth, instancePadding, gridCount, gridColumns, gridRows } = gridData;

    const meshRef_Cb = useCallback((mesh: InstancedMesh2 | null) => {
        if (mesh) {
            meshRef.current = mesh as InstancedGridMesh;
            mesh.initUniformsPerInstance({ vertex: { u_Hit_Offset: 'vec4', u_Hit_Time: 'float', u_Anim_Progress: 'float' } });
            mesh.sortObjects = true;
            mesh.customSort = createRadixSort(mesh);
        }
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            const instancedMesh = meshRef.current;

            console.log('%c[instancedMesh2]', 'color: #b85533', `Creating Instances ${gridCount} (cols:${gridColumns} rows:${gridRows})`);
            const indicesUnderMenuItems = menuItemPositions.map((menuItemIndex) => GridAnimations.getRingShape(menuItemIndex, 3, [gridColumns, gridRows]));
            const merged = GridAnimations.mergeIndicesDistanceLevels(...indicesUnderMenuItems);
            const filtered = GridAnimations.filterIndices(merged, true).flat();

            const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);

            instancedMesh.addInstances(gridCount, (instance) => {
                if (isSquare) {
                    SquareGrid.setInstancePosition(instance, instance.id, gridColumns, [extentX, extentY], instanceWidth, instancePadding);
                } else {
                    HexGrid.setInstancePosition(instance, instance.id, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);
                }

                Grid.setInstanceColor(instance, instancedMeshTempColor);

                if (filtered.includes(instance.id)) {
                    instance.position.setZ(-10);
                    // instance.color.setHex(0x666666);
                }
            });

            meshRef.current = instancedMesh;
        }
    }, [menuItemPositions, overallWidth, overallHeight, instanceWidth, instancePadding, gridCount, gridColumns, isSquare, instanceFlatTop]);

    const hexGridGeometry_Memo = useMemo(() => {
        if (isSquare) {
            return new PlaneGeometry(instanceWidth, instanceWidth);
        } else {
            const size = HexGrid.getSizeFromWidth(instanceWidth, instanceFlatTop);
            return new HexagonalPrismGeometry(size, instanceWidth, instanceFlatTop).rotateX(MathUtils.degToRad(90));
        }
    }, [isSquare, instanceWidth, instanceFlatTop]);

    const material_Memo = useMemo(() => {
        const [currentBackground, currentActivePrimary, currentActiveSecondary] = getColorsFromTheme();

        const shaderUniforms = UniformsUtils.merge([
            ShaderLib.phong.uniforms,
            {
                u_Length: { value: instanceWidth },
                u_FresnelColor: { value: instancedMeshTempColor.setHex(currentActivePrimary) },
                u_HighLightColor: {
                    value: instancedMeshTempColor.clone().setHex(currentActiveSecondary),
                },
            },
        ]) as GridShaderMaterial['uniforms'];

        shaderUniforms.diffuse.value.setHex(currentBackground);
        shaderUniforms.opacity.value = 1;
        shaderUniforms.shininess.value = 100;
        shaderUniforms.specular.value.setHex(0xdddddd);

        const shaderMaterial = new ShaderMaterial({
            uniforms: shaderUniforms,
            defines: {
                USE_UV: '',
                USE_INSTANCING_COLOR: '',
                USE_INSTANCING_COLOR_INDIRECT: '',
                ...(useFresnel ? { USE_FRESNEL: '' } : {}),
                ...(isFlatShaded ? { FLAT_SHADED: '' } : {}),
            },
            vertexShader,
            fragmentShader,
            wireframe: false,
            lights: true,
            // transparent: true,
            // side: DoubleSide,
            // transparent: shaderUniforms.opacity.value >= 1 ? false : true,
        });

        return shaderMaterial as GridShaderMaterial;
    }, [instanceWidth, useFresnel]);

    return (
        <>
            <InstancedGridMeshFiber ref={meshRef_Cb} geometry={hexGridGeometry_Memo} material={material_Memo} params={{ renderer, createEntities: true }} />
        </>
    );
};

import { createRadixSort, InstancedEntity, InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, CubeTextureLoader, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils, WebGLRenderer } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { DefaultGridData, GridData, InstancedMesh2ShaderMaterial, OffsetCoordinate } from '../types/types';
import { extend, Object3DNode } from '@react-three/fiber';
import { FC, MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import HexagonalPrismGeometry, { HexagonalPrismUtilities } from './classes/HexagonalPrismGeometry';

extend({ InstancedMesh2 });
declare module '@react-three/fiber' {
    interface ThreeElements {
        instancedMesh2: Object3DNode<InstancedMesh2ShaderMaterial, typeof InstancedMesh2>;
    }
}

const instancedMeshTempColor = new Color();
const isFlatShaded = false;

const BackgroundMesh: FC<{
    gridData: GridData;
    meshRef: MutableRefObject<InstancedMesh2ShaderMaterial | null>;
    renderer: WebGLRenderer;
    isSquare: boolean;
    useFresnel?: boolean;
}> = ({ gridData, meshRef, renderer, isSquare, useFresnel = false }) => {
    const { overallWidth, overallHeight, instanceFlatTop, instanceWidth, instancePadding, gridCount, gridColumns, gridRows } = gridData;

    const meshRef_Cb = useCallback((mesh: InstancedMesh2 | null) => {
        if (mesh) {
            meshRef.current = mesh as InstancedMesh2ShaderMaterial;
            mesh.initUniformsPerInstance({ vertex: { u_Hit_Offset: 'vec4', u_Hit_Time: 'float', u_Anim_Progress: 'float' } });
            mesh.sortObjects = true;
            mesh.customSort = createRadixSort(mesh);
        }
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            const instancedMesh = meshRef.current;
            const extentX = -(overallWidth / 2); // Negative, so grid is filled from top-left
            const extentY = overallHeight / 2;

            if (!instancedMesh.instancesCount) {
                console.log('%c[instancedMesh2]', 'color: #b85533', `Creating Instances ${gridCount} (cols:${gridColumns} rows:${gridRows})`);
                instancedMesh.addInstances(gridCount, (instance, idx) => {
                    updateInstances(
                        instance,
                        idx,
                        gridColumns,
                        [extentX, extentY],
                        instanceWidth,
                        instancePadding,
                        isSquare,
                        instanceFlatTop,
                        instancedMeshTempColor,
                    );
                });
            } else {
                const difference = gridCount - instancedMesh.instancesCount;
                if (Math.sign(difference) === 1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Adding Instances ${difference}`);
                    instancedMesh.addInstances(difference, (instance, idx) => {
                        updateInstances(
                            instance,
                            idx,
                            gridColumns,
                            [extentX, extentY],
                            instanceWidth,
                            instancePadding,
                            isSquare,
                            instanceFlatTop,
                            instancedMeshTempColor,
                        );
                        instance.color = instancedMeshTempColor.setHex(0x888888 * Math.random());
                    });
                } else if (Math.sign(difference) === -1) {
                    console.log('%c[instancedMesh2]', 'color: #b85533', `Removing Instances ${difference}`);
                    const idsToRemove = Array.from({ length: -difference }).map((_elem, idx) => -difference + idx);
                    instancedMesh.removeInstances(...idsToRemove);
                } else {
                    throw new Error('difference is 0');
                }
            }

            meshRef.current = instancedMesh;
        }
    }, [overallWidth, overallHeight, instanceWidth, instancePadding, gridCount, gridColumns, isSquare, instanceFlatTop]);

    const geometry_Memo = useMemo(() => {
        if (isSquare) {
            return new PlaneGeometry(instanceWidth, instanceWidth);
        } else {
            const size = HexagonalPrismUtilities.getSizeFromWidth(instanceWidth, instanceFlatTop);
            return new HexagonalPrismGeometry(size, instanceWidth, instanceFlatTop, isFlatShaded);
        }
    }, [isSquare, instanceWidth, instanceFlatTop]);

    const material_Memo = useMemo(() => {
        const shaderUniforms = UniformsUtils.merge([
            ShaderLib.phong.uniforms,
            {
                u_Length: { value: instanceWidth },
            },
        ]);

        shaderUniforms.diffuse.value.setHex(0xff8800);
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
            // side: DoubleSide,
            transparent: shaderUniforms.opacity.value >= 1 ? false : true,
        });

        return shaderMaterial;
    }, [instanceWidth, useFresnel]);

    return <instancedMesh2 ref={meshRef_Cb} args={[geometry_Memo, material_Memo, { renderer, createEntities: true }]} position={[0, 0, 0]} />;
};

export default BackgroundMesh;

const updateInstances = (
    instance: InstancedEntity,
    index: number,
    gridColumns: number,
    [extentX, extentY]: [number, number],
    width: number,
    padding: number,
    isSquare: boolean,
    flatTop: boolean,
    colorObject: Color,
) => {
    let offsetX, offsetY;
    const [column, row] = HexagonalPrismUtilities.getColumnAndRowByIndex(index, gridColumns);

    if (isSquare) {
        offsetX = column * width + padding;
        offsetY = row * width + padding;
    } else {
        [offsetX, offsetY] = HexagonalPrismUtilities.getXYOffsets(width, padding, column, row, flatTop);
    }

    const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };
    instance.position.set(position.x, position.y, position.z);

    instance.color = colorObject.setHex(0x000000); // Set to black to not initially add anything to 'diffuse'
};

export const getInstanceCount = (params: DefaultGridData, isSquare: boolean) => {
    const { overallWidth, overallHeight, instanceFlatTop, instancePadding, gridCount } = params;

    const overallArea = overallWidth * overallHeight;
    const idealInstanceArea = overallArea / gridCount;

    if (isSquare) {
        // Via https://stackoverflow.com/a/1575761
        const idealInstanceWidth = Math.sqrt(idealInstanceArea);

        const columns = Math.round(overallWidth / idealInstanceWidth);
        let rows = Math.round(overallHeight / idealInstanceWidth);

        const minLength = Math.min(overallWidth / columns, overallWidth / rows);
        if (overallHeight > minLength * rows) rows++;

        return { ...params, instanceWidth: minLength - instancePadding, gridCount: columns * rows, gridColumns: columns, gridRows: rows };
    } else {
        const size = Math.sqrt((2 * idealInstanceArea) / (3 * Math.sqrt(3))); // same as radius
        const [horizontalSpacing, verticalSpacing] = HexagonalPrismUtilities.getSpacing(size, instanceFlatTop); // column width, basically
        const rSin = HexagonalPrismUtilities.hexSine * size;

        const shorterToLongerDimRatio = instanceFlatTop ? rSin / size : size / rSin;
        const adjustedHorizontalPadding = instancePadding * shorterToLongerDimRatio;
        const horizontalSpacingNoPadding = Math.max(0.001, horizontalSpacing - adjustedHorizontalPadding);

        const newSizeH = HexagonalPrismUtilities.getSizeFromSpacing(horizontalSpacingNoPadding, true, instanceFlatTop);
        const [width, height] = HexagonalPrismUtilities.getWidthHeight(newSizeH, instanceFlatTop);

        const numColumns = Math.ceil((overallWidth + adjustedHorizontalPadding) / horizontalSpacing);
        const numRows = Math.ceil((overallHeight + height / 2) / verticalSpacing);

        return {
            ...params,
            instanceWidth: width,
            gridCount: numColumns * numRows,
            gridColumns: numColumns,
            gridRows: numRows,
        } as GridData;
    }
};

export const getAllNeighbors = (instanceIndex: number, distance: number, numColumns: number) => {
    const offsetCoords = HexagonalPrismUtilities.getColumnAndRowByIndex(instanceIndex, numColumns);
    const cubeCoords = HexagonalPrismUtilities.coord_EvenRToCube(offsetCoords);
    const neighboringRings = HexagonalPrismUtilities.getSpiralRingsCubeCoordinates(cubeCoords, distance);
    const neighborsOffsetCoords = neighboringRings.map((cubeCoordArray) =>
        cubeCoordArray.map((cubeCoord) => HexagonalPrismUtilities.coord_CubeToEvenR(cubeCoord)),
    );
    return neighborsOffsetCoords;
};

export const getAdjacentIndices = (instanceIndex: number, numColumns: number, numRows: number, distance: number, _flatTop = false, isSquare = false) => {
    let allNeighbors: number[] = [];

    if (isSquare) {
        const above = instanceIndex - numColumns;
        const toRight = instanceIndex + 1;
        const below = instanceIndex + numColumns;
        const toLeft = instanceIndex - 1;

        allNeighbors.push(above, toRight, below, toLeft);
    } else {
        const neighbors = getAllNeighbors(instanceIndex, distance, numColumns);
        allNeighbors = neighbors.flat().map((coords) => offsetCoordsToIndices(coords, numColumns, numRows));
    }

    return allNeighbors.filter((adjacent) => adjacent >= 0);
};

const offsetCoordsToIndices = (coord: OffsetCoordinate, numColumns: number, numRows: number) => {
    const [column, row] = coord;
    let index = row * numColumns + column;

    if (column < 0 || column >= numColumns || row < 0 || row >= numRows) {
        index = -1; // prevent wrapping to other side, as filtered below
    }

    return index;
};

const getHexagonRings = (distance: number, coordinates: [number, number][], flatTop: boolean, iteration = 1) => {
    if (iteration === 1) {
        const centerCoords = coordinates[0];
        coordinates = [];

        // Initial ring (6 neighbors)
        for (let i = 0; i < 6; i++) {
            const coords = HexagonalPrismUtilities.getNeighborsOffsetCoordinates(centerCoords, i, flatTop);
            coordinates.push(coords);
        }
    } else {
        const loopStart = coordinates.length - (iteration - 1) * 6;
        const loopEnd = coordinates.length;

        for (let j = loopStart, k = 0; j < loopEnd; j++, k++) {
            const [nHexCol, nHexRow] = coordinates[j];

            const neighbor = k;
            let nextNeighbor;
            if (k + 1 > 5) {
                nextNeighbor = 0;
                k = 0;
            } else {
                nextNeighbor = k + 1;
            }

            // TODO revise the below algo, not working ;D
            /** each neighbor queries two of it's further outwards neighbors: 0 queries it's neightbors 0 and 1; 1 queries it's 1 and 2 --- etc */
            const nColRow0 = HexagonalPrismUtilities.getNeighborsOffsetCoordinates([nHexCol, nHexRow], neighbor, flatTop);
            const nColRow1 = HexagonalPrismUtilities.getNeighborsOffsetCoordinates([nHexCol, nHexRow], nextNeighbor, flatTop);

            coordinates.push(nColRow0, nColRow1);
        }
    }

    if (iteration === distance) {
        return coordinates;
    } else {
        return getHexagonRings(distance, coordinates, flatTop, iteration + 1);
    }
};

const cubeTextureLoader = new CubeTextureLoader();
const _getEnvMap = (path: string) => {
    // const path = '../../examples/textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];

    const reflectionCube = cubeTextureLoader.load(urls);

    return reflectionCube;
};

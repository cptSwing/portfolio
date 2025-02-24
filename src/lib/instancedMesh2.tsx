import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { Color, PlaneGeometry, ShaderLib, ShaderMaterial, UniformsUtils } from 'three';
import vertexShader from './shading/instancedShader_V.glsl';
import fragmentShader from './shading/instancedShader_F.glsl';
import { GridData, InstancedMesh2ShaderMaterial, OriginalInstancePositions } from '../types/types';
import HexagonGeometry from './classes/HexagonGeometry';
import { extend, Object3DNode } from '@react-three/fiber';
import { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

extend({ InstancedMesh2 });
declare module '@react-three/fiber' {
    interface ThreeElements {
        instancedMesh2: Object3DNode<InstancedMesh2ShaderMaterial, typeof InstancedMesh2>;
    }
}

const BackgroundMesh: FC<{
    gridData: GridData;
    meshAndPositions: MutableRefObject<[InstancedMesh2ShaderMaterial | null, OriginalInstancePositions]>;
    isSquare: boolean;
}> = ({ gridData, meshAndPositions, isSquare }) => {
    const { overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, gridBaseColor } = gridData;

    const mesh_Ref = useRef<InstancedMesh2ShaderMaterial | null>(null);
    const originalPositions_Ref = useRef<OriginalInstancePositions>([]);

    const meshRef_Cb = useCallback((mesh: InstancedMesh2 | null) => {
        if (mesh && mesh_Ref) {
            mesh_Ref.current = mesh as InstancedMesh2ShaderMaterial;
            mesh.initUniformsPerInstance({ vertex: { u_Hit: 'vec2', u_Hit_Color: 'vec3' } });
        }
    }, []);

    useEffect(() => {
        if (mesh_Ref.current) {
            const instancedMesh = mesh_Ref.current;
            const lengthIncludingPadding = instanceLength + instancePadding;
            const extentX = -(overallWidth / 2 - instanceLength / 2); // Negative, so grid is filled from top-left
            const extentY = overallHeight / 2;

            instancedMesh.clearInstances();
            if (originalPositions_Ref.current.length) {
                originalPositions_Ref.current = [];
            }

            instancedMesh.addInstances(gridCountHorizontal * gridCountVertical, (instancedEntity, index) => {
                let offsetX, offsetY;
                const [column, row] = HexagonGeometry.getColumnAndRowByIndex(index, gridCountHorizontal);

                if (isSquare) {
                    offsetX = column * lengthIncludingPadding;
                    offsetY = row * lengthIncludingPadding;
                } else {
                    [offsetX, offsetY] = HexagonGeometry.getXYOffsets(instanceLength / 2, instancePadding, column, row);
                }

                const position = { x: extentX + offsetX, y: extentY - offsetY, z: 0 };

                originalPositions_Ref.current.push(position);

                instancedEntity.position.set(position.x, position.y, position.z);
                instancedEntity.color = gridBaseColor;
                // instancedEntity.color = gridBaseColor.setHex(0x888888 * Math.random());
            });

            meshAndPositions.current = [mesh_Ref.current, originalPositions_Ref.current];
        }
    }, [overallWidth, overallHeight, instanceLength, instancePadding, gridCountHorizontal, gridCountVertical, isSquare]);

    const geometry_Memo = useMemo(() => {
        if (isSquare) {
            return new PlaneGeometry(instanceLength, instanceLength);
        } else {
            return new HexagonGeometry(instanceLength / 2);
        }
    }, [isSquare, instanceLength]);

    const material_Memo = useMemo(() => {
        const shaderUniforms = UniformsUtils.merge([
            ShaderLib.phong.uniforms,
            {
                u_Time_S: {
                    value: 0,
                },
            },
        ]);

        shaderUniforms.shininess.value = 40;
        shaderUniforms.specular.value = new Color(0xffffff);

        return new ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader,
            lights: true,
        });
    }, []);

    return <instancedMesh2 ref={meshRef_Cb} args={[geometry_Memo, material_Memo, { createEntities: true }]} position={[0, 0, 0]} />;
};

export default BackgroundMesh;

export const getInstanceCount = (params: GridData, isSquare: boolean) => {
    const { overallWidth, overallHeight, instancePadding, gridCount } = params;

    const overallArea = overallWidth * overallHeight;
    const idealInstanceArea = overallArea / gridCount;

    if (isSquare) {
        // Via https://stackoverflow.com/a/1575761
        const idealInstanceLength = Math.sqrt(idealInstanceArea);

        const columns = Math.round(overallWidth / idealInstanceLength);
        let rows = Math.round(overallHeight / idealInstanceLength);

        const minLength = Math.min(overallWidth / columns, overallWidth / rows);
        if (overallHeight > minLength * rows) rows++;

        return { ...params, instanceLength: minLength - instancePadding, gridCount: columns * rows, gridCountHorizontal: columns, gridCountVertical: rows };
    } else {
        const side = Math.sqrt((2 * idealInstanceArea) / (3 * Math.sqrt(3))); // same as radius

        const widthWhenStacked = side * 1.5;
        const columns = Math.round((overallWidth - side / 2 - instancePadding) / widthWhenStacked);

        const newWidthWhenStacked = (overallWidth + side / 2 + instancePadding) / columns;
        const newSide = newWidthWhenStacked * (2 / 3);
        const newDiameter = newSide * 2;

        const apothem = (Math.sqrt(3) / 2) * newSide; // half height
        const height = 2 * apothem;
        const rows = Math.ceil((overallHeight - apothem) / height) + 1; // pad rows beyond screen w/ +1

        return {
            ...params,
            instanceLength: newDiameter - instancePadding,
            gridCount: columns * rows,
            gridCountHorizontal: columns,
            gridCountVertical: rows,
        };
    }
};

export const getAdjacentIndices = (instanceIndex: number, numColumns: number, distance: number, isSquare = false) => {
    const [hexCol, hexRow] = HexagonGeometry.getColumnAndRowByIndex(instanceIndex, numColumns);

    let allNeighbors: number[] = [];

    if (isSquare) {
        const above = instanceIndex - numColumns;
        const toRight = instanceIndex + 1;
        const below = instanceIndex + numColumns;
        const toLeft = instanceIndex - 1;

        allNeighbors.push(above, toRight, below, toLeft);
    } else {
        // 6 = query all six directions
        let neighbors: [number, number][] = Array.from({ length: 6 }).map((_, idx) => HexagonGeometry.getNeighborsEvenQ([hexCol, hexRow], idx));

        distance && getDistantNeighbors(neighbors);

        allNeighbors = neighbors.map(([nCol, nRow]) => {
            let nIndex = nRow * numColumns + nCol;

            if (nCol < 0 || nCol >= numColumns) {
                nIndex = -1; // prevent wrapping to other side, as filtered below
            }

            return nIndex;
        });
    }

    return allNeighbors.filter((adjacent) => adjacent >= 0);
};

// TODO make this recursive?
const getDistantNeighbors = (neighbors: [number, number][]) => {
    const arrLength = neighbors.length;

    for (let i = 0; i < arrLength; i++) {
        const [nHexCol, nHexRow] = neighbors[i];
        const nextI = i < arrLength - 1 ? i + 1 : 0;

        /** neighbor queries two of it's further outwards neighbors: 0 queries 0, 1 --- 1 queries 1, 2 --- etc */

        const nColRow0 = HexagonGeometry.getNeighborsEvenQ([nHexCol, nHexRow], i);
        const nColRow1 = HexagonGeometry.getNeighborsEvenQ([nHexCol, nHexRow], nextI);

        neighbors.push(nColRow0, nColRow1);
    }

    return neighbors;
};

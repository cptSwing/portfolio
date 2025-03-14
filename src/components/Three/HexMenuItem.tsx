import { forwardRef, useCallback, useMemo } from 'react';
import { MathUtils, MeshPhysicalMaterial, WebGLRenderer } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { GridData, HexMenuMesh } from '../../types/types';
import { HexGrid } from '../../lib/classes/Grid';
import { getExtentsInNDC } from '../../lib/THREE_coordinateConversions';

// : FC<{ gridData: GridData; positionIndex: number; renderer: WebGLRenderer }>

const HexMenuItem = forwardRef<HexMenuMesh, { gridData: GridData; positionIndex: number; renderer: WebGLRenderer }>(
    ({ gridData, positionIndex, renderer }, ref) => {
        const { overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop } = gridData;

        const menuHexGeometry_Memo = useMemo(() => {
            const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);
            return new HexagonalPrismGeometry(gridInstanceSize * 3.25 * 2, gridInstanceSize * 10)
                .rotateX(MathUtils.degToRad(90))
                .rotateZ(MathUtils.degToRad(90));
        }, [instanceWidth, instanceFlatTop]);

        const refCallback = useCallback(
            (mesh: HexMenuMesh | null) => {
                if (mesh) {
                    // const forwardRef = ref as MutableRefObject<Mesh>;
                    // forwardRef.current = mesh;
                    const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);

                    HexGrid.setInstancePosition(mesh, positionIndex, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);
                    // forwardRef.current.position.setZ(-1.5);
                }

                if (typeof ref === 'function') {
                    ref(mesh);
                } else if (ref) {
                    ref.current = mesh;
                }
            },
            [overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop],
        );

        const hexMenuMaterial_Memo = useMemo(() => {
            renderer.transmissionResolutionScale = 0.5;
            return new MeshPhysicalMaterial({
                // side: DoubleSide,
                // iridescenceIOR: 0.9,
                // iridescence: 1,

                color: 0xaabbff,
                metalness: 0.1,
                roughness: 0.05,
                transmission: 0.8,
                thickness: 1,
                ior: 2,
            });
        }, []);

        return <mesh ref={refCallback} geometry={menuHexGeometry_Memo} material={hexMenuMaterial_Memo} />;
    },
);

export default HexMenuItem;

import { FC, useEffect, useMemo, useRef } from 'react';
import { MathUtils, Mesh, MeshPhysicalMaterial, WebGLRenderer } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { GridData } from '../../types/types';
import { HexGrid } from '../../lib/classes/Grid';
import { getExtentsInNDC } from '../../lib/ndcFromViewportCoordinates';

const HexMenuItem: FC<{ gridData: GridData; positionIndex: number; renderer: WebGLRenderer }> = ({ gridData, positionIndex, renderer }) => {
    const { overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop } = gridData;
    const meshRef = useRef<Mesh | null>(null);

    const menuHexGeometry_Memo = useMemo(() => {
        const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);
        return new HexagonalPrismGeometry(gridInstanceSize * 3.25 * 2, gridInstanceSize * 10).rotateX(MathUtils.degToRad(90)).rotateZ(MathUtils.degToRad(90));
    }, [instanceWidth, instanceFlatTop]);

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

    useEffect(() => {
        if (meshRef.current) {
            const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);

            HexGrid.setInstancePosition(meshRef.current, positionIndex, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);
            meshRef.current.position.setZ(-1.5);
        }
    }, [overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop]);

    return <mesh ref={meshRef} geometry={menuHexGeometry_Memo} material={hexMenuMaterial_Memo} />;
};

export default HexMenuItem;

import { FC, forwardRef, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Box3, Group, MathUtils, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { GridData, HexMenuMesh } from '../../types/types';
import { HexGrid } from '../../lib/classes/Grid';
import { getExtentsInNDC } from '../../lib/THREE_coordinateConversions';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import useForwardedRef from '../../hooks/useForwardedRef';

const HexMenuItem = forwardRef<HexMenuMesh, { gridData: GridData; positionIndex: number; scaleXZ?: [number, number] }>(
    ({ gridData, positionIndex, scaleXZ = [1, 2] }, ref) => {
        const { overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop } = gridData;
        const renderer = useThree((state) => state.gl);
        const [zMax, setZMax] = useState(0);

        const menuHexGeometry_Memo = useMemo(() => {
            const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);
            const [scaleX, scaleZ] = scaleXZ;
            return new HexagonalPrismGeometry(gridInstanceSize * scaleX, gridInstanceSize * scaleZ)
                .rotateX(MathUtils.degToRad(90))
                .rotateZ(MathUtils.degToRad(90));
        }, [instanceWidth, instanceFlatTop, scaleXZ]);

        const refCallback = useCallback(
            (mesh: HexMenuMesh | null) => {
                if (mesh) {
                    const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);
                    HexGrid.setInstancePosition(mesh, positionIndex, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);

                    !mesh.geometry.boundingBox && mesh.geometry.computeBoundingBox();
                    mesh.geometry.boundingBox && setZMax(mesh.geometry.boundingBox.max.z);
                }

                // if (typeof ref === 'function') {
                //     ref(mesh);
                // } else if (ref) {
                //     ref.current = mesh;
                // }

                // meshRef.current = mesh;
            },
            [overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop],
        );

        const meshRef = useForwardedRef(ref, refCallback);

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

        const active = true;
        const dummyRef = useRef(new Object3D());
        useFrame(({ pointer }, delta) => {
            if (active && meshRef.current) {
                pointer.clampScalar(-0.075, 0.075);
                dummyRef.current.lookAt(pointer.x, pointer.y, 1);
                easing.dampQ(meshRef.current.quaternion, dummyRef.current.quaternion, 0.5, delta, 1);
            }
        });

        return (
            <mesh ref={meshRef} geometry={menuHexGeometry_Memo} material={hexMenuMaterial_Memo}>
                <Html
                    transform
                    position-z={zMax + 0.05}
                    // distanceFactor={100}
                    // onUpdate={(self) => {
                    //     console.log('%c[HexMenuItem]', 'color: #2f44fd', `self :`, self);
                    // }}
                >
                    HIII
                </Html>
            </mesh>
        );
    },
);

export default HexMenuItem;

const LookAtMe = forwardRef<Group, { active?: boolean; children: ReactNode }>(({ active = true, children }, ref) => {
    const groupRef = useForwardedRef(ref);

    useFrame(({ pointer }, delta) => {
        if (active && groupRef.current) {
            pointer.clampScalar(-0.25, 0.25);
            easing.dampLookAt(groupRef.current, [pointer.x, pointer.y, 1], 0.5, delta, 1);
        }
    });

    return <group ref={groupRef}>{children}</group>;
});

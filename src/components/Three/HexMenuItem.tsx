import { FC, forwardRef, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Group, MathUtils, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, Vector3 } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { GridData, HexMenuMesh } from '../../types/types';
import { HexGrid } from '../../lib/classes/Grid';
import { getExtentsInNDC } from '../../lib/THREE_coordinateConversions';
import { Html, useSelect } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import useForwardedRef from '../../hooks/useForwardedRef';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import HalfHexagonGeometry from '../../lib/classes/HalfHexagonGeometry';
import { animationSettings, vectors } from '../../config/threeSettings';

const tempVector = new Vector3();

const HexMenuItem = forwardRef<HexMenuMesh, { gridData: GridData; positionIndex: number; scaleXZ?: [number, number] }>(
    ({ gridData, positionIndex, scaleXZ = [1, 2] }, ref) => {
        const { overallWidth, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop } = gridData;
        const [scaleX, scaleZ] = scaleXZ;

        const [zMax, setZMax] = useState(0);

        const hexMenuGeometry_Memo = useMemo(() => {
            const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);
            return new HexagonalPrismGeometry(gridInstanceSize * scaleX, gridInstanceSize * scaleZ)
                .rotateX(MathUtils.degToRad(90))
                .rotateZ(MathUtils.degToRad(90));
            // .center();
        }, [instanceWidth, instanceFlatTop, scaleXZ]);

        const refCallback = useCallback(
            (mesh: HexMenuMesh | null) => {
                if (mesh) {
                    const [extentX, extentY] = getExtentsInNDC(overallWidth, overallHeight);
                    HexGrid.setInstancePosition(mesh, positionIndex, gridColumns, [extentX, extentY], instanceWidth, instancePadding, instanceFlatTop);

                    !mesh.geometry.boundingBox && mesh.geometry.computeBoundingBox();
                    mesh.geometry.boundingBox && setZMax(mesh.geometry.boundingBox.max.z);
                }
            },
            [overallWidth, positionIndex, overallHeight, gridColumns, gridRows, instanceWidth, instancePadding, instanceFlatTop],
        );

        const meshRef = useForwardedRef(ref, refCallback);

        const hexMenuMaterial_Memo = useMemo(
            () =>
                new MeshPhongMaterial({
                    // wireframe: true,
                    flatShading: true,
                    transparent: true,
                    opacity: 1,
                    color: 0xaabbee,
                }),
            [],
        );

        const selected = useSelect();
        const [isSelected, setIsSelected] = useState(false);
        const [cameraMovement, setCameraMovement] = useState<Vector3 | null>(null);
        const camera = useThree((state) => state.camera);

        useLayoutEffect(() => {
            if (selected.length) {
                if (selected[0].uuid === meshRef.current?.uuid) {
                    hexMenuMaterial_Memo.opacity = 0.5;
                    setIsSelected(true);
                } else {
                    hexMenuMaterial_Memo.opacity = 0;
                    setIsSelected(false);
                }

                tempVector.copy(camera.position);
                tempVector.x *= -1;
                setCameraMovement(tempVector);
            } else {
                hexMenuMaterial_Memo.opacity = 1;
                setIsSelected(false);
            }
        }, [selected]);

        useFrame(({ camera }, delta) => {
            if (cameraMovement) {
                const isRunning = easing.damp3(camera.position, cameraMovement, 0.5, delta);
                camera.lookAt(vectors.zeroVector3);

                if (!isRunning) {
                    setCameraMovement(null);
                }
            }
        });

        // const dummyRef = useRef(new Object3D());
        // useFrame(({ pointer }, delta) => {
        //     if (isSelected && meshRef.current) {
        //         pointer.clampScalar(-0.075, 0.075);
        //         dummyRef.current.lookAt(pointer.x, pointer.y, 1);
        //         easing.dampQ(meshRef.current.quaternion, dummyRef.current.quaternion, 0.5, delta, 1);
        //     }
        // });

        return (
            <mesh
                ref={meshRef}
                geometry={hexMenuGeometry_Memo}
                material={hexMenuMaterial_Memo}
                position-z={isSelected && animationSettings.menu.menuItemOffsetZ}
            >
                {(isSelected || !selected.length) && (
                    <Html occlude transform position-z={zMax + 0.05} distanceFactor={1}>
                        {`${isSelected ? 'selected ' : positionIndex}`}
                    </Html>
                )}
                {isSelected && <HexMenuContent gridData={gridData} scaleX={scaleX} widthPx={400} htmlZ={zMax} />}
            </mesh>
        );
    },
);

export default HexMenuItem;

const HexMenuContent: FC<{ gridData: GridData; scaleX: number; widthPx: number; htmlZ: number }> = ({ gridData, scaleX, widthPx, htmlZ }) => {
    const { instanceWidth, instanceFlatTop } = gridData;
    const renderer = useThree((state) => state.gl);

    const hexItemContentGeo_Memo = useMemo(() => {
        const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);

        const radius = gridInstanceSize * scaleX;
        const halfTop = new HalfHexagonGeometry(radius);
        const squareBetween = new PlaneGeometry(radius * 2, 0);
        const halfBottom = new HalfHexagonGeometry(radius).rotateZ(MathUtils.degToRad(180));

        const geo = BufferGeometryUtils.mergeGeometries([halfTop, squareBetween, halfBottom]).translate(0, 0, instanceWidth);

        return geo;
    }, [instanceWidth, instanceFlatTop, scaleX]);

    useEffect(() => {
        if (hexItemContentGeo_Memo.index) {
            HalfHexagonGeometry.translateXPosition(9, hexItemContentGeo_Memo.index, hexItemContentGeo_Memo.attributes['position']);
            HalfHexagonGeometry.translateYPosition(-6, hexItemContentGeo_Memo.index, hexItemContentGeo_Memo.attributes['position']);
        }
    }, [hexItemContentGeo_Memo, widthPx]);

    const hexItemContentMat_Memo = useMemo(() => {
        renderer.transmissionResolutionScale = 0.5;
        return new MeshPhysicalMaterial({
            // side: DoubleSide,
            // iridescenceIOR: 0.9,
            // iridescence: 1,
            // wireframe: true,

            // color: 0xaabbff,
            color: 'gray',

            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.45,
            thickness: 1,
            ior: 2,
        });
    }, []);

    return (
        <mesh geometry={hexItemContentGeo_Memo} material={hexItemContentMat_Memo}>
            <Html
                style={{ width: widthPx / 2 }}
                occlude
                // transform
                position-z={htmlZ + 0.05}
                distanceFactor={1}
            >
                <div className='overflow-hidden text-white' onPointerDown={(e) => e.stopPropagation()}>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making
                    it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                    words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable
                    source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                    written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,
                    "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced
                    below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
                    original form, accompanied by English versions from the 1914 translation by H. Rackham.
                </div>
            </Html>
        </mesh>
    );
};

const _LookAtMe = forwardRef<Group, { active?: boolean; children: ReactNode }>(({ active = true, children }, ref) => {
    const groupRef = useForwardedRef(ref);

    useFrame(({ pointer }, delta) => {
        if (active && groupRef.current) {
            pointer.clampScalar(-0.25, 0.25);
            easing.dampLookAt(groupRef.current, [pointer.x, pointer.y, 1], 0.5, delta, 1);
        }
    });

    return <group ref={groupRef}>{children}</group>;
});

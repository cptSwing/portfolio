import { FC, forwardRef, MutableRefObject, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Color, Group, MathUtils, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, Vector3 } from 'three';
import HexagonalPrismGeometry from '../../lib/classes/HexagonalPrismGeometry';
import { GridData, HexMenuMesh, InstancedGridMesh } from '../../types/types';
import { HexGrid } from '../../lib/classes/Grid';
import { getExtentsFromOrigin } from '../../lib/THREE_coordinateConversions';
import { Html, useSelect } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import useForwardedRef from '../../hooks/useForwardedRef';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import HexagonGeometry, { translateXPosition, translateYPosition } from '../../lib/classes/HexagonGeometry';
import { vectors } from '../../config/threeSettings';

const HexMenuItem = forwardRef<
    Group,
    { gridData: GridData; gridMesh: MutableRefObject<InstancedGridMesh | null>; shapeIndices: number[][]; scaleXZ?: [number, number] }
>(({ gridData, gridMesh, shapeIndices, scaleXZ }, ref) => {
    const { gridWidth, gridHeight, gridColumnCount, gridRowCount, instanceWidth, instancePadding, instanceFlatTop } = gridData;

    const [zMax, setZMax] = useState(0);
    // const htmlGroup_Ref = useRef<Group | null>();
    const htmlGroup_Ref = useForwardedRef(ref);

    const handleMount = useCallback(
        (elem: HTMLDivElement | null) => {
            console.log('%c[HexMenuItem]', 'color: #99d138', `${shapeIndices[0]} --> handleMount() --> elem :`, elem);

            if (elem) {
                if (htmlGroup_Ref.current) {
                    // --> Set Group position to center hex
                    const [extentX, extentY] = getExtentsFromOrigin(gridWidth, gridHeight);
                    HexGrid.setInstancePosition(
                        htmlGroup_Ref.current,
                        shapeIndices[0][0],
                        gridColumnCount,
                        [extentX, extentY],
                        instanceWidth,
                        instancePadding,
                        instanceFlatTop,
                    );
                }
            }
        },
        [gridWidth, shapeIndices, gridMesh, gridHeight, gridColumnCount, gridRowCount, instanceWidth, instancePadding, instanceFlatTop],
    );

    const [cameraMovement, setCameraMovement] = useState<Vector3 | null>(null);

    useFrame(({ camera }, delta) => {
        if (cameraMovement) {
            const isRunning = easing.damp3(camera.position, cameraMovement, 0.5, delta);
            camera.lookAt(vectors.zeroVector3);

            if (!isRunning) {
                setCameraMovement(null);
            }
        }
    });

    return (
        <Html
            ref={handleMount}
            transform
            distanceFactor={10}
            // occlude
            position-z={zMax + 0.05}
            onUpdate={(self) => {
                if (htmlGroup_Ref) {
                    htmlGroup_Ref.current = self;
                }
            }}
        >
            <div className='size-full cursor-pointer'>{`${shapeIndices[0]}`}</div>
        </Html>
    );
});

export default HexMenuItem;

const HexMenuContent: FC<{ gridData: GridData; scaleX: number; widthPx: number; htmlZ: number }> = ({ gridData, scaleX, widthPx, htmlZ }) => {
    const { instanceWidth, instanceFlatTop } = gridData;
    const renderer = useThree((state) => state.gl);

    const hexItemContentGeo_Memo = useMemo(() => {
        const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);

        const radius = gridInstanceSize * scaleX;
        const halfTop = new HexagonGeometry(radius, true);
        const squareBetween = new PlaneGeometry(radius * 2, 0);
        const halfBottom = new HexagonGeometry(radius, true).rotateZ(MathUtils.degToRad(180));

        const geo = BufferGeometryUtils.mergeGeometries([halfTop, squareBetween, halfBottom]).translate(0, 0, instanceWidth);

        return geo;
    }, [instanceWidth, instanceFlatTop, scaleX]);

    useEffect(() => {
        if (hexItemContentGeo_Memo.index) {
            translateXPosition(9, hexItemContentGeo_Memo.index, hexItemContentGeo_Memo.attributes['position']);
            translateYPosition(-6, hexItemContentGeo_Memo.index, hexItemContentGeo_Memo.attributes['position']);
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

const HexMenuItemMesh: FC<{ children: ReactNode; gridData: GridData; scaleXZ?: [number, number] }> = ({ children, gridData, scaleXZ = [1, 2] }) => {
    const { gridWidth, gridHeight, gridColumnCount, gridRowCount, instanceWidth, instancePadding, instanceFlatTop } = gridData;
    const [scaleX, scaleZ] = scaleXZ;

    const hexMenuGeometry_Memo = useMemo(() => {
        const gridInstanceSize = HexGrid.getSizeFromWidth(instanceWidth, !instanceFlatTop);
        return new HexagonalPrismGeometry(gridInstanceSize * scaleX, gridInstanceSize * scaleZ).rotateX(MathUtils.degToRad(90)).rotateZ(MathUtils.degToRad(90));
    }, [instanceWidth, instanceFlatTop, scaleXZ]);

    const hexMenuMaterial_Memo = useMemo(
        () =>
            new MeshPhongMaterial({
                // wireframe: true,
                flatShading: true,
                transparent: true,
                opacity: 0.25,
                color: 0xaabbee,
                visible: false, // The meshes are used for raycasting only atm
            }),
        [],
    );

    const selected = useSelect();

    // useLayoutEffect(() => {
    //     if (selected.length) {
    //         if (selected[0].uuid === meshRef.current?.uuid) {
    //             hexMenuMaterial_Memo.opacity = 0.5;
    //             setIsSelected(true);
    //         } else {
    //             hexMenuMaterial_Memo.opacity = 0;
    //             setIsSelected(false);
    //         }

    //         tempVector.copy(camera.position);
    //         tempVector.x *= -1;
    //         setCameraMovement(tempVector);
    //     } else {
    //         hexMenuMaterial_Memo.opacity = 0.25;
    //         setIsSelected(false);
    //     }
    // }, [selected]);

    // const dummyRef = useRef(new Object3D());
    // useFrame(({ pointer }, delta) => {
    //     if (isSelected && innerRef.current) {
    //         pointer.clampScalar(-0.075, 0.075);
    //         dummyRef.current.lookAt(pointer.x, pointer.y, 1);
    //         easing.dampQ(innerRef.current.quaternion, dummyRef.current.quaternion, 0.5, delta, 1);
    //     }
    // });

    return (
        <mesh
            // ref={meshRef}
            geometry={hexMenuGeometry_Memo}
            material={hexMenuMaterial_Memo}
            // position-z={isSelected && instanceWidth * animationSettings.menu.menuItemOffsetZMultiplier}
        >
            {children}
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

import { Canvas } from '@react-three/fiber';
import { /* PerspectiveCamera as PerspectiveCameraImpl, */ OrthographicCamera as OrthographicCameraImpl } from '@react-three/drei';
import BackgroundGrid from './BackgroundGrid';
import { Vector3 } from 'three';
import { useWindowSize } from 'react-use';
import { useMemo } from 'react';

const lookAtVector = new Vector3();

const ThreeCanvas = () => {
    const { width, height } = useWindowSize();

    const orthoFrustum_Memo = useMemo(() => {
        const scaledWidth = width / 100;
        const scaledHeight = height / 100;

        const viewSize = scaledHeight;
        const aspectRatio = scaledWidth / scaledHeight; // 1 unit = 100 pixel
        const left = (-aspectRatio * viewSize) / 2;
        const right = (aspectRatio * viewSize) / 2;
        const top = viewSize / 2;
        const bottom = -viewSize / 2;

        return {
            left,
            right,
            top,
            bottom,
        };
    }, [width, height]);

    return (
        <div className='fixed bottom-0 left-0 right-0 top-0 -z-50'>
            <Canvas gl={{ alpha: true, antialias: true }}>
                {/* <PerspectiveCameraImpl
                    makeDefault
                    position={[0, 0, cameraSettings.offset]}
                    fov={45}
                    aspect={window.innerWidth / window.innerHeight}
                    near={Math.max(0, cameraSettings.offset - 5)}
                    far={cameraSettings.offset + 2}
                /> */}

                <OrthographicCameraImpl
                    makeDefault
                    left={orthoFrustum_Memo.left}
                    right={orthoFrustum_Memo.right}
                    top={orthoFrustum_Memo.top}
                    bottom={orthoFrustum_Memo.bottom}
                    position={[orthoFrustum_Memo.right / 3, 0, Math.max(orthoFrustum_Memo.right, orthoFrustum_Memo.top)]}
                    zoom={1}
                    onUpdate={(self) => {
                        self.lookAt(lookAtVector);
                        const dist = self.position.length();
                        self.near = 0.1;
                        self.far = dist * 2;
                    }}
                />
                <BackgroundGrid isSquare={false} />
                <Lights />
            </Canvas>
        </div>
    );
};

export default ThreeCanvas;

const Lights = () => {
    return (
        <>
            <ambientLight color='white' intensity={1} />
            <directionalLight position={[-1, 2, 1]} color={0xffffff} intensity={1.5} />
            <directionalLight position={[1, 2, 1]} color={0xffffff} intensity={1.5} />
            <directionalLight position={[0, -2, -1]} color={0xbbbbff} intensity={0.25} />
        </>
    );
};

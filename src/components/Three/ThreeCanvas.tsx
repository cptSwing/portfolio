import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera as PerspectiveCameraImpl } from '@react-three/drei';
import BackgroundGrid from './BackgroundGrid';

const cameraOffset = 30;

const ThreeCanvas = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 top-0 -z-50'>
            <Canvas gl={{ alpha: true, antialias: true }}>
                <PerspectiveCameraImpl
                    makeDefault
                    position={[0, 0, cameraOffset]}
                    fov={45}
                    aspect={window.innerWidth / window.innerHeight}
                    near={Math.max(0, cameraOffset - 5)}
                    far={cameraOffset + 2}
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

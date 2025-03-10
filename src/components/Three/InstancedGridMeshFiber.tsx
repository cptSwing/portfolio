import { forwardRef } from 'react';
import { extend } from '@react-three/fiber';
import { InstancedMesh2, InstancedMesh2Params } from '@three.ez/instanced-mesh';
import { InstancedGridMesh } from '../../types/types';

extend({ InstancedMesh2 });

const InstancedGridMeshFiber = forwardRef<
    InstancedGridMesh,
    {
        geometry: InstancedGridMesh['geometry'];
        material: InstancedGridMesh['material'];
        params?: InstancedMesh2Params;
    }
>(({ geometry, material, params }, ref) => {
    return <instancedMesh2 ref={ref} args={[geometry, material, params]} />;
});

export default InstancedGridMeshFiber;

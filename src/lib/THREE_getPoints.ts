import { BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, SRGBColorSpace, Points } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const getPoints = (width: number, height: number) => {
    let geometry = new BufferGeometry();
    const vertices = getRandomVertices3D(1000, [width / 2, height / 2, 5]);
    const bufferAttribute = new Float32BufferAttribute(vertices, 3);
    geometry.setAttribute('position', bufferAttribute);
    // geometry.setIndex(bufferAttribute);
    geometry = mergeVertices(geometry);

    const material = new PointsMaterial({ size: 5, sizeAttenuation: false, transparent: true, opacity: 0.5, blending: AdditiveBlending });
    material.color.setHSL(1.0, 0.3, 0.7, SRGBColorSpace);

    const particles = new Points(geometry, material);
    return particles;
};

export default getPoints;

const getEquallyDistributedVertices2D = () => {
    // const grid = new PlaneGeometry(width, height, 200, 100)
};

const getRandomVertices3D = (count: number, maxExtents: [number, number, number]) => {
    const [maxX, maxY, _maxZ] = maxExtents;

    const vertices = [];

    for (let i = 0; i < count; i++) {
        const x = maxX * 2 * Math.random() - maxX;
        const y = maxY * 2 * Math.random() - maxY;
        // const z = Math.abs(maxZ * 2 * Math.random() - maxZ) * -2;
        const z = 0;

        vertices.push(x, y, z);
    }
    return vertices;
};

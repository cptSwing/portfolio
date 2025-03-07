import { BufferAttribute, InterleavedBufferAttribute, Mesh, PerspectiveCamera, Vector2, Vector3 } from 'three';

/** Calculate the width and height at a given Z depth from a Perspective Camera */
export const getWidthHeight = (depth: number, camera: PerspectiveCamera) => {
    const widthAtZ = visibleWidthAtZDepth(depth, camera);
    const heightAtZ = visibleHeightAtZDepth(depth, camera);
    return [widthAtZ, heightAtZ];
};

/** https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269 */
const visibleHeightAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = (camera.fov * Math.PI) / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

/** Adapted from https://discourse.threejs.org/t/how-ot-get-vertices-faces-facevertexuvs-from-buffergeometry/23086/3 */

const isIndexed = (mesh: Mesh) => mesh.geometry.index !== null;

const getFaces = (mesh: Mesh) => {
    const faces = [];
    const position = mesh.geometry.getAttribute('position');

    if (isIndexed(mesh)) {
        const index = mesh.geometry.getIndex() as BufferAttribute;

        for (let i = 0; i < index.count; i += 3) {
            const face = {
                a: index.getX(i),
                b: index.getX(i + 1),
                c: index.getX(i + 2),
                // normal: new Vector3(),
            };
            faces.push(face);
        }
    } else {
        for (let i = 0; i < position.count; i += 3) {
            const face = {
                a: i,
                b: i + 1,
                c: i + 2,
            };
            faces.push(face);
        }
    }

    for (let j = 0; j < faces.length; j++) {
        const face = faces[j];
        const pointA = new Vector3(position.getX(face.a), position.getY(face.a), position.getZ(face.a));
        const pointB = new Vector3(position.getX(face.b), position.getY(face.b), position.getZ(face.b));
        const pointC = new Vector3(position.getX(face.c), position.getY(face.c), position.getZ(face.c));

        // let faceTriangule = new Triangule(pointA, pointB, pointC);
        // faceTriangule.getNormal(faces[j].normal);
    }

    return faces;
};

const getVertices = (mesh: Mesh) => {
    const position = mesh.geometry.getAttribute('position');
    const vertices = [];

    for (let i = 0; i < position.count / position.itemSize; i++) {
        const vertex = new Vector3(position.getX(i), position.getY(i), position.getZ(i));

        vertices.push(vertex);
    }

    return vertices;
};

const getFaceVertexUvs = (mesh: Mesh) => {
    const faceVertexUvs = [];
    const uv = mesh.geometry.getAttribute('uv');

    if (isIndexed(mesh)) {
        const index = mesh.geometry.getIndex() as BufferAttribute;

        for (let i = 0; i < index.count; i += 3) {
            const faceVertexUv = [
                // new Vector2(uv.getX(index.getX(i)), uv.getY(index.getX(i))),
                new Vector2(...getIndexedVertex(i, index, uv).points),
                new Vector2(...getIndexedVertex(i + 1, index, uv).points),
                new Vector2(...getIndexedVertex(i + 2, index, uv).points),
            ];

            faceVertexUvs.push(faceVertexUv);
        }
    } else {
        for (let i = 0; i < uv.count; i += 3) {
            const faceVertexUv = [
                new Vector2(uv.getX(i), uv.getY(i)),
                new Vector2(uv.getX(i + 1), uv.getY(i + 1)),
                new Vector2(uv.getX(i + 2), uv.getY(i + 2)),
            ];

            faceVertexUvs.push(faceVertexUv);
        }
    }

    return faceVertexUvs;
};

type VertexCollection = { attributeIndex: number; points: number[] };

export const getIndexedVertex = (vIndex: number, index: BufferAttribute, attribute: BufferAttribute | InterleavedBufferAttribute) => {
    const attributeIndex = index.getX(vIndex);

    const points = [];

    for (let i = 0; i < attribute.itemSize; i++) {
        points.push(attribute.getComponent(attributeIndex, i));
    }

    return { points, attributeIndex } as VertexCollection;
};

export const setIndexedVertex = (
    vIndex: number,
    index: BufferAttribute,
    attribute: BufferAttribute | InterleavedBufferAttribute,
    values: [number] | [number, number] | [number, number, number] | [number, number, number, number],
) => {
    const attributeIndex = index.getX(vIndex);

    if (attribute.itemSize === 1 && values.length === 1) {
        attribute.setX(attributeIndex, ...(values as [number]));
    } else if (attribute.itemSize === 2 && values.length === 2) {
        attribute.setXY(attributeIndex, ...(values as [number, number]));
    } else if (attribute.itemSize === 3 && values.length === 3) {
        attribute.setXYZ(attributeIndex, ...(values as [number, number, number]));
    } else if (attribute.itemSize === 4 && values.length === 4) {
        attribute.setXYZW(attributeIndex, ...(values as [number, number, number, number]));
    }

    return [attributeIndex, attribute.getX(attributeIndex), attribute.getY(attributeIndex)];
};

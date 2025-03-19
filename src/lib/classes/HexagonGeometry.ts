import { BufferAttribute, CircleGeometry, InterleavedBufferAttribute, MathUtils } from 'three';
import { getIndexedVertex, setIndexedVertex } from '../THREE_bufferAttributeHelpers';

// With guidance from https://eperezcosano.github.io/hex-grid/

/** "even-q" vertical layout, as per here: https://www.redblobgames.com/grids/hexagons/#coordinates-offset */

export default class HexagonGeometry extends CircleGeometry {
    static hexAngle = (2 * Math.PI) / 6; // 60 deg
    static cos = Math.cos(this.hexAngle);
    static sin = Math.sin(this.hexAngle);

    constructor(radius: number, half = false) {
        super(radius, half ? 3 : 6, 0, half ? MathUtils.degToRad(180) : 0);
    }
}

export const translateXPosition = (translateBy: number, index: BufferAttribute, attribute: BufferAttribute | InterleavedBufferAttribute) => {
    [0, 1, 11, 13, 19, 22].forEach((vIndex) => {
        const { points } = getIndexedVertex(vIndex, index, attribute);
        setIndexedVertex(vIndex, index, attribute, [points[0] + translateBy, points[1], points[2]]);
    });
    // this.attributes['position'].needsUpdate = true;
};

export const translateYPosition = (translateBy: number, index: BufferAttribute, attribute: BufferAttribute | InterleavedBufferAttribute) => {
    const lowerHalfIndices = [15, 16, 17, 19, 22];
    [...lowerHalfIndices, 10, 13].forEach((vIndex) => {
        const { points } = getIndexedVertex(vIndex, index, attribute);
        setIndexedVertex(vIndex, index, attribute, [points[0], points[1] + translateBy, points[2]]);
    });
    // this.attributes['position'].needsUpdate = true;
};

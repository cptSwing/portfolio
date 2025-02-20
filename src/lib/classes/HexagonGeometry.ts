import { CircleGeometry } from 'three';

// With guidance from https://eperezcosano.github.io/hex-grid/

export default class HexagonGeometry extends CircleGeometry {
    angle = (2 * Math.PI) / 6; // 60 deg
    radius;
    horizontalColumnOffset;
    verticalColumnOffset;
    rowOffset;

    constructor(radius: number, thetaStart?: number, thetaLength?: number) {
        super(radius, 6, thetaStart, thetaLength);
        this.radius = radius;

        const angle = this.angle;
        const rSin = radius * Math.sin(angle);
        const rCos = radius * Math.cos(angle);

        this.horizontalColumnOffset = radius + rCos;
        this.verticalColumnOffset = rSin;
        this.rowOffset = rSin * 2;
    }

    getXYOffsets(column: number, row: number, padding: number) {
        const horizontalColumnOffset = this.horizontalColumnOffset;
        const verticalColumnOffset = this.verticalColumnOffset;
        const rowOffset = this.rowOffset;

        let evenOrUneven = column % 2 === 0 ? 0 : 1;

        const x = column * horizontalColumnOffset;
        const y = verticalColumnOffset * evenOrUneven + row * rowOffset;

        return [x, y];
    }
}

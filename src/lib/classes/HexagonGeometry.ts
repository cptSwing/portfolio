import { CircleGeometry } from 'three';

// With guidance from https://eperezcosano.github.io/hex-grid/

export default class HexagonGeometry extends CircleGeometry {
    radius; // width / 2
    horizontalColumnOffset;
    verticalColumnOffset;
    rowOffset; // height

    constructor(radius: number, thetaStart?: number, thetaLength?: number) {
        super(radius, 6, thetaStart, thetaLength);
        this.radius = radius;

        const angle = (2 * Math.PI) / 6; // 60 deg
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
        const radius = this.radius;

        const evenOrUneven = column % 2 === 0 ? 1 : 0;

        let x = column * (horizontalColumnOffset + padding);
        let y = (verticalColumnOffset + padding / 2) * evenOrUneven + row * (rowOffset + padding);

        x -= radius / 2; // start offset to left

        return [x, y];
    }
}

import { config } from '../types/exportTyped';
import { ROUTE } from '../types/enums';
import {
    CategoryLinkButtonRouteData,
    HexagonRouteData,
    HexagonRouteDataTransformOffsets,
    HexagonTransformData,
    FunctionalButtonRouteData,
} from '../types/types';
import roundToDecimal from './roundToDecimal';
import { categoryCardActive, categoryCardInactive, hexagonGridTransformCenter } from './hexagonElements';
import isNumber from './isNumber';

const {
    ui: {
        hexGrid: { scaleUp, gutterWidth: strokeWidthDefault, clipPathWidth, clipPathHeight },
    },
} = config;

export const staticValues = {
    heightAspect: {
        flatTop: 0.866,
        pointyTop: 1.1547,
    },
    tilingMultiplierHorizontal: {
        flatTop: 1.5,
        pointyTop: 1,
    },
    tilingMultiplierVertical: {
        flatTop: 1,
        pointyTop: 1.5,
    },
};

// TODO put to config? or a static.json?
export const viewBoxWidth = 400;
export const viewBoxHeight = viewBoxWidth * staticValues.heightAspect.flatTop;
export const viewBoxAspect = viewBoxWidth / viewBoxHeight;

const tan30 = Math.tan(degToRad(30));
const tan60 = Math.tan(degToRad(60));
const sin30 = sin(30);
const cos30 = cos(30);

const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;
const centerPosition = viewBoxWidth / 2 - hexHalfWidth; // 100 width hexagon, transform top left corner, 400 width viewbox = 150 (hence spans 150 to 250)

const roundedHexagonPath = getHexagonPath({ sideLength: hexHalfWidth, cornerRadius: hexHalfWidth / 5 });
const strokedRoundedHexagonPath = getHexagonPath({ sideLength: hexHalfWidth, cornerRadius: hexHalfWidth / 5, inner: 'stroke', innerSize: 0.97 });
const wideStrokedRoundedHexagonPath = getHexagonPath({ sideLength: hexHalfWidth, cornerRadius: hexHalfWidth / 5, inner: 'stroke', innerSize: 0.9 });
const halfRoundedHexagonPath = getHexagonPath({ sideLength: hexHalfWidth, cornerRadius: hexHalfWidth / 5, isHalf: true });
const halfStrokedRoundedHexagonPath = getHexagonPath({
    sideLength: hexHalfWidth,
    cornerRadius: hexHalfWidth / 5,
    isHalf: true,
    inner: 'stroke',
    innerSize: 0.9,
});

export const hexagonClipPathStatic = `path("${roundedHexagonPath}")`;
export const halfHexagonClipPathStatic = `path("${halfRoundedHexagonPath}")`;
export const strokedHexagonClipPathStatic = `path("${strokedRoundedHexagonPath}")`;
export const wideStrokedHexagonClipPathStatic = `path("${wideStrokedRoundedHexagonPath}")`;
export const halfStrokedHexagonClipPathStatic = `path("${halfStrokedRoundedHexagonPath}")`;

export const subMenuButtonHexagonPath = getHexagonPath({ sideLength: 0.5, cornerRadius: 1 });

export function offsetHexagonTransforms<T>(baseTransforms: T, offsets: HexagonRouteDataTransformOffsets): T;
export function offsetHexagonTransforms<T>(baseTransforms: T[], offsets: HexagonRouteDataTransformOffsets[]): T[];
export function offsetHexagonTransforms<T = HexagonRouteData | CategoryLinkButtonRouteData | FunctionalButtonRouteData>(
    baseTransforms: T | T[],
    offsets: HexagonRouteDataTransformOffsets | HexagonRouteDataTransformOffsets[],
): T | T[] {
    if (!Array.isArray(baseTransforms) && !Array.isArray(offsets)) {
        return offsetRoute(baseTransforms, offsets) as T;
    } else if ((baseTransforms as T[]).length && (offsets as HexagonRouteDataTransformOffsets[]).length) {
        return (baseTransforms as T[]).map((genericRouteData, idx) =>
            offsetRoute(genericRouteData, (offsets as HexagonRouteDataTransformOffsets[])[idx]),
        ) as T[];
    } else {
        throw new Error('invalid input arguments');
    }
}

function offsetRoute<T>(routeData: T, routeOffset?: HexagonRouteDataTransformOffsets) {
    const newRouteData: T = { ...routeData };

    let key: keyof T;
    for (key in routeData) {
        if (key in ROUTE && routeOffset && key in routeOffset) {
            const route = key as unknown as ROUTE;
            (newRouteData as HexagonRouteData)[route] = {
                ...(newRouteData as HexagonRouteData)[route],
                ...routeOffset[route],
            };
        }
    }

    return newRouteData;
}

export function transformCategoryHalfHexagons(
    routeTransforms: HexagonTransformData,
    imaginaryHexagonScale?: number,
    iris = false,
    center = hexagonGridTransformCenter,
): HexagonRouteDataTransformOffsets {
    let returnOffsets = routeTransforms;

    if (isNumber(imaginaryHexagonScale)) {
        const imaginaryHexagonScaleTyped = imaginaryHexagonScale as number;
        const oldPosition = returnOffsets.position;
        const newPosition = { ...oldPosition };

        let newRotation = returnOffsets.rotation;
        const newScale = imaginaryHexagonScaleTyped / 2;

        if (iris) {
            if (oldPosition.x < center.x) {
                if (oldPosition.y < center.y) {
                    newPosition.x = center.x - 12.5 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y - 21.65 * imaginaryHexagonScaleTyped;
                } else {
                    newPosition.x = center.x - 25 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y;
                }
            } else if (oldPosition.x === center.x) {
                if (newPosition.y < center.y) {
                    newPosition.x = center.x + 12.5 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y - 21.65 * imaginaryHexagonScaleTyped;
                } else {
                    newPosition.x = center.x - 12.5 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y + 21.65 * imaginaryHexagonScaleTyped;
                }
            } else {
                if (oldPosition.y > center.y) {
                    newPosition.x = center.x + 12.5 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y + 21.65 * imaginaryHexagonScaleTyped;
                } else {
                    newPosition.x = center.x + 25 * imaginaryHexagonScaleTyped;
                    newPosition.y = center.y;
                }
            }

            newRotation -= 120;
        } else {
            if (oldPosition.x < center.x) {
                newPosition.x = center.x - 37.5 * imaginaryHexagonScaleTyped;
            } else if (oldPosition.x > center.x) {
                newPosition.x = center.x + 37.5 * imaginaryHexagonScaleTyped;
            }

            let yOffset;
            if (oldPosition.x === center.x) {
                yOffset = 43.3;
            } else {
                yOffset = 21.65;
            }

            if (oldPosition.y < center.y) {
                newPosition.y = center.y - yOffset * imaginaryHexagonScaleTyped;
            } else if (oldPosition.y > center.y) {
                newPosition.y = center.y + yOffset * imaginaryHexagonScaleTyped;
            }
        }

        returnOffsets = { ...returnOffsets, position: newPosition, scale: newScale * 1, rotation: newRotation };
    }

    return { [ROUTE.category]: returnOffsets };
}

export function getCategoryHexagons(count: number): HexagonTransformData[] {
    const activeHexagonScale = categoryCardActive.scale;
    const inactiveHexagonScale = activeHexagonScale / Math.max(count - 1, 8);

    const allHexagons = [categoryCardActive];

    if (count > 1) {
        const extraHexagons = count - 1;

        const activeHexagonWidthInViewBox = clipPathWidth * activeHexagonScale;
        const activeHexagonHeightInViewBox = clipPathHeight * activeHexagonScale;

        const _activeHexagonHalfWidth = activeHexagonWidthInViewBox / 2;
        const activeHexagonThreeQuarterWidth = activeHexagonWidthInViewBox * 0.75;
        const _activeHexagonQuarterWidth = activeHexagonWidthInViewBox / 4;
        const activeHexagonHalfHeight = activeHexagonHeightInViewBox / 2;

        const inactiveHexagonWidth = clipPathWidth * inactiveHexagonScale;
        const inactiveHexagonHeight = clipPathHeight * inactiveHexagonScale;

        const _inactiveHexagonHeightOffset = Math.min(inactiveHexagonHeight, (activeHexagonHalfHeight - inactiveHexagonHeight) / count);
        const inactiveHexagonWidthOffset =
            Math.min(inactiveHexagonWidth, (activeHexagonThreeQuarterWidth - inactiveHexagonWidth) / count) + inactiveHexagonWidth / 8;

        for (let i = 0; i < extraHexagons; i++) {
            // const additionalHexagonStartingPositionY = 5 + inactiveHexagonHeightOffset * (i);
            // const additionalHexagonStartingPositionX = additionalHexagonStartingPositionY / -tan60 + position.x - activeHexagonQuarterWidth - inactiveHexagonWidth;

            const centered = extraHexagons % 2 === 0 ? extraHexagons / 4 : Math.floor(extraHexagons / 2);
            const inactiveHexagonStartingPositionX = inactiveHexagonWidthOffset * i + (centerPosition - centered * inactiveHexagonWidthOffset);

            const inactiveHexagon = { ...categoryCardInactive };
            inactiveHexagon.position = { ...categoryCardInactive.position, x: inactiveHexagonStartingPositionX };
            inactiveHexagon.scale = inactiveHexagonScale;

            allHexagons.push(inactiveHexagon);
        }
    }

    return allHexagons;
}

type Point = [number, number];
type PointOpts = {
    point: Point;
    customRadius?: number;
    useAspectRatio?: boolean;
};

function roundedPolygon(points: PointOpts[], cornerRadius: number, aspectRatio = 1): string {
    if (points.length < 3) return '';

    const pathParts: string[] = [];
    const length = points.length;

    const radius = cornerRadius;

    for (let i = 0; i < length; i++) {
        const withOpts = points[i]!;
        const r = withOpts.customRadius ?? radius;
        const aspect = withOpts.useAspectRatio ? aspectRatio : 1;

        const previous = points[(i - 1 + length) % length]!.point;
        const current = points[i]!.point;
        const next = points[(i + 1) % length]!.point;

        // Direction vectors
        const inVector: Point = [current[0] - previous[0], current[1] - previous[1]];
        const outVector: Point = [next[0] - current[0], next[1] - current[1]];

        // Normalize vectors
        const inLength = Math.hypot(inVector[0], inVector[1]);
        const outLength = Math.hypot(outVector[0], outVector[1]);

        const inDirection: Point = [inVector[0] / inLength, inVector[1] / inLength];
        const outDirection: Point = [outVector[0] / outLength, outVector[1] / outLength];

        // Entry and exit points
        const entry: Point = [current[0] - inDirection[0] * r, current[1] - inDirection[1] * r];
        const exit: Point = [current[0] + outDirection[0] * r, current[1] + outDirection[1] * r];

        if (i === 0) {
            pathParts.push(`M ${entry[0] / aspect},${entry[1]}`);
        } else {
            pathParts.push(`L ${entry[0] / aspect},${entry[1]}`);
        }

        pathParts.push(`Q ${current[0]},${current[1]} ${exit[0] / aspect},${exit[1]}`);
    }

    pathParts.push('Z');
    return pathParts.join(' ');
}

function getCategoryCardPath(styleIndex: number, aspectRatio: number): string {
    const cornerRadius = 0.0175;

    let path;

    switch (styleIndex) {
        // isFirst
        case 0:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0.41] },
                    { point: [0.41 / aspectRatio / tan60, 0] },

                    { point: [1, 0] },

                    { point: [1, 1] },
                    { point: [0.9075, 1] },
                    { point: [0.9075, 0.91] },
                    { point: [0.51, 0.91] },
                    { point: [0.51, 1] },

                    { point: [0, 1] },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 1:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0] },

                    { point: [0.645, 0] },
                    { point: [0.645, 0.12] },
                    { point: [1, 0.12] },

                    { point: [1, 1] },

                    { point: [0.325 / aspectRatio / tan60, 1] },
                    { point: [0, 1 - 0.325] },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 2:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0.12] },
                    { point: [0.215, 0.12] },
                    { point: [0.215, 0] },

                    { point: [1, 0] },

                    { point: [1, 1 - 0.19] },
                    { point: [1 - 0.19 / aspectRatio / tan60, 1] },

                    { point: [0, 1], useAspectRatio: true },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 3:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon([{ point: [0, 0] }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1] }], cornerRadius, aspectRatio);
            break;
        case 4:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;

        case 5:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [
                    { point: [0, 0], useAspectRatio: true },

                    { point: [1 - 0.2 / aspectRatio / tan60, 0] },
                    { point: [1, 0.2] },

                    { point: [1, 1] },

                    { point: [0, 1], useAspectRatio: true },
                ],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 6:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;
        case 7:
            // top left; top right; bottom right; bottom left
            path = roundedPolygon(
                [{ point: [0, 0], useAspectRatio: true }, { point: [1, 0] }, { point: [1, 1] }, { point: [0, 1], useAspectRatio: true }],
                cornerRadius,
                aspectRatio,
            );
            break;

        default:
            path = 'M0,0 L1,0 L1,1 L0,1 Z';
    }

    return path;
}

export function _getIndexCategoryCardPath(gridAreaIndex: number, width: number, height: number): string {
    const aspectRatio = width / height;
    const path = getCategoryCardPath(gridAreaIndex, aspectRatio);
    return path;
}

/* Local functions */

type GetHexagonPathParams = { sideLength: number; cornerRadius: number; isHalf?: boolean; width?: number; inner?: 'invert' | 'stroke'; innerSize?: number };
function getHexagonPath(params: GetHexagonPathParams): string {
    const { sideLength, cornerRadius, isHalf = false, width = 1, inner = null, innerSize = 0 } = params;

    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspect.flatTop;

    const extraWidth = width !== 1 ? sideLength - sideLength * 2 * width : null;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);

        let xRounded = roundToDecimal(x, 4);
        const yRounded = roundToDecimal(y, 4);

        if (extraWidth) {
            switch (i) {
                case 2:
                    xRounded -= extraWidth;
                    break;
                case 3:
                    xRounded -= extraWidth;
                    break;
                case 4:
                    xRounded -= extraWidth;
                    break;
            }
        }
        points.push({ x: xRounded, y: yRounded });
    }

    const cornerSinOffsetRounded = roundToDecimal(cornerRadius * sin30, 4);
    const cornerCosOffsetRounded = roundToDecimal(cornerRadius * cos30, 4);

    let hexagonPath = isHalf
        ? `M ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded}   \
           Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y}   \
           \
           L ${points[1]!.x + cornerSinOffsetRounded},${points[0]!.y} \
           Q ${points[1]!.x},${points[0]!.y} ${points[1]!.x + cornerSinOffsetRounded * 2},${points[0]!.y}   \
           \
           L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[3]!.y} \
           Q ${points[2]!.x},${points[3]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[3]!.y}   \
           \
           L ${points[3]!.x - cornerSinOffsetRounded * 2},${points[3]!.y} \
           Q ${points[3]!.x},${points[0]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
           \
           L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded}   \
           Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y}   \
           \
           L ${points[5]!.x + cornerSinOffsetRounded * 2},${points[5]!.y} \
           Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y - cornerCosOffsetRounded} \
          `
        : `M ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded} \
           Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y - cornerCosOffsetRounded} \
           \
           L ${points[1]!.x - cornerSinOffsetRounded},${points[1]!.y + cornerCosOffsetRounded} \
           Q ${points[1]!.x},${points[1]!.y} ${points[1]!.x + cornerSinOffsetRounded * 2},${points[1]!.y} \
           \
           L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[2]!.y} \
           Q ${points[2]!.x},${points[2]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[2]!.y + cornerCosOffsetRounded} \
           \
           L ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y - cornerCosOffsetRounded} \
           Q ${points[3]!.x},${points[3]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
           \
           L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded} \
           Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y} \
           \
           L ${points[5]!.x + cornerSinOffsetRounded * 2},${points[5]!.y} \
           Q ${points[5]!.x},${points[5]!.y} ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y - cornerCosOffsetRounded} \
          `;

    // Last point from the above hexagon
    const closingPoint = `L ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y - cornerCosOffsetRounded}`;

    if (inner) {
        if (inner === 'invert') {
            const width = centerX * 2;
            const height = centerY * 2;

            const outerPath = `\
            L 0,${height} \
            L ${width},${height} \
            L ${width},0 \
            L 0,0 \
            L 0,${height}`;
            hexagonPath += outerPath + closingPoint;
        } else if (inner === 'stroke' && innerSize) {
            const pointsInner: { x: number; y: number }[] = [];
            const sideLengthInner = sideLength * innerSize;

            const cornerSinOffsetRoundedInner = roundToDecimal(cornerRadius * innerSize * sin30, 4);
            const cornerCosOffsetRoundedInner = roundToDecimal(cornerRadius * innerSize * cos30, 4);

            for (let i = 0; i < 6; i++) {
                const angleInner_deg = 60 * i + moveZeroPoint;
                const x = centerX + sideLengthInner * cos(angleInner_deg);
                const y = centerY + sideLengthInner * sin(angleInner_deg);

                let xRoundedInner = roundToDecimal(x, 4);
                const yRoundedInner = roundToDecimal(y, 4);

                if (extraWidth) {
                    switch (i) {
                        case 2:
                            xRoundedInner -= extraWidth;
                            break;
                        case 3:
                            xRoundedInner -= extraWidth;
                            break;
                        case 4:
                            xRoundedInner -= extraWidth;
                            break;
                    }
                }

                pointsInner.push({ x: xRoundedInner, y: yRoundedInner });
            }

            const innerPath = isHalf
                ? `L ${pointsInner[5]!.x - cornerSinOffsetRoundedInner},${pointsInner[5]!.y - cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[5]!.x},${pointsInner[5]!.y} ${pointsInner[5]!.x + cornerSinOffsetRoundedInner * 2},${pointsInner[5]!.y} \
                   \
                   L ${pointsInner[4]!.x - cornerSinOffsetRoundedInner * 2},${pointsInner[4]!.y} \
                   Q ${pointsInner[4]!.x},${pointsInner[4]!.y} ${pointsInner[4]!.x + cornerSinOffsetRoundedInner},${pointsInner[4]!.y - cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[3]!.x - cornerSinOffsetRoundedInner},${pointsInner[3]!.y + cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[3]!.x - cornerSinOffsetRoundedInner / (2 * innerSize)},${pointsInner[3]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} ${pointsInner[3]!.x - cornerSinOffsetRoundedInner * (2 * innerSize)},${pointsInner[3]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   \
                   L ${pointsInner[2]!.x + cornerSinOffsetRoundedInner * 2},${pointsInner[3]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   Q ${pointsInner[2]!.x},${pointsInner[3]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} ${pointsInner[2]!.x - cornerSinOffsetRoundedInner * 2},${pointsInner[3]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   \
                   L ${pointsInner[1]!.x + cornerSinOffsetRoundedInner * 2},${pointsInner[0]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   Q ${pointsInner[1]!.x},${pointsInner[0]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} ${pointsInner[1]!.x - cornerSinOffsetRoundedInner},${pointsInner[0]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   \
                   L ${pointsInner[0]!.x + cornerSinOffsetRoundedInner * (2 * innerSize)},${pointsInner[0]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} \
                   Q ${pointsInner[0]!.x + cornerSinOffsetRoundedInner / (2 * innerSize)},${pointsInner[0]!.y + cornerCosOffsetRoundedInner / (2 * innerSize)} ${pointsInner[0]!.x + cornerSinOffsetRoundedInner},${pointsInner[0]!.y + cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[5]!.x - cornerSinOffsetRoundedInner},${pointsInner[5]!.y - cornerCosOffsetRoundedInner} \
                  `
                : `L ${pointsInner[5]!.x - cornerSinOffsetRoundedInner},${pointsInner[5]!.y - cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[5]!.x},${pointsInner[5]!.y} ${pointsInner[5]!.x + cornerSinOffsetRoundedInner * 2},${pointsInner[5]!.y} \
                   \
                   L ${pointsInner[4]!.x - cornerSinOffsetRoundedInner * 2},${pointsInner[4]!.y} \
                   Q ${pointsInner[4]!.x},${pointsInner[4]!.y} ${pointsInner[4]!.x + cornerSinOffsetRoundedInner},${pointsInner[4]!.y - cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[3]!.x - cornerSinOffsetRoundedInner},${pointsInner[3]!.y + cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[3]!.x},${pointsInner[3]!.y} ${pointsInner[3]!.x - cornerSinOffsetRoundedInner},${pointsInner[3]!.y - cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[2]!.x + cornerSinOffsetRoundedInner},${pointsInner[2]!.y + cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[2]!.x},${pointsInner[2]!.y} ${pointsInner[2]!.x - cornerSinOffsetRoundedInner * 2},${pointsInner[2]!.y} \
                   \
                   L ${pointsInner[1]!.x + cornerSinOffsetRoundedInner * 2},${pointsInner[1]!.y} \
                   Q ${pointsInner[1]!.x},${pointsInner[1]!.y} ${pointsInner[1]!.x - cornerSinOffsetRoundedInner},${pointsInner[1]!.y + cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[0]!.x + cornerSinOffsetRoundedInner},${pointsInner[0]!.y - cornerCosOffsetRoundedInner} \
                   Q ${pointsInner[0]!.x},${pointsInner[0]!.y} ${pointsInner[0]!.x + cornerSinOffsetRoundedInner},${pointsInner[0]!.y + cornerCosOffsetRoundedInner} \
                   \
                   L ${pointsInner[5]!.x - cornerSinOffsetRoundedInner},${pointsInner[5]!.y - cornerCosOffsetRoundedInner} \
                  `;

            hexagonPath += innerPath + closingPoint;
        }
    } else {
        // add gibberish points so clip-path transitions work correctly
        const centerPoints = isHalf
            ? `\
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
            Q ${centerX},${centerY * 1.5} ${centerX},${centerY * 1.5} \
            \
            L ${centerX},${centerY * 1.5} \
        `
            : `\
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
            Q ${centerX},${centerY} ${centerX},${centerY} \
            \
            L ${centerX},${centerY} \
        `;
        hexagonPath += centerPoints + closingPoint;
    }

    hexagonPath += ' Z';

    return hexagonPath;
}

function getOffset(scale: number) {
    const baseline = 1;
    const factor = 50;
    return factor * (scale - baseline);
}

/** Unused Functions (for now) */

function _getHexagonalSidePath(sideLength = 1, cornerRadius = 8, shorter = 0, isRightSide = false): string {
    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspect.flatTop;

    const extraWidth = shorter ? sideLength * (isRightSide ? 2 : 2) * shorter : 0;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);

        let xRounded = roundToDecimal(x, 4);
        const yRounded = roundToDecimal(y, 4);

        if (shorter) {
            if (isRightSide) {
                switch (i) {
                    case 0:
                        xRounded = sideLength / 1.1547;
                        break;
                    case 2:
                        xRounded += extraWidth;
                        break;
                    case 3:
                        xRounded += extraWidth;
                        break;
                    case 4:
                        xRounded += extraWidth;
                        break;
                }
            } else {
                switch (i) {
                    case 2:
                        xRounded += extraWidth;
                        break;
                    case 3:
                        xRounded -= sideLength / 2;
                        break;
                    case 4:
                        xRounded += extraWidth;
                        break;
                }
            }
        }
        points.push({ x: xRounded, y: yRounded });
    }

    const cornerSinOffsetRounded = roundToDecimal(cornerRadius * sin30, 4);
    const cornerCosOffsetRounded = roundToDecimal(cornerRadius * cos30, 4);

    return isRightSide
        ? ` M ${points[0]!.x - cornerSinOffsetRounded},${points[0]!.y + cornerCosOffsetRounded} \
            Q ${points[0]!.x},${points[0]!.y} ${points[0]!.x - cornerSinOffsetRounded},${points[0]!.y - cornerCosOffsetRounded} \
            \
            L ${points[1]!.x - cornerSinOffsetRounded},${points[1]!.y}  \
            \
            L ${points[2]!.x - cornerSinOffsetRounded * 2},${points[2]!.y} \
            Q ${points[2]!.x},${points[2]!.y} ${points[2]!.x + cornerSinOffsetRounded},${points[2]!.y + cornerCosOffsetRounded} \
            \
            L ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y - cornerCosOffsetRounded} \
            Q ${points[3]!.x},${points[3]!.y} ${points[3]!.x - cornerSinOffsetRounded},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded},${points[4]!.y - cornerCosOffsetRounded} \
            Q ${points[4]!.x},${points[4]!.y} ${points[4]!.x - cornerSinOffsetRounded * 2},${points[4]!.y} \
            \
            L ${points[5]!.x - cornerSinOffsetRounded},${points[5]!.y} \
            \
            Z`
        : ` M ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y + cornerCosOffsetRounded} \
            Q ${points[0]!.x + cornerSinOffsetRounded},${points[0]!.y} ${points[0]!.x + cornerSinOffsetRounded * 2},${points[0]!.y - cornerCosOffsetRounded} \
            \
            L ${points[1]!.x},${points[1]!.y + cornerCosOffsetRounded} \
            Q ${points[1]!.x + cornerSinOffsetRounded},${points[1]!.y} ${points[1]!.x + cornerSinOffsetRounded * 3},${points[1]!.y} \
            \
            L ${points[2]!.x + cornerSinOffsetRounded * 2},${points[2]!.y} \
            \
            L ${points[3]!.x + cornerSinOffsetRounded / 2},${points[3]!.y - cornerCosOffsetRounded} \
            Q ${points[3]!.x - cornerSinOffsetRounded / 3},${points[3]!.y} ${points[3]!.x + cornerSinOffsetRounded / 2},${points[3]!.y + cornerCosOffsetRounded} \
            \
            L ${points[4]!.x + cornerSinOffsetRounded * 2},${points[4]!.y} \
            \
            L ${points[5]!.x + cornerSinOffsetRounded * 3},${points[5]!.y} \
            Q ${points[5]!.x + cornerSinOffsetRounded},${points[5]!.y} ${points[5]!.x},${points[5]!.y - cornerCosOffsetRounded} \
            \
            Z`;
}

export function getHexagonalClipPath(
    y_NormalizedPercent: number,
    size: { width: number; height: number },
    options?: {
        multipliers?: { x?: number; y?: number };
        shape?: 'full' | 'top-left' | 'top-right' | 'bottom' | 'slant-right';
    },
): string {
    const { multipliers, shape } = options ?? {};
    const { width, height } = size;

    const clipWidth = width * (multipliers?.x ?? 1);
    const clipHeight = height * (multipliers?.y ?? 1);
    const aspectRatio = clipWidth / clipHeight;

    const y_Percent = y_NormalizedPercent * 100;
    const x_Percent = (y_Percent / aspectRatio) * tan30;

    const actualShape = shape ?? 'full';

    switch (actualShape) {
        case 'full':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, calc(100% - ${x_Percent}%) 0%, 100% ${y_Percent}%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, ${x_Percent}% 100%, 0% calc
            (100% - ${y_Percent}%))`;

        case 'top-left':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, 100% 0%, 100% 100%, 0% 100%)`;

        case 'top-right':
            return `polygon(0% 0%, calc(100% - ${x_Percent}%) 0%, 100% ${y_Percent}%, 100% 100%, 0% 100%)`;

        case 'bottom':
            return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, ${x_Percent}% 100%, 0% calc(100% - ${y_Percent}%))`;

        case 'slant-right':
            return `polygon(0% ${y_Percent}%, ${x_Percent}% 0%, 100% 0%, 100% calc(100% - ${y_Percent}%), calc(100% - ${x_Percent}%) 100%, 0% 100%)`;
    }
}

export function degToRad(deg: number): number {
    return (Math.PI / 180) * deg;
}
export function sin(deg: number, clampTo?: number): number {
    const sinNum = Math.sin(degToRad(deg));
    return clampTo ? parseFloat(sinNum.toFixed(clampTo)) : sinNum;
}
export function cos(deg: number, clampTo?: number): number {
    const cosNum = Math.cos(degToRad(deg));
    return clampTo ? parseFloat(cosNum.toFixed(clampTo)) : cosNum;
}

// swiped from : https://github.com/pmndrs/drei/pull/2541/files
export function roundToPixelRatio(value: number): number {
    const ratio = window.devicePixelRatio || 1;
    return Math.round(value * ratio) / ratio;
}

export function calcCSSVariables(
    translate: { x: number; y: number },
    rotation: number,
    scale: number,
    isHalf: boolean,
    parentSize: {
        width: number;
        height: number;
    },
    options?: { gutterWidth?: number; clipStroke?: boolean; clampTo?: number },
) {
    const { gutterWidth = strokeWidthDefault, clipStroke, clampTo: _clampTo } = options ?? {};

    let { width, height } = parentSize;

    // TODO better than the top left stack-spawn, bu
    if (!width || !height) {
        width = viewBoxWidth;
        height = viewBoxHeight;
    }

    const parentAspect = width / height;
    const ratio = viewBoxAspect / parentAspect;

    const parentToViewboxWidth = width / viewBoxWidth;
    const parentToViewboxHeight = height / viewBoxHeight;
    const insetByStrokeWidth = (1 - gutterWidth) * scale;

    const mappedScaleX = roundToDecimal(insetByStrokeWidth * parentToViewboxWidth * ratio, 2);
    const mappedScaleY = roundToDecimal(insetByStrokeWidth * parentToViewboxHeight, 2);

    const mappedTranslateX = roundToPixelRatio(translate.x * parentToViewboxWidth * ratio + getOffset(parentToViewboxWidth * ratio));
    const mappedTranslateY = roundToPixelRatio(translate.y * parentToViewboxHeight + getOffset(parentToViewboxHeight) * (viewBoxHeight / viewBoxWidth));

    let clipPath;

    if (isHalf) {
        if (clipStroke) {
            clipPath = 'var(--hexagon-clip-path-half-stroked)';
        } else {
            clipPath = 'var(--hexagon-clip-path-half)';
        }
    } else {
        if (clipStroke) {
            clipPath = 'var(--hexagon-clip-path-full-stroke)';
        } else {
            clipPath = 'var(--hexagon-clip-path-full)';
        }
    }

    return {
        '--hexagon-translate-x': mappedTranslateX + 'px',
        '--hexagon-translate-y': mappedTranslateY + 'px',
        '--hexagon-rotate': rotation + 'deg',
        '--hexagon-scale-x': mappedScaleX,
        '--hexagon-scale-y': mappedScaleY,
        // TODO use container query values here instead of all that other jazz?
        // '--hexagon-scale-x': `calc(${insetByStrokeWidth} * var(--hexagon-width-container-to-viewbox) * var(--hexagon-ratio-of-aspects))`,
        // '--hexagon-scale-y': `calc(${insetByStrokeWidth} * var(--hexagon-height-container-to-viewbox))`,
        '--hexagon-lighting-gradient-counter-rotation': `calc(${-rotation}deg - var(--home-menu-rotation, 0deg))`,
        '--hexagon-clip-path': clipPath,
    };
}

function _toSvgTransform(
    translate?: { x: number; y: number },
    rotate_DEG?: number,
    scale?: { x: number; y: number },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo: _clampTo } = options ?? {};

    const translation = translate ? `translate(${shouldOffset && offset ? translate.x + offset : translate.x} ${translate.y}) ` : '';
    const rotation = rotate_DEG ? `rotate(${rotate_DEG}) ` : '';
    const scaling = scale ? `scale(${scale.x}, ${scale.y}) ` : '';

    return translation + rotation + scaling;
}

function _toSvgTransformMatrix(
    translate = { x: 0, y: 0 },
    rotate_DEG = 0,
    scale = { x: 1, y: 1 },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo } = options ?? {};

    const angle = degToRad(rotate_DEG); // Convert to radians
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Apply scale and rotation
    const a = scale.x * cos;
    const b = scale.x * sin;
    const c = -scale.y * sin;
    const d = scale.y * cos;
    const e = shouldOffset && offset ? translate.x + offset : translate.x;
    const f = translate.y;

    return `matrix(${a.toFixed(clampTo ?? 6)} ${b.toFixed(clampTo ?? 6)} ${c.toFixed(clampTo ?? 6)} ${d.toFixed(clampTo ?? 6)} ${e.toFixed(clampTo ?? 6)} ${f.toFixed(clampTo ?? 6)})`;
}

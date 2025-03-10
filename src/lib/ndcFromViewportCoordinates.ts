/** Returns Normalized Device Coordinates in [-1, 1] */
export const ndcFromViewportCoordinates = (vpCoord: [number, number], vpWidth: number, vpHeight: number) => {
    const [clientX, clientY] = vpCoord;
    const ndcX = (clientX / vpWidth) * 2 - 1;
    const ndcY = -(clientY / vpHeight) * 2 + 1;
    return [ndcX, ndcY] as [number, number];
};

/** Returns Normalized Device Coordinates in [-1, 1] */
export const ndcFromViewportCoordinates = (viewportX: number, viewportY: number, viewportWidth: number, viewportHeight: number) => {
    const ndcX = (viewportX / viewportWidth) * 2 - 1;
    const ndcY = -(viewportY / viewportHeight) * 2 + 1;
    return [ndcX, ndcY] as [number, number];
};

export const getExtentsInNDC = (width: number, height: number) => {
    const extentX = -(width / 2); // Negative, so grid is filled from top-left
    const extentY = height / 2;
    return [extentX, extentY] as [number, number];
};

/** Converts a NDC position [-1,1] to a world position on a plane at given width / height (usually a plane at Z:0 with width/height filling the screen) */
export const worldPositionFromNDC = (ndcX: number, ndcY: number, cameraPlaneWidth: number, cameraPlaneHeight: number) => {
    const worldPosX = ndcX * (cameraPlaneWidth / 2);
    const worldPosY = ndcY * (cameraPlaneHeight / 2);

    return [worldPosX, worldPosY];
};

/**
 * Converts viewport coordinates (screen space) to 'normalized device coordinates' (clip space). OpenGL coords (starting at BOTTOM left) not taken into account for now.
 * @param viewportX viewport coordinate X (pixel 0 at left, eg clientX)
 * @param viewportY viewport coordinate Y (pixel 0 at top, eg clientY)
 * @param viewportWidth full width (eg window.innerWidth)
 * @param viewportHeight full height (eg window.innerHeight)
 * @returns  ndc coordinates, where top left is [-1,1] and bottom right is [1,-1]
 */
export const ndcFromViewportCoordinates = (viewportX: number, viewportY: number, viewportWidth: number, viewportHeight: number) => {
    const ndcX = (viewportX / viewportWidth) * 2 - 1;
    const ndcY = -(viewportY / viewportHeight) * 2 + 1;

    return [ndcX, ndcY] as [number, number];
};

/** Converts from 'normalized device coordinates' (clip space) to viewport coordinates (screen space), flipping Y as needed via 'convertFromOpenGL' */
export const viewportCoordinatesFromNdc = (ndcX: number, ndcY: number, viewportWidth: number, viewportHeight: number, convertFromOpenGL = true) => {
    const x = 0;
    const y = convertFromOpenGL ? -viewportHeight : 0; // browser starts at TOP left (default), openGL at BOTTOM left

    const viewportX = (ndcX + 1) * viewportWidth * 0.5 + x;
    const viewportY = (ndcY + 1) * viewportHeight * 0.5 + y;

    return [viewportX, convertFromOpenGL ? viewportY * -1 : viewportY] as [number, number];
};

export const getExtentsFromOrigin = (width: number, height: number) => {
    const extentX = -(width / 2); // Negative, so grid is filled from top-left
    const extentY = height / 2;

    return [extentX, extentY] as [number, number];
};

/** Converts a NDC position [-1,1] to a world position [min,max] at given width / height (assumed to be screen width/height in World Coordinates) */
export const worldPositionFromNDC = (ndcX: number, ndcY: number, width: number, height: number) => {
    const worldPosX = ndcX * (width / 2);
    const worldPosY = ndcY * (height / 2);

    return [worldPosX, worldPosY];
};

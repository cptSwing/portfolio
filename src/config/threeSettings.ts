import { Vector2, Vector3 } from 'three';

export const animationSettings = {
    menu: {
        menuItemDistanceSize: 2,
        menuItemOffsetZMultiplier: 2,
    },
    ambient: {
        length_S: 1.5,
        timeScale: 0.75,
    },
    intro: {
        length_S: 1,
    },
};

export const cameraSettings = {
    defaultCameraName: 'jbrandenburg.de_defaultCamera',
    offset: 10,
};

export const vectors = {
    zeroVector2: new Vector2(0, 0),
    zeroVector3: new Vector3(0, 0, 0),
};

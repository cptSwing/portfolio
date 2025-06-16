const degToRad = (deg: number) => deg * (Math.PI / 180);

export const hex = (angleDeg = 0) => {
    const angleRad = degToRad(angleDeg);
    const sides = 6;

    let shape = `polygon(`;
    for (let i = 0; i < sides; i++) {
        const x = 50 + 50 * Math.cos(angleRad + (i * 2 * Math.PI) / sides);
        const y = 50 + 50 * Math.sin(angleRad + (i * 2 * Math.PI) / sides);
        shape += `${+x.toFixed(2)}% ${+y.toFixed(2)}%,`;
    }
    shape = shape.slice(0, -1);
    shape += `)`;

    return shape;
};

/* https://css-tip.com/hexagon-shape/ */
export const simpleHexClip = (flatTop = true) => {
    const aspectRatio = flatTop ? '1 / cos(30deg)' : 'cos(30deg)';
    const clipPath = flatTop ? 'polygon(50% -50%,100% 50%,50% 150%,0 50%)' : 'polygon(-50% 50%,50% 100%,150% 50%,50% 0)';

    return {
        aspectRatio,
        clipPath,
    };
};

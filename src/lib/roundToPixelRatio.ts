// swiped from : https://github.com/pmndrs/drei/pull/2541/files
function roundToPixelRatio(value: number): number {
    const ratio = window.devicePixelRatio || 1;
    return Math.round(value * ratio) / ratio;
}

export default roundToPixelRatio;

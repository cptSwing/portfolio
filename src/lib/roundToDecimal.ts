// From https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary#comment139520098_48764436

function roundToDecimal(num: number, places: number) {
    const p = Math.pow(10, places);
    const rounded = Math.round((num + Number.EPSILON) * p) / p;
    return rounded;
}

export default roundToDecimal;

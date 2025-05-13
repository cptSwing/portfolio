const roundNumToDecimal = (num: number, decimalPlaces: number = 2): number => {
    if (typeof num !== 'number' || isNaN(num)) {
        throw new Error('Invalid input: The first parameter must be a number.');
    }
    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
        throw new Error('Invalid input: Decimal places must be a non-negative integer.');
    }

    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier;
};

export default roundNumToDecimal;

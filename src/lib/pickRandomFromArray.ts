const pickRandomFromArray = <T>(arr: T[]): [T, number] => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return [arr[randomIndex], randomIndex];
};

export default pickRandomFromArray;

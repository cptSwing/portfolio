function throttle(func: (...args: unknown[]) => void, delay_Ms: number) {
    let time = Date.now();

    return (...args: unknown[]) => {
        if (time + delay_Ms - Date.now() <= 0) {
            func(...args);
            time = Date.now();
        }
    };
}

export default throttle;

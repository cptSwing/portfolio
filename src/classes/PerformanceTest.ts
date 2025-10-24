// Adapted into a class from Stackoverflow (https://stackoverflow.com/a/41868702), itself a version adapted from the chrome blog

class PerformanceTest {
    time: number | undefined;
    previousTime: number | undefined;
    draw: (load: number) => void;
    result: HTMLElement;

    static maxSlow = 10;
    static maximumFrameTime = 1000 / 30; // 30 FPS

    drawLoad = 1;
    slowCount = 0;

    constructor(drawFunction: (load: number) => void, resultElement: HTMLElement) {
        this.tick = this.tick.bind(this);
        this.draw = drawFunction;
        this.result = resultElement;
    }

    tick() {
        this.time = performance.now();
        const elapsed = this.time - this.previousTime!;
        this.previousTime = this.time;

        if (elapsed < PerformanceTest.maximumFrameTime || this.slowCount < PerformanceTest.maxSlow) {
            if (elapsed < PerformanceTest.maximumFrameTime) {
                this.drawLoad += 10;
            } else {
                this.slowCount++;
            }

            this.draw(this.drawLoad);
            requestAnimationFrame(this.tick);
        } else {
            // found maximum sustainable load at 30 FPS
            this.result.innerHTML = 'could draw ' + this.drawLoad + ' in ' + PerformanceTest.maximumFrameTime + ' ms';

            // reset, I think?
            this.drawLoad = 1;
            this.slowCount = 0;
        }
    }

    start() {
        this.time = this.previousTime = performance.now();
        requestAnimationFrame(this.tick);
    }
}

export default PerformanceTest;

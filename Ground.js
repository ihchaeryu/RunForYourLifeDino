

class Ground {
    constructor(w, h, speed, scaleRatio) {
        this.width = w;
        this.height = h;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = height - this.height;

        this.groundImage = images.ground;
    }

    draw() {
        image(this.groundImage, this.x, this.y, this.width, this.height);
        image(this.groundImage, this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    update(gameSpeed, frameRate) {
        this.x -= gameSpeed * frameRate * this.speed * this.scaleRatio;
    }

    reset() {
        this.x = 0;
    }
}
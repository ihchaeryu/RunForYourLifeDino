
class Tunnel {
    constructor(w, h, speed, scaleRatio) {
        this.width = w;
        this.height = h;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = -12 * scaleRatio;
        this.y = 0;

        this.tunnelImage = images.tunnel;
    }

    draw() {
        image(this.tunnelImage, this.x, this.y, this.width, this.height);
        image(this.tunnelImage, this.x, this.y + this.height - 5, this.width, this.height);

        if (this.y < -this.height + 10) {
            this.y = 0;
        }
    }

    update(gameSpeed, frameRate) {
        this.y -= gameSpeed * frameRate * this.speed * this.scaleRatio;
    }

    reset() {
        this.y = 0;
    }
}
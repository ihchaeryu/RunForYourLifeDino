

class Bg {
    constructor(w, h, speed, scaleRatio) {
        this.width = w;
        this.height = h;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        const bgImage1 = images.triassic_bg;
        const bgImage2 = images.jurassic_bg;
        const bgImage3 = images.cretaceous_bg;
        const bgImage4 = images.dooms_bg;

        this.bgImages = [];
        this.bgImages.push(bgImage1);
        this.bgImages.push(bgImage2);
        this.bgImages.push(bgImage3);
        this.bgImages.push(bgImage4);
        this.bgImages.push(bgImage1);
        this.stage = 1;
    }

    nextStage() {
        this.stage += 1;
    }

    draw() {
        image(this.bgImages[this.stage - 1], this.x, this.y, this.width, this.height);
        image(this.bgImages[this.stage - 1], this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    update(gameSpeed, frameRate) {
        this.x -= gameSpeed * frameRate * this.speed * this.scaleRatio;
    }

    reset() {
        this.x = 0;
        this.stage = 1;
    }
}
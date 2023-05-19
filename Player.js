

class Player {

    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    jumpPressed = false;
    jumpInProgress = false;
    fallingFromJump = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;
    
    fallingInTunnel = false;
    MOVE_WHILE_FALLING_SPEED = 20;
    ducking = false;
    doomsday = false;


    constructor(w, h, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.width = w;
        this.height = h;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 20 * scaleRatio;
        this.xStandingPosition = this.x;
        this.y = height - this.height - 5 * scaleRatio;
        this.yStandingPosition = this.y;    // initial y in default standing position

        this.standingStillImage = images.stand;
        this.image = this.standingStillImage;

        const dinoRunImage1 = images.run1;

        const dinoRunImage2 = images.run2;

        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        // keyboard events
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        // touch events
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }

    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        } else if (event.code === "ArrowLeft" && this.fallingInTunnel) {
            if (this.x > 130 * this.scaleRatio) {
                this.x -= this.MOVE_WHILE_FALLING_SPEED * this.scaleRatio;
            }
        } else if (event.code === "ArrowRight" && this.fallingInTunnel) {
            if (this.x < 620 * this.scaleRatio) {
                this.x += this.MOVE_WHILE_FALLING_SPEED * this.scaleRatio;
            }
        } else if (event.code === "ArrowDown") {
            this.duck();
        } else if (event.code === "ArrowLeft" && this.doomsday) {
            if (this.x > 0) {
                this.x -= 20 * this.scaleRatio;
            }
        } else if (event.code === "ArrowRight" && this.doomsday) {
            if (this.x < width - this.width) {
                this.x += 20 * this.scaleRatio;
            }
        }
    };

    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        } else if (event.code === "ArrowDown") {
            this.unduck();
        }
    };

    // touchstart = () => {
    //     this.jumpPressed = true;
    // };

    // touchend = () => {
    //     this.jumpPressed = false;
    // }

    update(gameSpeed, frameRate) {

        this.run(gameSpeed, frameRate);

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        this.jump(frameRate);
    }

    jump(frameRate) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        if (this.jumpInProgress && !this.fallingFromJump) {
            // if still going up
            if (this.y > height - this.minJumpHeight || 
                (this.y > height - this.maxJumpHeight && this.jumpPressed)) {
                    this.y -= this.JUMP_SPEED * frameRate * this.scaleRatio * Math.max(Math.min(this.y, 70), 20) / 80;
                } else {
                    this.fallingFromJump = true;
                }
        } else {
            // if still falling From Jump
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameRate * this.scaleRatio * Math.max(Math.min(this.y, 70), 20) / 80;
                if (this.y + this.height > height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.fallingFromJump = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, frameRate) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];
            } else {
                this.image = this.dinoRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }

        this.walkAnimationTimer -= frameRate * gameSpeed;
    }

    duck() {
        if (!this.ducking) {
            this.image = images.duck1;

            this.dinoRunImages = [];
            this.dinoRunImages.push(images.duck1);
            this.dinoRunImages.push(images.duck2);

            this.ducking = true;
        }
    }

    unduck() {
        this.image = images.run1;

        this.dinoRunImages = [];
        this.dinoRunImages.push(images.run1);
        this.dinoRunImages.push(images.run2);

        this.ducking = false;
    }

    toFallPosition() {
        this.fallingInTunnel = true;
        this.x = width / 2 - 30 * this.scaleRatio;
        this.y = 80 * this.scaleRatio;
    }

    toRunPosition() {
        this.fallingInTunnel = false;
        this.x = this.xStandingPosition;
        this.y = this.yStandingPosition;
    }

    toDoomsdayPosition() {
        this.doomsday = true;
        this.x = width / 2 - 30 * this.scaleRatio;
        this.y = height - this.height - 10 * this.scaleRatio;
    }

    getXPosition() {
        return this.x;
    }

    getYPosition() {
        return this.y;
    }

    draw() {
        image(this.image, this.x, this.y, this.width, this.height);
    }
}
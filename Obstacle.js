
class Obstacle {
    constructor(x, y, w, h, image) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.image = image;
    }
  
    draw() {
      image(this.image, this.x, this.y, this.width, this.height);
    }

    update() {}
  
    collideWith(sprite) {
      const margin = 1.4;
      if (
        sprite.x < this.x + this.width / margin &&
        sprite.x + sprite.width / margin > this.x &&
        sprite.y < this.y + this.height / margin &&
        sprite.height + sprite.y / margin > this.y
      ) {
        console.log("collide!");
        return true;
      } else {
        return false;
      }
    }
  }

  class Cactus extends Obstacle {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        this.x -= speed * gameSpeed * frameRate * scaleRatio;
    }

  }

  const buzzingRange = [40, 150]; 

  class Insect extends Obstacle {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
        this.delta = -5;
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        this.x -= speed * gameSpeed * frameRate * scaleRatio;
        if (this.y < buzzingRange[0] * scaleRatio) {
            this.delta = - this.delta;
        } else if (this.y > buzzingRange[1] * scaleRatio) {
            this.delta = - this.delta;
        } 
        this.y += this.delta * scaleRatio;
    }

  }

  class TunnelEntrance extends Obstacle {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        this.x -= speed * gameSpeed * frameRate * scaleRatio;
    }

    enterTunnelEntrance(sprite) {
        const margin = 1.4;
        if (
          sprite.x < this.x + this.width / margin &&
          sprite.x + sprite.width / margin > this.x &&
          sprite.y < this.y + this.height / margin &&
          sprite.height + sprite.y / margin > this.y
        ) {
          console.log("enter!");
          return true;
        } else {
          return false;
        }
      }

  }

  class Rock extends Obstacle {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        this.y -= speed * gameSpeed * frameRate * scaleRatio;
    }

  }

  class Bird extends Obstacle {

    FLY_ANIMATION_TIMER = 200;
    flyAnimationTimer = this.FLY_ANIMATION_TIMER;

    constructor(x, y, w, h, image, image2) {
        super(x, y, w, h, image);
        this.image2 = image2;
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        this.x -= speed * gameSpeed * frameRate * scaleRatio;

        if (this.flyAnimationTimer <= 0) {
            const temp = this.image;
            this.image = this.image2;
            this.image2 = temp;
            this.flyAnimationTimer = this.FLY_ANIMATION_TIMER;
        }

        this.flyAnimationTimer -= frameRate * gameSpeed;
    }

    draw() {
        image(this.image, this.x, this.y, this.width, this.height);
    }


  }

  class Meteor extends Obstacle {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
    }

    update(speed, gameSpeed, frameRate, scaleRatio) {
        const random = Math.random();
        this.x -= speed * gameSpeed * frameRate * scaleRatio * random;
        this.y += speed * gameSpeed * frameRate * scaleRatio * random;
    }

  }


const flyingHeights = [60, 90, 120];

class Controller {
  
    constructor(obsImages, scaleRatio, speed) {
      this.obsImages = obsImages;
      this.scaleRatio = scaleRatio;
      this.speed = speed;
      this.intervalMin = 800;
      this.intervalMax = 2000;
      this.nextObsInterval = null;
      this.obsList = [];
  
      this.setNextObsTime();
    }
  
    setNextObsTime() {
      const num = this.getRandomNumber(
        this.intervalMin,
        this.intervalMax
      );
  
      this.nextObsInterval = num;
    }
  
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    createObs() {}
  
    update(gameSpeed, frameRate) {
      if (this.nextObsInterval <= 0) {
        this.createObs();
        this.setNextObsTime();
      }
      this.nextObsInterval -= frameRate;
  
      this.obsList.forEach((obs) => {
        obs.update(this.speed, gameSpeed, frameRate, this.scaleRatio);
      });
  
      this.obsList = this.obsList.filter((obs) => obs.x > -obs.width);
    }
  
    draw() {
      this.obsList.forEach((obs) => obs.draw());
    }
  
    collideWith(sprite) {
      return this.obsList.some((obs) => obs.collideWith(sprite));
    }
  
    reset() {
      this.obsList = [];
    }
  }

  class TriassicController extends Controller {

    constructor(obsImages, scaleRatio, speed) {
        super(obsImages, scaleRatio, speed);
        this.tunnelEntranceList = [];
    }

    createObs() {
        const index = this.getRandomNumber(0, this.obsImages.length - 1);
        const obsImage = this.obsImages[index];
        // differs depending on type of obstacle
        let obs;
        if (index < 3) {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 - 2  * this.scaleRatio;
            obs = new Cactus(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
        } 
        else {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 + 15 * this.scaleRatio;
            obs = new TunnelEntrance(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
            this.tunnelEntranceList.push(obs);
        }
    
        this.obsList.push(obs);
      }

      enterTunnelEntrance(sprite) {
        return this.tunnelEntranceList.some((obs) => obs.enterTunnelEntrance(sprite));
      }

      reset() {
        this.obsList = [];
        this.tunnelEntranceList = [];
      }

  }


  class JurassicController extends Controller {

    constructor(obsImages, scaleRatio, speed) {
        super(obsImages, scaleRatio, speed);
        this.tunnelEntranceList = [];
    }

    createObs() {
        const index = this.getRandomNumber(0, this.obsImages.length - 1);
        const obsImage = this.obsImages[index];
        console.log(index);
        // differs depending on type of obstacle
        let obs;
        if (index < 3) {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 - 2  * this.scaleRatio;
            obs = new Cactus(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
        } 
        else if (index === 3) {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 + 15 * this.scaleRatio;
            obs = new TunnelEntrance(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
            this.tunnelEntranceList.push(obs);
        } 
        else if (index === 4) {
            const x = width * 1.5;
            const flyHeight = flyingHeights[this.getRandomNumber(0, flyingHeights.length - 1)]
            const y = height - flyHeight - obsImage.height * this.scaleRatio;
            obs = new Bird(
            x,
            y,
            obsImage.width * this.scaleRatio,
            obsImage.height * this.scaleRatio,
            obsImage,
            this.obsImages[5]
            );
        } else {
            const x = width * 1.5;
            const flyHeight = flyingHeights[this.getRandomNumber(0, flyingHeights.length - 1)]
            const y = height - flyHeight - obsImage.height * this.scaleRatio;
            obs = new Bird(
            x,
            y, 
            obsImage.width * this.scaleRatio,
            obsImage.height * this.scaleRatio,
            obsImage,
            this.obsImages[4]
            );
        }
    
        this.obsList.push(obs);
      }

      enterTunnelEntrance(sprite) {
        return this.tunnelEntranceList.some((obs) => obs.enterTunnelEntrance(sprite));
      }

      reset() {
        this.obsList = [];
        this.tunnelEntranceList = [];
      }

  }

  class CretaceousController extends Controller {

    constructor(obsImages, scaleRatio, speed) {
        super(obsImages, scaleRatio, speed);
        this.tunnelEntranceList = [];
    }

    createObs() {
        const index = this.getRandomNumber(0, this.obsImages.length - 1);
        const obsImage = this.obsImages[index];
        console.log(index);
        // differs depending on type of obstacle
        let obs;
        if (index < 3) {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 - 2  * this.scaleRatio;
            obs = new Cactus(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
        } 
        else if (index === 3) {
            const x = width * 1.5;
            const y = height - obsImage.height * this.scaleRatio * 0.8 + 15 * this.scaleRatio;
            obs = new TunnelEntrance(
            x,
            y,
            obsImage.width * this.scaleRatio * 0.8,
            obsImage.height * this.scaleRatio * 0.8,
            obsImage
            );
            this.tunnelEntranceList.push(obs);
        } 
        else if (index === 4) {
            const x = width * 1.5;
            const flyHeight = flyingHeights[this.getRandomNumber(0, flyingHeights.length - 1)]
            const y = height - flyHeight - obsImage.height * this.scaleRatio;
            obs = new Bird(
            x,
            y,
            obsImage.width * this.scaleRatio,
            obsImage.height * this.scaleRatio,
            obsImage,
            this.obsImages[5]
            );
        } else if (index === 5){
            const x = width * 1.5;
            const flyHeight = flyingHeights[this.getRandomNumber(0, flyingHeights.length - 1)]
            const y = height - flyHeight - obsImage.height * this.scaleRatio;
            obs = new Bird(
            x,
            y, 
            obsImage.width * this.scaleRatio,
            obsImage.height * this.scaleRatio,
            obsImage,
            this.obsImages[4]
            );
        } else {
            const x = width * 1.5;
            const y = height / 2 - obsImage.height * this.scaleRatio + this.getRandomNumber(-10 * this.scaleRatio, 10 * this.scaleRatio);
            obs = new Insect(
            x,
            y, 
            obsImage.width * this.scaleRatio,
            obsImage.height * this.scaleRatio,
            obsImage
            );
        }
    
        this.obsList.push(obs);
      }

      enterTunnelEntrance(sprite) {
        return this.tunnelEntranceList.some((obs) => obs.enterTunnelEntrance(sprite));
      }

      reset() {
        this.obsList = [];
        this.tunnelEntranceList = [];
      }

  }

  class DoomsdayController extends Controller {

    constructor(obsImages, scaleRatio, speed) {
        super(obsImages, scaleRatio, speed);
        this.intervalMin = 300;
        this.intervalMax = 1200;
    }

    createObs() {
        const index = this.getRandomNumber(0, this.obsImages.length - 1);
        const obsImage = this.obsImages[index];
        const x = width + this.getRandomNumber(-1000 * this.scaleRatio, 50 * this.scaleRatio);
        const y = this.getRandomNumber(-50 * this.scaleRatio, 50 * this.scaleRatio);
        const obs = new Meteor(
          x,
          y,
          obsImage.width,
          obsImage.height,
          obsImage
        );
    
        this.obsList.push(obs);
      }

  }  


  class TunnelController extends Controller {

    constructor(obsImages, scaleRatio, speed) {
        super(obsImages, scaleRatio, speed);
    }

    createObs() {
        const index = this.getRandomNumber(0, this.obsImages.length - 1);
        const obsImage = this.obsImages[index];
        let x;
        if (index === 0) {
          x = this.getRandomNumber(-100 * this.scaleRatio, 100 * this.scaleRatio);
        } else {
          x = width - obsImage.width + this.getRandomNumber(-100 * this.scaleRatio, 100 * this.scaleRatio);
        }
        const y = height * 2;
        const obs = new Rock(
          x,
          y,
          obsImage.width,
          obsImage.height,
          obsImage
        );
    
        this.obsList.push(obs);
      }

  }



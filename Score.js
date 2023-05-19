
const stages = ["TRIASSIC", "JURASSIC", "CRETACEOUS", "DOOMSDAY", "SUCCESS!"];

class Score {
  
    constructor(scaleRatio) {
      this.scaleRatio = scaleRatio;
      this.score = 0;
      this.stageNumber = 1;
      this.stageName = "TRIASSIC";
      this.highScoreKey = "highScore";
    }
  
    update(frameRate) {
      this.score += frameRate * 0.01;
    }
  
    reset() {
      this.score = 0;
      this.stageNumber = 1;
      this.stageName = "TRIASSIC";
    }

    getScore() {
        return this.score;
    }
  
    setHighScore() {
      const highScore = Number(localStorage.getItem(this.highScoreKey));
      if (this.score > highScore) {
        localStorage.setItem(this.highScoreKey, Math.floor(this.score));
      }
    }

    getStageName() {
        return this.stageName;
    }

    goNextStage() {
        this.stageNumber += 1;
        this.stageName = stages[this.stageNumber - 1];
    }
  
    draw() {
      // score
      const highScore = Number(localStorage.getItem(this.highScoreKey));
      const y = 20 * this.scaleRatio;
  
      textAlign(CENTER, CENTER);
      textSize(20 * this.scaleRatio);
      textFont('Courier New');
      stroke(230, 230, 230);
      strokeWeight(3);
      fill(80, 80, 80);
      const scoreX = width - 60 * this.scaleRatio;
      const highScoreX = scoreX - 110 * this.scaleRatio;
  
      const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
      const highScorePadded = highScore.toString().padStart(6, 0);
  
      text(scorePadded, scoreX, y);
      text(`HI ${highScorePadded}`, highScoreX, y);

      // stage
      textAlign(LEFT, TOP);
      textSize(20 * this.scaleRatio);
      textFont('Courier New');
      stroke(200, 200, 200);
      strokeWeight(10);
      fill(80, 80, 80);
      text(this.stageName, 10 * this.scaleRatio, 10 * this.scaleRatio);

    }
  }
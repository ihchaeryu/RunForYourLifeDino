

// constants
const FR = 30;

const SCALE_CONST = 1.5;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / SCALE_CONST;
const PLAYER_HEIGHT = 94 / SCALE_CONST;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_OBS_SPEED = 0.5;
const GAME_SPEED_START = 0.75;
const GAMESPEED_DELTA = 0.1;
const BG_WIDTH = 669;
const BG_HEIGHT = 97;
const BG_SPEED = 0.05;
const TUNNEL_WIDTH = 840;
const TUNNEL_HEIGHT = 836;
const TUNNEL_SPEED = 0.2;
const TUNNEL_TIME = 10000;           // for testing
const TRANSITION_TIME = 3000;
const MAX_SPOTLIGHT = 3000;
const MIN_SPOTLIGHT = 1600;
const STAGE_TRANSITION_TIME = 4000; // test
const MAX_HINDRANCE = 150;
const MIN_HINDRANCE = 50;
const HINDRANCE_DELTA = 10;
const METEOR_SPEED = 0.4;

const JURASSIC_SCORE = 100;         // testing
const CRETACEOUS_SCORE = 200;
const APOCALYPSE_SCORE = 300;
const ENDING_SCORE = 400;

let scaleRatio = null;
let gameSpeed = GAME_SPEED_START;
let spotlight = MAX_SPOTLIGHT;
let spotlight_x = null;
let spotlight_y = null;
let exitTunnel = null;
let newStage = 1;
let hindrance = MAX_HINDRANCE + MIN_HINDRANCE / 2;
let finalAlpha = 200;
let finalX = null;
let finalY = null;
let finalWidth = null;
let finalHeight = null;

// flags

let waitingToStart = true;
let gameOver = false;
let addedEventListenersForRestart = false;
let inTunnel = false;
let outOfTunnel = false;
let enteredTunnel = false;
let changingStage = false;
let finalStage = false;
let escapeSuccess = false;

// game objects

let player = null;
let ground = null;
let bg = null;
let stage = 1;          // control stage
let score = null;

let controller = null;
let triassicController = null;
let jurassicController = null;
let cretaceousController = null;
let doomsdayController = null;
let tunnelController = null;
let tunnel = null;

const images = {};
const triassic_images = [];
const jurassic_images = [];
const cretaceous_images = [];
const doomsday_images = [];
const tunnel_images = [];

function preload() {
    images.stand = loadImage("images/standing_still.png");
    images.run1 = loadImage("images/dino_run1.png");
    images.run2 = loadImage("images/dino_run2.png");
    images.duck1 = loadImage("images/ducking1.png");
    images.duck2 = loadImage("images/ducking2.png");

    images.ground = loadImage("images/ground.png");
    images.triassic_bg = loadImage("images/triassic_bg.png");
    images.jurassic_bg = loadImage("images/jurassic_bg.png");
    images.cretaceous_bg = loadImage("images/cretaceous_bg.png");
    images.dooms_bg = loadImage("images/dooms_bg.png");

    images.cactus_1 = loadImage("images/cactus_1.png");
    triassic_images.push(images.cactus_1);
    images.cactus_2 = loadImage("images/cactus_2.png");
    triassic_images.push(images.cactus_2);
    images.cactus_3 = loadImage("images/cactus_3.png");
    triassic_images.push(images.cactus_3);
    images.tunEnt = loadImage("images/tunnel_entrance.png");
    triassic_images.push(images.tunEnt);

    images.bird1 = loadImage("images/bird1.png");
    jurassic_images.push(images.bird1);
    images.bird2 = loadImage("images/bird2.png");
    jurassic_images.push(images.bird2);

    images.insect = loadImage("images/insect.png");
    cretaceous_images.push(images.insect);

    images.meteor1 = loadImage("images/meteor1.png");
    doomsday_images.push(images.meteor1);
    images.meteor2 = loadImage("images/meteor2.png");
    doomsday_images.push(images.meteor2);

    images.rock_1 = loadImage("images/rock_1.png");
    tunnel_images.push(images.rock_1);
    images.rock_2 = loadImage("images/rock_2.png");
    tunnel_images.push(images.rock_2);

    images.tunnel = loadImage("images/tunnel.png");

    images.ufo = loadImage("images/ufo.png");
    images.space = loadImage("images/space.png");

}

function setup() {
    scaleRatio = getScaleRatio();

    frameRate(FR);
    createCanvas(GAME_WIDTH * scaleRatio, GAME_HEIGHT * scaleRatio);
    createSprites();

    finalX = finalWidth * scaleRatio;
    finalY = height - 2 * finalHeight * scaleRatio;
    finalWidth = images.ufo.width;
    finalHeight = images.ufo.height;
}

function draw() {

    if (changingStage) return;

    clear();
    background(240, 240, 240);

    console.log(`stage ${stage}, newStage ${newStage}`);
    // check score for stage
    if (score.getScore() > ENDING_SCORE) {
        // ending, exodus
        newStage = 5;
    } else if (score.getScore() > APOCALYPSE_SCORE) {
        // meteor apocalypse
        newStage = 4;
    } else if (score.getScore() > CRETACEOUS_SCORE) {
        // stage 3, cretaceous era
        newStage = 3;
    } else if (score.getScore() > JURASSIC_SCORE) {
        // stage 2, jurassic era
        newStage = 2;
    }
    if (stage !== newStage) {
        changingStage = true;
        nextStageTransition(newStage);
        return;
    }

    // if finished
    if (escapeSuccess) {
        fill(30, 30, 30, finalAlpha);
        rect(0, 0, width, height);
        imageMode(CORNER);
        image(images.space, 0, 0, width, width * images.space.height / images.space.width);

        fill(10, 10, 10);
        textSize(15 * scaleRatio);
        textFont('Courier New');
        stroke(200, 200, 200);
        strokeWeight(5);
        textAlign(RIGHT, TOP);
        const msg = "Goodbye! Refresh page to play again.";
        text(msg, width - 25 * scaleRatio, 10 * scaleRatio);

        image(images.ufo, finalX, finalY, finalWidth, finalHeight);

        if (finalAlpha < 255) {
            finalAlpha += 0.1;
        }
        finalX += scaleRatio;
        finalY -= 0.2 * scaleRatio;
        finalWidth -= 0.05 * scaleRatio;
        finalHeight -= 0.05 * scaleRatio;

        return;
    }

    // final stage; doomsday
    if (finalStage) {

        if (!gameOver) {
            controller.update(gameSpeed, FR);
            score.update(FR);
        }
        
        // meteor collision 
        if (!gameOver && controller.collideWith(player)) {
            gameOver = true;
            setupGameReset();
            score.setHighScore();
        }

        bg.draw();
        controller.draw();
        ground.draw();
        player.draw();
        hinder();
        score.draw();

        // game over
        if (gameOver) {
            showGameOver();
        }

        return;
    }
    
    // just entered tunnel; transition
    if (enteredTunnel) {
        bg.draw();
        ground.draw();
        controller.draw();
        player.draw();
        score.draw();

        noFill();
        stroke(50, 50, 50);
        strokeWeight(MAX_SPOTLIGHT);
        ellipse(spotlight_x, spotlight_y, spotlight * 2, spotlight * 2 );

        if (spotlight > MIN_SPOTLIGHT) {
            spotlight -= 20;
        }
        
        return;
    }

    // just out of tunnel; transition
    if (outOfTunnel) {
        controller.draw();
        tunnel.draw();
        player.draw();
        score.draw();

        noFill();
        stroke(50, 50, 50);
        strokeWeight(MAX_SPOTLIGHT);
        ellipse(spotlight_x, spotlight_y, spotlight * 2, spotlight * 2 );

        if (spotlight > MIN_SPOTLIGHT) {
            spotlight -= 20;
        }
        
        return;
    }

    // update game objects
    if (!gameOver && !waitingToStart && !inTunnel) {
        bg.update(gameSpeed, FR);
        ground.update(gameSpeed, FR);
        player.update(gameSpeed, FR);
        controller.update(gameSpeed, FR);
        score.update(FR);
    }

    // check collision!
    if (!gameOver && !inTunnel && !controller.enterTunnelEntrance(player) && controller.collideWith(player)) {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
    }

    // check tunnel entrance!
    if (!gameOver && !inTunnel && controller.enterTunnelEntrance(player) && !enteredTunnel) {
        // just entered; transition
        if (spotlight_x !== player.getXPosition() + 20 * scaleRatio
        || spotlight_y !== player.getYPosition() + 20 * scaleRatio) {
            enteredTunnel = true;
            spotlight = MAX_SPOTLIGHT;
            spotlight_x = player.getXPosition() + 20 * scaleRatio;
            spotlight_y = player.getYPosition() + 20 * scaleRatio;
            setTimeout(() => {
                enteredTunnel = false;
            }, TRANSITION_TIME);
            if (enteredTunnel) {
                return;
            }
        }
        
        inTunnel = true;
        // empty the controller first
        controller.reset();
        // change controller
        controller = tunnelController;
        player.toFallPosition();
        exitTunnel = setTimeout(() => {
            inTunnel = false;
            outOfTunnel = true;
            spotlight = MAX_SPOTLIGHT;
            spotlight_x = player.getXPosition() + 20 * scaleRatio;
            spotlight_y = player.getYPosition() + 20 * scaleRatio;
            controller.reset();
            controller = triassicController;
            setTimeout(() => {
                outOfTunnel = false;
                player.toRunPosition();
            }, TRANSITION_TIME);
        }, TUNNEL_TIME);
    }
    
    // in tunnel
    if (inTunnel) {
        // update
        if (!gameOver && inTunnel) {
            tunnel.update(gameSpeed, FR);
            controller.update(gameSpeed, FR);
        }
        // check collision
        if (!gameOver && inTunnel && controller.collideWith(player)) {
            gameOver = true;
            if (exitTunnel !== null) clearTimeout(exitTunnel);
            setupGameReset();
            score.setHighScore();
        }

        // draw in here
        controller.draw();
        tunnel.draw();
        player.draw();
        score.draw();

    }
    
    // draw game objects
    if (!inTunnel) {
        bg.draw();
        ground.draw();
        controller.draw();
        player.draw();
        if (stage === 3) hinder();
        score.draw();
    }


    // game over
    if (gameOver) {
        showGameOver();
    }

    // not started yet
    if (waitingToStart) {
        showStartGameText();
    }
}


///// helper functions

function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

    // window is wider than the game width
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
}

function resetGame() {
    waitingToStart = false;
    addedEventListenersForRestart = false;
    gameOver = false;
    inTunnel = false;
    outOfTunnel = false;
    enteredTunnel = false;
    changingStage = false;
    finalStage = false;
    escapeSuccess = false;

    player.toRunPosition();
    controller = triassicController;
    ground.reset();
    bg.reset();
    triassicController.reset();
    jurassicController.reset();
    cretaceousController.reset();
    doomsdayController.reset();
    tunnelController.reset();
    score.reset();

    gameSpeed = GAME_SPEED_START;
    spotlight_x = null;
    spotlight_y = null;
    exitTunnel = null;
    stage = 1;
    newStage = 1;
    hindrance = MAX_HINDRANCE + MIN_HINDRANCE / 2;
}

function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio; 

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
    const bgWidthInGame = BG_WIDTH * scaleRatio;
    const bgHeightInGame = BG_HEIGHT * scaleRatio;

    const tunnelWidthInGame = TUNNEL_WIDTH * scaleRatio;
    const tunnelHeightInGame =TUNNEL_HEIGHT * scaleRatio;

    player = new Player(playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
    ground = new Ground(groundWidthInGame, groundHeightInGame, GROUND_AND_OBS_SPEED, scaleRatio);
    bg = new Bg(bgWidthInGame, bgHeightInGame, BG_SPEED, scaleRatio);
    tunnel = new Tunnel(tunnelWidthInGame, tunnelHeightInGame, TUNNEL_SPEED, scaleRatio);
    
    triassicController = new TriassicController(
        triassic_images,
        scaleRatio,
        GROUND_AND_OBS_SPEED
    );

    jurassicController = new JurassicController(
        triassic_images.concat(jurassic_images),
        scaleRatio,
        GROUND_AND_OBS_SPEED
    );

    cretaceousController = new CretaceousController(
        triassic_images.concat(jurassic_images).concat(cretaceous_images),
        scaleRatio,
        GROUND_AND_OBS_SPEED
    );

    doomsdayController = new DoomsdayController(
        doomsday_images,
        scaleRatio,
        METEOR_SPEED
    );

    tunnelController = new TunnelController(
        tunnel_images,
        scaleRatio,
        TUNNEL_SPEED
    );

    controller = triassicController;      // first, start with triassic

    score = new Score(scaleRatio);
}

function showStartGameText() {
    fill(150, 150, 150);
    textSize(50 * scaleRatio);
    textFont('Courier New');
    stroke(50, 50, 50);
    strokeWeight(5);
    textAlign(CENTER, CENTER);
    const start = "Press Key To Start";
    text(start, width / 2, height / 2);
}

function setupGameReset() {
    if (!addedEventListenersForRestart) {
        addedEventListenersForRestart = true;
    
        setTimeout(() => {
          window.addEventListener("keyup", resetGame, { once: true });
        }, 1000);
      }
}

function showGameOver() {
    fill(150, 150, 150);
    textSize(80 * scaleRatio);
    textFont('Courier New');
    stroke(50, 50, 50);
    strokeWeight(10);
    textAlign(CENTER, CENTER);
    const over = "GAME OVER";
    text(over, width / 2, height / 2);
}

function nextStageTransition(n) {
    
    controller.reset();

    bg.update(gameSpeed, FR);
    ground.update(gameSpeed, FR);
    player.update(gameSpeed, FR);
    bg.draw();
    ground.draw();
    player.draw();
    score.draw();

    fill(50, 50, 50, 200);
    noStroke();
    rect(0, 0, width, height);
    fill(255);
    textSize(40 * scaleRatio);
    textFont('Courier New');
    stroke(255);
    strokeWeight(5);
    textAlign(CENTER, CENTER);

    gameSpeed += GAMESPEED_DELTA;
    if (n === 2) {
        controller = jurassicController;
    } else if (n === 3) {
        controller = cretaceousController;
    } else if (n === 4) {
        controller = doomsdayController;
    } else {
        finalStage = false;
        escapeSuccess = true;
    }
    stage = n;
    score.goNextStage();
    bg.nextStage();

    if (n === 4) {
        finalStage = true;
        player.toDoomsdayPosition();
        const doom = "FINAL: Survive Doomsday";
        text(doom, width / 2, height / 2);
    } else if (n === 5) {
        const escape = "Success! We are good to go...";
        textSize(20 * scaleRatio);
        strokeWeight(2);
        text(escape, width / 2, height / 2);
    } else {
        const stageName = score.getStageName();
        const next = `STAGE ${n}: ${stageName}`;
        text(next, width / 2, height / 2);
    }
    

    setTimeout(() => {
        changingStage = false;
    }, STAGE_TRANSITION_TIME);
}

function hinder() {
    noStroke();
    fill(100, 100, 100, hindrance);
    rect(0, 0, width, height);

    if (Math.random() > 0.5) {
        hindrance += HINDRANCE_DELTA;
        hindrance = Math.min(hindrance, MAX_HINDRANCE);
    } else {
        hindrance -= HINDRANCE_DELTA;
        hindrance = Math.max(hindrance, MIN_HINDRANCE);
    }
}


window.addEventListener("keyup", resetGame, { once: true });
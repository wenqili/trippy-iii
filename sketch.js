//setting for the background color
var inColR = 8;
var inColG = 74;
var inColB = 131;
var outColR = 255;
var outColG = 255;
var outColB = 231;

// presettings, need to be reset in start() function
var gameSwitch = false; //control the game start
var squareNum = 100; //control the cave and game progress
var score = 0;
var sceneNum = 0; //jump to 0 when bigger than 5, set in sceneCheck functions
var feedback = 0; // 0 means simple wave, 1 means sin wave, -1 means random wave

//wave setting
var xspacing = 10;
var theta = 0.0;
var frq = 0.05;
var amplitude = 20;
var period = 300; // using for feedback
var dx;
var xvalues; //using for change squares positions

//sketches drawing
var squares = [];
var height = 800;
var width = 1280;
var mouseWidth = 2 * (height / squareNum);

//game mechanism variables
var preTime = 0; // used by checkSound;
var feedbackSoundDuration = 500; // used by checkSound;
var sceneLoadtime = 0; //scene operate
var sceneDuration = 3000; // 3s for a scenes
var goodSpotToggle = false;
var badSpotToggle = false;


function preload() {
    bgm = loadSound("inTheBelly.mp3");
    badSound = loadSound("badSpot.mp3");
    goodSound = loadSound("goodSpot.mp3");

}

function windowResized() {
  resizeCanvas(windowWidth, windowWidth * (9/16));
}


function setup() {
    // voice control
    mic = new p5.AudioIn();
    mic.start();
    // mic.stop();

    //canvas
    canvas = createCanvas(windowWidth, windowHeight* (9/16));
    // canvas.style("width","100%");
    // canvas.style("height","100%");

    //square array
    for (var i = 0; i < squareNum; i++) {
        squares[i] = new Square(0, 0, (squareNum - i) * ceil(mouseWidth), i,
            color(inColR - (inColR - outColR) / squareNum * (squareNum - i),
                inColG - (inColG - outColG) / squareNum * (squareNum - i),
                inColB - (inColB - outColB) / squareNum * (squareNum - i)));
    }

    //wave move
    xvalues = new Array(squareNum);
}


function draw() {
    if (gameSwitch) {
        //game mechanism
        var vol = mic.getLevel();
        // console.log(vol*10);
        if (vol > 0.15 && vol < 0.2 && goodSpotToggle == false) {
            badSpotToggle = true;
            goodSpotToggle = true;
            positiveSpot();
        } else if (vol > 0.22 && badSpotToggle == false) {
            badSpotToggle = true;
            goodSpotToggle = true;
            negativeSpot();
        }
        // console.log(vol);

        //pre setting
        dx = (TWO_PI / period) * xspacing;
        amplitude = lerp(10, random(10, 50), 0.01);
        background(outColR, outColG, outColB);

        //interaction
        checkFeedback();

        //draw playground
        push();
        translate(width / 2, height / 2);

        //draw ellipses
        for (var i = 0; i < squareNum; i++) {
            ellipseMode(CENTER);
            fill(squares[i].col);
            // noStroke();

            stroke(0, 200);

            squares[i].display();
            squares[i].move();
        }
        pop();

        //change sceneNum
        sceneTimer();

        //to end the feedback sound
        checkSound();
        if (score < 0) {
            lose();
        }
    }
    else {
      //start page
        background(inColR, inColG, inColB);
        push();
        fill(outColR,outColG,outColB);
        textAlign(CENTER);
        translate(width / 2, height / 2);
        textSize(50);
        text("Press Enter To Start", 0, 0);;
        pop();
    }
}


//function for feedback
function positiveSpot() {
    // mic.stop();
    preTime = millis();
    changeFeedback(1);
    console.log("you touch good spot!");
    goodSound.play();
}

function negativeSpot() {
    // mic.stop();
    preTime = millis();
    changeFeedback(-1);
    console.log("you touch bad spot!");
    badSound.play();
}

// change the feedback
function changeFeedback(num) {
    feedback = num;
}

function sinWave() {
    theta += frq;
    if (period <= 300) {
        period = 300;
    }
    var x = theta;
    for (var i = 0; i < xvalues.length; i++) {
        xvalues[i] = sin(x) * amplitude;
        x += dx;
    }
}

function rectWave() {
    for (var i = 0; i < xvalues.length; i++) {
        xvalues[i] = random(-2, 2) * amplitude;
    }
}

function simpleWave() {
    theta += frq;
    if (period >= 150) {
        period = 150;
    }
    var x = theta;
    for (var i = 0; i < xvalues.length; i++) {
        xvalues[i] = sin(x) * amplitude;
        x += dx;
    }
}

function changeToSimple() {
    feedback = 0;
}

function stepMove() {
    squareNum = floor(map(score, 100, 0, 0, 100));
    if (score > 99) {
        win();
    }
}

function addScore() {
    score += 3;
    console.log("score: " + score);
}

function subScore() {
    score += -10;
    console.log("score: " + score);
}

//gameplay functions
//scene functions
function start() {
    gameSwitch = true;
    squareNum = 100;
    score = 0;
    sceneNum = 0;
    feedback = 0;
    console.log("game start!!!!!!!!!!!!!");
}

function checkFeedback() {
    if (feedback == 1) {
        return sinWave();
        console.log("sinWave");
    } else if (feedback == -1) {
        return rectWave();
        console.log("rectWave")
    } else if (feedback == 0) {
        return simpleWave();
        console.log("simpleWave")
    }
}

function checkSound() {
    if (feedback == 1 && preTime != 0 && millis() - preTime > feedbackSoundDuration) {
        goodSound.stop();
        goodSpotToggle = false;
        badSpotToggle = false;
        console.log("good music stop!!!");
        changeToSimple();
    } else if (feedback == -1 && preTime != 0 && millis() - preTime > feedbackSoundDuration) {
        badSound.stop();
        goodSpotToggle = false;
        badSpotToggle = false;
        console.log("bad roar stop!!!");
        changeToSimple();
    }
}

//start a timer, and change the sceneNum
function sceneTimer() {
    checkScene();
    if (millis() - sceneLoadtime > sceneDuration) {
        sceneNum += 1;
        console.log("sceneNum: " + sceneNum);
        sceneLoadtime = millis();
        //checkScene to see if the level should changeLevel
        if (sceneNum > 5) {
            sceneNum = 0;
        }
    }
}

//check if level should be up and move forward or backward
function checkScene() {
    stepMove();
}

function win() {
    bgm.stop();
    goodSound.stop();
    badSound.stop();
    gameSwitch = false;
    endWin();
    console.log("you win");
}

function lose() {
    bgm.stop();
    goodSound.stop();
    badSound.stop();
    gameSwitch = false;
    sceneNum = 0;
    endLose();
    console.log("you lose");
}


//sketch functions
function Square(x, y, d, n, col) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.n = n;
    this.col = col;
    // this.col = 180 / squareNum * (16 - this.n);

    this.display = function() {
        noStroke();
        ellipse(this.x, this.y, this.d, this.d * height / width);
    };

    this.move = function() {
        // this.x = xvalues[this.n];
        this.y = xvalues[this.n];
    };
}

function endWin() {}

function endLose() {}

//functions used for testing
function keyPressed() {
    if (keyCode === ENTER) {
        // console.log("whet");
        start();
    } else if (keyCode === LEFT_ARROW) {
        positiveSpot();
        addScore();
    } else if (keyCode === RIGHT_ARROW) {
        negativeSpot();
        subScore();
    }
}

//all the first spots in 6 scenss store in tarArr0, same as the others
var tarArr0 = [];
var tarArr1 = [];
var tarArr2 = [];
var tarArr3 = [];
var tarArr4 = [];

//setting for the quility of spots
var spot0value = [true, true, true, true, true, true];
var spot1value = [false, true, false, true, false, true];
var spot2value = [true, true, true, false, false, false];
var spot3value = [true, true, false, false, false, true];
var spot4value = [true, true, false, false, true, true];

//setting for the background color
// var inColR = 0;
// var inColG = 0;
// var inColB = 0;
// var outColR = 255;
// var outColG = 255;
// var outColB = 255;

var inColR = 8;
var inColG = 74;
var inColB = 131;
var outColR = 255;
var outColG = 255;
var outColB = 231;

// var inColR = 0;
// var inColG = 0;
// var inColB = 0;
// var outColR = 255;
// var outColG = 255;
// var outColB = 255;

//setting for the spots color, not using rightnow
var goodCol = 0;
var badCol = 0;

//Serial input variables
var serial; // variable to hold an instance of the serialport library
var sensorValue = 0;
var FRS = [];

// presettings, need to be reset in start() function
var gameSwitch = false; //control the game start
var squareNum = 100; //control the cave and game progress
var score = 0;
// var levelNow = 0;
// var levelBefore = 0;
var sceneNum = 0;//jump to 0 when bigger than 5, set in sceneCheck functions
var feedback = 0; // 0 means simple wave, 1 means sin wave, -1 means random wave
var timecount = 0;// using for screenTimer()

//wave setting
var xspacing = 10;
var theta = 0.0;
var frq = 0.05;
var amplitude = 20;
var period = 300;// using for feedback
var dx;
var xvalues;//using for change squares positions


// variables that no longer needed
// var linesNum = 12;
// var linesCol = (20, 20, 20, 20);
// var lines = [];

//sketches drawing
var squares = [];
var height = 800;
var width = 1280;
var mouseWidth = 2 * (height / squareNum);

//game mechanism variables
var levels = [99, 80, 60, 40, 20, 10];// not used anymore
var preTime = 0; // used by checkSound;
var feedbackSoundDuration = 3000; // used by checkSound;
var sceneLoadtime = 0; //scene operate
var sceneDuration = 3000; // 3s for a scenes



function preload() {
    bgm = loadSound("inTheBelly.mp3");
    badSound = loadSound("badSpot.mp3");
    goodSound = loadSound("goodSpot.mp3");

}


function setup() {
    // voice control
    mic = new p5.AudioIn();
    mic.start();
    //for test
    // start();

    //Serial input
    // serial = new p5.SerialPort(); // make a new instance of  serialport library
    // serial.on('list', printList); // callback function for serialport list event
    // serial.on('data', serialEvent); // callback for new data coming in
    // serial.list(); // list the serial ports
    // serial.open("/dev/cu.usbmodem1411"); // open a port


    //canvas
    canvas = createCanvas(1280, 800);

    // //drawing presettings
    // p = createElement('p', 'score:  ');
    // p.style('font-size', '15pt');
    // // change element p's background color
    // p.style('background-color', 'white');
    // // add paddings to element p
    // p.style('padding', '15px');

    //square array
    for (var i = 0; i < squareNum; i++) {
        squares[i] = new Square(0, 0, (squareNum - i) * ceil(mouseWidth), i,
            color(inColR - (inColR - outColR) / squareNum * (squareNum - i),
                inColG - (inColG - outColG) / squareNum * (squareNum - i),
                inColB - (inColB - outColB) / squareNum * (squareNum - i)));
    }

    //wave move
    xvalues = new Array(squareNum);

    // var buttonChange = select('#change');
    // var buttonNormal = select('#normal');
    // var buttonForward = select('#forward');
    // var buttonBcakward = select('#backward');
    // var buttonGood = select('#goodSpot');
    // var buttonBad = select('#badSpot');
    // var buttonAddscore = select('#addScore');
    // buttonChange.mousePressed(changeFeedback);
    // buttonForward.mousePressed(moveForward);
    // buttonBcakward.mousePressed(moveBackward);
    // buttonNormal.mousePressed(changeToSimple);
    // buttonGood.mousePressed(positiveSpot);
    // buttonBad.mousePressed(negativeSpot);
    // buttonAddscore.mousePressed(addScore);

    //create objects one time in setup function
    // newAllSpots();

    // serial.write("X");
}


function draw() {
    if (gameSwitch) {
        //voice control
        var vol = mic.getLevel();
        // console.log(vol*10);
        score += vol;
        console.log(vol);

        //score shows only when game starts
        // p.position(1050, 50);

        //pre setting
        dx = (TWO_PI / period) * xspacing;
        amplitude = lerp(10, random(10, 50), 0.01);
        background(outColR,outColG,outColB);

        //interaction
        checkFeedback();

        //draw playground
        push();
        translate(width / 2, height / 2);

        //draw squares
        for (var i = 0; i < squareNum; i++) {
            rectMode(CENTER);
            fill(squares[i].col);
            // noStroke();

            stroke(0, 200);

            squares[i].display();
            squares[i].move();
        }

        //draw lines
        // for (var j = 0; j < linesNum; j++) {
        //     lines[j] = new Line(j, 1, squares[squareNum - 1]);
        //     lines[linesNum + j] = new Line(j, -1, squares[squareNum - 1]);
        // }
        //
        // for (var n = 0; n < 2 * linesNum; n++) {
        //     stroke(color(linesCol));
        //     lines[n].display();
        // }
        pop();

        //change sceneNum
        sceneTimer();

        //set the timer on screen
        // screenTimer();

        //to end the feedback sound
        checkSound();


        // callOneSceneSpots(sceneNum);

        // p.html('score: ' + score);

        if (score < 0) {
            lose();
        }
    }
    // else {
    //   //start page
    //     background(inColR, inColG, inColB);
    //     push();
    //     fill(255);
    //     translate(width / 2, height / 2);
    //
    //     textSize(50);
    //     text("", -150, 0);
    //     // textSize(20);
    //     // text("Ji Young & Eric", -50, 50);
    //     pop();
    // }
    // functions to test the serial things
    // showFRStext();
}


//function for feedback
function positiveSpot() {
    preTime = millis();
    changeFeedback(1);
    console.log("you touch good spot!");
    goodSound.play();
}

function negativeSpot() {
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
    score += -0.1;
    console.log("score: " + score);
}



//gameplay functions
//scene functions
function start() {
    gameSwitch = true;
    squareNum = 100;
    score = 0;
    levelNow = 0;
    levelBefore = 0;
    sceneNum = 0;
    feedback = 0;
    timecount = 0;
    // bgm.play();
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
        console.log("good music stop!!!");
        changeToSimple();
    } else if (feedback == -1 && preTime != 0 && millis() - preTime > feedbackSoundDuration) {
        badSound.stop();
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
        // console.log("Loadtime: "+sceneLoadtime);

        //checkScene to see if the level should changeLevel
        if (sceneNum > 5) {
            // lose();
            sceneNum = 0;
            resetSpots();
        }
    }
}

//check if level should be up and move forward or backward
function checkScene() {
    // after one scene of game
    // checkLevel();
    stepMove();
    // console.log("levelNow: "+levelNow+"  levelBefore: "+levelBefore);
    // levelBefore = levelNow;
}

//check if the score are enough to up level
function checkLevel() {
    for (var i = 0; i < levels.length; i++) {
        if (score > levels[i]) {
            levelNow = levels.length - i;
            console.log("levelNow: " + levelNow);
            break;
        }
    }
}

//a screen timer
function screenTimer() {
    push();
    translate(1220, 110);
    rotate(-PI / 2);
    timer();
    timecount += 1 / 50;
    pop();
}

function timer() {
    stroke(50, 50);
    fill('white');
    ellipse(0, 0, 50, 50);
    fill(color(255, 50, 50, 100));
    arc(0, 0, 50, 50, 0, timecount, PIE);
}

//target management
function target(xloc, yloc, size, fsr, value) {
    this.colorValues = 255 / 100;
    this.steps = size / 100;
    this.xloc = xloc;
    this.yloc = yloc;
    this.size = size;
    this.fsr = fsr;
    this.value = value;
    this.RE = false;
    this.BT = true;
    this.colred = color(255, 150, 150, 100);
    this.colblack = color(0, 100);


    // drive
    this.drive = function(fsr) {
        this.size = map(fsr, 0, 255, 20, 110);
        //console.log(this.size + '+' + test);
        // this.size += test;

        // console.log('typeof this.size: ' + typeof(this.size));
        // console.log("whats this?" + Number(this.size));
        if (this.value == false && this.size > 90 && this.BT) {
            negativeSpot();
            subScore();
            this.BT = false;
        }
        if (this.size >= 100) {
            this.size = 110;
            this.colorValues = 0;
        }
    };


    // display
    this.display = function() {
        push();
        // strokeWeight(2);
        // stroke(10);
        if (this.value) {
            fill(this.colred);
        } else {
            fill(this.colblack);
        }

        ellipse(this.xloc, this.yloc, 100);
        pop();
        noStroke();
        for (var i = 0; i < 100; i++) {
            fill(i * this.colorValues, 200);
            ellipse(this.xloc, this.yloc, this.size - i * this.steps, this.size - i * this.steps);
        }
    };

    this.game = function() {
        if (this.size > 100 && this.RE === false && this.value) {
            addScore();
            this.size = 110;
            //add positive feedback
            positiveSpot();
            this.RE = true;
        }
    };
}

function newAllSpots() {
    for (var i = 0; i < 6; i++) {
        //in 6 scenes
        tarArr0[i] = new target(250, 400, 20, 0, spot0value[i]);
        tarArr1[i] = new target(400, 550, 20, 0, spot1value[i]);
        tarArr2[i] = new target(600, 350, 20, 0, spot2value[i]);
        tarArr3[i] = new target(800, 600, 20, 0, spot3value[i]);
        tarArr4[i] = new target(1000, 450, 20, 0, spot4value[i]);
    }
}

function callOneSceneSpots(sceneNum) {
    tarArr0[sceneNum].display();
    tarArr1[sceneNum].display();
    tarArr2[sceneNum].display();
    tarArr3[sceneNum].display();
    tarArr4[sceneNum].display();

    tarArr0[sceneNum].drive(FRS[0]);
    tarArr1[sceneNum].drive(FRS[1]);
    tarArr2[sceneNum].drive(FRS[2]);
    tarArr3[sceneNum].drive(FRS[3]);
    tarArr4[sceneNum].drive(FRS[4]);

    tarArr0[sceneNum].game();
    tarArr1[sceneNum].game();
    tarArr2[sceneNum].game();
    tarArr3[sceneNum].game();
}

function resetSpots() {
    for (var i = 0; i < tarArr0.length; i++) {
        tarArr0[i].RE = false;
        tarArr0[i].BT = true;
        tarArr1[i].RE = false;
        tarArr1[i].BT = true;
        tarArr2[i].RE = false;
        tarArr2[i].BT = true;
        tarArr3[i].RE = false;
        tarArr3[i].BT = true;
        tarArr4[i].RE = false;
        tarArr4[i].BT = true;
    }
    console.log("Spots Reset");
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

function Line(n, d, square) {
    this.x1 = -width / 2 + width / (linesNum - 1) * n;
    this.y1 = -height / 2 * d;
    this.x2 = square.x - square.d * 0.5 + square.d / (linesNum - 1) * n;
    this.y2 = square.y - square.d * height / width * 0.5 * d;
    this.display = function() {
        line(this.x1, this.y1, this.x2, this.y2);
        // line(this.x1,this.y1,0,0);
    };
}

function endWin() {}

function endLose() {}


//serial input functions, ref: Tom Igeo and Shawn Van
// get the list of ports:
function printList(portList) {
    for (var i = 0; i < portList.length; i++) {
        // Display the list the console:
        println(i + " " + portList[i]);
    }
}

function serialEvent() {
    var inString = serial.readLine();
    if (inString.length > 0) {
        inString = inString.trim();
        var values = split(inString, ",");
        if (values.length > 2) {
            FRS[0] = Number(values[0]);
            FRS[1] = Number(values[1]);
            FRS[2] = Number(values[2]);
            FRS[3] = Number(values[3]);
            FRS[4] = Number(values[4]);
            serial.write("X");
        }
        // console.log(FRS[0] + " " + FRS[1] + " " + FRS[2] + " " + FRS[3] + " " + FRS[4]);
    }
}

//functions used for testing
function showFRStext() {
    fill(255, 0, 0);
    textSize(40);
    text("F0: " + FRS[0], 100, 100);
    text("F1: " + FRS[1], 100, 200);
    text("F2: " + FRS[2], 100, 300);
    text("F3: " + FRS[3], 100, 400);
    text("F4: " + FRS[4], 100, 500);
    text("score: " + score, 400, 100);
    text("level: " + levelNow, 400, 200);
    text("feedback: " + feedback, 400, 300);
}

function keyPressed() {
    if (keyCode === ENTER) {
        // console.log("whet");
        start();
    } else if (keyCode === LEFT_ARROW) {
        positiveSpot();
        addScore();
    } else if (keyCode === RIGHT_ARROW) {
        negativeSpot();
        // subScore();
    }

}

/*************** GAME PROJECT 7 *****************/

/********GAME CHARACTER POSITION VARIABLE ********/
var gameChar;
var player;
var floorPos_y;

/********GAME BACKGROUND POSITION CONTROL VARIABLES **************/
var scrollPos;
var isLeftEnd;
var isRightEnd;

/********VARIABLES FOR GAME SOUND ******************************/
var collectSound;
var themeSound;

/********VARIABLE FOR STORING THE GAME SCORE ******************************/
var GameScore;
var backgroundScene;
var lives;
var gameStart;
var enemies;
var flagpole;
var platforms;
var global_hideflag;
var initial;
var level;
var highScore;
const fireworks = [];
var gravity;

/************************************************
P5JS PREALOAD FUNCTION FOR LOADING EXTERNAL FILES
https://p5js.org/reference/#/p5/preload 
*************************************************/
function preload() {
    soundFormats('mp3', 'wav');
    jumpingsound = loadSound("assets/sounds/jumping.wav");
    gameover = loadSound("assets/sounds/gameover.wav");
    themeSound = loadSound('assets/sounds/background.mp3');
    collectSound = loadSound("assets/sounds/collect.mp3");
    OrangeKid = loadFont("assets/fonts/orange.ttf");
    Zerovelo = loadFont("assets/fonts/zerovelo.ttf");
    collectSound.setVolume(0.1);
}
/************************************************
P5JS SETUP FUNCTION FOR INITIALISE GAME PROPERTIES 
https://p5js.org/reference/#/p5/setup 
*************************************************/
function setup() {
    /**** CREATE CANVAS FOR FOR SHOW ELEMENTS *****/
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    //themeSound.play();
    lives = 5;
    initial = false;
    level = 1;
    highScore = 0;
    global_hideflag = height - 100;
    gameStart = false;
    themeSound.setVolume(0.24);
    setTimeout(function () {}, 3000);

    //backgroundMusic.play();
    /*****FUNCTION GAME INITIALIZATION CALLED **************/
    startGame(); // LINE NO 213 
}

/************************************************
P5JS DRAW FUNCTION START OF GAME  
https://p5js.org/reference/#/p5/draw 
*************************************************/
function draw() {



    if (gameStart) {

        noFill();
        noStroke();
        /***FILL THE SKY BLUE***/
        backgroundScene.DrawSky();
        push();
        translate(scrollPos, 0);
        /************ CALLING DRAW CLOUD FUNCTION / DRAWING CLOUDS ***************/
        backgroundScene.DrawClouds();
        /************ CALLING DRAW MOUNTAIN FUNCTION / DRAWING MOUNTAIN ***************/
        backgroundScene.DrawMountains();

        DrawFlag(color(255, 0, 0), "Level " + level + " Completed");

        pop();
        /************ CALLING DRAW HILLS FUNCTION / DRAWING HILLS ***************/

        backgroundScene.DrawHills();
        push();
        translate(scrollPos, 0);

        /*************CALLING THE DRAW BIRD FUNCTION *************/
        backgroundScene.DrawTrees();

        /***PLATFORMS**/

        for (var i = 0; i < platforms.length; i++) {
            platforms[i].Draw();
        }
        /************ CALLING DRAW CANYON FUNCTION / DRAWING CANYON ***************/
        for (let canyonIndex = 0; canyonIndex < canyons.length; canyonIndex++) {
            checkCanyon(canyons[canyonIndex]);
            drawCanyon(canyons[canyonIndex]);
        }
        /************ CALLING DRAW DIAMOND(COLLECTABLE) FUNCTION / DRAWING DIAMOND ***************/
        for (let collectableIndex = 0; collectableIndex < collectables.length; collectableIndex++) {
            drawCollectable(collectables[collectableIndex]);
            checkCollectable(collectables[collectableIndex]);
        }
        for (var i = 0; i < enemies.length; i++) {
            if (!enemies[i].life) {
                enemies[i].Draw();
                enemies[i].Update();
            }
            var status = enemies[i].Check(gameChar.gameCharWorld, gameChar.yPos);
            if (status) {
                gameChar.isAttacked = true;
            }
        }
        pop();
        /************* SHOW THE SCORE OF THE GAME ****/
        showScores();
        // Draw the game character - this must be last
        drawGameCharacter();
    }
    if (!gameStart) {
        showWelcomeMessage();
        showFirework();
    }

    if (abs(gameChar.gameCharWorld - flagpole.xPos) < 50) {

        if (GameScore > 50) {

            flagpole.isReached = true;
            raechedFlagpolemsg();
        } else {
            showpopup("You Havent Collected All Diamonds");
        }

    }


    if ((gameChar.isPlummeting == true && gameChar.yPos > height && lives > 0) || (gameChar.isAttacked == true && gameChar.yPos < 1 && lives > 0)) {
        if (initial) {
            initial = false;
        } else {
            initial = true;
        }
        themeSound.stop();
        if (GameScore > highScore) {
                highScore = GameScore;
            }
        startGame(initial);
    }

    if (lives < 1) {
        gameOvermessage();
    }
    //////// Game character logic ///////
    gameCharacterControls();

    if(gameChar.isFalling){
        jumpingsound.setVolume(0.5);
    }else{
        jumpingsound.setVolume(0.0);
    }
}



/************************************************
P5JS KEYPRESSED FUNCTION IS CALLED ONCE EVERY TIME A KEY IS PRESSED
https://p5js.org/reference/#/p5/keyPressed 
*************************************************/
function keyPressed() {


    /*IF CHARACTER FALL IN CANYON THEN IT WILL NOT MOVE AND IT WILL NOT UNTIL GAME START*/
    if (!gameChar.isPlummeting) {


        /* IF REACHED AT FLAGPOLE THE IT WILL START NEXT LEVEL*/
        if (flagpole.isReached && keyCode == 13) {
            level++;
            if (GameScore > highScore) {
                highScore = GameScore;
            }
            themeSound.stop();
            startGame(true);
        }

        if (gameChar.isAttacked && lives > 0 && keyCode == 13) {
            if (GameScore > highScore) {
                highScore = GameScore;
            }
            themeSound.stop();
            startGame(true);
        }
        /*LEFT KEY */
        if (key == 'A' && !gameChar.isAttacked && !isLeftEnd) {
            
            gameChar.isLeft = true;

        }
        //RIGHT  KEY
        if (key == 'D' && !gameChar.isAttacked && !isRightEnd) {
            gameChar.isRight = true;
        }
        //CHECK FOR CHARACTER TOP ON PLATEORM OR NOT
        var checkPlat = false;

        for (var i = 0; i < platforms.length; i++) {
            if (platforms[i].Check(gameChar.gameCharWorld, gameChar.yPos)) {
                checkPlat = true;
                break;
            }
        }

        //JUMP 
        if (key == "W" && (gameChar.yPos == floorPos_y || checkPlat)) {
            gameChar.yPos -= 120;
        }
        //GAME START
        if (!gameStart) {
            if (key == 'N'){
                
                themeSound.stop();
                startGame(true);
                gameStart = true;
            }
            if (keyCode == 13) {
                themeSound.stop();
                startGame(false);
                gameStart = true;
            }
        }

    }

}
/************************************************
P5JS KEYPRESSED FUNCTION IS CALLED ONCE EVERY TIME A KEY IS RELEASED
https://p5js.org/reference/#/p5/keyReleased 
*************************************************/
function keyReleased() {
    if (key == 'A') {
        gameChar.isLeft = false;
    }
    if (key == 'D') {
        gameChar.isRight = false;
    }
}

/**** FUNCTION FOR DRAWING CANYON ****/
function drawCanyon(t_canyon) {

    var y_pos = 415;

    /****MINIMUM WIDTH LIMITATION **/
    if (t_canyon.width <= 50) {
        t_canyon.width = 50;
    }
    /***MANAGE THE TOP ANGLE OF CANYON **/
    if (t_canyon.x_pos < 70 && t_canyon.x_pos > 30) {
        y_pos += 10;
    } else if (t_canyon.x_pos >= 90 && t_canyon.x_pos < 470) {
        y_pos -= 15;
    }

    /****** SHAPE OF CANYON *******/
    fill(100, 50, 20);
    stroke(134, 51, 8);
    strokeWeight(0);
    beginShape();

    vertex(t_canyon.x_pos + t_canyon.width + 10, y_pos);
    vertex(t_canyon.x_pos, floorPos_y);

    vertex(t_canyon.x_pos, 576);
    vertex(t_canyon.x_pos + t_canyon.width, 576);

    vertex(t_canyon.x_pos + t_canyon.width, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width + t_canyon.width, y_pos - 10);

    endShape(CLOSE);

    fill(87, 51, 8); // Stone inside canyon
    ellipse(t_canyon.x_pos + 20, 576, 20, 10);
    ellipse(t_canyon.x_pos + 10, 576, 20, 30);
    ellipse(t_canyon.x_pos + 30, 576, 20, 20);
    ellipse(t_canyon.x_pos + 40, 576, 20, 40);

}

/**** CHECK THE GAME CHARACTER ARE TOP OF CANYON OR NOT ***/
function checkCanyon(t_canyon) {

    if (gameChar.yPos == floorPos_y && gameChar.gameCharWorld < t_canyon.x_pos + t_canyon.width - 10 && gameChar.gameCharWorld > t_canyon.x_pos) {
        gameChar.isPlummeting = true;
        gameChar.isLeft = false;
        gameChar.isRight = false;

    }

}

/**** FUNCTION FOR DRAWING COLLECTABLE/DIAMOND ****/
function drawCollectable(t_collectable) {

    var Dheight = 10;

    if (!t_collectable.isFound) {


        if (t_collectable.size > 30) {
            Dheight = 1 / 3 * t_collectable.size;
        } else {
            t_collectable.size = 30;
        } //Minimum Size limitation

        Dheight = 1 / 3 * t_collectable.size;
        stroke(0, 0, 0);
        strokeWeight(0.5);
        fill(255);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, Dheight);
        triangle(
            t_collectable.x_pos - t_collectable.size / 2, t_collectable.y_pos,
            t_collectable.x_pos + t_collectable.size / 2, t_collectable.y_pos,
            t_collectable.x_pos, t_collectable.y_pos - 20
        );
        line(t_collectable.x_pos, t_collectable.y_pos - 20, t_collectable.x_pos - 8, t_collectable.y_pos);
        line(t_collectable.x_pos, t_collectable.y_pos - 20, t_collectable.x_pos + 8, t_collectable.y_pos);
        line(t_collectable.x_pos + 3, t_collectable.y_pos + 5, t_collectable.x_pos + 8, t_collectable.y_pos);
        line(t_collectable.x_pos - 2, t_collectable.y_pos + 5, t_collectable.x_pos - 8, t_collectable.y_pos);


    }



}

/*****CHECK COLLECTABLE ARE FOUND OR NOT **/
function checkCollectable(t_collectable) {
    if (dist(t_collectable.x_pos, t_collectable.y_pos, gameChar.gameCharWorld, gameChar.yPos) < 20 && t_collectable.isFound == false) {
        GameScore += 1;
        t_collectable.isFound = true;
        collectSound.play();
    }
}


/****************** LOGIC TO MOVE CHARACTER ********************/
function gameCharacterControls() {


    if (gameChar.isLeft && !gameChar.isAttacked) {
        if (gameChar.xPos > width * 0.2) {
            gameChar.xPos -= 5;

        } else {
            scrollPos += 5;
        }
    }

    if (gameChar.isRight && !gameChar.isAttacked) {
        if (gameChar.xPos < width * 0.8) {
            gameChar.xPos += 5;
        } else {
            scrollPos -= 5; // negative for moving against the background
        }
    }
    if (gameChar.isAttacked) {

        gameChar.yPos -= 5;

    }

    if (gameChar.gameCharWorld < -3200) {
        isLeftEnd = true;
        showMessage("Reached the Left border");
    } else {
        isLeftEnd = false;
    }
    if (gameChar.gameCharWorld > 3700) {
        showMessage("Reached the Right border");
        isRightEnd = true;
    } else {
        isRightEnd = false;
    }

    if (gameChar.yPos < floorPos_y && !gameChar.isAttacked) {

        var checkPlat = false;
        //check platform contact
        for (var i = 0; i < platforms.length; i++) {
            if (platforms[i].Check(gameChar.gameCharWorld, gameChar.yPos)) {
                checkPlat = true;
                break;
            }
        }
        if (!checkPlat) {
            //only falls if no contact with platforms
            gameChar.yPos += 2;
            gameChar.isFalling = true;
        } else {
            gameChar.isFalling = false;
        }
    } else {
        gameChar.isFalling = false; //prevent conflicts
    }

    /***** FALLING CHARACTER INTO CANYON *****/
    if (gameChar.isPlummeting) {

        gameChar.yPos += 5;


    }

    /*********** UPDATE REAL POSITION OF GAMECHAR FOR COLLISION DETECTION *********/
    gameChar.gameCharWorld = gameChar.xPos - scrollPos;

}

/*################# DRAWING CHARACTER START #####################*/

/**** FUNCTION FOR DRAWING CHARACTER ACOORDING TO ITS STATE ****/
function drawGameCharacter() {

    if (gameChar.isLeft && gameChar.isFalling) {
        //jumping-left  
        player.DrawLeftJump(gameChar.xPos, gameChar.yPos);
        //drawGirlLeftJump(gameChar_x, gameChar_y);
    } else if (gameChar.isRight && gameChar.isFalling) {
        //jumping-right
        player.DrawRightJump(gameChar.xPos, gameChar.yPos);
    } else if (gameChar.isLeft) {
        player.DrawLeftWalk(gameChar.xPos, gameChar.yPos);
    } else if (gameChar.isRight) {
        //walking right 
        player.DrawRightWalk(gameChar.xPos, gameChar.yPos);
    } else if (gameChar.isFalling || gameChar.isPlummeting) {
        //falling 
        player.DrawJump(gameChar.xPos, gameChar.yPos);
    } else {
        //standing front facing
        player.DrawFrontFace(gameChar.xPos, gameChar.yPos);
    }

}


/*****FUNCTION GAME INITIALIZATION**************/
function startGame(mode) {

    /******INITIALIZATION OF GAMECHARACTER X POSITION AND Y POSITION ***********************/
    gameChar = {
        xPos: width / 2,
        yPos: floorPos_y,
        gameCharWorld: this.xPos - scrollPos,
        isLeft: false,
        isRight: false,
        isFalling: false,
        isPlummeting: false,
        isAttacked: false,
    }

    backgroundScene = new BackgroundScene();
    
    setTimeout(function(){
        themeSound.play();
        themeSound.loop();
        gameover.play();
        gameover.loop();
        gameover.setVolume(0.0);
        jumpingsound.play();
        jumpingsound.loop();
        jumpingsound.setVolume(0.0);
    },2000);
    
    
    
    backgroundScene.Initialise(mode);


    platforms = [];
    enemies = [];

    enemies.push(new Enemy(900, floorPos_y - 10));
    enemies.push(new Enemy(1100, floorPos_y - 10, 30));
    enemies.push(new Enemy(1400, floorPos_y - 10, 60));
    enemies.push(new Enemy(1800, floorPos_y - 10, 100));
    enemies.push(new Enemy(100, floorPos_y - 10, 100));
    enemies.push(new Enemy(-200, floorPos_y - 10, 100));
    enemies.push(new Enemy(-750, floorPos_y - 10, 40));
    enemies.push(new Enemy(-1350, floorPos_y - 10, 40));

    player = new Player();

    gravity = createVector(0, 0.2);

    flagpole = {
        xPos: 3300,
        yPos: 100,
        isReached: false,
    }

    for (var i = 0; i < 10; i++) {
        platforms.push(new Platform(random(-3000, 3000), random(370, 340), random(40, 100)));
    }

    /******VARIABLE TO CONTROL THE BACKGROUND SCROLLING ********/
    scrollPos = 0;

    /**********GAME SCORE VARIABLE INITILIZATION *****************/
    GameScore = 0;
    /*############INITIALIZATION OF SCENERY OBJECTS START###########*/
    /*********** CANYON ARRAY OF OBJECT INITIALIZATION **************/
    canyons = [
        {
            x_pos: -80,
            width: 50
        },

        {
            x_pos: -3212,
            width: 62
        },

        {
            x_pos: 778,
            width: 54
        },
        {
            x_pos: -681,
            width: 55
        },
        {
            x_pos: -2230, //
            width: 57
        },
        {
            x_pos: 1170,
            width: 62
        },
        {
            x_pos: -863,
            width: 67
        },
        {
            x_pos: 2749,
            width: 67
        },
        {
            x_pos: -3418,
            width: 55
        },
        {
            x_pos: 2119,
            width: 56
        },
        {
            x_pos: -402,
            width: 53
        },
        {
            x_pos: 2573,
            width: 56
        },
        {
            x_pos: -85,
            width: 51
        },
        {
            x_pos: -1244,
            width: 60
        },
        {
            x_pos: -2143,
            width: 51
        },
        {
            x_pos: 940,
            width: 51
        },
        {
            x_pos: -646,
            width: 70
        },
        {
            x_pos: -3644,
            width: 69
        },
        {
            x_pos: -3097,
            width: 55
        },
        {
            x_pos: -2863,
            width: 59
        },
        {
            x_pos: 1601,
            width: 56
        }];
    /*********** COLLECTABLE ARRAY OF OBJECT INITIALIZATION  **************/
    collectables = [

        {
            x_pos: 947,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: -1143,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1953,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 698,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -196,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: 166,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 102,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1043,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1280,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -356,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: -1696,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -263,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1590,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1994,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 934,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: 1204,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: -1418,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1958,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 623,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -816,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: 1048,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1612,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -265,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1846,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1964,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1879,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1968,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -1648,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1772,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1921,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -316,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 1559,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -763,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: -1511,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 528,
            y_pos: 432,
            size: 30,
            isFound: true
                },
        {
            x_pos: -1802,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -926,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 746,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: -229,
            y_pos: 432,
            size: 30,
            isFound: false
                },
        {
            x_pos: 367,
            y_pos: 432,
            size: 30,
            isFound: false
                },

        {
            x_pos: 2064,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2509,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2790,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2654,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2873,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3421,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3886,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2500,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2334,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3421,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3217,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2155,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3349,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2418,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3652,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3965,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3813,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3703,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3856,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2680,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3989,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2222,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3090,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2261,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2926,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3218,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3617,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3317,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3504,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3293,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2475,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2700,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -3120,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2866,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2553,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 2320,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2240,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: 3482,
            y_pos: 432,
            size: 30,
            isFound: false
        },
        {
            x_pos: -2257,
            y_pos: 432,
            size: 30,
            isFound: false
        }];
    /*##############INITIALIZATION OF SCENERY OBJECTS END###################*/
    lives--;
}
/*################# BACKGROUND SCENE OF GAME #####################*/

function showMessage(msg) {
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);
    textFont(OrangeKid);
    textSize(90);
    fill(255);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
    textAlign(LEFT, BASELINE);
}

function DrawFlag(colour, message) {
    push();
    fill(colour);
    rect(flagpole.xPos, flagpole.yPos, 10, 600, 10, 10);
    rect(flagpole.xPos, global_hideflag, 200, 100);
    fill(255);
    text(message, flagpole.xPos + 20, global_hideflag + 40);
    if (flagpole.isReached) {
        if (global_hideflag > flagpole.yPos) {
            global_hideflag -= 5;
        }
    }
    pop();
}

function showWelcomeMessage() {
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);
    textFont(OrangeKid);

    textAlign(CENTER);
    fill(255);
    textSize(90);
    text("WelCome To Zero Velocity\n", width / 2, 200);
    textSize(30);
    text("\n This is the Intro to Programming Game \n Press \"ENTER\" for start Game With Regular Mode \n Press \"N\" for Night Mode ", width / 2, 250);
    textAlign(CENTER, LEFT);
    text("\n W : for Jump                A :  for Left \n D : for Right                Jump Over the Enemies to Kill", width / 2, 400);
    textAlign(LEFT);
}

function showScores() {
    fill(0, 255, 0, 100);
    rect(10, 10, 200, 120);
    fill(0, 0, 0);
    textSize(20);
    text("Game Score: " + GameScore, 20, 40);
    text("Lives: " + lives + " Level: " + level, 20, 70);
    text("High Score: " + highScore, 20, 100);
}

function showFirework() {






    // 
    //    //  stroke(255);
    //    //  strokeWeight(4);
    //    //  background(0);
    //     colorMode(HSB)
    //    colorMode(RGB);

    background(0, 0, 0, 100);

    if (random(1) < 0.03) {
        fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();

        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }

    noFill();
    noStroke();


}

function raechedFlagpolemsg() {

    fill(0, 0, 0, 100);
    rect(0, 0, width, height);
    textFont(OrangeKid);
    textAlign(CENTER);
    fill(255);
    textSize(90);
    text("WelCome To Zero Velocity\n", width / 2, 200);
    textSize(30);
    text("\n Start the next level \n Press \"Enter\ ", width / 2, 300);
    textAlign(LEFT);
    showFirework();

}

function gameOvermessage() {
    themeSound.stop();
    gameover.setVolume(1.0);
    push();
    stroke(0, 0, 0, 250);
    strokeWeight(5);
    textSize(50);
    textAlign(CENTER,CENTER);
    textFont(OrangeKid);
    text("Game Over", width / 2 , height / 2 );
    stroke(222, 210, 220, 220);
    strokeWeight(2);
    text("Press space to continue", width / 2, (height / 2)+100);
    textAlign(LEFT);
    pop();
    if (keyCode == 32) {
        //just temp code until we have next level #level
        if (initial) {
            initial = false;
        } else {
            initial = true;
        }

        lives = 4;
        if (GameScore > highScore) {
                highScore = GameScore;
        }
        startGame(initial);
    }
    return;
}

function showpopup(msg) {
    fill(random(0, 255), random(0, 255), random(0, 255), 120);
    rect(412, 10, 200, 100);
    fill(255);
    textAlign(CENTER);
    text(msg, 512, 30);
}

// console.log('javascript linked')

// make scoreboard display divs
var $newGameButton = $('<button id="new-game">New Game</button>');
$('body').prepend($newGameButton);
var $gamesWon = $('<h3 class="score" id="game-count">Games Won: 0</h3>');
$('body').prepend($gamesWon);
var $gameScore = $('<h3 class="score" id="game-score">Bricks Broken This Game: 0</h3>');
$('body').prepend($gameScore);

// score variables:
var score = 0;
var wins = 0;
var startLives = 2;
var lives = startLives;
var isGameOver = false;
// canvas variables:
var width = 400;
var height = 412;
// make canvas
var canvas = document.getElementById('board');
var ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;

// ball variables:
var ballRadius = 10;
var ballSpeed = 2;
$(document).keypress(spacebarLaunchHandler);
$('#board').click(clickLaunchHandler);
// create ball object
var ball = {
  xSpeed: ballSpeed,
  ySpeed: -ballSpeed,
  xySpeed: Math.sqrt(Math.pow(ballSpeed, 2) + Math.pow(-ballSpeed, 2)),
  r: ballRadius,
  x: canvas.width / 2,
  y: canvas.height - 60,
  color: '#000000',
  new: true
}

// paddle variables:
// user controls for paddle
var rightPressed = false;
var leftPressed = false;
// stats for paddle
var paddleWidth = 75;
var paddleHeight = 10;
var paddleSpeed = 7;
// constant to limit the influence of where the ball hits the paddle on the ball's new xSpeed/trajectory: number between 0 and 1; shouldn't be 0 or the ball will just bounce straight up and down with no xSpeed
var bounceInfluence = 0.5;
// allow the user to control the paddle with the keyboard
$(document).keydown(keyDownHandler);
$(document).keyup(keyUpHandler);


// paddle object
var paddle = {
  xSpeed: 7,
  ySpeed: 0,
  w: paddleWidth,
  h: paddleHeight,
  x: (canvas.width - paddleWidth)/ 2,
  y: ball.y + ball.r,
  color: '#000000'
}

// brick variables:
// brick dimensions could depend on how many the user wants, ie get bigger when there are fewer so they take up an adequate portion of the screen; would involve using ranges to decide how big to make bricks depending which range the requests fall in
var brickWidth = 80;
var brickHeight = 30;
var brickPadding = 6;
// might get user input for rows and columns, but will have to set limits
var numRows = 2;
var numColumns = 4;
// have to have colors for the max # of rows you're allowing
var brickColors = ['hotPink', 'mediumVioletRed', 'lightSeaGreen', 'teal', 'steelBlue', 'midnightBlue', 'plum', '#8E4585', 'purple'];
// an array containing numRows arrays, each containing numColumns objects consisting of the x and y positions of every brick in the row. this is to keep track of the locations of all the bricks on the gameBoard. Should it be 'brokenBricks' instead?
var allBricks = [];

var brick = {
  w: brickWidth,
  h: brickHeight,
  x: (canvas.width - (numColumns * (brickWidth + brickPadding))) / 2,
  y: brickHeight
};

// putting empty bricks into the allBricks var so that it has the right number according to rows and columns
for (var i = 0; i < numRows; i++) {
  allBricks[i] = [];
  for (var j = 0; j < numColumns; j++) {
    allBricks[i][j] = {x: 0, y: 0, status: 1};
  }
}


// listener for a click on the new game button
$newGameButton.click(newGameHandler);

// function for reseting board and score
function newGameHandler() {
  console.log('button clicked!')
  score = 0;
  $gameScore.text('Bricks Broken This Game: ' + score);
  lives = startLives;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  paddle.x = canvas.width / 2 - paddle.w / 2;
  ball.new = true;
  isGameOver = false;
  allBricks.forEach(function(row) {
    row.forEach(function(brick) {
      brick.status = 1;
    })
  })
  draw();
}

// functions for moving paddle
function keyDownHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = true;
  } else if (event.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = false;
  } else if (event.keyCode === 37) {
    leftPressed = false;
  }
}

// ball
function makeBall() {
  if (ball.new) {
    ball.x = paddle.x + paddle.w / 2;
  }
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// launch ball on spacebar press
function spacebarLaunchHandler(event) {
  if (event.keyCode === 32) {
    ball.new = false;
  }
}
// launch ball on mouse click
function clickLaunchHandler() {
  ball.new = false;
}

// paddle
function makePaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();
}

// could i build different shaped boards for different levels by using switch statements? ie, a case for the first row, second row, third row, etc that all build different numbers of bricks?
// function to set a new board
function makeBricks() {
  // brick.x = (canvas.width - (numColumns * (brick.w + brickPadding))) / 2,
  // brick.y = brick.h
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numColumns; j++) {
      if (allBricks[i][j].status === 1) {
        var brickX = (canvas.width - (numColumns * (brick.w + brickPadding))) / 2 + j * (brick.w + brickPadding);
        var brickY = brick.h + (i * (brick.h + brickPadding));
        allBricks[i][j].x = brickX;
        allBricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brick.w,brick.h);
        ctx.fillStyle = brickColors[i];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numColumns; j++) {
      var thisBrick = allBricks[i][j];
      if (thisBrick.status === 1) {
        if (ball.x + ball.r > thisBrick.x  && ball.x - ball.r < thisBrick.x + brick.w && ball.y + ball.r > thisBrick.y && ball.y - ball.r < thisBrick.y + brick.h) {
          ball.ySpeed = -ball.ySpeed;
          thisBrick.status = 0;
          score++;
          $gameScore.text('Bricks Broken This Game: ' + score);
          // check if all bricks are broken, and if so, run the win function
          if (score === numRows * numColumns) {
            youWin();
          }
        }
      }
    }
  }
}

var drawReq;

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height)
  makeBricks();
  makeBall();
  makePaddle();
  makeRemainingLives();
  collisionDetection();

  // bounce off the side walls
  if (!ball.new) {
    if (ball.x + ball.xSpeed + ball.r > canvas.width || ball.x + ball.xSpeed - ball.r < 0) {
      ball.xSpeed = -ball.xSpeed;
    }
    if (ball.y + ball.ySpeed - ball.r < 0) {
      ball.ySpeed = -ball.ySpeed;
    } else if (ball.y + ball.ySpeed + ball.r > paddle.y) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        // determine where the ball bounced relative to the center of the paddle as a number between -1 and 1
        var paddleCenter = paddle.x + paddle.w / 2;
        var ballRelX = (ball.x - paddleCenter)/(0.5 * paddle.w)
        // new xSpeed for ball based on overall speed, relative x position, and influence factor
        ball.xSpeed = ball.xySpeed * ballRelX * bounceInfluence;
        // new ySpeed based on constant overall speed and new xSpeed
        ball.ySpeed = -Math.sqrt((Math.pow(ball.xySpeed, 2) - Math.pow(ball.xSpeed, 2)));
      } else {
        lives--;
        checkLives();
      }
    }

    if (rightPressed && paddle.x + paddle.w < canvas.width) {
      paddle.x += paddleSpeed;
    } else if (leftPressed && paddle.x > 0) {
      paddle.x -= paddleSpeed;
    }

    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
  }
  if (!isGameOver) {
    drawReq = requestAnimationFrame(draw);
  }
}

// control the paddle with the mouse
// document.addEventListener('mousemove', mouseMoveHandler, false);
$('#board').mousemove(mouseMoveHandler);

function mouseMoveHandler(event) {
  var relativeX = event.clientX - canvas.offsetLeft;
  if (relativeX > paddle.w/2 && relativeX < canvas.width - paddle.w/2) {
    paddle.x = relativeX - paddle.w/2;
  }
}

draw();

// setInterval(draw, 10);

// display the number of lives left graphically beneath the paddle
function makeRemainingLives() {
  // add lives counter to canvas
  ctx.font = '20px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.fillText('Lives remaining: ', 20, canvas.height - 15);

  for (var i = 0; i < lives - 1; i++) {
    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.arc((200)+i*(2*ball.r + brickPadding),canvas.height - 22,ball.r/2,0,2*Math.PI);
    ctx.fill();
  }
}

// paddle ball and bricks will reset when all the bricks are broken or lives are out
function checkLives(){
  if (!lives) {
    gameOver();
    // want to add a button for reseting the board to start a new game
  } else {
    ball.x = canvas.width/2;
    ball.y = canvas.height-60;
    ball.xSpeed = ballSpeed;
    ball.ySpeed = -ballSpeed;
    ball.new = true;
    paddle.x = (canvas.width - paddle.w) / 2;
  }
}

function youWin() {
  // increment game win counter and display it
  wins++;
  $gamesWon.text('Games Won: ' + wins);
  // display win message
  ctx.font = '30px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('You Win!!!', canvas.width / 2, canvas.height / 2);
  ball.new = true;
  isGameOver = true;

  // window.cancelAnimationFrame(drawReq);
}

function gameOver() {
  // window.cancelAnimationFrame(drawReq);

  // display game over message
  ctx.font = '30px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  ball.new = true;
  isGameOver = true;
  // var $gameOverDiv = $('#game').prepend('<div id="game-over"></div>');
  // var $gameOverMessage = $('#game-over').append('<h1 id="g-o-message">Game Over</h1>');
  // var $newGameButton = $('#game-over').append('<button id="new-game">New Game</button>');
}
  // reset... maybe after user confirmation of some sort? New Game/Play again option? if no button, at least time out for a moment after displaying game over and before resetting
  // reset();

// bonus ideas:
// make higher rows of bricks worth more points
// allow user to choose different brick shapes
// allow user to make the ball go faster
// make different levels with slower/faster balls and different brick layouts
// have special bricks that do things like give extra lives or split the paddle or ball

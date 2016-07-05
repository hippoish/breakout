console.log('javascript linked')

// make scoreboard display divs
var $scoreBoard = $('<h3 id="score">Bricks Broken This Game: 0</h3>');
$('body').prepend($scoreBoard);
var $gamesWon = $('<h3 id="game-count">Games Won: 0</h3>');
$('body').prepend($gamesWon);

// score variables:
var score = 0;
var wins = 0;
var lives = 3;
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
// $('document').keypress(spacebarHandler);
// create ball object
var ball = {
  xSpeed: ballSpeed,
  ySpeed: -ballSpeed,
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
// allow the user to control the paddle with the keyboard
//document.addEventListener('keydown', keyDownHandler, false);
//document.addEventListener('keyup', keyUpHandler, false);
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
var brickPadding = 4;
// might get user input for rows and columns, but will have to set limits
var numRows = 2;
var numColumns = 3;
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
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// launch ball on spacebar press
// function spacebarHandler(event) {
//   if (event.keyCode === 32) {
//     ball.new = false;
//   }
// }

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
  brick.x = (canvas.width - (numColumns * (brick.w + brickPadding))) / 2,
  brick.y = brick.h
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numColumns; j++) {
      if (allBricks[i][j].status === 1) {
        var brickX = (j * (brick.w + brickPadding)) + brick.w;
        var brickY = (i * (brick.h + brickPadding)) + brick.h;
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
        if (ball.x > thisBrick.x && ball.x < thisBrick.x + brick.w && ball.y > thisBrick.y && ball.y < thisBrick.y + brick.h) {
          ball.ySpeed = -ball.ySpeed;
          thisBrick.status = 0;
          score++;
          // document.getElementById('score').innerHTML = 'Bricks Broken This Game: ' + score;
          $scoreBoard.html(function() {
            'Bricks Broken This Game: ' + score;
          })
          // check if all bricks are broken
          if (score === numRows * numColumns) {
            wins++;
            alert('You Win, Congratulations!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height)
  makeBricks();
  makeBall();
  makePaddle();
  makeRemainingLives();
  collisionDetection();

  // bounce off the side walls
  // if (ball.new === false) {
    if (ball.x + ball.xSpeed + ball.r > canvas.width || ball.x + ball.xSpeed - ball.r < 0) {
      ball.xSpeed = -ball.xSpeed;
    }
    if (ball.y + ball.ySpeed - ball.r < 0) {
      ball.ySpeed = -ball.ySpeed;
    } else if (ball.y + ball.ySpeed + ball.r > paddle.y) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        ball.ySpeed = -ball.ySpeed;
      } else {
        lives--;
        checkLives();
        // ball.new = true;
      }
    }
  // }

  if (rightPressed && paddle.x + paddle.w < canvas.width) {
    paddle.x += paddleSpeed;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddleSpeed;
  }

  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;

  requestAnimationFrame(draw);
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
  ctx.fillStyle = '#000';
  ctx.fillText('Lives remaining: ', 20, canvas.height - 15);

  for (var i = 0; i < lives - 1; i++) {
    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.arc((200)+i*(2*ball.r + brickPadding),canvas.height - 22,ball.r/2,0,2*Math.PI);
    ctx.fill();
  }
}

// ball will launch when space bar is pressed, and will move in both the x and
// y directions. when it hits a wall, it will change x direction, when it hits
// a brick the brick will disappear and the ball will change y directions

// var to store user input
// Handle keyboard controls
// First user input should be listening for space to be pressed and then launch the ball
$('#ball').keypress(function() {
  // start ball moving in the -y direction
  // $('#ball')
})
// var keysDown = {};
//
// addEventListener("keydown", function (e) {
// 	keysDown[e.keyCode] = true;
// }, false);
//
// addEventListener("keyup", function (e) {
// 	delete keysDown[e.keyCode];
// }, false);

// horizontal position of paddle will change when the left and right arrow keys are pressed

// if top of ball reaches a place where there is the bottom of a brick, that brick will disappear and the ball will change y directions and the brick count (score) will increment
// potential ways to hide ball: use display: hidden property; set opacity or a to 0; remove the element altogether; set it to match bg color and have no border; display: none; maybe draw a new white rectangle over it to cover it up? and keep an array of the hit/covered block locations instead of the existing blocks?
// maybe keep track of how many bricks are left in a row so that you know when to stop paying attention to that position on the board w/ regards to the ball hitting

// i think i'll somehow have to keep track of which bricks are already broken so i know not to have the ball react in those spots anymore. will that mean i'll have to remove the elements completely rather than just hiding them?  or just keep track of which ones not to react to? or because they are shapes in canvas will this be totally different?!

// when the ball goes below the paddle without hitting it, a life is lost and the paddle and ball reset.
// checkLives();

// paddle ball and bricks will reset when all the bricks are broken or lives are out
function checkLives(){
  if (!lives) {
    // display game over message
    ctx.font = '50px Helvetica';
    ctx.fillStyle = '#000000';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    // this auto reloads; probably also want to set a button for resetting the board instead
    // document.location.reload();
  } else {
    ball.x = canvas.width/2;
    ball.y = canvas.height-60;
    ball.xSpeed = ballSpeed;
    ball.ySpeed = -ballSpeed;
    paddle.x = (canvas.width - paddle.w) / 2;
  }
}
  // reset... maybe after user confirmation of some sort? New Game/Play again option? if no button, at least time out for a moment after displaying game over and before resetting
  // reset();


// function for reseting board
// function reset() {
//   score = 0;
//   brick.y = 20;
//   makeBricks();
//   makeBall();
//   makePaddle();
//   remainingLives();
//   ball.x = canvas.width / 2;
//   ball.y = 500;
//   paddle.x = canvas.width / 2 - paddle.w / 2;
// }


// bonus ideas:
// make higher rows of bricks worth more points
// allow user to choose different brick shapes
// allow user to make the ball go faster
// make different levels with slower/faster balls and different brick layouts
// have special bricks that do things like give extra lives or split the paddle or ball

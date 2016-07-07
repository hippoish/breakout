///////////////////////////////////
//////// K. Taylor Britton ////////
////////   GA WDI-SM-24    ////////
////////     Project 1     ////////
////////   July 8, 2016    ////////
///////////////////////////////////
////////    BREAKOUT!!    /////////
///////////////////////////////////


// CONSTANTS
// score
var START_LIVES = 1;
// canvas
var WIDTH = 400;
var HEIGHT = 500;
// ball
var BALL_RADIUS = 10;
var BALL_SPEED = 2;
// paddle
var PADDLE_WIDTH = 75;
var PADDLE_HEIGHT = 10;
var PADDLE_SPEED = 7;
// Bounce-Influence: limit the influence of where the ball hits the paddle on the ball's new xSpeed/trajectory: number between 0 and 1; shouldn't be 0 or the ball will just bounce straight up and down with no xSpeed
var BOUNCE_INFLUENCE = 0.75;
// bricks
// brick dimensions could depend on how many the user wants, ie get bigger when there are fewer so they take up an adequate portion of the screen; would possibly involve using ranges to decide how big to make bricks depending which range the requests fall in. Could also ask for user input for rows and columns
var NUM_ROWS = 8;
var NUM_COLUMNS = 6;
var BRICK_PADDING = 6;
var BRICK_HEIGHT = HEIGHT / (3 * NUM_ROWS);
var BRICK_WIDTH = WIDTH / NUM_COLUMNS - BRICK_PADDING;
// contains as many colors as the max number of allowable rows
var BRICK_COLORS = ['hotPink', 'mediumVioletRed', 'lightSeaGreen', 'teal', 'steelBlue', 'midnightBlue', 'plum', '#8E4585', 'purple'];

// make canvas
var canvas = document.getElementById('board');
var ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;

// VARIABLES
// score
var levelScore = 0;
var gameScore = 0;
var wins = 0;
var lives = START_LIVES;
var isGameOver = false;
var isLevelOver = false;
var level = 1;
// number of bricks to be broken on the current level; starts as rows*columns level 1
var maxPoints = NUM_ROWS * NUM_COLUMNS;
// paddle
// user controls for paddle
var rightPressed = false;
var leftPressed = false;
// an array containing NUM_ROWS arrays, each containing NUM_COLUMNS objects consisting of the x and y positions of every brick in the row. this is to keep track of the locations of all the bricks on the gameBoard. Should it be 'brokenBricks' instead?
var allBricks = [];
// populate allBricks array with empty coordinate objects; set all statuses to 1 so that they will display by default
for (var i = 0; i < NUM_ROWS; i++) {
  allBricks[i] = [];
  for (var j = 0; j < NUM_COLUMNS; j++) {
    allBricks[i][j] = {x: 0, y: 0, status: 1};
  }
}

// ball properties
var ball = {
  xSpeed: BALL_SPEED,
  ySpeed: -BALL_SPEED,
  xySpeed: Math.sqrt(Math.pow(BALL_SPEED, 2) + Math.pow(-BALL_SPEED, 2)),
  r: BALL_RADIUS,
  x: canvas.width / 2,
  y: canvas.height - 60,
  color: '#000000',
  // tells the ball whether to be moving or wait for launch
  new: true
}

// paddle properties
var paddle = {
  xSpeed: 7,
  ySpeed: 0,
  w: PADDLE_WIDTH,
  h: PADDLE_HEIGHT,
  x: (canvas.width - PADDLE_WIDTH)/ 2,
  y: ball.y + ball.r,
  color: '#000000'
}

// individual brick properties
var brick = {
  w: BRICK_WIDTH,
  h: BRICK_HEIGHT,
  x: (canvas.width - (NUM_COLUMNS * (BRICK_WIDTH + BRICK_PADDING))) / 2,
  y: BRICK_HEIGHT
};

// make scoreboard display
var $gamesWon = $('#game-count>');
var $newGameButton = $('#new-game');
var $gameScore = $('#game-score');
var $levelDisplay = $('#level');
var $levelScore = $('#level-score');

// EVENT LISTENERS
// ball launch
function addListeners() {
  $(document).keypress(spacebarLaunchHandler);
  $('#board').click(clickLaunchHandler);
  // paddle control (keyboard)
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);
  // paddle control(mouse)
  $('#board').mousemove(mouseMoveHandler);
  // new game button
  $newGameButton.click(newGameHandler);
}

// EVENT FUNCTIONS
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

// function for moving paddle
function keyDownHandler(event) {
  // look for right arrow key
  if (event.keyCode === 39) {
    rightPressed = true;
  }
  // look for left arrow key
  else if (event.keyCode === 37) {
    leftPressed = true;
  }
}
// function for stopping paddle motion when key is lifted
function keyUpHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = false;
  } else if (event.keyCode === 37) {
    leftPressed = false;
  }
}

// function for moving paddle according to movement of mouse
function mouseMoveHandler(event) {
  var relativeX = event.clientX - canvas.offsetLeft;
  if (relativeX > paddle.w/2 && relativeX < canvas.width - paddle.w/2) {
    paddle.x = relativeX - paddle.w/2;
  }
}

// function for reseting board, score, and animation when the new game button is clicked
function newGameHandler() {
  gameScore = 0;
  $gameScore.text('Bricks Broken This Game: ' + gameScore);
  levelScore = 0;
  $gameScore.text('Bricks Broken This Level: ' + levelScore);
  lives = START_LIVES;
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
  // restart animation
  draw();
}

// draw is the only function called automatically; it animates the game by calculating new ball and paddle positions and redrawing all canvas shapes frame by frame according to other functions
function draw() {
  // clear the canvas
  ctx.clearRect(0,0,canvas.width, canvas.height)
  addListeners();
  makeBricks();
  makeBall();
  makePaddle();
  collisionDetection();
  makeRemainingLives();

  // if the ball is new, it should be waiting for launch, if not, it should be moving
  if (!ball.new) {
    // bounce off the side walls
    if (ball.x + ball.xSpeed + ball.r > canvas.width || ball.x + ball.xSpeed - ball.r < 0) {
      ball.xSpeed = -ball.xSpeed;
    }
    // bounce off the top wall
    if (ball.y + ball.ySpeed - ball.r < 0) {
      ball.ySpeed = -ball.ySpeed;
    }
    // bottom of the ball's trajectory
    else if (ball.y + ball.ySpeed + ball.r > paddle.y) {
      // if the ball hits the paddle
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        // determine where the ball bounced relative to the center of the paddle as a number between -1 and 1
        var paddleCenter = paddle.x + paddle.w / 2;
        var ballRelX = (ball.x - paddleCenter)/(0.5 * paddle.w)
        // new xSpeed for ball based on overall speed, relative x position, and influence factor
        ball.xSpeed = ball.xySpeed * ballRelX * BOUNCE_INFLUENCE;
        // new ySpeed based on constant overall speed and new xSpeed (pythagorean theorem)
        ball.ySpeed = -Math.sqrt((Math.pow(ball.xySpeed, 2) - Math.pow(ball.xSpeed, 2)));
      }
      // if the ball misses the paddle
      else {
        lives--;
        checkLives();
      }
    }

    // move the paddle right while the right arrow is held down
    if (rightPressed && paddle.x + paddle.w < canvas.width) {
      paddle.x += paddleSpeed;
    }
    // move the paddle left while the left arrow is held down
    else if (leftPressed && paddle.x > 0) {
      paddle.x -= paddleSpeed;
    }

    // change the ball location according to its speed for the next frame
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
  }
  if (!isGameOver && !isLevelOver) {
    // if the game isn't over, keep redrawing the canvas frame by frame
    requestAnimationFrame(draw);
  }
}

// draw first frame to start animation
draw();

// draw a rectangular board based on the numbers of rows and columns
function makeBricks() {
  for (var i = 0; i < NUM_ROWS; i++) {
    for (var j = 0; j < NUM_COLUMNS; j++) {
      if (allBricks[i][j].status === 1) {
        var brickX = BRICK_PADDING / 2 + j * (brick.w + BRICK_PADDING);
        var brickY = brick.h + (i * (brick.h + BRICK_PADDING));
        allBricks[i][j].x = brickX;
        allBricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brick.w,brick.h);
        ctx.fillStyle = BRICK_COLORS[i];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// draw ball
function makeBall() {
  // if it's a new ball, place it in the middle of the paddle
  if (ball.new) {
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r;
  }
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// draw paddle
function makePaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();
}

// each frame, check for collisions with bricks
function collisionDetection() {
  for (var i = 0; i < NUM_ROWS; i++) {
    for (var j = 0; j < NUM_COLUMNS; j++) {
      // look one by one at the coordinates of each brick
      var thisBrick = allBricks[i][j];
      // if the brick has not yet been hit
      if (thisBrick.status === 1) {
        // if the ball's next movement will make it collide with the edge of a brick
        if (ball.x + ball.r > thisBrick.x  && ball.x - ball.r < thisBrick.x + brick.w && ball.y + ball.r > thisBrick.y && ball.y - ball.r < thisBrick.y + brick.h) {
          // reverse the vertical direction of the ball
          ball.ySpeed = -ball.ySpeed;
          // set brick status to 0, ie already been hit
          thisBrick.status--;
          // increase the score for the current game and overall
          gameScore++;
          levelScore++;
          $gameScore.text('Bricks Broken This Game: ' + gameScore);
          $levelScore.text('Bricks Broken This Level: ' + levelScore)
          // if all bricks are broken run the win function

          if (levelScore === maxPoints) {
            if (level === 4) {
              youWin();
            }
            else {
              endLevel();
            }
          }
        }
      }
    }
  }
}

// display lives counter
function makeRemainingLives() {
  // add text
  ctx.font = '20px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('Lives remaining: ', 100, canvas.height - 15);

  // add mini balls to represent lives
  for (var i = 0; i < lives - 1; i++) {
    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.arc((200)+i*(2*ball.r + BRICK_PADDING),canvas.height - 22,ball.r/2,0,2*Math.PI);
    ctx.fill();
  }
}

// check whether the game is over
function checkLives(){
  // if there are no lives left
  if (!lives) {
    // run the game over function
    gameOver();
  } else {
    // otherwise, reset the ball and paddle to the start state to start the next life
    ball.x = canvas.width/2;
    ball.y = canvas.height-60;
    ball.xSpeed = BALL_SPEED;
    ball.ySpeed = -BALL_SPEED;
    ball.new = true;
    paddle.x = (canvas.width - paddle.w) / 2;
  }
}

// var defining brick pattern for each level
var levels = [
            // level 1 pattern array
            [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
          ],
          // level 2 pattern array
          [
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0],
          ],
          // level 3 pattern array
          [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0],
          ],
          // level 4 pattern array
          [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0],
          ]
        ];

// runs when the user has broken all the bricks
function endLevel() {
  // increment the level and set isLevelOver to true
  level++;
  isLevelOver = true;
  // play level up noise
  $levelUpNoise = $('<audio controls autoplay> <source src="assets/mario-slide.wav" type="audio/wav">Your brower SUCKS so it does not support the mario slide noise</audio>')
  // $('body').append($levelUpNoise);
  // add level up message to canvas
  ctx.font = 'bold 50px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('Level Up', canvas.width / 2, (BRICK_HEIGHT + BRICK_PADDING) * (NUM_ROWS + 2) - 0.5 * BRICK_HEIGHT);
  // click to continue message
  ctx.font = '20px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('Click Anywhere To Continue', canvas.width / 2, (BRICK_HEIGHT + BRICK_PADDING) * (NUM_ROWS + 2)) + BRICK_HEIGHT;
  // add click listener to canvas
  $('canvas').on('click', levelUp);
}

function levelUp() {
  // return level score to zero
  levelScore = 0;
  // change the level label to the new level
  $('#level').text('Level ' + level);
  // set the brick statuses for the next level
  for (var i = 0; i < NUM_ROWS; i++) {
    for (var j = 0; j < NUM_COLUMNS; j++) {
      allBricks[i][j].status = levels[level-1][i][j];
    }
  }
  // based on brick statuses, calculate how many points will beat the level
  maxPoints = 0;
  for (var i = 0; i < NUM_ROWS; i++) {
    for (var j = 0; j < NUM_COLUMNS; j++) {
      maxPoints += allBricks[i][j].status;
    }
  }
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  paddle.x = canvas.width / 2 - paddle.w / 2;
  ball.new = true;
  isLevelOver = false;
  $('canvas').off('click');
  // restart animation
  draw();

}

function youWin() {
  // increment game win counter and display it
  wins++;
  $gamesWon.text('Games Won: ' + wins);
  // display win message
  ctx.font = 'bold 50px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('You Win!!!', canvas.width / 2, canvas.height / 2);
  ball.new = true;
  isGameOver = true;
}

function gameOver() {
  // play sad trombone noise
  $sadTromboneNoise = $('<audio controls autoplay> <source src="assets/wah-wah-sad-trombone.wav" type="audio/wav">Your brower SUCKS so it does not support the sad trombone noise</audio>')
  // $('body').append($sadTromboneNoise);
  // display game over message
  ctx.font = 'bold 50px Helvetica';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center'
  ctx.fillText('Game Over', canvas.width / 2, (BRICK_HEIGHT + BRICK_PADDING) * (NUM_ROWS + 1.5));
  // reset ball.new to true so it will wait for launch
  ball.new = true;
  // reset isGameOver to true so drawing will pause
  isGameOver = true;
}

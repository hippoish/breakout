// ideas:
// multiple balls
// multiple paddles
// allow user to choose # of bricks
// allow user to choose brick layout

// identify the elements with the bricks, the paddle, and the ball
var bricks = document.getElementsByClassName('brick');
var ball = document.getElementById('ball');
var paddle = document.getElementById('paddle');

// initialize the scoreboard and lives counter
var score = 0;
var lives = 3;

// start the ball at the bottom of the screen
ball.addEventListener('click', fucntion() {
  ball.style.top = paddle.style.top - ball.style.height;
}

// move the ball vertically and horizontally between the paddle and the bricks

// when the ball reaches a wall, reverse the x direction of movement

// when the ball reaches the brick area
  // if there is no brick, continue the ball until it hits a wall or does encounter a brick
  // if there is a brick there disappear that brick and reverse the y direction of the ball, and score++
  document.getElementsByClassName('brick').style.display = 'none';
  score++;

// when the ball reaches the level of the paddle
  // if the paddle is there, reverse the y direction of movement
  // if the ball misses the paddle, lives--, display message, and reset paddle and ball start next life

//

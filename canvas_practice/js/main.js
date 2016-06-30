console.log('javascript linked')

var my_canvas = document.getElementById('board');
var ctx = my_canvas.getContext('2d');

my_canvas.width = 800;
my_canvas.height = 600;

// make scoreboard display divs
var $scoreBoard = $('<h3>Bricks Broken This Game: 0</h3>');
$('body').prepend($scoreBoard);
var $gamesWon = $('<h3>Games Won: 0</h3>');
$('body').prepend($gamesWon);

// initialize score vars
var score = 0;
var wins = 0;
var lives = 5;

// ball stats
var ball = {
  xSpeed: 200,
  ySpeed: 200,
  r: 20,
  x: (my_canvas.width / 2),
  y: 500,
  color: '#000000'
}

// paddle stats
var paddle = {
  xSpeed: 200,
  ySpeed: 0,
  w: 200,
  h: 30,
  x: (my_canvas.width / 2 - 200 / 2),
  y: ball.y + ball.r,
  color: '#000000'
}

// bricks. planning to get user input for rows and columns, but will have to set limits
var numRows = 9;
var numColumns = 9;
// an array containing numRows arrays, each containing numColumns objects consisting of the x and y positions of every brick in the row. this is to keep track of the locations of all the bricks on the gameBoard
var allBricks = [];
// putting the empty rows into the allBricks var so that it has the right number of array elements(each representing a row)
for (var i = 0; i < numRows; i++) {
  allBricks[i] = [];
}
// brick dimensions could depend on how many the user wants, ie get bigger when there are fewer so they take up an adequate portion of the screen; would involve using ranges to decide how big to make bricks depending which range the requests fall in
var brickWidth = 80;
var brickHeight = 30;
var brick = {
  w: brickWidth,
  h: brickHeight,
  xPosition: (my_canvas.width - (numColumns * (brickWidth + 4))) / 2,
  yPosition: 20
};
// have to have colors for the max # of rows you're allowing
var brickColors = ['hotPink', 'mediumVioletRed', 'lightSeaGreen', 'teal', 'steelBlue', 'midnightBlue', 'plum', '#8E4585', 'purple'];

// function to set a new board
function makeBricks() {

// could i build different shaped boards for different levels by using switch statements? ie, a case for the first row, second row, third row, etc that all build different numbers of bricks?
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numColumns; j++) {
      var thisBrick = {x: brick.xPosition, y: brick.yPosition};
      allBricks[i].push(thisBrick);
      ctx.fillStyle = brickColors[i];
      ctx.fillRect(brick.xPosition,brick.yPosition,brick.w,brick.h);
      brick.xPosition += brick.w + 4;
    }
    brick.xPosition = (my_canvas.width - (numColumns * (brickWidth + 4))) / 2;
    brick.yPosition += brick.h + 4;
  }
}

makeBricks();

// to build a white brick to cover up the existing brick?!?
ctx.fillStyle = '#ffffff';
ctx.fillRect((my_canvas.width - (numColumns * (brickWidth + 4))) / 2,brick.yPosition + (brick.h+4)*(numRows-1),brick.w,brick.h);

// ball
ctx.fillStyle = ball.color;
ctx.beginPath();
ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
ctx.fill();

// paddle
ctx.fillStyle = '#000000';
// ctx.strokeRect(paddle.x,paddle.y,paddle.w,paddle.h);
ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);

// add lives counter to canvas
ctx.font = '20px Helvetica';
ctx.fillStyle = '#000';
ctx.fillText('Lives remaining: ', 20, my_canvas.height - 15);

// display the number of lives left as balls
for (var i = 0; i < lives - 1; i++) {
  ctx.fillStyle = '#aaaaaa';
  ctx.beginPath();
  ctx.arc((200)+i*(2*ball.r + 4),my_canvas.height - 22,ball.r/2,0,2*Math.PI);
  ctx.fill();
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
score++;

// i think i'll somehow have to keep track of which bricks are already broken so i know not to have the ball react in those spots anymore. will that mean i'll have to remove the elements completely rather than just hiding them?  or just keep track of which ones not to react to? or because they are shapes in canvas will this be totally different?!

// paddle ball and bricks will reset when all the bricks are broken or lives are out. instead of checking these every time, we could put the whole game inside of a while loop with live > 0 and score < numRows * numColumns and then once exiting that check this
if (lives === 0) {
  // display game over message

  // reset... maybe after user confirmation of some sort? New Game/Play again option?
  reset();
} else if (score === numRows * numColumns) {
  wins++;
  reset();
}

// function for reseting board
function reset() {
  score = 0;
  makeBricks();
  ball.x = my_canvas.width / 2;
  ball.y = 500;
  paddle.x = my_canvas.width / 2 - paddle.w / 2;
}


// bonus ideas:
// make higher rows of bricks worth more points
// allow user to choose different brick shapes
// allow user to make the ball go faster
// make different levels with slower/faster balls and different brick layouts
// have special bricks that do things like give extra lives or split the paddle or ball

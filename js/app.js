//setup Canvas
const canvas = document.getElementById('my-canvas');


const groundLevel = 375; //setting most bottom layer of the 
let xPosition = 0; //will be used to scroll the background image
let gameSpeed = 2.5; //how fast the background image will scroll
let pause = false; //set the pause condition as false initially
let upKeyPress = false; //set up key press as false
let rightKeyPress = false; // set right key press as false
let leftKeyPress = false; // set left key press as false
let jumpCount = 0; // set number of jumps as 0
let gameOver = false; //set game over as false
let enemyCount = 0; //used to only allow 1 new enemy during spawn point
let score = 0; //keep track of user score
const $score = $('#score');
let gameSpeedTracker = 0; //count to make sure game speed is only increased once
let enemyDistance = 250;//distance at which new enemies spawn
let obstacleDistance = 100;//distance at which new obstacles may spawn
let check = false;
const $button = $('#pause');
let highScores = [];
let gameStart = 0;


const ctx = canvas.getContext('2d'); //setting up canvas
let groundImage = new Image(); //setting up ground image

groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/world1_image.png';

groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, xPosition, 200, 600, 25, 0, 375, canvas.width, 25)
}


let pipeImage = new Image();
pipeImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/blocks_sheet.png';

pipeImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(pipeImage, 0, 160, 32, 32, X, Y, width, height);
}


let coinImage = new Image();
coinImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/coinGold.png';

coinImage.onload = function (X, Y) {//draw the ground image
  ctx.drawImage(coinImage, 12, 12, 46, 46, X-2, Y - 30, 30, 30) 
}


let characterImage = new Image();
characterImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/p1_stand.png';

characterImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(characterImage, 2, 2, 62, 88, X, Y, width, height);
}


let blockImage = new Image();
blockImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/box.png';

blockImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(blockImage, 2, 2, 66, 66, X, Y, width, height);
}


let itemBlockImage = new Image();
itemBlockImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/boxItem.png';

itemBlockImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(itemBlockImage, 2, 2, 66, 66, X, Y, width, height);
}


let noItemBlockImage = new Image();
noItemBlockImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/boxEmpty.png';

noItemBlockImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(noItemBlockImage, 2, 2, 66, 66, X, Y, width, height);
}

let enemyImage = new Image();
enemyImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/slimeWalk2.png';

enemyImage.onload = function (X, Y, width, height) {//draw block image
  ctx.drawImage(enemyImage, 2, 2, 47, 22, X, Y, width, height);
}


let mushroomImage = new Image();
mushroomImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/star.png';

mushroomImage.onload = function (X, Y) {//draw the ground image
  ctx.drawImage(mushroomImage, 2, 12, 48, 46, X-8, Y - 30, 30, 30) 
}

//make an array with all the current characters 
const allChars = [];
const allObstacles = [];
const allEnemies = [];



//set start conditions for the player
const mainPlayer = {//setting up x, y, height and width as well as yVelocity
	x: 200, 
	height: 40,
	y: groundLevel - 40, 
	width: 25, 
  yVelocity: 0,
  lastY: 335, //tracks the Y direction that mario is currently going
  moving: false,
	draw(){//redraw the main character
  characterImage.onload(this.x, this.y, this.width, this.height);
  },
}

mainPlayer.draw();//draw the main character for the first time

class Enemy {//enemy Class, will be used to make multiple enemies
	constructor() {
    this.x = 400; 
    this.y = 350;
    this.width = 20; 
    this.height =  25;
    this.yVelocity =  0; 
    this.xVelocity = -1; //all enemies will move in relation to the background intially
  }
  draw() {
    enemyImage.onload(this.x, this.y, this.width, this.height)
  }
}


class Obstacle {//class of obstacles to be called inside of another function
  constructor (X, Y, width, height, hasitem, item, type) {//obstacle requires inputs to instantiate
    this.x = X;
    this.y = Y;
    this.width = width; 
    this.height = height; 
    this.yVelocity = 0;
    this.hasItem = hasitem;
    this.item = item;
    this.type = type;
    this.beenHit = false;
  }
  draw () {
    if(this.type === 'largePipe' || this.type === 'smallPipe') {//if obstacle is pipe
      pipeImage.onload(this.x, this.y, this.width, this.height);
    }
  }
  drawCoin() {
    if(this.hasItem === true && this.item == 'coin' && this.beenHit === true){//if obstacle has a coin
      coinImage.onload(this.x, this.y);
    }
  }
  drawMushroom() {
    if(this.hasItem === true && this.item == 'mushroom' && this.beenHit === true){//if obstacle has a coin
      mushroomImage.onload(this.x, this.y);
    }
  }
  drawBlock() {//if the obstacle is a block
    if(this.type === 'block' && this.hasItem === false) {

      blockImage.onload(this.x, this.y, this.width, this.height);

    } else if(this.type === 'block' && this.hasItem === true && this.beenHit === false) {

      itemBlockImage.onload(this.x, this.y, this.width, this.height)

    } else if(this.type === 'block' && (this.item === 'coin' || this.item === 'mushroom') 
      && this.beenHit === true) {

      noItemBlockImage.onload(this.x, this.y, this.width, this.height)
    }
  }
}

function clearCanvas() {//clears the canvas and redraws the ground image
  // this will erase the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  groundImage.onload();
  for(let i = 0; i < allEnemies.length; i++) { //draw all enemies as a part of clearing canvas
    allEnemies[i].draw();
  }

  for(let i = 0; i < allObstacles.length; i++){//draw all obstacles as a part of clearing canvas
    if(mainPlayer.moving && leftKeyPress === false) {
      allObstacles[i].x = allObstacles[i].x - gameSpeed;
    }
    //draw all items/obstacles types
    allObstacles[i].draw();
    allObstacles[i].drawCoin();
    allObstacles[i].drawBlock();
    allObstacles[i].drawMushroom();
  }
  mainPlayer.draw();//draw the main characeter
}


const gumba = new Enemy();//declare first enemy
const wall = new Obstacle(275, 345, 20, 30, false, '', 'smallPipe');//declare first obstacle

allEnemies[0] = gumba; 
allObstacles[0] = wall;


//gravity function which is going to be used on every character
const gravity = (object) => {
	if(standingOnObject(object)){//checking if character is standing on an object
		//do nothing
	} else {
     object.yVelocity += 0.45;//the "acceleration" due to gravity
     object.lastY = object.y;//record the current Y position
     object.y = object.y + object.yVelocity; //update the position of the player after gravity 
	}
	return
}

//function to check if the input object is standing on anything including the ground.
const standingOnObject = (character) => { //checks if the object is standing on an object
  for(let i = 0; i < allObstacles.length; i++) {
   //checking if player is standing ontop of an obstacle
    if(character.y + character.height <= allObstacles[i].y + 10 && //
      character.y + character.height >= allObstacles[i].y - 5 &&
      character.x < allObstacles[i].x + allObstacles[i].width &&
      character.x + character.width > allObstacles[i].x) {

      character.yVelocity = 0; //set the character's yVelocity to 0
      character.y =  allObstacles[i].y - character.height - 1; //draw the character to just above the ground

      if(allObstacles[i].hasItem === true && allObstacles[i].item === 'coin' && allObstacles[i].beenHit === true){
        //if obstacle had a coin add 200 points to score
        score += 200;
        $score.text(`Score: ${score}`)
        allObstacles[i].hasItem = false;
      } else if(allObstacles[i].hasItem === true && allObstacles[i].item === 'mushroom' && allObstacles[i].beenHit === true) {
        score += 350
        $score.text(`Score: ${score}`)
        allObstacles[i].hasItem = false;
      }


      jumpCount = 0; //reset the jump counter
      return true
    }
  }

  //checking if character is at ground level
	if(character.y + character.height >= groundLevel) { 
    character.yVelocity = 0; //set the character's yVelocity to 0
    character.y = 335; //draw the character to just above the ground
    jumpCount = 0; //reset the jump counter
		return true
	} else {
		return false
	}
}

const moveEnemies = () => { //function to move all enemies based on their xVelocity
  for(let i = 0; i < allEnemies.length; i++) {
    if(mainPlayer.moving && leftKeyPress === false) {//if player is moving the background
      allEnemies[i].x = allEnemies[i].x - gameSpeed + allEnemies[i].xVelocity; //add speed of background to enemy movement
    } else{
      allEnemies[i].x = allEnemies[i].x + allEnemies[i].xVelocity; //enemy movement if background is not moving
    }
  }
}

//function to clear all enemies and obstacles from memory that have left the display
const clearEverything = () => {
  for(let i = 0; i < allEnemies.length; i++) {
    if(allEnemies[i].x + allEnemies[i].width <= 0) {
      allEnemies.splice(i, 1);
    } 
  }

  for(let i = 0; i < allObstacles.length; i++) {
    if(allObstacles[i].x + allObstacles[i].width <= 0) {
      allObstacles.splice(i, 1);
    }
  }
}


//function to check for interference between enemy object and main player. To be used for death condition for either character
const checkForInterference = () => {
  for(let i = 0; i < allObstacles.length; i++) {//checks for interference will all objects with main player
    if((mainPlayer.y >= allObstacles[i].y && //checks interference on left edge with player
      mainPlayer.y <= allObstacles[i].y + allObstacles[i].height ||
      mainPlayer.y + mainPlayer.height >= allObstacles[i].y &&
      mainPlayer.y + mainPlayer.height <= allObstacles[i].y + allObstacles[i].height) &&
      mainPlayer.x + mainPlayer.width < allObstacles[i].x + 6 &&
      mainPlayer.x + mainPlayer.width > allObstacles[i].x -3 &&
      leftKeyPress == false) {

      mainPlayer.moving = false; //change player moving to false
      mainPlayer.x = allObstacles[i].x - mainPlayer.width - 2; //player to left edge of obstacle

    } else if ((mainPlayer.y >= allObstacles[i].y &&  //checks interference on right edge with player
      mainPlayer.y <= allObstacles[i].y + allObstacles[i].height ||
      mainPlayer.y + mainPlayer.height >= allObstacles[i].y &&
      mainPlayer.y + mainPlayer.height <= allObstacles[i].y + allObstacles[i].height) &&
      mainPlayer.x < allObstacles[i].x + allObstacles[i].width + 3 &&
      mainPlayer.x > allObstacles[i].x + allObstacles[i].width - 3 && 
      rightKeyPress == false){

      mainPlayer.x = allObstacles[i].x + allObstacles[i].width + 3; //move player to right edge of obstacle

    } else if(mainPlayer.y <= allObstacles[i].y + allObstacles[i].height + 1 && //
      mainPlayer.y >= allObstacles[i].y + allObstacles[i].height - 15 &&
      mainPlayer.x < allObstacles[i].x + allObstacles[i].width &&
      mainPlayer.x + mainPlayer.width > allObstacles[i].x) {

      mainPlayer.yVelocity = 0;
      mainPlayer.y = allObstacles[i].y + allObstacles[i].height + 2
      allObstacles[i].beenHit = true;
    }





  }  
  for(let i = 0; i < allEnemies.length; i++) {//checking interference between player and enemies
    const enemy = allEnemies[i];

    const mainPlayerL = mainPlayer.x;
    const mainPlayerR = mainPlayer.x + mainPlayer.width;
    const mainPlayerU = mainPlayer.y;
    const mainPlayerD = mainPlayer.y + mainPlayer.height;
  
  
    const gumbaL = enemy.x;
    const gumbaR = enemy.x + enemy.width;
    const gumbaU = enemy.y;
    const gumbaD = enemy.y + enemy.height;


    //checking if player is attacking from on top of enemy and there is interference
    if(mainPlayer.lastY < mainPlayer.y && mainPlayer.y <= 325){

      if(enemy.x < mainPlayer.x + mainPlayer.width &&
        enemy.x + enemy.width > mainPlayer.x &&
        enemy.y < mainPlayer.y + mainPlayer.height &&
        enemy.height + enemy.y > mainPlayer.y) {
        score += 100;
        $score.text(`Score: ${score}`);
        allEnemies.splice(i, 1);
        return 'mario wins'
      }
    } else {//if not attacking from the top check again to make sure there is interference
        if(enemy.x < mainPlayer.x + mainPlayer.width &&
          enemy.x + enemy.width > mainPlayer.x &&
          enemy.y < mainPlayer.y + mainPlayer.height &&
          enemy.height + enemy.y > mainPlayer.y) {

          ctx.beginPath();
          ctx.font= 'bold 34px Wendy';
          ctx.fillStyle = "red";
          ctx.fillText('YOU LOSE', 215, 200);
          ctx.closePath();

          $button.text('Restart Game');
          return true
      }
    }


    for(let j = 0; j < allObstacles.length; j++) {
      //Checking interference between obstacles and enemies
      //if interference, change the direction of enemy travel
      if(allObstacles[j].y + allObstacles[j].height == allEnemies[i].y + allEnemies[i].height &&
      allEnemies[i].x < allObstacles[j].x + allObstacles[j].width + 1 &&
      allEnemies[i].x > allObstacles[j].x + allObstacles[j].width - 1) {

        allEnemies[i].xVelocity = -allEnemies[i].xVelocity;

      } else if(allObstacles[j].y + allObstacles[j].height == allEnemies[i].y + allEnemies[i].height &&
      allEnemies[i].x + allEnemies[i].width < allObstacles[j].x + 1 &&
      allEnemies[i].x + allEnemies[i].width > allObstacles[j].x -1) {

        allEnemies[i].xVelocity = -allEnemies[i].xVelocity
      }
    }
  }
      return false
}
  
document.addEventListener('keydown', (event) => {//event listener on keypresses

  if(event.keyCode == 39) { //if right key is pressed set variable to true
    rightKeyPress = true;
  } else if(event.keyCode == 37) {//if left key is pressed set variable to true
    leftKeyPress = true;
  } 

  // up 38
  if(event.keyCode == 38 && jumpCount < 3) {//if up key is pressed and jump count is < 2 
    upKeyPress = true;
    if(mainPlayer.yVelocity < 7){ //set the yVelocity of the mainPlayer
      mainPlayer.yVelocity = -7;
      jumpCount++;
    }
  }
})


//move player based on key presses
const movePlayer = () => {
  if(rightKeyPress === true && mainPlayer.x + mainPlayer.width < canvas.width) { //listen for right press
    if(mainPlayer.x > 250) { //if player is in the middle of the screen
      xPosition += gameSpeed; //move the background intstead of the player
      enemyCount = 0;
      pipeCount = 0;
      mainPlayer.moving = true;
      mainPlayer.lastY = mainPlayer.y;
    } else { //move the player not the background
      mainPlayer.x += gameSpeed;
      mainPlayer.lastY = mainPlayer.y;
    }
  }

  if(leftKeyPress == true && mainPlayer.x > 0) { //listens for the left press
    mainPlayer.x -= gameSpeed; // the player moves to the left
    mainPlayer.lastY = mainPlayer.y;
  }

  if(upKeyPress == true) {
    mainPlayer.lastY = mainPlayer.y; //log the current y position as the last y position
    mainPlayer.y = mainPlayer.y + mainPlayer.yVelocity; //update the player's position based on the velocity
    standingOnObject(mainPlayer);

  }

}

//add event listener for key up press
document.addEventListener('keyup', (event) => {
  if(event.keyCode == 38) { //turn keypress holder off on up key
    upKeyPress = false;
    jumpCount++;
  }

  if(event.keyCode == 37) {//turn keypress holder off on left key
    leftKeyPress = false;
  }

  if(event.keyCode == 39) {//turn keypress holder off on right key
    rightKeyPress = false;
    mainPlayer.moving = false;
  }
})

//function to randomly add obstacles to the map
const makeObstacles = () => {
  const odds = Math.random();


  if(odds < 0.25) {//make pipes
    const sizeOfPipe = Math.random();
    if(sizeOfPipe < .6) {
      const pipe = new Obstacle(600, 345, 30, 30, false, '', 'smallPipe');//make small pipe
      allObstacles.push(pipe);
      pipeCount++;
    } else {
      const pipe = new Obstacle(600, 280, 40, 95, false, '', 'largePipe');//make large pipe
      allObstacles.push(pipe);
      pipeCount++;
    }
  } else if( odds < .75) {//make floating blocks
    let blockCount = 1
    const itemOdds = Math.random();
    let block;
    //make items based on random odds
    if(itemOdds < 0.1) {
      block = new Obstacle(600, 245, 25, 25, true, 'mushroom', 'block');
    //  console.log('made mushroom block')
    } else if(itemOdds < 0.2){
      block = new Obstacle(600, 245, 25, 25, true, 'coin', 'block');
     // console.log('made coin block')
    } else {
      block = new Obstacle(600, 245, 25, 25, false, '', 'block');
    }

    allObstacles.push(block); //add obstacle to the obstacles array

    let blockGroupOdds = Math.random();
    while(blockGroupOdds < 0.35 && blockCount < 5) {//make groups of blocks
      //console.log('made blockgroup')
      let block1;
      const itemOdds1 = Math.random();
      if(itemOdds1 < 0.04) {
        block1 = new Obstacle(600 + 25 * blockCount, 150, 25, 25, true, 'mushroom', 'block');
       // console.log('made blockgroup mushroom')
      } else if(itemOdds1 < 0.125){
        block1 = new Obstacle(600 + 25 * blockCount, 150, 25, 25, true, 'coin', 'block');
       // console.log('made blockgroup coin')
      } else {
        block1 = new Obstacle(600 + 25 * blockCount, 150, 25, 25, false, '', 'block');
      }

      allObstacles.push(block1);
      blockCount++;
      blockGroupOdds = Math.random(); 
    }
  }
}


//check for high score function 
//keeps the highest 10 scores
const checkHighScore = () => {
  const highScoreLength = highScores.length //for loop only runs for current length of array

  if(gameStart === 1) {
    const name = window.prompt('You got a high score! Enter your name.')
    const highScoreObject = {
      playerName: name, 
      playerScore: score
    }
    highScores[0] = highScoreObject
  } else {
    for(let i = 0; i < highScoreLength; i++) {

      if(score > highScores[i].playerScore) { //checks if current score is greater than current array element
        const name = window.prompt('You got a high score! Enter your name.')
        const highScoreObject = {
          playerName: name, 
          playerScore: score
        }

        highScores.splice(i, 0, highScoreObject);

        if(highScores.length > 10) {
          highScores.pop();
        }

        return
      }
    }

    //add the current score to the to the end of the array if the high score list is less than 10
    if(score > 0 && highScores.length < 10) {
      const name = window.prompt('You got a high score! Enter your name.')
      const highScoreObject = {
        playerName: name, 
        playerScore: score
      }
      highScores.push(highScoreObject);
    }
  }
}


//add the new high score array to the page
const makeHighScore = () => {
  
  const $olRight = $('#rightList');
  const $olLeft = $('#leftList');
  $olRight.empty();
  $olLeft.empty();

  for(let i = 0; i < highScores.length; i++) {
    const $liLeft = $('<li/>');
    $liLeft.text(highScores[i].playerName);
    $olLeft.append($liLeft);

    const $liRight = $('<li/>');
    $liRight.text(highScores[i].playerScore);
    $olRight.append($liRight);
  }
}


const resetGame = () => {
  xPosition = 0; //will be used to scroll the background image
  gameSpeed = 2.5; //how fast the background image will scroll
  pause = false; //set the pause condition as false initially
  upKeyPress = false; //set up key press as false
  rightKeyPress = false; // set right key press as false
  leftKeyPress = false; // set left key press as false
  jumpCount = 0; // set number of jumps as 0
  gameOver = false; //set game over as false
  enemyCount = 0; //used to only allow 1 new enemy during spawn point
  score = 0; //keep track of user score
  gameSpeedTracker = 0; //count to make sure game speed is only increased once
  enemyDistance = 250;//distance at which new enemies spawn
  obstacleDistance = 100;//distance at which new obstacles may spawn
  check = false;
  allObstacles.length = 0;
  allEnemies.length = 0;;
  $score.text(`Score: ${score}`);


  //reset mainPlayer stats
  mainPlayer.x = 200;
  mainPlayer.height = 40;
  mainPlayer.y = groundLevel - 40;
  mainPlayer.width = 25;
  mainPlayer.yVelocity = 0;
  mainPlayer.lastY = 335;
  mainPlayer.moving = false
  mainPlayer.draw();

  const enemy1 = new Enemy();
  const wall1 = new Obstacle(275, 345, 20, 30, false, '', 'smallPipe')
  allObstacles[0] = wall1;
  allEnemies[0] = enemy1;
  animateCanvas();

}

const startArary = ['Use the left and right arrows to move.', 'Use the up arrow to jump and double jump.', 'Avoid the obstacles and kill the enemies.', 'Collect coins and stars to get more points.', 'Try and get the high score!'];

//used to write the instructions to the screen when the first game is played
if(gameStart === 0) {
  for(let i = 0; i < startArary.length; i++) {
    ctx.beginPath();
    ctx.font= 'bold 15px Wendy';
    ctx.fillStyle = "black";
    ctx.fillText(startArary[i], 125, 200 + i * 30);
  }
}

//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
function animateCanvas() {
  movePlayer(); //move player
	gravity(mainPlayer); //gravity's affect on the player
  moveEnemies();//move all enemies
  
 	clearCanvas();//clear the canvas
  check = checkForInterference();//check for interference between main player and any enemies
  // pass this function into animate 
  clearEverything();
  if(pause || check == true){ //if pause or enemy interference clear the animation function
    if(check === true) {
      checkHighScore(); 
      makeHighScore();
      gameOver = true; 
      gameStart++;
    }
    return
  }
  //making obstacles at set intervals
  if(Math.floor(xPosition) % obstacleDistance === 0 && xPosition != 0 && pipeCount < 1){
    makeObstacles();
  }

  //making enemies at set intervals
  if(Math.floor(xPosition) % enemyDistance === 0 && xPosition != 0 && enemyCount < 1){
    const gumba1 = new Enemy();
    gumba1.x = 660;
    allEnemies.push(gumba1)
    enemyCount++;
  }

  //increase game speed at certain conditions
  if((score % 1000 >= 0 && score % 1000 < 400) && score >= 600 && (gameSpeedTracker < 1)) {
    gameSpeed += .5;
    // gameSpeed = Math.floor(gameSpeed * 10) / 10;
    enemyDistance += 50;
    obstacleDistance += 20;
    gameSpeedTracker++;
    xPosition = 0;
  } else if(score % 1000 > 600) {
    gameSpeedTracker = 0;
  }
  //reset the xposition to loop the background image
  if(xPosition >= 500) {
    xPosition = 0;
  }
  window.requestAnimationFrame(animateCanvas)

}


//just used to prevent overheating and overusing resources
//remove for actual game
$('#pause').on('click', (event) => {
  pause = !pause;

  //if first game, then the button starts the game
  if(gameStart === 0) {
    //clearCanvas();
    pause = !pause;
    animateCanvas();
    $button.text('Pause Game');
    gameStart++;
  } else if(gameOver === true) {//if game over then run resetGame function
    resetGame();
  } else if(pause === false){ //if game is paused then resume the game
    $button.text('Pause Game');
    animateCanvas();
  } else {//otherwise pause the game
    $button.text('Resume Game');
  }
})





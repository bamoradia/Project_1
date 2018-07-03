
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
let gameSpeedTracker = 0;
let enemyDistance = 250;
let obstacleDistance = 100;
let allowMoveRight = true;

const ctx = canvas.getContext('2d'); //setting up canvas
let groundImage = new Image(); //setting up ground image

groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/world1_image.png';

groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, xPosition, 200, 600, 25, 0, 375, canvas.width, 25)
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
		ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  },
}

mainPlayer.draw();//draw the main character for the first time

class Enemy {//enemy Class, will be used to make multiple enemies
	constructor() {
    this.x = 400; 
    this.y = 345;
    this.width = 20; 
    this.height =  30;
    this.yVelocity =  0; 
    this.xVelocity = -1; //all enemies will move in relation to the background intially
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}


class Obstacle {//class of obstacles to be called inside of another function
  constructor (X, Y, width, height) {//obstacle requires inputs to instantiate
    this.x = X;
    this.y = Y;
    this.width = width; 
    this.height = height; 
    this.yVelocity = 0;
  }
  draw () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath(); 
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
      if(mainPlayer.moving) {
        allObstacles[i].x = allObstacles[i].x - gameSpeed;
      }
    allObstacles[i].draw();
  }
  mainPlayer.draw();//draw the main characeter
}


const gumba = new Enemy();
const wall = new Obstacle(275, 345, 20, 30);

allEnemies[0] = gumba; 
allObstacles[0] = wall;




//gravity function which is going to be used on every character
const gravity = (object) => {
	if(standingOnObject(object)){//checking if character is standing on an object
		//do nothing
	} else {
     object.yVelocity += 0.45;//the "acceleration" due to gravity
     object.lastY = object.y;
     object.y = object.y + object.yVelocity; //update the position of the player after gravity 
      //the velocity of the object increases every tick
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
    character.y =  allObstacles[i].y - character.height; //draw the character to just above the ground
    jumpCount = 0; //reset the jump counter
    return true
    }

  }

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
    if(mainPlayer.moving) {//if player is moving the background
      allEnemies[i].x = allEnemies[i].x - gameSpeed + allEnemies[i].xVelocity; //add speed of background to enemy movement
    } else{
      allEnemies[i].x = allEnemies[i].x + allEnemies[i].xVelocity; //enemy movement if background is not moving
    }
  }
}


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

//need to adjust so that a top interference kills the enemy otherwise main character is killed
const checkForInterference = () => {
  for(let i = 0; i < allObstacles.length; i++) {//checks for interference will all objects with main player
    if((mainPlayer.y >= allObstacles[i].y && //checks interference on left edge with player
      mainPlayer.y <= allObstacles[i].y + allObstacles[i].height ||
      mainPlayer.y + mainPlayer.height >= allObstacles[i].y &&
      mainPlayer.y + mainPlayer.height <= allObstacles[i].y + allObstacles[i].height) &&
      mainPlayer.x + mainPlayer.width < allObstacles[i].x + 6 &&
      mainPlayer.x + mainPlayer.width > allObstacles[i].x -3 &&
      leftKeyPress == false) {

      mainPlayer.x = allObstacles[i].x - mainPlayer.width - 2;
      allowMoveRight = false;
      console.log(allowMoveRight)

    } else if ((mainPlayer.y >= allObstacles[i].y &&  //checks interference on right edge with player
      mainPlayer.y <= allObstacles[i].y + allObstacles[i].height ||
      mainPlayer.y + mainPlayer.height >= allObstacles[i].y &&
      mainPlayer.y + mainPlayer.height <= allObstacles[i].y + allObstacles[i].height) &&
      mainPlayer.x < allObstacles[i].x + allObstacles[i].width + 3 &&
      mainPlayer.x > allObstacles[i].x + allObstacles[i].width - 3 && 
      rightKeyPress == false)
    {
      mainPlayer.x = allObstacles[i].x + allObstacles[i].width + 3;
    } else {
      allowMoveRight = true;
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
    if(mainPlayer.lastY < mainPlayer.y) {

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

          console.log('player should be dead');
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
  if(event.keyCode == 38 && jumpCount < 2) {//if up key is pressed and jump count is < 2 
  	//console.log('got up key')
    upKeyPress = true;
    if(mainPlayer.yVelocity < 7){ //set the yVelocity of the mainPlayer
      mainPlayer.yVelocity = -7;
    }
    //mainPlayer.y -= 150; //the player jumps 150 px
  }
})


//move player based on key presses
const movePlayer = () => {
  if(rightKeyPress === true && allowMoveRight && mainPlayer.x + mainPlayer.width < canvas.width) { //listen for right press

    if(mainPlayer.x > 200) { //if player is in the middle of the screen
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
    mainPlayer.x -= gameSpeed; // the player moves 2.5px to the left
    mainPlayer.lastY = mainPlayer.y;
    // xPosition -= .25;
  }

  if(upKeyPress == true) {
    // jumpTick++;
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
      const pipe = new Obstacle(600, 345, 30, 30);
      allObstacles.push(pipe);
      pipeCount++;
    } else {
      const pipe = new Obstacle(600, 280, 30, 95);
      allObstacles.push(pipe);
      pipeCount++;
    }
  } else if( odds < .75) {//make floating blocks
    //console.log('making block')
    let blockCount = 1
    const block = new Obstacle(600, 250, 25, 25);
    allObstacles.push(block);
    let blockGroupOdds = Math.random();
    while(blockGroupOdds < 0.4) {//make groups of blocks
      const block1 = new Obstacle(600+25*blockCount, 250, 25, 25)
      allObstacles.push(block1);
      blockCount++;
      blockGroupOdds = Math.random();
    }

  }

}
//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
//
function animateCanvas() {
  movePlayer(); //move player
	gravity(mainPlayer); //gravity's affect on the player
  //xPosition += gameSpeed;//move the position of the background
  moveEnemies();//move all enemies
  
 	clearCanvas();//clear the canvas
  const check = checkForInterference();//check for interference between main player and any enemies
  //console.log(xPosition);
  // pass this function into animate 
  clearEverything();
  if(pause || check == true){ //if pause or enemy interference clear the animation function
    gameOver = true;
    return
  } else if (check == 'mario wins') {
    console.log('Mario won!')
  }

  //making obstacles at set intervals
  if(Math.floor(xPosition) % obstacleDistance === 0 && xPosition != 0 && pipeCount < 1){
    makeObstacles();
  }

  //making enemies at set intervals
  if(Math.floor(xPosition) % enemyDistance === 0 && xPosition != 0 && enemyCount < 1){
    const gumba1 = new Enemy();
    gumba1.x = 650;
    allEnemies.push(gumba1)
    enemyCount++;
  }

  //increase game speed at certain conditions
  if((score % 1000 === 0) && score != 0 && (gameSpeedTracker < 1)) {
    gameSpeed += .5;
    // gameSpeed = Math.floor(gameSpeed * 10) / 10;
    enemyDistance += 50;
    obstacleDistance += 20;
    gameSpeedTracker++;
    xPosition = 0;
  } else if(score % 1000 != 0) {
    gameSpeedTracker = 0;
  }

  //reset the xposition to loop the background image
  if(xPosition >= 2792) {
    xPosition = 0;
  }
  window.requestAnimationFrame(animateCanvas)

}


animateCanvas();


if(gameOver == true) {
  console.log('The game is over!')
}



//just used to prevent overheating and overusing resources
//remove for actual game
$('#pause').on('click', (event) => {
  pause = !pause;
  if(pause === false){
    animateCanvas();
  }
})


//setup Canvas
const canvas = document.getElementById('my-canvas');


const groundLevel = 375; //setting most bottom layer of the 
let xPosition = 0; //will be used to scroll the background image
let gameSpeed = 0.75; //how fast the background image will scroll
let pause = false; //set the pause condition as false initially
let upKeyPress = false; //set up key press as false
let rightKeyPress = false; // set right key press as false
let leftKeyPress = false; // set left key press as false
let jumpCount = 0; // set number of jumps as 0
let gameOver = false; //set game over as false

const ctx = canvas.getContext('2d'); //setting up canvas
let groundImage = new Image(); //setting up ground image

groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/world1_image.png';

groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, xPosition, 200, canvas.width, 25, 0, 375, canvas.width, 25)
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
	draw(){//redraw the main character
		ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  },
}

mainPlayer.draw();//draw the main character for the first time


// const trialPlayer = {
//   position: [200, groundLevel - 40, 25, 40],
//   desiredPosition: [200, groundLevel - 40, 40, 25],
//   yVelocity: 0, 
//   xVelocity: 0,
//   angle: 0,
//   draw() {
//     ctx.beginPath();
//     ctx.rect(this.position[0], this.position[1], this.position[2], this.position[3]);
//     ctx.fillStyle = 'blue';
//     ctx.fill();
//     ctx.closePath(); 
//   }
// }

// trialPlayer.draw();


class Enemy {//enemy Class, will be used to make multiple enemies
	constructor() {
    this.x = 400; 
    this.y = 345;
    this.width = 20; 
    this.height =  30;
    this.yVelocity =  0; 
    this.xVelocity = -0.2; //all enemies will move in relation to the background intially
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath();
  }
}


class Obstacle {//class of obstacles to be called inside of another function
  constructor (height) {
    this.x = 300;
    this.y = 345;
    this.width = 20; 
    this.height = 30; 
    this.yVelocity = 0;
  }
  draw () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "yellow";
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
    allObstacles[i].draw();
  }
  mainPlayer.draw();//draw the main characeter
}


const gumba = new Enemy();
const wall = new Obstacle();

allEnemies[0] = gumba; //add trial enemy to enemies array
allObstacles[0] = wall; //add trial obstacle to obstacles array




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
    allEnemies[i].x = allEnemies[i].x - gameSpeed + allEnemies[i].xVelocity;
  }
}


//function to check for interference between enemy object and main player. To be used for death condition for either character

//need to adjust so that a top interference kills the enemy otherwise main character is killed
const checkForInterference = () => {

  for(let i = 0; i < allEnemies.length; i++) {
    const enemy = allEnemies[i];

    const mainPlayerL = mainPlayer.x;
    const mainPlayerR = mainPlayer.x + mainPlayer.width;
    const mainPlayerU = mainPlayer.y;
    const mainPlayerD = mainPlayer.y + mainPlayer.height;
  
  
    const gumbaL = enemy.x;
    const gumbaR = enemy.x + enemy.width;
    const gumbaU = enemy.y;
    const gumbaD = enemy.y + enemy.height;
    console.log(mainPlayer.lastY, mainPlayer.y);

    //console.log(mainPlayer.y + mainPlayer.height < enemy.y)
    if(mainPlayer.lastY < mainPlayer.y /* && mainPlayer.y + mainPlayer.height - 2 < enemy.y*/) {
      if(enemy.x < mainPlayer.x + mainPlayer.width &&
        enemy.x + enemy.width > mainPlayer.x &&
        enemy.y < mainPlayer.y + mainPlayer.height &&
        enemy.height + enemy.y > mainPlayer.y) {
        console.log('got in here')
        allEnemies.splice(i, 1);
        //console.log("Enemy DL corner is in mario's box");
        return 'mario wins'
      }
    } else {
        //console.log('got in here')
        if(enemy.x < mainPlayer.x + mainPlayer.width &&
          enemy.x + enemy.width > mainPlayer.x &&
          enemy.y < mainPlayer.y + mainPlayer.height &&
          enemy.height + enemy.y > mainPlayer.y) {
          //console.log("Enemy DL corner is in mario's box");
          return true
      }
    }
  }
      // } else if(gumbaR > mainPlayerL && gumbaR < mainPlayerR && gumbaD < mainPlayerD && gumbaD > mainPlayerU  ) {
      //   console.log("Enemy DR corner is in mario's box");
      //   return true
      // } else if(gumbaR > mainPlayerL && gumbaR < mainPlayerR && gumbaU < mainPlayerD && gumbaU > mainPlayerU  ) {
      //   console.log("Enemy UR corner is in mario's box");
      //   return true
      // } else if(gumbaL > mainPlayerL && gumbaL < mainPlayerR && gumbaU < mainPlayerD && gumbaU > mainPlayerU  ) {
      //   console.log("Enemy UL corner is in mario's box");
      //   return true
      // }
      return false
}
  



const topCheck = () => {
  
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
  if(rightKeyPress === true && mainPlayer.x + mainPlayer.width < canvas.width) { //listen for right press
    mainPlayer.x += 2.5; //moves character 2.5px to the right
    // xPosition += 20;
  }

  if(leftKeyPress == true && mainPlayer.x > 0) { //listens for the left press
    mainPlayer.x -= 2.5; // the player moves 2.5px to the left
    // xPosition -= .25;
  }

  if(upKeyPress == true) {
    // jumpTick++;
    mainPlayer.lastY = mainPlayer.y;
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
  }
})


//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
//
function animateCanvas() {
  movePlayer(); //move player
	gravity(mainPlayer); //gravity's affect on the player
  xPosition += gameSpeed;//move the position of the background
  //moveEnemies();//move all enemies
  
 	clearCanvas();//clear the canvas
  const check = checkForInterference();//check for interference between main player and any enemies
  //console.log(xPosition);
  // pass this function into animate 
  if(pause || check == true){ //if pause or enemy interference clear the animation function
    gameOver = true;
    return
  } else if (check == 'mario wins') {
    console.log('Mario won!')
  }
  window.requestAnimationFrame(animateCanvas)

}


animateCanvas();


if(gameOver) {
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

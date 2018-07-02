
//setup Canvas
const canvas = document.getElementById('my-canvas');


const groundLevel = 375; //setting most bottom layer of the 
let xPosition = 0; //will be used to scroll the background image
let gameSpeed = 0.75; //how fast the background image will scroll
let pause = false; //set the pause condition as false initially
let upKeyPress = false;
let rightKeyPress = false;
let leftKeyPress = false;
let jumpCount = 0;
let jumpTick = 0;
let gameOver = false;

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
    this.xVelocity = -0.2;
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
  for(let i = 0; i < allEnemies.length; i++) {
    allEnemies[i].draw();
  }
}


const gumba = new Enemy();
const wall = new Obstacle();

allEnemies[0] = gumba;
allObstacles[0] = wall;
// ctx.beginPath();
// ctx.rect(, this.y, this.width, this.height);
// ctx.fillStyle = "brown";
// ctx.fill();
// ctx.closePath();




//gravity function which is going to be used on every character
const gravity = (object) => {
	if(standingOnObject(object)){//checking if character is standing on an object
		//do nothing
	} else {
     object.yVelocity += 0.45;//the "acceleration" due to gravity
     object.y = object.y + object.yVelocity;
      //the velocity of the object increases every tick
	}
	return
}

//function to check if the input object is standing on anything including the ground.
const standingOnObject = (character) => { //checks if the object is standing on an object
	if(character.y + character.height >= groundLevel) {
    character.yVelocity = 0;
    character.y = 335;
    jumpCount = 0;
		return true
	} else {
		return false
	}
}

const moveEnemies = () => {
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
  
    //console.log(enemyL, enemyR, enemyU, enemyD, marioL, marioR, marioU, marioD)
    // console.log(enemyL > marioL);
    // console.log(enemyL < marioR);
    // console.log(enemyD > marioD);
    // console.log(enemyD < marioU);
  
    if(gumbaL > mainPlayerL && gumbaL < mainPlayerR && gumbaD < mainPlayerD && gumbaD > mainPlayerU) {
      console.log("Enemy DL corner is in mario's box");
      return true
    } else if(gumbaR > mainPlayerL && gumbaR < mainPlayerR && gumbaD < mainPlayerD && gumbaD > mainPlayerU  ) {
      console.log("Enemy DR corner is in mario's box");
      return true
    } else if(gumbaR > mainPlayerL && gumbaR < mainPlayerR && gumbaU < mainPlayerD && gumbaU > mainPlayerU  ) {
      console.log("Enemy UR corner is in mario's box");
      return true
    } else if(gumbaL > mainPlayerL && gumbaL < mainPlayerR && gumbaU < mainPlayerD && gumbaU > mainPlayerU  ) {
      console.log("Enemy UL corner is in mario's box");
      return true
    }
    return false
  }
}



document.addEventListener('keydown', (event) => {//event listener on keypresses


  if(event.keyCode == 39) {
    rightKeyPress = true;
  } else if(event.keyCode == 37) {
    leftKeyPress = true;
  } 

  // up 38
  if(event.keyCode == 38 && jumpCount < 2) {//&& jumpPress < 2) {    //listens for up press
  	//console.log('got up key')
    upKeyPress = true;
    mainPlayer.yVelocity = -7;
    //mainPlayer.y -= 150; //the player jumps 150 px
  }
})



const movePlayer = () => {
  if(rightKeyPress === true && mainPlayer.x + mainPlayer.width < canvas.width) { //listen for right press
    mainPlayer.x += 2.5; //moves character 20px to the right
    // xPosition += 20;
  }

  if(leftKeyPress == true && mainPlayer.x > 0) { //listens for the left press
    mainPlayer.x -= 2.5; // the player moves 20px to the left
    // xPosition -= .25;
  }

  if(upKeyPress == true) {
    // jumpTick++;
    console.log(mainPlayer.yVelocity);
    mainPlayer.y = mainPlayer.y + mainPlayer.yVelocity;
    standingOnObject(mainPlayer);

  }

}


document.addEventListener('keyup', (event) => {
  if(event.keyCode == 38) {
    upKeyPress = false;
    jumpTick = 0;
    jumpCount++;
  }

  if(event.keyCode == 37) {
    leftKeyPress = false;
  }

  if(event.keyCode == 39) {
    rightKeyPress = false;
  }
})


//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
//
function animateCanvas() {
  movePlayer();
	gravity(mainPlayer);
  xPosition += gameSpeed;
  moveEnemies();
  
 	clearCanvas();
  mainPlayer.draw();
  wall.draw();
  const check = checkForInterference();
  //console.log(xPosition);
  // pass this function into animate 
  if(pause || check){
    gameOver = true;
    return
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

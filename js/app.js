
//setup Canvas
const canvas = document.getElementById('my-canvas');


const groundLevel = 375; //setting most bottom layer of the 
let xPosition = 0; //will be used to scroll the background image
let gameSpeed = 0.75; //how fast the background image will scroll
let pause = false;

const ctx = canvas.getContext('2d'); //setting up canvas
let groundImage = new Image(); //setting up ground image

groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/Project_1/js/sprites/world1_image.png';

groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, xPosition, 200, 600, 25, 0, 375, 600, 25)
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
  velocity: 0,
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
    this.velocity =  0;
  }
  draw() {
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
  
}


const gumba = new Enemy();

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
    object.velocity += 0.25;//the "acceleration" due to gravity
		object.y = object.y + object.velocity; //the velocity of the object increases every tick
	}
	return
}


const standingOnObject = (character) => { //checks if the object is standing on an object
	if(character.y + character.height >= 375) {
    character.velocity = 0;
    character.y = 335;
		return true
	} else {
		return false
	}
}


const makeObstacle = () => {//function to make obstacles
  
}



document.addEventListener('keydown', (event) => {//event listener on keypresses

  // up 38
  if(event.keyCode == 38 ){//&& jumpPress < 2) {    //listens for up press
  	//console.log('got up key')
    mainPlayer.y -= 150; //the player jumps 150 px
  }

  // down 40 - no need
  // if(event.keyCode == 40 && mainPlayer.y + mainPlayer.height < canvas.height) {
  //   mainPlayer.y += 20; // you may want to use a val much higher than 1
  // }

  // left 37
  if(event.keyCode == 37 && mainPlayer.x > 0) { //listens for the left press
    mainPlayer.x -= 20; // the player moves 20px to the left
    // xPosition -= 20;
  }

  // right 39
  if(event.keyCode == 39 && mainPlayer.x + mainPlayer.width < canvas.width) { //listen for right press
    mainPlayer.x += 20; //moves character 20px to the right
    // xPosition += 20;
  }
})



//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
//
function animateCanvas() {
	gravity(mainPlayer);

  xPosition += gameSpeed;
 	clearCanvas();
  mainPlayer.draw();
  //console.log(xPosition);
  // pass this function into animate 
  if(pause){
    return
  }
  window.requestAnimationFrame(animateCanvas)

}


animateCanvas();





//just used to prevent overheating and overusing resources
//remove for actual game
$('#pause').on('click', (event) => {
  pause = !pause;
  if(pause === false){
    animateCanvas();
  }
})

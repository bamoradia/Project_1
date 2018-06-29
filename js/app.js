
//setup Canvas
const canvas = document.getElementById('my-canvas');


const groundLevel = 375; //setting most bottom layer of the 

const ctx = canvas.getContext('2d');
let groundImage = new Image();

groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/06_29_2018_Day1_First_Project/js/sprites/world1_image.png';

groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, 0, 200, 600, 25, 0, 375, 600, 25)
}


//make an array with all the current characters 
const allChars = [];



//set start conditions for the player
const mainPlayer = {
	x: 200, 
	height: 40,
	y: groundLevel - 40, 
	width: 25, 
	draw(){
		ctx.beginPath();
    	ctx.rect(this.x, this.y, this.width, this.height);
    	ctx.fillStyle = "red";
    	ctx.fill();
    	ctx.closePath();
    }

}

mainPlayer.draw();
class Enemy {
	constructor() {

	}
}

function clearCanvas() {
  // this will erase the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  groundImage = new Image();
  groundImage.src = '/../Users/bamoradia/Documents/funky-ducks/06_29_2018_Day1_First_Project/js/sprites/world1_image.png';
  groundImage.onload = function () {//draw the ground image
	ctx.drawImage(groundImage, 0, 200, 600, 25, 0, 375, 600, 25)
}
}



// ctx.beginPath();
// ctx.rect(, this.y, this.width, this.height);
// ctx.fillStyle = "brown";
// ctx.fill();
// ctx.closePath();





const gravity = (object) => {
	if(standingOnObject(object)){
		//do nothing
	} else {
		object.y = object.y + 2;
	}
	return
}


const standingOnObject = (character) => {
	if(character.y + character.height >= 375) {
		return true
	} else {
		return false
	}
}




document.addEventListener('keydown', (event) => {
 // console.log("you are pressing a key", event.keyCode)  

  // up 38
  if(event.keyCode == 38 ){//&& jumpPress < 2) {
  	console.log('got up key')
    mainPlayer.y -= 80; // you may want to use a val much higher than 1
  }

  // down 40
  if(event.keyCode == 40 && mainPlayer.y + mainPlayer.height < canvas.height) {
    mainPlayer.y += 20; // you may want to use a val much higher than 1
  }

  // left 37
  if(event.keyCode == 37 && mainPlayer.x > 0) {
    mainPlayer.x -= 0; // you may want to use a val much higher than 1
  }

  // right 39
  if(event.keyCode == 39 && mainPlayer.x + mainPlayer.width < canvas.width) {
    mainPlayer.x += 0; // you may want to use a val much higher than 1
  }

  // clearCanvas();
  // mainPlayer.draw();
  // checkForInterference();
})



//the main gameplay function
//will house gravity conditions,
//checks if character is on ground
//
function animateCanvas() {
	gravity(mainPlayer);

	// if(mainPlayer.y <= 335){
	// 	mainPlayer.y = mainPlayer.y + 2;
	// }

 	clearCanvas();
  	mainPlayer.draw();
  // pass this function into animate 
  window.requestAnimationFrame(animateCanvas)
}


animateCanvas();

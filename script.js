//==========================================================

// IMAGES & CANVAS

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const startButton = document.querySelector('#start-button');
const levelCounter = document.querySelector('.level');

const starshipImage = new Image();
starshipImage.src = "/images/spaceship-new-two.png";

const alienImageOne = new Image();
alienImageOne.src = "/images/alien-one.png";

const alienImageTwo = new Image();
alienImageTwo.src = "/images/alien-two.png";

const alienImageThree = new Image();
alienImageThree.src = "/images/alien-three.png";

const alienImageFour = new Image();
alienImageFour.src = "/images/alien-four.png";

const alienImageFive = new Image();
alienImageFive.src = "/images/alien-five.png";

const alienInvasion = new Image();
alienInvasion.src = '/images/alien-invasion.png';

const earthImage = new Image();
earthImage.src = '/images/earth-win.png'

let alienImageArray = [alienImageOne, alienImageFive, alienImageOne, alienImageOne];

//==========================================================

// PLAYER & ALIENS & KEYS & PARTICLES

let alienArray = [];
let laserArray = [];
let particleArray = [];
let particleColors = ['white','purple','pink','white','white'];
let animationId;
let levelOneIdentifier = false;
let playerLose = false;
let keys = {
    right: false,
    left: false
}

let starship = {
    x: 100,
    y: canvas.height/2 - 25,
    width: 100,
    height: 100,
    speed: 0,

    update: function() {
        this.draw();
        this.y += this.speed;
    },

    draw: function() {
        ctx.drawImage(starshipImage, this.x, this.y, this.width, this.height);
    },

    shoot: function() {
        laserArray.push(new Laser());

    }

}

class Laser {
    constructor() {
        this.x = starship.x + 50;
        this.y = starship.y + 50;
        this.width = 30;
        this.height = 5;
        this.speed = 15
    }

    move() {
        this.draw();
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = "#70d6cb";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Particle {
    constructor(positionX, positionY, radius, color) {
        this.x = positionX;
        this.y = positionY;
        this.radius = radius;
        this.color = color;
        this.speed = 10;
    }

    move() {
        this.draw();
        this.x -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Alien {
    constructor (a, b) {
        this.x = 1100 + a;
        this.y = 100 + b;
        this.width = 50;
        this.height = 50;
        this.speed = 10;
        this.color = alienImageArray[Math.floor(Math.random() * 4)]
    }

    move() {
        this.draw();
        this.x -= this.speed;
    }

    draw() {
        ctx.drawImage(this.color, this.x, this.y, this.width, this.height);
    }
}

//==========================================================

// START GAME / END GAME

// This function resets the game by setting all our alien, laser, and particle arrays to 0 (removing them). It resets the position of
// our starship, resets our playerLose to false, resets the level, and cancels the previous animation. After that it calls levelOne
// function to begin our game again.
function startGame() {
    alienArray = [];
    laserArray = [];
    particleArray = [];
    starship.x = 100;
    starship.y = canvas.height/2 - 25;
    playerLose = false;
    levelCounter.style.visibility = 'visible';
    levelCounter.innerHTML = "LEVEL: 1"
    cancelAnimationFrame(animationId);
    levelOne();
}

// This function clears our game by setting all our alien, laser, and particle arrays to 0 (removing them). It hides the level tracker,
// cancels the previous animation, clears the canvas, draws a loser screen image, and adds the start button so user can click it to
// start the game again.
function gameOver() {
    alienArray = [];
    laserArray = [];
    particleArray = [];
    levelCounter.style.visibility = 'hidden';
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(alienInvasion, 0, 0, canvas.width, canvas.height);
    loserSound();
    startButton.style.visibility = 'visible';
}

// This function clears our game by setting all our alien, laser, and particle arrays to 0 (removing them). It hides the level tracker,
// cancels the previous animation, clears the canvas, draws a winner screen image, and adds the start button so user can click it to
// start the game again.
function gameWin() {
    alienArray = [];
    laserArray = [];
    particleArray = [];
    levelCounter.style.visibility = 'hidden';
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(earthImage, 0, 0, canvas.width, canvas.height);
    winnerSound();
    startButton.style.visibility = 'visible';
}


// This function checks to see if the player has lost, if player did lose then it calls the gameOver function.
function aliensWin() {
    if (playerLose === true) {
        gameOver();
    }
}

//==========================================================

// ANIMATION

// This function begins the animation and calls on multiple functions to loop through. (Movement, collisions, and levels)
function animationLoop() {
    animationId = requestAnimationFrame(animationLoop);
    ctx.fillStyle = '#0c0c15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    starshipMovement();

    particleMovement();

    alienMovement();

    laserMovement();

    starship.update();
    
    collisionCheck();

    aliensWin();

    changeLevel();
}

//==========================================================

// LEVELS


// This function sets the levelOne varibale to true to let us know it is level one, it calls on the function to create aliens for
// level one, it calls the function to begin the animation loop, and it calls the function to create the background particles.
function levelOne() {
    levelOneIdentifier = true;
    createAliensOne();
    animationLoop();
    createParticles();
}

// This function sets the levelOne varibale to false to let us know it is no longer level one, it changes the innerHTML of the level
// tracker to level 2, it calls on the function to play the new level sound, and calls on the function to create the aliens for
// level 2.
function levelTwo() {
    levelCounter.innerHTML = 'LEVEL: 2'
    levelOneIdentifier = false;
    newLevelSound();
    createAliensTwo();
}

// This function changes the level from level one to level two if all the aliens from level one are destroyed and the player has
// not lost yet, this assumes we are still in level one. If we are not in level one and the conditions above are true, then game is
// over. 
function changeLevel() {
    if (alienArray.length === 0 && playerLose === false) {
        if(levelOneIdentifier === true) {
            levelTwo();
        } else {
            gameWin();
        }
    }
}

//==========================================================

// CREATE ALIENS & PARTICLES


// Creates 36 Aliens for level one. They are formatted in a 6x6 square.
function createAliensOne() {
    for(let i = 0; i < 36; i++) {

        if (i === 0) {
            alienArray.push(new Alien(-100, 150));
            alienArray[0].draw();
        } else if (i < 6) {
            alienArray.push(new Alien(-100, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 6) {
            alienArray.push(new Alien(-40, 150));
            alienArray[i].draw();
        } else if (i < 12) {
            alienArray.push(new Alien(-40, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 12) {
            alienArray.push(new Alien(20, 150));
            alienArray[i].draw();
        } else if (i < 18){
            alienArray.push(new Alien(20, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 18) {
            alienArray.push(new Alien(80, 150));
            alienArray[i].draw();
        } else if (i < 24) {
            alienArray.push(new Alien(80, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 24) {
            alienArray.push(new Alien(140, 150));
            alienArray[i].draw();
        } else if (i < 30) {
            alienArray.push(new Alien(140, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 30){
            alienArray.push(new Alien(200, 150));
            alienArray[i].draw();
        } else {
            alienArray.push(new Alien(200, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        }
    
    }
}

// Creates 55 aliens once level two is reached. They are formatted in 5 columns of 11 aliens each.
function createAliensTwo() {
    for(let i = 0; i < 55; i++) {

        if (i === 0) {
            alienArray.push(new Alien(0, 0));
            alienArray[0].draw();
        } else if (i < 11) {
            alienArray.push(new Alien(0, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 11) {
            alienArray.push(new Alien(60, 0));
            alienArray[i].draw();
        } else if (i < 22) {
            alienArray.push(new Alien(60, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 22) {
            alienArray.push(new Alien(120, 0));
            alienArray[i].draw();
        } else if (i < 33){
            alienArray.push(new Alien(120, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 33) {
            alienArray.push(new Alien(180, 0));
            alienArray[i].draw();
        } else if (i < 44) {
            alienArray.push(new Alien(180, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 44) {
            alienArray.push(new Alien(240, 0));
            alienArray[i].draw();
        } else {
            alienArray.push(new Alien(240, 60 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        }
    }
}

// Creates 180 background particles with random positions on the canvas.
function createParticles() {
    for (let i = 0; i < 180; i++) {
        let xValue = Math.random() * canvas.width;
        let yValue = Math.random() * canvas.height;
        let rValue = Math.random() * 3;
        let cValue = particleColors[Math.round((Math.random() * 4))];
        particleArray.push(new Particle(xValue, yValue, rValue, cValue));
        particleArray[i].draw();
    }
}

//==========================================================

// MOVEMENT

// Determines the movement of the starship. If the starship every reaches outside of the canvas height it stops. Otherwise while,
// right or left arrow key is pressed they move according to the speed that is adjusted.
function starshipMovement() {
    if(starship.y + starship.height > canvas.height) {
        keys.right = false;
        if (keys.left) {
            starship.speed = -12;
        } else if (keys.right) {
            starship.speed = 12;
        } else {
            starship.speed = 0;
        }
    } else if (starship.y < 0){
        keys.left = false;
        if (keys.left) {
            starship.speed = -12;
        } else if (keys.right) {
            starship.speed = 12;
        } else {
            starship.speed = 0;
        }
    } else {
        if (keys.left) {
            starship.speed = -12;
        } else if (keys.right) {
            starship.speed = 12;
        } else {
            starship.speed = 0;
        }
    }
}

// Determines the movement of the aliens. If a alien reaches outside of the canvas width player will lose. If the aliens haven't
// passed the canvas x, then it will keep on moving.
function alienMovement() {
    for (let o = 0; o < alienArray.length; o++) {

        if(alienArray[o].x < 0) {
            alienArray.splice(o, 1);
            playerLose = true;
        } else {
            alienArray[o].move();
        }
    }
}

// Determines the movement of the lasers. If the laser every reaches outside of the canvas width it removes itself. If the lasers
// haven't passed the canvas width, then it will keep on moving.
function laserMovement() {
    for (let i = 0; i < laserArray.length; i++) {

        if(laserArray[i].x > canvas.width) {
            laserArray.splice(i, 1);
        } else {
            laserArray[i].move();
        }
    }
}

// Determines the movement of the particles. If the particle every reaches outside of the canvas x it repositions itself.
// If the particles haven't passed the canvas x, then it will keep on moving.
function particleMovement() {
    for (let p = 0; p < particleArray.length; p++) {
        if(particleArray[p].x < 0) {
            particleArray[p].x = 1440 + (Math.random() * canvas.width);
            particleArray[p].y = Math.random() * canvas.height;
            particleArray[p].move();
        } else {
            particleArray[p].move();
        }
    }
}

//==========================================================

// ALIEN & LASER COLLISION

// This will begin checks for collisions between an alien and a laser. It will remove the alien in question if a laser has
// indeed crossed its path. It will also play an explosion sound.
function collisionCheck() {
    for(let j = 0; j < alienArray.length; j++) {
        if (checkCollisionAlien(alienArray[j]) === true){
            alienArray.splice(j, 1);
            explosionSound();
        }
    }
}


// This will check if the laser ever intersects with an alien spaceship. If so it will remove that laser in question and return true.
function checkCollisionAlien(alien) {
    for (let i = 0; i < laserArray.length; i++) {
        if (alien.x < laserArray[i].x + laserArray[i].width
            && alien.x + alien.width > laserArray[i].x
            && laserArray[i].y < alien.y + alien.height
            && laserArray[i].y + laserArray[i].height > alien.y) {
                laserArray.splice(i, 1);
                return true;
            } 
    }

}

// function checkCollisionLaser(laser) {
//     for (let i = 0; i < alienArray.length; i++) {
//         if (laser.x < alienArray[i].x + alienArray[i].width
//             && laser.x + laser.width > alienArray[i].x
//             && alienArray[i].y < laser.y + laser.height
//             && alienArray[i].y + alienArray[i].height > laser.y) {
//                 return true;
//             }
//     }
// }

//==========================================================

// SOUNDS

function playMusic() {
    let backgroundMusic = new Audio('/audios/Rich in the 80s - DivKid.mp3');
    backgroundMusic.volume = 0.03;
    backgroundMusic.play();
    // some weird favicon icon error here
}

function laserSound() {
    let laserShot = new Audio('/audios/laser-one.mp3');
    laserShot.volume = 0.1;
    laserShot.play();
}

function explosionSound() {
    let boom = new Audio('/audios/explosion-one.wav');
    boom.volume = 0.1;
    boom.play();
}

function newLevelSound() {
    let newLevel = new Audio('/audios/level-sound.wav');
    newLevel.volume = 0.2;
    newLevel.play();
}

function winnerSound() {
    let winnerPing = new Audio('/audios/win-audio.wav');
    winnerPing.volume = 0.2;
    winnerPing.play();

}

function loserSound() {
    let loserPing = new Audio('/audios/lose-audio.wav');
    loserPing.volume = 0.2;
    loserPing.play();
}

//==========================================================

// ON LOAD EVENTS

// On load of the web application, we will begin looking for a click on the Start Button, and for keydowns/keyups of the movement &
// shoot keys for the starship.
window.onload = () => {
    document.getElementById('start-button').onclick = function() {
        startGame();
        startButton.style.visibility = 'hidden'; 
        playMusic();
    };

    
    document.addEventListener('keydown', e => {
        switch (e.keyCode) {
            case 37:
                keys.left = true;
                break;
            case 39:
                keys.right = true;
                break;
        }
    });

    document.addEventListener('keyup', e => {
        switch (e.keyCode) {
            case 37:
                keys.left = false;
                break;
            case 39:
                keys.right = false;
                break;
        }
    });

    document.addEventListener('keydown', e => {
        if (e.keyCode === 70) {
            starship.shoot();
            laserSound();
        }
    })
}

//==========================================================
// 1300 x 550 = Canvas

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

// PLAYER & ALIENS & KEYS & PARTICLES

let alienArray = [];
let laserArray = [];
let particleArray = [];
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

    remove() {

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

    remove() {

    }
}

class Alien {
    constructor (a, b) {
        this.x = 1100 + a;
        this.y = 100 + b;
        this.width = 50;
        this.height = 50;
        this.speed = .5;
        this.color = alienImageArray[Math.floor(Math.random() * 4)]
    }

    move() {
        this.draw();
        this.x -= this.speed;
    }

    draw() {
        ctx.drawImage(this.color, this.x, this.y, this.width, this.height);
    }

    remove() {

    }


}



// START GAME / END GAME


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

// LEVEL 1


function levelOne() {
    levelOneIdentifier = true;
    createAliensOne();
    animate();
    createParticles();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = '#0c0c15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    for (let p = 0; p < particleArray.length; p++) {
        if(particleArray[p].x < 0) {
            // particleArray.splice(p, 1)
            particleArray[p].x = 1440 + (Math.random() * canvas.width);
            particleArray[p].y = Math.random() * canvas.height;
            particleArray[p].move();
        } else {
            particleArray[p].move();
        }
    }

    for (let o = 0; o < alienArray.length; o++) {

        if(alienArray[o].x < 0) {
            alienArray.splice(o, 1);
            playerLose = true;
            //gameOver();
        } else {
            alienArray[o].move();
        }
    }

    for (let i = 0; i < laserArray.length; i++) {

        if(laserArray[i].x > canvas.width) {
            laserArray.splice(i, 1);
        } else {
            laserArray[i].move();
        }
    }

    starship.update();

    for(let j = 0; j < alienArray.length; j++) {
        if (checkCollisionAlien(alienArray[j]) === true){
            alienArray.splice(j, 1);
            explosionSound();
        }
    }

    if (playerLose === true) {
        gameOver();
    }

    if (alienArray.length === 0 && playerLose === false) {
        if(levelOneIdentifier === true) {
            createAliensTwo();
        } else {
            gameWin();
        }
        //gameWin();
    }
}

let particleColors = ['white','purple','pink','white','white']

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

function checkCollisionLaser(laser) {
    for (let i = 0; i < alienArray.length; i++) {
        if (laser.x < alienArray[i].x + alienArray[i].width
            && laser.x + laser.width > alienArray[i].x
            && alienArray[i].y < laser.y + laser.height
            && alienArray[i].y + alienArray[i].height > laser.y) {
                return true;
            }
    }
}

function createAliensTwo() {
    levelCounter.innerHTML = 'LEVEL: 2'
    levelOneIdentifier = false;
    newLevelSound();
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

function gameOver() {
    alienArray = [];
    laserArray = [];
    particleArray = [];
    levelCounter.style.visibility = 'hidden';
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(alienInvasion, 0, 0, canvas.width, canvas.height);
    startButton.style.visibility = 'visible';
}

function gameWin() {
    alienArray = [];
    laserArray = [];
    particleArray = [];
    levelCounter.style.visibility = 'hidden';
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(earthImage, 0, 0, canvas.width, canvas.height);
    startButton.style.visibility = 'visible';
}

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

function hideButton() {
    startButton.style.visibility = 'hidden'; 
}








///////

window.onload = () => {
    document.getElementById('start-button').onclick = function() {
        startGame();
        hideButton();
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

console.log(innerWidth);
console.log(innerHeight);

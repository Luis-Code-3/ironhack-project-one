// 1300 x 550 = Canvas

// IMAGES & CANVAS

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const starshipImage = new Image();
starshipImage.src = "";

const alienImage = new Image();
alienImage.src = "";

const backgroundImage = new Image();
backgroundImage.src = "";

// PLAYER & ALIENS & KEYS & PARTICLES

let alienArray = [];
let laserArray = [];
let particleArray = [];
let animationId;
let keys = {
    right: false,
    left: false
}

let starship = {
    x: 100,
    y: canvas.height/2 - 50,
    width: 0,
    height: 0,
    speed: 0,

    update: function() {
        this.draw();
        this.y += this.speed;
    },

    draw: function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 100, 100);
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
        ctx.fillStyle = "red";
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
        this.width = 30;
        this.height = 30;
        this.speed = 5;
    }

    move() {
        this.draw();
        this.x -= this.speed;
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    remove() {

    }


}



// START GAME / END GAME


function startGame() {
    alienArray = [];
    laserArray = [];
    starship.x = 100;
    starship.y = canvas.height/2 - 50;
    cancelAnimationFrame(animationId);
    levelOne();
}

// LEVEL 1


function levelOne() {
    animate();
    createAliensOne();
    createParticles();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    starship.update();

    if (keys.left) {
        starship.speed = -8;
    } else if (keys.right) {
        starship.speed = 8;
    } else {
        starship.speed = 0;
    }

    for (let p = 0; p < particleArray.length; p++) {
        if(particleArray[p].x < 0) {
            particleArray.splice(p, 1)
        } else {
            particleArray[p].move();
        }
    }

    for (let o = 0; o < alienArray.length; o++) {

        if(alienArray[o].x < 0) {
            alienArray.splice(o, 1);
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

    for(let j = 0; j < alienArray.length; j++) {
        if (checkCollisionAlien(alienArray[j]) === true){
            alienArray.splice(j, 1);
        }
    }
}

function createParticles() {
    for (let i = 0; i < 60; i++) {
        let xValue = Math.random() * canvas.width;
        let yValue = Math.random() * canvas.height;
        let rValue = Math.random() * 3;
        let cValue = 'white';
        particleArray.push(new Particle(xValue, yValue, rValue, cValue));
        particleArray[i].draw();
    }
}

function createAliensOne() {
    for(let i = 0; i < 8; i++) {

        if (i === 0) {
            alienArray.push(new Alien(0, 0));
            alienArray[0].draw();
        } else if (i < 4) {
            alienArray.push(new Alien(0, 100 + (alienArray[i-1].y - 100)));
            alienArray[i].draw();
        } else if (i === 4) {
            alienArray.push(new Alien(100, 0));
            alienArray[i].draw();
        } else {
            alienArray.push(new Alien(100, 100 + (alienArray[i-1].y - 100)));
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








///////

window.onload = () => {
    document.getElementById('start-button').onclick = function() {
        startGame();
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
            //sound
        }
    })
}

console.log(innerWidth);

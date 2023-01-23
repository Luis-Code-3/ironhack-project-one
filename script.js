// 1300 x 550 = Canvas

// IMAGES & CANVAS

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const starshipImage = new Image();
starshipImage.src = "";

const alienImage = new Image();
alienImage.src = "";

const backgroundImage = new Image();
backgroundImage.src = "";

// PLAYER & ALIENS

let alienArray = [];
let laserArray = [];

let starship = {
    x: 100,
    y: canvas.height/2 - 50,
    width: 0,
    height: 0,
    speed: 0,

    moveLeft: function() {
        this.y -= 5;
    },

    moveRight: function() {
        this.y += 5;
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
        this.width = 10;
        this.height = 10;
    }

    move() {
        this.x += 5;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
    }

    move() {
        this.x -= 5;
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

    levelOne();
}

function animationLoop() {
    animationId = setInterval(() => {
        updateCanvas();
    }, 16);
}

function updateCanvas() {
    ctx.clearRect(0, 0, 1300, 550);
    starship.draw();

    
    for (let o = 0; o < alienArray.length; o++) {

        if(alienArray[o].x < 0) {
            alienArray.splice(o, 1);
        } else {
            alienArray[o].move();
            alienArray[o].draw();
        }
    }

    for (let i = 0; i < laserArray.length; i++) {

        if(laserArray[i].x > 1300) {
            laserArray.splice(i, 1);
        } else {
            laserArray[i].move();
            laserArray[i].draw();
        }
    }

    for(let j = 0; j < alienArray.length; j++) {
        if (checkCollisionAlien(alienArray[j]) === true){
            alienArray.splice(j, 1);
        }
    }

    // for(let k = 0; k < alienArray.length; k++) {
    //     if (checkCollision(laserArray[k]) === true) {
    //         laserArray.splice(k, 1);
    //     }
    // }

}

// LEVEL 1


function levelOne() {
    starship.draw();
    createAliensOne();
    animationLoop();
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
    //MANUALLY SPAWN THEM
    // let alienOne = new Alien();
    // alienOne.draw(0, 0);

    // let alienTwo = new Alien();
    // alienTwo.draw(0, 100);

    // let alienThree = new Alien();
    // alienThree.draw(0, 200);

    // let alienFour = new Alien();
    // alienFour.draw(0, 300);

    // let alienFive = new Alien();
    // alienFive.draw(100, 0);

    // let alienSix = new Alien();
    // alienSix.draw(100, 100);

    // let alienSeven = new Alien();
    // alienSeven.draw(100, 200);

    // let alienEight = new Alien();
    // alienEight.draw(100, 300);
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
                starship.moveLeft();
                break;
            case 39:
                starship.moveRight();
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

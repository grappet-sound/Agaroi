const p1screen = document.getElementById("player1");
const p2screen = document.getElementById("player2");

const BOARDSIZE = 6000;
const PARTICLENUM = 400;

if(window.innerWidth < 900){
    p1screen.width = window.innerWidth;
    p1screen.height = window.innerHeight / 2;
    p2screen.width = window.innerWidth;
    p2screen.height = window.innerHeight / 2;
}else{
    p1screen.width = window.innerWidth / 2;
    p1screen.height = window.innerHeight;
    p2screen.width = window.innerWidth / 2;
    p2screen.height = window.innerHeight;
}

onresize = (event) => {
    if(window.innerWidth < 900){
        p1screen.width = window.innerWidth;
        p1screen.height = window.innerHeight / 2;
        p2screen.width = window.innerWidth;
        p2screen.height = window.innerHeight / 2;
    }else{
        p1screen.width = window.innerWidth / 2;
        p1screen.height = window.innerHeight;
        p2screen.width = window.innerWidth / 2;
        p2screen.height = window.innerHeight;
    }
};
const p1ctx = p1screen.getContext('2d');
const p2ctx = p2screen.getContext('2d');
const ctxArr = [0, p1ctx, p2ctx];

var colors = ["#610aa8", "#453da1", "#1706cf", "#e66c7e", "#ff0a2f", "#0affba", "#0ae2ff", "#0aff91", "#0aff27", "#a9e309", "#cae309", "#e39309", "#e35909", "#deaa1b", "#000000", "#5c5c5c"];


var particles = [];

class Particle {
    x;
    y;
    color;
    constructor(){
        this.x = Math.random() * BOARDSIZE;
        this.y = Math.random() * BOARDSIZE;
        var colorId = Math.floor(Math.random() * colors.length);
        this.color = colors[colorId];
    }
}

class Player {
    x;
    y;
    color;
    size;
    speed;
    id;
    xspeed;
    yspeed;
    constructor(id){
        var colorId = Math.floor(Math.random() * colors.length);
        this.color = colors[colorId];
        this.x = Math.floor(Math.random() * BOARDSIZE);
        this.y = Math.floor(Math.random() * BOARDSIZE);
        this.size = 50;
        this.speed = 10;
        this.id = id;
        this.xspeed = 0;
        this.yspeed = 0;
    }


    draw(){
        ctxArr[this.id].clearRect(0, 0, p1screen.width, p1screen.height);
        var width = p1screen.width;
        var height = p1screen.height;

        var widthpt = width * this.size / 50;
        var heightpt = height * this.size / 50;
        ctxArr[this.id].beginPath();
        ctxArr[this.id].strokeStyle = 'black';
        for(var i = - (this.x - widthpt / 2) % 200; i < widthpt; i += 200){
            ctxArr[this.id].moveTo(i * 50 / this.size, 0);
            ctxArr[this.id].lineTo(i * 50 / this.size, height);
            
        }
        for(var i = - (this.y - heightpt / 2) % 200; i < heightpt; i += 200){
            ctxArr[this.id].moveTo(0, i * 50 / this.size);
            ctxArr[this.id].lineTo(width, i * 50 / this.size);
            
        }
        ctxArr[this.id].stroke();

        for(var i = 0; i < particles.length; i++){
            if(particles[i].x >= this.x - widthpt 
            && particles[i].x <= this.x + widthpt 
            && particles[i].y >= this.y - heightpt
            && particles[i].y <= this.y + heightpt){
                var px = (particles[i].x - (this.x - widthpt / 2)) * 50 / this.size;
                var py = (particles[i].y - (this.y - heightpt / 2)) * 50 / this.size;
                ctxArr[this.id].fillStyle = particles[i].color;
                ctxArr[this.id].beginPath();
                ctxArr[this.id].arc(px, py, 1000 / this.size, 0, 2 * Math.PI);
                ctxArr[this.id].fill();
            }
        }

        var otherplayer = players[2 - this.id];
        if(otherplayer.x >= this.x - widthpt 
            && otherplayer.x <= this.x + widthpt 
            && otherplayer.y >= this.y - heightpt
            && otherplayer.y <= this.y + heightpt){
                var px = (otherplayer.x - (this.x - widthpt / 2)) * 50 / this.size;
                var py = (otherplayer.y - (this.y - heightpt / 2)) * 50 / this.size;
                ctxArr[this.id].fillStyle = otherplayer.color;
                ctxArr[this.id].beginPath();
                ctxArr[this.id].arc(px, py, otherplayer.size * 50 / this.size, 0, 2 * Math.PI);
                ctxArr[this.id].fill();
            }

        ctxArr[this.id].fillStyle = this.color;
        ctxArr[this.id].beginPath();
        ctxArr[this.id].arc(width/2, height/2, 50, 0, 2*Math.PI);
        ctxArr[this.id].fill();

        ctxArr[this.id].fillStyle = 'black';
        ctxArr[this.id].font = "24px arial";
        ctxArr[this.id].textAlign = "right";
        ctxArr[this.id].fillText("Eaten: " + eaten[this.id], p1screen.width - 40, 40);
    }
    move(){
        this.x += this.xspeed;
        this.y += this.yspeed;
        if(this.x < 0) this.x = 0;
        if(this.y < 0) this.y = 0;
        if(this.x > BOARDSIZE) this.x = BOARDSIZE;
        if(this.y > BOARDSIZE) this.y = BOARDSIZE;

        for(var i = 0; i < particles.length; i++){
            var p = particles[i];
            var dx = this.x - p.x;
            var dy = this.y - p.y;
            if(dx * dx + dy * dy <= (this.size + 20) * (this.size + 20)){
                particles.splice(i, 1);
                i--;
                this.size += 0.4;
            }
        }

        var otherplayer = players[2 - this.id];
        var dx = this.x - otherplayer.x;
        var dy = this.y - otherplayer.y;
        if(dx * dx + dy * dy <= (this.size + otherplayer.size) * (this.size + otherplayer.size) / 3){
            if(this.size >= otherplayer.size * 1.2){
                this.size += otherplayer.size / 2;
                respawn(otherplayer.id);
            }
        }

        this.xspeed *= 0.95;
        this.yspeed *= 0.95;

        this.speed = 1800 / (this.size + 100);
    }
}

var p1 = new Player(1);
var p2 = new Player(2);
var players = [p1, p2];

function respawn(id){
    if(id == 1){
        p1 = new Player(1);
        eaten[2]++;
    }else{
        p2 = new Player(2);
        eaten[1]++;
    }
    players = [p1, p2];
}

var requestId;
function animate(now = 0){
    movement();
    p1.move();
    p1.draw();
    p2.move();
    p2.draw();
    if(particles.length < PARTICLENUM){
        for(var i = 0; i < PARTICLENUM; i++){
            particles.push(new Particle());
        }
    }
    requestId = requestAnimationFrame(animate);
}
var keys = [];
for(var i = 0; i < 200; i++){
    keys.push(false);
}

var eaten = [0, 0, 0];

function gameStart(){
    eaten = [0, 0, 0];
    animate();
}


window.addEventListener('keyup', () =>{
    keys[event.keyCode] = false;
});
window.addEventListener('keydown', () =>{
    console.log(event.keyCode);
    keys[event.keyCode] = true;
    
});
function movement(){
    // w 87 a 65 s 83 d 68
    if(keys[87]){
        p1.yspeed -= p1.speed / 5;
        if(p1.yspeed < -p1.speed) p1.yspeed = -p1.speed;
    }else if(keys[83]){
        p1.yspeed += p1.speed / 5
        if(p1.yspeed > p1.speed) p1.yspeed = p1.speed;

    }
    if(keys[65]){
        p1.xspeed -= p1.speed / 5
        if(p1.xspeed < -p1.speed) p1.xspeed = -p1.speed;
    }else if(keys[68]){
        p1.xspeed += p1.speed / 5
        if(p1.xspeed > p1.speed) p1.xspeed = p1.speed;
    }
    // up 38 left 37 down 40 right 39
    if(keys[38]){
        p2.yspeed -= p2.speed / 5;
        if(p2.yspeed < -p2.speed) p2.yspeed = -p2.speed;
    }else if(keys[40]){
        p2.yspeed += p2.speed / 5
        if(p2.yspeed > p2.speed) p2.yspeed = p2.speed;

    }
    if(keys[37]){
        p2.xspeed -= p2.speed / 5
        if(p2.xspeed < -p2.speed) p2.xspeed = -p2.speed;
    }else if(keys[39]){
        p2.xspeed += p2.speed / 5
        if(p2.xspeed > p2.speed) p2.xspeed = p2.speed;
    }
}

gameStart();
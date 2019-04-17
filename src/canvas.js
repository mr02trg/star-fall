import utils from './utils'
import './styles/app.scss';
import { isContext } from 'vm';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
const MIN_RADIUS_THRESHOLD = 1
const SPAWN_RATE = 150

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

addEventListener('click', () => {
    init()
})

// Objects
function Ball(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: 2
    }
    this.gravity = 0.2
    this.friction = 0.8
    
}

function MiniBall(x, y, radius, color) {
    // inheritance
    Ball.call(this, x, y , radius, color)
    this.velocity = {
        x: 0,
        y: 3
    }
    this.gravity = 0.5
    this.friction = 0.8

    // number of frames before these miniball is faded out
    this.ttl = 250 
    this.opacity = 1
}

// improve performance compared to init funciton within ball objects
Ball.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = '#f4f2ea'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

Ball.prototype.update = function() {

    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.radius *= 0.7
        // explosion
        this.explode()
    } else {
        this.velocity.y += this.gravity
    }


    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius + this.velocity.x < 0) {
        this.velocity.x = - this.velocity.x * this.friction
        this.radius *= 0.9
        // explosion
        this.explode()
    }

    this.x += this.velocity.x
    this.y += this.velocity.y

    this.draw()
}

Ball.prototype.explode = function() {
    var numMiniBalls = utils.randomIntFromRange(5, 8)
    for(let i = 0; i < numMiniBalls; i++) {
        var miniBall = new MiniBall(this.x, this.y, 2)
        miniBall.velocity.x = utils.randomIntFromRange(-6, 6)
        miniBall.velocity.y = utils.randomIntFromRange(-15, 15)
        miniBalls.push(miniBall)
    }
    this.radius *= this.friction
}

MiniBall.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(255, 250, 250, ${this.opacity})`   // es6 - fade effect - decrement opacity
    c.shadowColor = '#f5f3ce'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

MiniBall.prototype.update = function() {

    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.radius *= this.friction
    } else {
        this.velocity.y += this.gravity
    }

    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius + this.velocity.x < 0) {
        this.velocity.x = - this.velocity.x * this.friction
        this.radius *= this.friction
    }

    this.x += this.velocity.x
    this.y += this.velocity.y

    // fading effect
    this.ttl -= 1
    this.opacity -= 1 / this.ttl
    this.draw()
}

// Implementation
let balls
let miniBalls
let ticker = 0

let gradientBg
function init() {
    balls = []
    miniBalls = []

    drawBackground()
    drawMoon()
}

// background
function drawBackground() {
    gradientBg = c.createLinearGradient(0, 0, 0, canvas.height)
    gradientBg.addColorStop(0, '#2D3436')
    gradientBg.addColorStop(1, '#000000')
}

// moon
function drawMoon() {
    c.save()
    var moonGradient = c.createRadialGradient(120, 80, 10, 100, 100, 50);
    moonGradient.addColorStop(0.3, "#ffffff");
    moonGradient.addColorStop(0.9, "#ffff66");
    c.beginPath()
    c.arc(100, 100, 50, 0, Math.PI*2);
    c.fillStyle = moonGradient
    c.shadowColor = '#ffff66'
    c.shadowBlur = 50
    c.fill()
    c.closePath()
    c.restore()
}

// tree
function drawTree(startx, starty, len, angle, width) {
    c.save()
    c.beginPath()
    c.translate(startx, starty)
    c.rotate(angle * Math.PI / 180)
    c.moveTo(0, 0)
    c.lineTo(0, -len)

    c.lineWidth = width
    c.strokeStyle = 'white'
    c.stroke()


    if (len < 10) {
        c.restore()
        return
    }

    drawTree(0, -len, len*0.5, 10, width*0.8)
    drawTree(0, -len, len*0.8, 20, width* 0.8)
 
    drawTree(0, -len, len*0.6, -15, width* 0.8)   
    drawTree(0, -len, len*0.6, -35, width* 0.8)   

    c.restore()
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)

    c.clearRect(0, 0, canvas.width, canvas.height)

    // draw background
    c.fillStyle = gradientBg
    c.fillRect(0, 0, canvas.width, canvas.height)

    // draw moon
    drawMoon()
    

    // draw tree
    drawTree(canvas.width/2, canvas.height, 80, -5, 3)
    drawTree(canvas.width/2 - 40, canvas.height, 40, 10, 3)
    drawTree(canvas.width/2 - 20, canvas.height, 50, -2, 3)

    balls.forEach(b => {
        b.update()
    });

    miniBalls.forEach((mb, index) => {
        mb.update()
        if (mb.ttl == 0) {
            miniBalls.splice(index, 1)
        }
    });

    // remove balls and mini balls after they disappear
    balls = balls.filter(b => b.radius > MIN_RADIUS_THRESHOLD)

    ticker++

    if (ticker % SPAWN_RATE == 0) {
        var radius = Math.random() * 3 + 5
        var ball = new Ball(utils.randomIntFromRange(100 + radius, canvas.width - radius * 2), 
                            0, 
                            radius, 
                            'white');

        balls.push(ball)
    }
}

init()
animate()

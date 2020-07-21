import utils from './utils'
import canvas2 from './canvas2'
import './styles/app.scss';

const canvas1 = document.getElementById('canvas1')
const c = canvas1.getContext('2d')

canvas1.width = innerWidth
canvas1.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const MIN_RADIUS_THRESHOLD = 1
const SPAWN_RATE = 20
let NUM_STARS = canvas1.width * 0.25

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas1.width = innerWidth
    canvas1.height = innerHeight
    NUM_STARS = canvas1.width * 0.25

    init()
    canvas2.init()
})

addEventListener('click', () => {
    init()
    canvas2.init()
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
    this.gravity = 0.4
    this.friction = 0.6
    
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

    if (this.y + this.radius + this.velocity.y > canvas1.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.radius *= 0.7
        // explosion
        this.explode()
    } else {
        this.velocity.y += this.gravity
    }


    if (this.x + this.radius + this.velocity.x > canvas1.width || this.x - this.radius + this.velocity.x < 0) {
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

// explode movement
MiniBall.prototype.update = function() {

    if (this.y + this.radius + this.velocity.y > canvas1.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.radius *= this.friction
    } else {
        this.velocity.y += this.gravity
    }

    if (this.x + this.radius + this.velocity.x > canvas1.width || this.x - this.radius + this.velocity.x < 0) {
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

function Star(x, y, r, opacity) {
    this.x = x
    this.y = y
    this.r = r

    // determine if star will dim down or become brighter
    this.direction = Math.round (Math.random())
    this.opacity = opacity
}

Star.prototype.draw = function() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(255, 250, 250, ${this.opacity})`   // es6 - fade effect - decrement opacity
    c.shadowColor = '#f5f3ce'
    c.shadowBlur = 40
    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function() {
    if (this.direction == 0) {
        this.opacity -= ( 0.02 * Math.random() )
    } else {
        this.opacity += ( 0.02 * Math.random() )
    }

    if (this.opacity >= 1) {
        this.direction = 0
    }

    if (this.opacity <= 0) {
        this.direction = 1
    }

    this.x += (0.1 * Math.random())

    if (this.x > canvas1.width) {
        this.x = Math.random() - 1
    }

    this.draw()
}

// Implementation
let balls
let miniBalls
let stars
let ticker = 0
let gradientBg
function init() {
    balls = []
    miniBalls = []

    stars = []
    for(let i = 0; i < NUM_STARS; i++) {
        stars.push(new Star(
            Math.random() * canvas1.width,
            Math.random() * canvas1.height - 150,
            Math.random() * 1.5 + 0.5,
            Math.random(),
        ))  
    }

    drawBackground()
    drawMoon()
}

// background
function drawBackground() {
    gradientBg = c.createLinearGradient(0, 0, 0, canvas1.height)
    gradientBg.addColorStop(0, '#2D3436')
    gradientBg.addColorStop(1, '#000000')
}

// moon
function drawMoon() {
    var x = canvas1.width / 4
    var y = canvas1.height / 4
    var r = x < y ? x / 2  : y / 2

    c.save()
    var moonGradient = c.createRadialGradient(x + r/2, y - r/2, r/5, x, y, r);
    moonGradient.addColorStop(0.3, "#ffffff");
    moonGradient.addColorStop(0.9, "#ffff66");
    c.beginPath()
    c.arc(x, y, r, 0, Math.PI*2);
    c.fillStyle = moonGradient
    c.shadowColor = '#ffff66'
    c.shadowBlur = 50
    c.fill()
    c.closePath()
    c.restore()
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)

    c.clearRect(0, 0, canvas1.width, canvas1.height)
    canvas2.clearCanvas2()
    
    // draw background
    c.fillStyle = gradientBg
    c.fillRect(0, 0, canvas1.width, canvas1.height)

    // draw moon
    drawMoon()
    
    // draw star
    stars.forEach(s => {
        s.update()
    });

    // draw tree
    canvas2.getTrees().forEach(t => {
        canvas2.drawTree(t.startx, t.starty, t.len, t.angle, t.width, t.opacity)
    });

    // ball animation
    balls.forEach(b => {
        b.update()
    });

    miniBalls.forEach((mb, index) => {
        mb.update()
        if (mb.ttl == 0) {
            miniBalls.splice(index, 1)
        }
    });

    // remove balls when they become too small
    balls = balls.filter(b => b.radius > MIN_RADIUS_THRESHOLD)

    ticker++
    if (ticker % SPAWN_RATE == 0) {
        var radius = Math.random() * 1 + 2
        var ball = new Ball(utils.randomIntFromRange(100 + radius, canvas1.width - radius * 2), 
                            0, 
                            radius, 
                            'white');

        balls.push(ball)
    }
}

init()
animate()

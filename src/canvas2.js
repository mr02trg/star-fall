import utils from './utils'

// trees drawing
const canvas2 = document.getElementById('canvas2')
const c2 = canvas2.getContext('2d')

canvas2.width = innerWidth
canvas2.height = innerHeight
let num_trees= canvas2.width / 100
addEventListener('resize', () => {
    num_trees =  innerWidth / 100
    canvas2.width = innerWidth
    canvas2.height = innerHeight
})

function clearCanvas2() {
    c2.clearRect(0, 0, canvas1.width, canvas1.height)
}

let trees
function init() {
    trees = []
    for(let i = 0; i < num_trees; i++) {
        var len = Math.random() * 30 + 60
        var t = new Tree(   canvas2.width / num_trees  * i + Math.random() * 50, 
                            canvas2.height + (len*0.7),
                            len,
                            utils.randomIntFromRange(-4, 4),
                            Math.random() + 5
                        )

        trees.push(t)
    }
}

function getTrees() {
    return trees
}

function Tree(startx, starty, len, angle, width) {
    this.startx = startx
    this.starty = starty
    this.len = len
    this.angle = angle
    this.width = width

    this.opacity = 1
    this.maxSubBranches = 1 * Math.random() + 2
}

// tree
function drawTree(startx, starty, len, angle, width, opacity=1) {
    
    c2.save()
    c2.beginPath()
    c2.translate(startx, starty)
    c2.rotate(angle * Math.PI / 180)
    c2.moveTo(0, 0)
    c2.lineTo(0, -len)

    c2.lineWidth = width
    c2.strokeStyle = `rgba(255, 0, 0, ${opacity})`
    c2.stroke()

    if (len < 12) {
        c2.restore()
        return
    }

    // drawTree(0, -len, len*0.39, 15, width*0.8, opacity * 0.9)
    drawTree(0, -len, len*0.69, 23, width* 0.85, opacity * 0.9)
 
    drawTree(0, -len, len*0.47, -15, width* 0.85, opacity * 0.95)   
    drawTree(0, -len, len*0.76, -33, width* 0.65, opacity * 0.9)   

    c2.restore()
}

init()

module.exports = { drawTree, clearCanvas2, getTrees, init }

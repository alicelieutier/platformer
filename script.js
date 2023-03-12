const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width
const HEIGHT = canvas.height

function write(text, left, top) {
  ctx.font = "50px monospace";
  ctx.fillStyle = "yellow"
  ctx.fillText(text, left, top);
}

const PALETTE = [
  "#55212f","#3f3f30","#42402a",
  "#1a3029","#5a5c59","#3a3a3a"]

function sample(array) {
  const dice = getRandomInt(0, array.length)
  return array[dice]
}

function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

const character = new Character(800, HEIGHT - 200)
const platforms = [
  new Platform('ground', 0, HEIGHT-15, WIDTH, 30),
  new Platform('wallRight', WIDTH-15, -100, 30, HEIGHT+100),
  new Platform('wallLeft', -15, -100, 30, HEIGHT+100),
  new Platform('plat', 100, HEIGHT-60, 20),
  new Platform('plat', 260, HEIGHT-120, 20),
  new Platform('plat', 380, HEIGHT-180, 20),
  new Platform('plat', 470, HEIGHT-240, 20),
  new Platform('plat', 280, HEIGHT-300, 20),
  new Platform('plat', 150, HEIGHT-360, 20),
  new Platform('plat', 20, HEIGHT-420, 30),
]

const decor = []
for (let index = 0; index < 15; index++) {
  decor.push(new Decor(
    'decor',
    getRandomInt(-WIDTH/3, WIDTH-100),
    getRandomInt(-HEIGHT/3, HEIGHT-400),
    getRandomInt(100, WIDTH/2),
    getRandomInt(100, 200),
    sample(PALETTE),
  ))
}

const timer = new Timer()
let gameOver = false

function drawWinScreen() {
  write("You Win!", WIDTH-300, 80)
}

const keyDown = {
  up: false,
  down: false,
  left: false,
  right: false,
}

function keyDownListener(event) {
  timer.start() // start the timer witht the first keydown
  if (event.code === 'ArrowLeft') {
    keyDown.left = true
  }

  if (event.code === 'ArrowRight') {
    keyDown.right = true
  }

  if (event.code === 'Space') {
    keyDown.space = true
  }
}

function keyUpListener(event) {
  if (event.code === 'ArrowLeft') {
    keyDown.left = false
  }

  if (event.code === 'ArrowRight') {
    keyDown.right = false
  }

  if (event.code === 'Space') {
    keyDown.space = false
  }
}

function render() {
  // clear the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  

  // draw the platforms + decor
  decor.forEach((shape) => shape.draw())
  platforms.forEach((platform) => platform.draw())

  // draw the character
  character.draw()

  // show the timer
  write(timer.getTimeString(), 30, 80)

  
  // draw win screen if game has been won
  if (gameOver) {
    drawWinScreen()
  }
}

// let vl = 0
// let vt = 0
// let al = 0
// let at = 0
let gravity = 9
let lastTick = Date.now()

function physics() {
  let ellapsed = (Date.now() - lastTick) / 100
  lastTick = Date.now()
  let dl = 0
  let dt = 0
  // 1 User Interaction
  if (keyDown.left && !keyDown.right) {
    dl -= 5
  }
  if (keyDown.right && !keyDown.left) {
    dl += 5
  }
  if (keyDown.space && character.vt == 0) {
    character.vt = -40 
  }
  // 2 Physics!
  character.vl = character.al*ellapsed + character.vl
  character.vt = character.at*ellapsed + gravity*ellapsed + character.vt
  dl = character.vl*ellapsed + dl
  dt = character.vt*ellapsed + dt

  // Move and account for collisions
  character.move(platforms, dl, dt)
}

function step() {
  // game logic
  if (character.top <= 100) {
    timer.stop()
    gameOver = true
  }
  // user interactions + physics
  physics()

  // render
  render()

  // call next
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
window.addEventListener('keydown', keyDownListener)
window.addEventListener('keyup', keyUpListener)
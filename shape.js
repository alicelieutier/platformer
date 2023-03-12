class Shape {
  constructor(name, left, top, width, height, color) {
    this.name = name
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.color = color
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.left, this.top, this.width, this.height);
  }

  intersects(obstacle, left=this.left, top=this.top) {
    return (
      // the obstacle bottom is lower than the zone top
      obstacle.top + obstacle.height > top
      // or the obstacle top is higher than the this bottom
      && obstacle.top < (top + this.height)
      // and the obstacle right is to the right of the this left border
      && obstacle.left + obstacle.width > left
      // and the obstacle left border is to the left of the this right border
      && obstacle.left < (left + this.width)
    )
  }

  contains(shape) {
    return (
      // the shape top is lower than the zone top
      shape.getTop() >= top
      // and the shape bottom is higher than the this bottom
      && (shape.getTop() + shape.height) <= (top + this.height)
      // and the shape left is to the right of the this left border
      && shape.getLeft() >= left
      // and the shape right border is to the left of the this right border
      && (shape.getLeft() + shape.width) <= (left + this.width)
    )
  }
}

class Character extends Shape{
  constructor(left, top) {
    super('character', left, top, 20, 30, 'red')
    this.al = 0
    this.at = 0
    this.vl = 0
    this.vt = 0
    // this.speedLeft = 0;
    // this.speedTop = 0;
    // this.gravity = 0.05;
    // this.gravitySpeed = 0;
  }

  displacement(obstacle, left, top) {
    // console.log('considering', obstacle.name)
    let dl = 0
    let dt = 0

    if (this.intersects(obstacle, left, top)) {
      if (this.intersects(obstacle, this.left, top)) {
        // dt needs to change
        if (obstacle.top + obstacle.height > top && obstacle.top + obstacle.height <= this.top) {
          // console.log("the obstacle bottom would become lower than this top")
          dt = obstacle.top + obstacle.height - top
          // console.log('dl',dl, 'dt', dt)
        }
        if (obstacle.top < (top + this.height) && obstacle.top >= (this.top + this.height)) {
          // console.log("the obstacle top would become higher than this bottom")
          dt = obstacle.top - (top + this.height)
          // console.log('dl',dl, 'dt', dt)
        }
        this.at = 0
        this.vt = 0
      }
      if (this.intersects(obstacle, left, this.top)) {
        // dl needs to change
        if (obstacle.left + obstacle.width > left && obstacle.left + obstacle.width <= this.left) {
          // console.log("the obstacle right would pass to the right of this left border")
          dl = obstacle.left + obstacle.width - left
          // console.log('dl',dl, 'dt', dt)
        }
        if (obstacle.left < (left + this.width) && obstacle.left >= (this.left + this.width)) {
          // console.log("the obstacle left border would pass to the left of this right border")
          dl = obstacle.left - (left + this.width)
          // console.log('dl',dl, 'dt', dt)
        }
        this.al = 0
        this.vl = 0
      }
    }
    return [dl, dt]
  }

  tryMove(obstacles, tryLeft, tryTop) {
    let [dl, dt] = [0,0]
    for (let index = 0; index < obstacles.length; index++) {
      const obstacle = obstacles[index];
      let [ddl, ddt] = this.displacement(obstacle, tryLeft, tryTop)
      dl += ddl
      dt += ddt
    }
    this.left = tryLeft + dl
    this.top = tryTop + dt
  }

  move(obstacles, dl, dt) {
    this.tryMove(obstacles, this.left + dl, this.top + dt)
  }

  // moveLeft(obstacles, delta) {
  //   this.tryMove(obstacles, this.left - delta, this.top)
  // }

  // moveRight(obstacles, delta) {
  //   this.tryMove(obstacles, this.left + delta, this.top)
  // }

  // moveUp(obstacles, delta) {
  //   this.tryMove(obstacles, this.left, this.top - delta)
  // }

  // moveDown(obstacles, delta) {
  //   this.tryMove(obstacles, this.left, this.top + delta)
  // }
}

class Platform  extends Shape{
  constructor (name, left, top, width, height=20) {
    super(name, left, top, width,height,'yellow')
  }
}

class Decor extends Shape{
  constructor (name, left, top, width, height, color) {
    super(name, left, top, width, height, color)
  }
}
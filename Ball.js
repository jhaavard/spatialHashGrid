class Ball {
  constructor({ position = [0, 0], dimensions }) {
    this.pos = position
    this.dimensions = dimensions
    this.isActive = false
  }

  update(newPos) {
    this.pos[0] += newPos[0]
    this.pos[1] += newPos[1]
  }

  display(c, isNear) {
    const color = isNear ? 'hsla(0, 0%, 100%, 1.0)':'hsla(0, 0%, 100%, 0.2)'
    c.beginPath()
    c.arc(this.pos[0], this.pos[1], this.dimensions[0], 0, Math.PI * 2, false)
    c.fillStyle = color
    c.fill()
    if (this.isActive) {
      c.beginPath()
      c.arc(
        this.pos[0],
        this.pos[1],
        this.dimensions[0] + 5,
        0,
        Math.PI * 2,
        false
      )
      c.strokeStyle = 'hsla(50, 100%, 50%, 1)'
      c.stroke()
    }
  }
}

export default Ball

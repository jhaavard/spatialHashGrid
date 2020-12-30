import SpatialHashGrid from './grid'
import { math } from './math'
import Ball from './Ball'
const canvas = document.getElementById('canvas')
canvas.width = 500
canvas.height = 500
const c = canvas.getContext('2d')

// Spatial Hash Grid
const DIMENSIONS = [canvas.width, canvas.height]
const BOUNDS = [
  [0, 0],
  [canvas.width, canvas.height],
]
const grid = new SpatialHashGrid(BOUNDS, DIMENSIONS)

const members = []
const NUM_MEMBERS = 500

for (let i = 0; i < NUM_MEMBERS; i++) {
  const margin = 50
  const x = math.lerp(margin, canvas.width - margin, Math.random())
  const y = math.lerp(margin, canvas.height - margin, Math.random())
  const pos = [x, y]
  const dimensions = [2, 2]
  const member = grid.NewMember(pos, dimensions)
  members.push(member)
}

// console.log(members)
// console.log(grid)

function sketch({ c, time, width, height }) {
  c.clearRect(0, 0, width, height)
  c.fillStyle = 'hsl(190, 50%, 5%)'
  c.fillRect(0, 0, width, height)

  // Display all members
  members.forEach((m) => {
    m.body.display(c)
  })

  // Highlight the active member
  members[0].body.isActive = true

  // Query nearby members
  const queryBounds = [100, 100]
  const found = Array.from(grid.FindNear(members[0].position, queryBounds))

  // Highlight nearby members
  found.forEach((f) => {
    f.body.display(c, true)
  })

  // Update all members
  members.forEach((m, i) => {
    if (i === 0) {
      const deltaX = Math.random() * 4 - 2
      const deltaY = Math.random() * 4 - 2
      m.position[0] += deltaX
      m.position[1] += deltaY
      grid.UpdateMember(m)
      m.body.update([deltaX, deltaY])
    }
    const deltaX = Math.random() - 0.5
    const deltaY = Math.random() - 0.5
    m.position[0] += deltaX
    m.position[1] += deltaY
    grid.UpdateMember(m)
    m.body.update([deltaX, deltaY])
  })
}

let time = 0
function animate(e) {
  time = e / 1000.0
  sketch({ c, time, width: canvas.width, height: canvas.height })
  requestAnimationFrame(animate)
}

animate()

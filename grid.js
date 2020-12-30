import { math } from './math'
import Ball from './Ball'

class SpatialHashGrid {
  constructor(bounds, dimensions) {
    this._bounds = bounds
    this._dimensions = dimensions
    this._cells = new Map()
  }

  NewMember(position, dimensions) {
    const member = {
      position: position,
      dimensions: dimensions,
      body: new Ball({ position, dimensions }),
      indices: null,
    }
    this._Insert(member)
    return member
  }

  _Insert(member) {
    const [x, y] = member.position
    const [w, h] = member.dimensions

    const i1 = this._GetCellIndex([x - w / 2, y - h / 2])
    const i2 = this._GetCellIndex([x + w / 2, y + h / 2])

    member.indices = [i1, i2]

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this._Key(x, y)
        if (!(k in this._cells)) {
          this._cells[k] = new Set()
        }
        this._cells[k].add(member)
      }
    }
  }
  _Key(x, y) {
    return `${x}.${y}`
  }

  _GetCellIndex(position) {
    const x = math.sat(
      (position[0] - this._bounds[0][0]) /
        (this._bounds[1][0] - this._bounds[0][0])
    )
    const y = math.sat(
      (position[1] - this._bounds[0][1]) /
        (this._bounds[1][1] - this._bounds[0][1])
    )

    const xIndex = Math.floor(x * (this._dimensions[0] - 1))
    const yIndex = Math.floor(y * (this._dimensions[1] - 1))

    return [xIndex, yIndex]
  }

  FindNear(position, bounds) {
    const [x, y] = position
    const [w, h] = bounds

    const i1 = this._GetCellIndex([x - w / 2, y - h / 2])
    const i2 = this._GetCellIndex([x + w / 2, y + h / 2])

    const members = new Set()

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this._Key(x, y)

        if (k in this._cells) {
          for (let v of this._cells[k]) {
            members.add(v)
          }
        }
      }
    }
    return members
  }

  UpdateMember(member) {
    this.RemoveMember(member)
    this._Insert(member)
  }

  RemoveMember(member) {
    const [i1, i2] = member.indices

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this._Key(x, y)

        this._cells[k].delete(member)
      }
    }
  }
}

export default SpatialHashGrid

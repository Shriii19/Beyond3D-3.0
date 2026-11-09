import type { Font } from 'opentype.js'
import { ExtrudeGeometry, ShapePath } from 'three'

export type Glyph = {
  char: string
  geometry: ExtrudeGeometry
  advance: number
}

const SIZE = 1.25

// Converts one font glyph into an extruded, bevelled, centred mesh geometry.
function glyphGeometry(font: Font, char: string) {
  const path = font.getPath(char, 0, 0, SIZE)
  const shapePath = new ShapePath()

  for (const command of path.commands) {
    // opentype paths are y-down (canvas space); three.js is y-up
    switch (command.type) {
      case 'M':
        shapePath.moveTo(command.x, -command.y)
        break
      case 'L':
        shapePath.lineTo(command.x, -command.y)
        break
      case 'Q':
        shapePath.quadraticCurveTo(command.x1, -command.y1, command.x, -command.y)
        break
      case 'C':
        shapePath.bezierCurveTo(
          command.x1,
          -command.y1,
          command.x2,
          -command.y2,
          command.x,
          -command.y,
        )
        break
    }
  }

  // toShapes() finds holes (the inside of R) by containment, so winding order doesn't matter.
  const shapes = shapePath.toShapes()

  const geometry = new ExtrudeGeometry(shapes, {
    depth: 0.26,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.018,
    bevelSegments: 4,
  })
  geometry.center()
  geometry.computeVertexNormals()

  const glyph = font.charToGlyph(char)
  const advance = ((glyph.advanceWidth ?? font.unitsPerEm) / font.unitsPerEm) * SIZE
  return { geometry, advance }
}

export function createGlyphs(font: Font, word: string): Glyph[] {
  return word.split('').map((char) => ({ char, ...glyphGeometry(font, char) }))
}

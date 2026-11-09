// The canvas ignores pointer events so the page stays scrollable,
// so we track the pointer on the window instead (-1..1 on both axes).
export const pointer = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}

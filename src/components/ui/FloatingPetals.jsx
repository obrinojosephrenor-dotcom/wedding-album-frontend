import { useState, useEffect } from 'react'

const COLORS  = ['#F8D7DA', '#F0B8BF', '#A8B5A2', '#F8E7A1', '#A7BFD7']
const SHAPES  = [
  (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50"><ellipse cx="20" cy="28" rx="11" ry="18" fill="${c}" opacity=".7" transform="rotate(-12 20 28)"/></svg>`,
  (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="${c}" opacity=".6"/></svg>`,
  (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 38"><path d="M14 4C22 14 22 28 14 36C6 28 6 14 14 4Z" fill="${c}" opacity=".6"/></svg>`,
]

let _id = 0

export default function FloatingPetals() {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    const add = () => {
      const id     = ++_id
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)]
      const shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)](color)
      const size   = 12 + Math.random() * 20
      const left   = Math.random() * 98
      const dur    = 9 + Math.random() * 7
      const delay  = Math.random() * 2

      setPetals(p => [...p.slice(-14), { id, shape, size, left, dur, delay }])
    }

    add()
    const iv = setInterval(add, 2400)
    return () => clearInterval(iv)
  }, [])

  const remove = (id) => setPetals(p => p.filter(x => x.id !== id))

  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 1, overflow: 'hidden' }}>
      {petals.map(({ id, shape, size, left, dur, delay }) => {
        const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shape)}`
        return (
          <img
            key={id}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              left: `${left}vw`,
              top: '-30px',
              width: size,
              height: size,
              animation: `petalFall ${dur}s linear ${delay}s forwards`,
              opacity: 0,
            }}
            onAnimationEnd={() => remove(id)}
          />
        )
      })}
    </div>
  )
}

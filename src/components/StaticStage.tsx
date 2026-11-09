import { profile } from '../content'

// Shown instead of the WebGL scene when the device has no WebGL
// or the visitor prefers reduced motion.
export function StaticStage() {
  return (
    <div className="static-stage" aria-hidden="true">
      <span className="static-word">{profile.brand}</span>
    </div>
  )
}

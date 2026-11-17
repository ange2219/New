import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

// Affiche un vrai modèle 3D (.glb) avec <model-viewer> :
// rotation, zoom, ombres, éclairage réaliste et coloris intégrés (KHR_materials_variants).
export default function Model3D({
  src,
  alt = '',
  variant,
  interactive = false,
  autoRotate = false,
  rotationSpeed = '18deg',
  cameraOrbit,
  fieldOfView,
  className,
  style,
}) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoad = () => setLoaded(true)
    el.addEventListener('load', onLoad)
    return () => el.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (el && loaded && variant) el.variantName = variant
  }, [variant, loaded])

  return (
    <model-viewer
      ref={ref}
      src={src}
      alt={alt}
      class={`model3d ${loaded ? 'is-loaded' : ''} ${className || ''}`}
      style={style}
      camera-controls={interactive ? '' : undefined}
      disable-zoom={interactive ? undefined : ''}
      disable-pan=""
      auto-rotate={autoRotate ? '' : undefined}
      auto-rotate-delay="0"
      rotation-per-second={rotationSpeed}
      interaction-prompt="none"
      shadow-intensity="1"
      shadow-softness="0.9"
      exposure="1.05"
      environment-image="neutral"
      camera-orbit={cameraOrbit}
      field-of-view={fieldOfView}
      touch-action="pan-y"
      loading="eager"
    />
  )
}

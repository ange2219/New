import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

// Affiche un vrai modèle 3D (.glb) avec <model-viewer> :
// rotation, zoom, ombres, éclairage réaliste et coloris intégrés (KHR_materials_variants).
// Sur l'hébergement de démonstration, les .glb sont publiés encodés en texte (base64) :
// on les décode ici et on les donne à <model-viewer> sous forme d'URL blob (ou data: en secours).
const ENCODED = import.meta.env.VITE_MODELS_AS_TEXT === '1'
const cache = new Map()

function loadEncoded(path) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(`${path}.b64.txt`)
        .then((r) => {
          if (!r.ok) throw new Error(`Modèle introuvable : ${path}`)
          return r.text()
        })
        .then((b64) => {
          const clean = b64.trim()
          const bin = atob(clean)
          const bytes = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
          const blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'model/gltf-binary' }))
          return { blobUrl, dataUrl: `data:model/gltf-binary;base64,${clean}` }
        }),
    )
  }
  return cache.get(path)
}

function useModelSrc(path) {
  const [src, setSrc] = useState(ENCODED ? null : path)
  const [alt, setAlt] = useState(null)
  useEffect(() => {
    if (!ENCODED) return
    let alive = true
    loadEncoded(path)
      .then(({ blobUrl, dataUrl }) => {
        if (!alive) return
        setSrc(blobUrl)
        setAlt(dataUrl)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [path])
  // si l'URL blob est refusée, on passe à l'URL data:
  const fallback = () => alt && src !== alt && setSrc(alt)
  return [src, fallback]
}

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
  const [resolved, fallback] = useModelSrc(src)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoad = () => setLoaded(true)
    const onError = () => fallback()
    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('error', onError)
    }
  }, [fallback])

  useEffect(() => {
    const el = ref.current
    if (el && loaded && variant) el.variantName = variant
  }, [variant, loaded])

  return (
    <model-viewer
      ref={ref}
      src={resolved || undefined}
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

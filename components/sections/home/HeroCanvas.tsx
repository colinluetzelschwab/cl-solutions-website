'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Vertex Shader - passthrough
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

// Fragment Shader - water caustic with sine waves
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Caustic function: 5 overlapping sine waves at different angles and speeds
  float caustic(vec2 uv, float t) {
    float c1 = sin(uv.x * 4.2 + uv.y * 3.8 + t * 0.55) * 0.5 + 0.5;
    float c2 = sin(uv.x * 5.1 - uv.y * 4.3 + t * 0.42) * 0.5 + 0.5;
    float c3 = sin(uv.x * 3.7 + uv.y * 5.2 + t * 0.30) * 0.5 + 0.5;
    float c4 = sin(uv.x * 6.3 - uv.y * 2.9 + t * 0.38) * 0.5 + 0.5;
    float c5 = sin(uv.x * 4.8 + uv.y * 4.5 + t * 0.25) * 0.5 + 0.5;

    return c1 * 0.5 + c2 * 0.3 + c3 * 0.2;
  }

  void main() {
    // Aspect ratio correction
    vec2 uv = vUv;
    uv.x *= uResolution.x / uResolution.y;

    // Color palette — warm amber/bronze caustics
    vec3 colorBase = vec3(0.030, 0.028, 0.035);        // warm near-black
    vec3 colorMidGlow = vec3(0.080, 0.055, 0.035);     // deep bronze
    vec3 colorBrightCrest = vec3(0.280, 0.180, 0.100); // warm amber crest
    vec3 colorWhiteGlint = vec3(0.520, 0.380, 0.260);  // golden highlight

    // Calculate caustic pattern at 3 different scales
    float scale1 = caustic(uv * 2.0, uTime);
    float scale2 = caustic(uv * 3.5, uTime);
    float scale3 = caustic(uv * 5.0, uTime);

    // Blend scales
    float combined = scale1 * 0.5 + scale2 * 0.3 + scale3 * 0.2;

    // Sharp caustic crests
    float intensity = pow(combined, 3.2);

    // Mouse expanding ripple
    vec2 mouseUv = uMouse;
    mouseUv.x *= uResolution.x / uResolution.y;
    float dist = distance(uv, mouseUv);
    float ripple = sin(dist * 6.0 - uTime * 3.5) * exp(-dist * 1.8);
    intensity += ripple * 0.15;

    // Color gradation based on intensity
    vec3 color = colorBase;
    color = mix(color, colorMidGlow, smoothstep(0.2, 0.4, intensity));
    color = mix(color, colorBrightCrest, smoothstep(0.5, 0.7, intensity));
    color = mix(color, colorWhiteGlint, smoothstep(0.8, 0.95, intensity));

    // Vignette darkens edges
    vec2 vignetteUv = vUv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vignetteUv, vignetteUv) * 0.3;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const [webGLSupported, setWebGLSupported] = useState(true)

  useEffect(() => {
    // WebGL detection
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)

    if (!gl || isMobile) {
      setWebGLSupported(false)
      return
    }

    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Orthographic camera covering full clip space
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Geometry - full screen plane
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader,
      fragmentShader,
    })

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Initialize timestamp
    lastTimeRef.current = performance.now()

    // Animation loop with real dt
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      // Calculate real dt in seconds
      const currentTime = performance.now()
      const dt = (currentTime - lastTimeRef.current) / 1000.0
      lastTimeRef.current = currentTime

      if (meshRef.current && meshRef.current.material) {
        const material = meshRef.current.material as THREE.ShaderMaterial
        // Increment by real dt seconds per frame
        material.uniforms.uTime.value += dt
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial
        // Normalize mouse position to 0-1
        material.uniforms.uMouse.value.x = e.clientX / window.innerWidth
        material.uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight
      }
    }

    // Resize handler
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current && meshRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
        const material = meshRef.current.material as THREE.ShaderMaterial
        material.uniforms.uResolution.value.x = window.innerWidth
        material.uniforms.uResolution.value.y = window.innerHeight
      }
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose()
        }
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Mobile fallback: dark gradient if WebGL unavailable
  if (!webGLSupported) {
    return (
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#0A0A0C] via-[#12100E] to-[#0A0A0C]" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{ backgroundColor: '#0A0A0C' }}
    />
  )
}

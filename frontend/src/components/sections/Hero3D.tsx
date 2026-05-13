import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function HologramCore() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x =
      state.clock.elapsedTime * 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.55;
  });
  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={mesh} scale={1.15}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00D9FF"
          emissive="#38BDF8"
          emissiveIntensity={0.85}
          roughness={0.15}
          metalness={0.9}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-[min(52vh,420px)] w-full max-w-[520px] md:h-[min(60vh,480px)]">
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={["transparent"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 4, 6]} intensity={1.8} color="#00D9FF" />
        <pointLight position={[-5, -2, -4]} intensity={0.9} color="#38BDF8" />
        <HologramCore />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.22),transparent_65%)] blur-2xl" />
    </div>
  );
}

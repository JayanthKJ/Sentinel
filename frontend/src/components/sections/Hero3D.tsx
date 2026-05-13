import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

function NeuralPointField() {
  const points = useRef<Points>(null);
  const geo = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 1.35 + (Math.random() - 0.5) * 0.45;
      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.12;
    points.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial
        color="#00D9FF"
        size={0.045}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireframeShell() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = -state.clock.elapsedTime * 0.22;
    mesh.current.rotation.x =
      state.clock.elapsedTime * 0.11 + Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
  });
  return (
    <mesh ref={mesh} scale={1.42}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial
        color="#38BDF8"
        wireframe
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function EnergyRings() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.38;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });
  return (
    <group ref={group}>
      <mesh rotation={[1.1, 0.4, 0.2]}>
        <torusGeometry args={[1.58, 0.018, 12, 160]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[0.5, 2.1, 0.35]}>
        <torusGeometry args={[1.78, 0.012, 10, 120]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function HologramCore() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.38 + Math.sin(t * 0.45) * 0.1;
    mesh.current.rotation.y = t * 0.52;
    mesh.current.rotation.z = Math.sin(t * 0.2) * 0.05;
  });
  return (
    <Float speed={2.4} rotationIntensity={0.42} floatIntensity={0.72}>
      <mesh ref={mesh} scale={1.12}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color="#00D9FF"
          emissive="#38BDF8"
          emissiveIntensity={1.05}
          roughness={0.12}
          metalness={0.92}
          distort={0.42}
          speed={2.4}
        />
      </mesh>
    </Float>
  );
}

function InnerGlow() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const p = 0.92 + Math.sin(state.clock.elapsedTime * 1.8) * 0.04;
    mesh.current.scale.setScalar(p);
  });
  return (
    <mesh ref={mesh} scale={0.78}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#00D9FF"
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function SceneRig() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.15) * 0.06;
    group.current.rotation.x = Math.cos(t * 0.12) * 0.04;
  });
  return (
    <group ref={group}>
      <Sparkles
        count={48}
        scale={5.2}
        size={2.2}
        speed={0.35}
        opacity={0.55}
        color="#38BDF8"
      />
      <Sparkles
        count={28}
        scale={3.8}
        size={1.6}
        speed={0.55}
        opacity={0.45}
        color="#00D9FF"
      />
      <NeuralPointField />
      <EnergyRings />
      <WireframeShell />
      <InnerGlow />
      <HologramCore />
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-[min(54vh,440px)] w-full max-w-[540px] md:h-[min(62vh,520px)]">
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["transparent"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 4.35]} fov={42} />
        <ambientLight intensity={0.22} />
        <pointLight position={[4.5, 3.5, 5]} intensity={2.2} color="#00D9FF" />
        <pointLight position={[-4.5, -2.5, -3.5]} intensity={1.1} color="#38BDF8" />
        <spotLight
          position={[0, 5, 2]}
          angle={0.45}
          penumbra={0.85}
          intensity={1.4}
          color="#F8FAFC"
          castShadow={false}
        />
        <directionalLight position={[2, 1, 5]} intensity={0.35} color="#94A3B8" />
        <SceneRig />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.28),transparent_58%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-electric/15 opacity-60" />
    </div>
  );
}

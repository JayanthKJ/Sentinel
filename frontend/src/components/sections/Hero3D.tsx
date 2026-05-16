import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, InstancedMesh } from "three";

function LogColumns() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const columns = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        return {
          x: (col - 3.5) * 0.26,
          z: (row - 1.5) * 0.22,
          phase: Math.random() * Math.PI * 2,
          speed: 0.7 + Math.random() * 0.8,
        };
      }),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < columns.length; i++) {
      const c = columns[i];
      const h = 0.14 + Math.abs(Math.sin(t * c.speed + c.phase)) * 1.2;
      dummy.position.set(c.x, -0.9 + h * 0.5, c.z);
      dummy.scale.set(0.08, h, 0.08);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, columns.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00D9FF"
        emissive="#38BDF8"
        emissiveIntensity={0.65}
        metalness={0.25}
        roughness={0.35}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

function TerminalLayers() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.22) * 0.08;
    group.current.position.y = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.25, -0.35]} rotation={[-0.35, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.05, 1.55]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.38}
        />
      </mesh>
      <mesh position={[0.15, -0.05, -0.25]} rotation={[-0.35, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.45]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.45}
          transparent
          opacity={0.32}
        />
      </mesh>
      <mesh position={[-0.1, -0.33, -0.15]} rotation={[-0.35, 0.2, 0]}>
        <boxGeometry args={[1.9, 0.05, 1.25]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={0.25}
          metalness={0.18}
          roughness={0.48}
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh position={[0, -1.0, 0]} rotation={[-0.35, 0.2, 0]}>
        <boxGeometry args={[2.9, 0.04, 1.9]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function SceneRig() {
  return (
    <group>
      <Sparkles
        count={36}
        scale={4.2}
        size={2.4}
        speed={0.4}
        opacity={0.5}
        color="#38BDF8"
      />
      <Float speed={1.9} rotationIntensity={0.18} floatIntensity={0.4}>
        <TerminalLayers />
      </Float>
      <LogColumns />
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-[min(54vh,440px)] w-full max-w-[540px] md:h-[min(62vh,520px)]">
      <Canvas
        className="!bg-transparent"
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#020617"), 0);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.1, 4.5]} fov={40} />
        <ambientLight intensity={0.28} />
        <pointLight position={[4.2, 3.2, 4.5]} intensity={1.65} color="#00D9FF" />
        <pointLight position={[-3.8, -2.5, -2.8]} intensity={0.85} color="#38BDF8" />
        <spotLight
          position={[0, 4.2, 2.2]}
          angle={0.42}
          penumbra={0.8}
          intensity={1.1}
          color="#7DD3FC"
          castShadow={false}
        />
        <directionalLight position={[2.2, 1.1, 4.8]} intensity={0.28} color="#94A3B8" />
        <SceneRig />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.28),transparent_58%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-electric/15 opacity-60" />
    </div>
  );
}

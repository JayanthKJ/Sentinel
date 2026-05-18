import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, InstancedMesh } from "three";

function NetworkCore() {
  const group = useRef<Group>(null);

  const points = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => {
        const angle = (index / 24) * Math.PI * 2;
        const radius = index % 2 === 0 ? 1.05 : 0.82;
        const layer = index % 3;

        return new THREE.Vector3(
          Math.cos(angle) * radius * (1 + layer * 0.12),
          Math.sin(angle * 1.7) * 0.42 + (layer - 1) * 0.18,
          Math.sin(angle) * radius * 0.9
        );
      }),
    []
  );

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = points[i].distanceTo(points[j]);
        if (distance < 1.25) {
          positions.push(
            points[i].x,
            points[i].y,
            points[i].z,
            points[j].x,
            points[j].y,
            points[j].z
          );
        }
      }
    }

    return new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
  }, [points]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.22) * 0.34 + t * 0.045;
    group.current.rotation.x = Math.sin(t * 0.17) * 0.1 - 0.03;
    group.current.position.y = Math.sin(t * 0.55) * 0.09 + 0.34;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#68F0FF" transparent opacity={0.62} />
      </lineSegments>

      {points.map((point, index) => (
        <mesh key={index} position={point.toArray() as [number, number, number]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#F2FFFF" : "#64EAFF"}
            emissive="#53D7FF"
            emissiveIntensity={1.25}
            metalness={0.12}
            roughness={0.16}
          />
        </mesh>
      ))}

      <mesh>
        <icosahedronGeometry args={[0.31, 1]} />
        <meshStandardMaterial
          color="#F0FFFF"
          emissive="#B25DFF"
          emissiveIntensity={1.0}
          wireframe
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#F6FCFF" emissive="#F6FCFF" emissiveIntensity={2.1} />
      </mesh>
    </group>
  );
}

function StreamBase() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ribbons = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, index) => ({
        angle: (index / 40) * Math.PI * 2,
        radius: 0.85 + (index % 5) * 0.025,
        height: 0.06 + (index % 7) * 0.014,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    for (let index = 0; index < ribbons.length; index++) {
      const ribbon = ribbons[index];
      const pulse = 0.2 + Math.sin(t * 1.5 + ribbon.phase) * 0.05;
      const radius = ribbon.radius + Math.sin(t * 0.8 + ribbon.phase) * 0.03;
      const angle = ribbon.angle + t * 0.35 + Math.sin(t * 0.6 + ribbon.phase) * 0.03;

      dummy.position.set(
        Math.cos(angle) * radius,
        -0.96 + Math.sin(t * 0.7 + ribbon.phase) * 0.03,
        Math.sin(angle) * radius * 0.54
      );
      dummy.rotation.set(-0.2, angle, 0);
      dummy.scale.set(0.24 + pulse * 0.8, ribbon.height * 0.9, 0.95 + pulse * 0.9);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, ribbons.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0A1030"
          emissive="#2EDCFF"
          emissiveIntensity={0.56}
          metalness={0.12}
          roughness={0.22}
          transparent
          opacity={0.88}
        />
      </instancedMesh>
      <mesh rotation={[-0.5, 0.12, 0]} position={[0, -0.86, 0]}>
        <torusGeometry args={[1.16, 0.05, 16, 96]} />
        <meshStandardMaterial color="#2EDCFF" emissive="#2EDCFF" emissiveIntensity={1.08} />
      </mesh>
      <mesh rotation={[-0.5, 0.12, 0]} position={[0, -0.86, 0]}>
        <torusGeometry args={[1.34, 0.024, 16, 96]} />
        <meshStandardMaterial color="#B561FF" emissive="#B561FF" emissiveIntensity={0.82} />
      </mesh>
    </group>
  );
}

function FloatingServiceCube({
  position,
  label,
  icon,
}: {
  position: [number, number, number];
  label: string;
  icon: string;
}) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.18 + position[0] * 0.06;
    group.current.rotation.x = Math.sin(t * 0.55 + position[1]) * 0.05;
    group.current.position.y = position[1] + Math.sin(t * 1.1 + position[0]) * 0.06;
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <boxGeometry args={[0.58, 0.58, 0.58]} />
        <meshStandardMaterial
          color="#050915"
          emissive="#60EFFF"
          emissiveIntensity={0.22}
          metalness={0.28}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.58, 0.58, 0.58]} />
        <meshBasicMaterial color="#95F2FF" wireframe transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, 0.0, 0.31]}>
        <planeGeometry args={[0.4, 0.12]} />
        <meshBasicMaterial color="#DDFEFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.12, 0.31]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshBasicMaterial color="#DDFEFF" transparent opacity={1} />
      </mesh>
      <Text
        position={[0, 0.04, 0.34]}
        fontSize={0.105}
        color="#EAFBFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.38}
      >
        {icon}
      </Text>
      <Text
        position={[0, -0.14, 0.34]}
        fontSize={0.102}
        color="#EAFBFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.38}
      >
        {label}
      </Text>
    </group>
  );
}

function SideNodes() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.33) * 0.06;
    group.current.position.y = Math.sin(t * 0.8) * 0.05 - 0.04;
  });

  const points = [
    [-1.78, 0.05, -0.18],
    [1.72, 0.1, 0.0],
    [-1.86, -1.0, -0.05],
    [1.64, -0.95, 0.15],
  ] as const;

  return (
    <group ref={group}>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial
            color="#020814"
            emissive={index % 2 === 0 ? "#64E9FF" : "#BB63FF"}
            emissiveIntensity={0.22}
            transparent
            opacity={0.38}
            metalness={0.25}
            roughness={0.18}
          />
        </mesh>
      ))}
      <mesh position={[-1.78, 0.05, -0.18]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshBasicMaterial color="#8AF3FF" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh position={[1.72, 0.1, 0.0]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshBasicMaterial color="#8AF3FF" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh position={[-1.86, -1.0, -0.05]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshBasicMaterial color="#8AF3FF" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh position={[1.64, -0.95, 0.15]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshBasicMaterial color="#8AF3FF" wireframe transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function BottomWave() {
  const group = useRef<Group>(null);
  const points = useMemo(() => Array.from({ length: 42 }).map((_, index) => index / 41), []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.1) * 0.04;
  });

  const curve1 = useMemo(() => {
    const curvePoints = points.map((x) => {
      const y = Math.sin(x * Math.PI * 4) * 0.12 + Math.sin(x * Math.PI * 10) * 0.03;
      const z = Math.cos(x * Math.PI * 3) * 0.08;
      return new THREE.Vector3((x - 0.5) * 4.4, y, z);
    });
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [points]);

  const curve2 = useMemo(() => {
    const curvePoints = points.map((x) => {
      const y = Math.sin(x * Math.PI * 4 + 0.9) * 0.1 - 0.03;
      const z = Math.cos(x * Math.PI * 3 + 1.1) * 0.07;
      return new THREE.Vector3((x - 0.5) * 4.4, y, z);
    });
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [points]);

  return (
    <group ref={group} position={[0, -1.58, 0.18]}>
      <mesh rotation={[-0.18, 0, 0]} position={[0, 0, -0.08]}>
        <planeGeometry args={[4.9, 1.0]} />
        <meshStandardMaterial color="#060816" transparent opacity={0.66} />
      </mesh>
      <lineSegments geometry={curve1}>
        <lineBasicMaterial color="#6FE7FF" transparent opacity={0.88} />
      </lineSegments>
      <lineSegments geometry={curve2}>
        <lineBasicMaterial color="#B05BFF" transparent opacity={0.84} />
      </lineSegments>
    </group>
  );
}

function SceneRig() {
  return (
    <group>
      <Sparkles count={42} scale={5} size={1.8} speed={0.32} opacity={0.26} color="#78EFFF" />
      <Float speed={1.0} rotationIntensity={0.13} floatIntensity={0.22}>
        <NetworkCore />
      </Float>
      <StreamBase />
      <SideNodes />
      <BottomWave />
      <FloatingServiceCube position={[-1.92, -0.06, -0.45]} label="AUTH" icon="🛡" />
      <FloatingServiceCube position={[1.95, 0.1, -0.22]} label="DB" icon="◫" />
      <FloatingServiceCube position={[-2.12, -0.98, -0.06]} label="CACHE" icon="▤" />
      <FloatingServiceCube position={[1.58, -0.94, 0.42]} label="API" icon="{}" />
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
        <ambientLight intensity={0.16} />
        <pointLight position={[3.2, 2.8, 4.2]} intensity={1.35} color="#74E8FF" />
        <pointLight position={[-3.2, -2.4, -2.8]} intensity={1.05} color="#B04CFF" />
        <spotLight position={[0, 3.8, 2]} angle={0.38} penumbra={0.85} intensity={0.9} color="#E6F4FF" />
        <directionalLight position={[2.8, 1.2, 4.4]} intensity={0.3} color="#8EB8FF" />
        <SceneRig />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(86,219,255,0.14),transparent_58%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-[rgba(86,219,255,0.1)] opacity-60" />
    </div>
  );
}

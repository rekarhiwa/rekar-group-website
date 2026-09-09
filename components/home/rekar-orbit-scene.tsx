"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function SquircleFrame({
  scale,
  position,
  rotation,
  opacity = 0.35,
  speed = 0.2,
}: {
  scale: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = (rotation?.[2] ?? 0) + state.clock.elapsedTime * speed * 0.15;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.4) * 0.08;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[1.1, 0.018, 16, 96]} />
      <meshBasicMaterial color="#C878FF" transparent opacity={opacity} />
    </mesh>
  );
}

function CoreEmblem() {
  const group = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.45, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.3, 0.05);
      group.current.position.y = Math.sin(t * 0.9) * 0.08;
    }
    if (crystal.current) {
      crystal.current.rotation.y = t * 0.35;
      crystal.current.rotation.z = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.35} floatIntensity={0.6}>
        <mesh ref={crystal} scale={1.15}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#9A24F0"
            emissive="#6F00B8"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.75}
            distort={0.28}
            speed={2.2}
          />
        </mesh>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#C878FF" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitRing({
  radius,
  count,
  color,
  speed,
}: {
  radius: number;
  count: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return [Math.cos(a) * radius, Math.sin(a) * 0.15, Math.sin(a) * radius] as [
        number,
        number,
        number,
      ];
    });
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <group ref={ref}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} scale={0.05 + (i % 3) * 0.02}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#100018"]} />
      <fog attach="fog" args={["#100018", 8, 22]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 3, 5]} intensity={2.2} color="#9A24F0" />
      <pointLight position={[-5, -2, 2]} intensity={1.4} color="#6F00B8" />
      <spotLight
        position={[0, 8, 2]}
        angle={0.45}
        penumbra={0.8}
        intensity={2}
        color="#C878FF"
      />

      <CoreEmblem />

      <SquircleFrame scale={2.2} position={[0, 0, -0.4]} opacity={0.45} speed={0.35} />
      <SquircleFrame
        scale={3.1}
        position={[0, 0, -0.8]}
        rotation={[0.2, 0.1, 0.3]}
        opacity={0.28}
        speed={-0.22}
      />
      <SquircleFrame
        scale={4.2}
        position={[0, 0, -1.3]}
        rotation={[-0.15, 0.2, -0.2]}
        opacity={0.16}
        speed={0.12}
      />

      <OrbitRing radius={2.6} count={18} color="#C878FF" speed={0.25} />
      <OrbitRing radius={3.4} count={12} color="#7B00C8" speed={-0.14} />

      <Sparkles
        count={90}
        scale={[12, 8, 8]}
        size={2.5}
        speed={0.35}
        opacity={0.55}
        color="#E8C7FF"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshBasicMaterial color="#190026" transparent opacity={0.55} />
      </mesh>
    </>
  );
}

export function RekarOrbitScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(16,0,24,0.55)_75%,rgba(16,0,24,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

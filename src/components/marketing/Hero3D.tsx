"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Vault() {
  const ref = useRef<Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.35;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.15;
  });
  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh ref={ref} castShadow receiveShadow>
        <icosahedronGeometry args={[1.6, 2]} />
        <MeshDistortMaterial
          color="#06b0ef"
          emissive="#0a5c87"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.15}
          distort={0.35}
          speed={1.4}
        />
      </mesh>
    </Float>
  );
}

function Ring({ radius = 2.6, color = "#31cdff", speed = 0.6 }: { radius?: number; color?: string; speed?: number; }) {
  const ref = useRef<Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.getElapsedTime() * speed;
    ref.current.rotation.z = s.clock.getElapsedTime() * speed * 0.7;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 200]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <pointLight position={[-5, -3, -3]} intensity={0.8} color="#ffd66b" />
          <Vault />
          <Ring radius={2.4} color="#31cdff" speed={0.4} />
          <Ring radius={2.9} color="#ffd66b" speed={0.25} />
          <Ring radius={3.3} color="#75e2ff" speed={0.55} />
          <Sparkles count={120} scale={8} size={2} color="#75e2ff" speed={0.6} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { DharmaAura } from "./DharmaAura";

/* ============ CULTIVATOR 3D — silhouette robe + dharma aura ============ */

/* Robe-like cultivator silhouette built from primitive shapes */
const CultivatorFigure = ({ color = "#34d399" }: { color?: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.15;
  });

  const robeColor = "#ecfdf5";
  const sashColor = color;

  return (
    <group ref={ref} position={[0, -0.6, 0]}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Hair bun */}
      <mesh position={[0, 2.5, -0.05]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Hair flowing back */}
      <mesh position={[0, 1.95, -0.1]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.32, 0.7, 16, 1, true]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} />
      </mesh>

      {/* Upper body (robe top) */}
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.55, 0.9, 8]} />
        <meshStandardMaterial color={robeColor} roughness={0.4} metalness={0.1} emissive={color} emissiveIntensity={0.05} />
      </mesh>

      {/* Sash/belt */}
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.4, 0.06, 16, 32]} />
        <meshStandardMaterial color={sashColor} emissive={sashColor} emissiveIntensity={0.6} metalness={0.6} roughness={0.3} toneMapped={false} />
      </mesh>

      {/* Lower robe (long flowing) */}
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.85, 1.7, 8]} />
        <meshStandardMaterial color={robeColor} roughness={0.4} emissive={color} emissiveIntensity={0.08} />
      </mesh>

      {/* Glowing sleeves */}
      <mesh position={[-0.55, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.18, 0.7, 8]} />
        <meshStandardMaterial color={robeColor} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.55, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.18, 0.7, 8]} />
        <meshStandardMaterial color={robeColor} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
      </mesh>

      {/* Forehead jewel */}
      <mesh position={[0, 2.32, 0.27]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Halo ring above head */}
      <Halo />

      {/* Standing platform / cloud */}
      <CloudPlatform />
    </group>
  );
};

const Halo = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.5;
  });
  return (
    <mesh ref={ref} position={[0, 2.7, -0.3]} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[0.45, 0.02, 16, 64]} />
      <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2.5} toneMapped={false} />
    </mesh>
  );
};

const CloudPlatform = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.2;
  });
  return (
    <group ref={ref} position={[0, -0.85, 0]}>
      <mesh>
        <torusGeometry args={[0.85, 0.15, 16, 64]} />
        <meshStandardMaterial color="#a7f3d0" emissive="#34d399" emissiveIntensity={0.6} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <meshStandardMaterial color="#ecfdf5" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

/* Floating treasures around the cultivator */
const OrbitingTreasure = ({ angle, radius, height, color }: { angle: number; radius: number; height: number; color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime * 0.3;
      ref.current.position.x = Math.cos(angle + t) * radius;
      ref.current.position.z = Math.sin(angle + t) * radius;
      ref.current.position.y = height + Math.sin(s.clock.elapsedTime * 1.5 + angle) * 0.15;
      ref.current.rotation.y = s.clock.elapsedTime;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} metalness={0.8} roughness={0.2} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* Floating mini-swords around */
const OrbitingSword = ({ angle, radius, height }: { angle: number; radius: number; height: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime * 0.25;
      ref.current.position.x = Math.cos(angle + t) * radius;
      ref.current.position.z = Math.sin(angle + t) * radius;
      ref.current.position.y = height + Math.sin(s.clock.elapsedTime + angle) * 0.2;
      ref.current.rotation.y = -angle - t + Math.PI / 2;
      ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 2 + angle) * 0.15;
    }
  });
  return (
    <group ref={ref}>
      <Float floatIntensity={0.3} rotationIntensity={0.2}>
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.05, 0.6, 0.02]} />
            <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.5} metalness={0.9} roughness={0.1} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.15, 0.03, 0.04]} />
            <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={1} metalness={1} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.15, 16]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

const CultivatorScene = () => {
  const treasures = useMemo(
    () => [
      { angle: 0, radius: 1.6, height: 1.4, color: "#fcd34d" },
      { angle: Math.PI * 0.66, radius: 1.6, height: 0.5, color: "#34d399" },
      { angle: Math.PI * 1.33, radius: 1.6, height: 1.0, color: "#a7f3d0" },
    ],
    [],
  );
  const swords = useMemo(
    () => [
      { angle: Math.PI * 0.25, radius: 2.0, height: 1.2 },
      { angle: Math.PI * 0.85, radius: 2.0, height: 1.6 },
      { angle: Math.PI * 1.5, radius: 2.0, height: 0.8 },
      { angle: Math.PI * 1.85, radius: 2.0, height: 1.4 },
    ],
    [],
  );

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 3]} intensity={2} color="#fcd34d" />
      <pointLight position={[-3, 2, 3]} intensity={1.5} color="#34d399" />
      <pointLight position={[0, -2, 2]} intensity={1} color="#a7f3d0" />

      <CultivatorFigure color="#34d399" />

      {treasures.map((t, i) => (
        <OrbitingTreasure key={i} {...t} />
      ))}
      {swords.map((s, i) => (
        <OrbitingSword key={i} {...s} />
      ))}

      <Sparkles count={120} scale={6} size={3} speed={0.4} color="#34d399" />
      <Sparkles count={60} scale={4} size={2} speed={0.6} color="#fcd34d" />
    </>
  );
};

interface Cultivator3DProps {
  className?: string;
}

export const Cultivator3D = ({ className }: Cultivator3DProps) => (
  <div className={`relative ${className ?? ""}`}>
    {/* Dharma aura layer (background) */}
    <div className="absolute inset-0">
      <DharmaAura variant="jade" showCore={false} className="w-full h-full" />
    </div>
    {/* Cultivator layer (foreground) */}
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <CultivatorScene />
        </Suspense>
      </Canvas>
    </div>
  </div>
);

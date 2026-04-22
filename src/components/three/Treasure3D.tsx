import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ============ TREASURE 3D — kim đan, kiếm, bát quái, ngọc bội ============ */

const FloatingShape = ({ children }: { children: React.ReactNode }) => (
  <Float floatIntensity={0.6} rotationIntensity={0.4} speed={1.5}>
    {children}
  </Float>
);

/* --- Kiếm bay --- */
const FlyingSword = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <group ref={ref}>
      <FloatingShape>
        <group rotation={[0, 0, Math.PI / 4]}>
          {/* Lưỡi kiếm */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.12, 1.6, 0.04]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} metalness={0.9} roughness={0.1} toneMapped={false} />
          </mesh>
          {/* Mũi kiếm */}
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.08, 0.3, 4]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} metalness={0.9} roughness={0.1} toneMapped={false} />
          </mesh>
          {/* Cán */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
            <meshStandardMaterial color="#7c2d12" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Hộ thủ */}
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.4, 0.06, 0.1]} />
            <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={0.6} metalness={1} roughness={0.2} toneMapped={false} />
          </mesh>
        </group>
      </FloatingShape>
      <Sparkles count={30} scale={2} size={2} speed={0.6} color={color} />
    </group>
  );
};

/* --- Đan dược --- */
const PillCauldron = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime;
      ref.current.rotation.y = t * 0.8;
      const scale = 1 + Math.sin(t * 2) * 0.1;
      ref.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <group>
      <FloatingShape>
        <mesh ref={ref}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} metalness={0.3} roughness={0.2} toneMapped={false} />
        </mesh>
        {/* Halo ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.04, 16, 64]} />
          <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </FloatingShape>
      <Sparkles count={50} scale={2.5} size={3} speed={0.8} color={color} />
    </group>
  );
};

/* --- Bát quái pháp khí --- */
const BaguaDisc = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 0.6;
      ref.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.3;
    }
  });
  return (
    <group>
      <FloatingShape>
        <group ref={ref}>
          {/* Disc */}
          <mesh>
            <cylinderGeometry args={[1, 1, 0.08, 64]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} toneMapped={false} />
          </mesh>
          {/* 8 trigrams */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.7, 0.05, Math.sin(angle) * 0.7]}>
                <boxGeometry args={[0.18, 0.04, 0.06]} />
                <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2} toneMapped={false} />
              </mesh>
            );
          })}
          {/* Center yin-yang */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
            <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        </group>
      </FloatingShape>
      <Sparkles count={40} scale={2.5} size={2} speed={0.5} color={color} />
    </group>
  );
};

/* --- Quyển bí kíp --- */
const SpiritScroll = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.5;
  });
  return (
    <group>
      <FloatingShape>
        <group ref={ref}>
          {/* Scroll body */}
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 1.6, 32]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fcd34d" emissiveIntensity={0.3} roughness={0.6} />
          </mesh>
          {/* End caps */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.9} roughness={0.2} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.85, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.9} roughness={0.2} toneMapped={false} />
          </mesh>
          {/* Glowing runes spinning around */}
          <RuneOrbit color={color} />
        </group>
      </FloatingShape>
      <Sparkles count={45} scale={2.5} size={2.5} speed={0.6} color={color} />
    </group>
  );
};

const RuneOrbit = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 1.2;
  });
  const dots = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <group ref={ref}>
      {dots.map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/* --- Linh thú orb --- */
const SpiritBeastOrb = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime;
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.x = t * 0.3;
    }
  });
  return (
    <group>
      <FloatingShape>
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} wireframe metalness={0.5} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.6} toneMapped={false} />
        </mesh>
        {/* Orbiting energy */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[1, 0.03, 16, 64]} />
          <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </FloatingShape>
      <Sparkles count={60} scale={3} size={2.5} speed={0.7} color={color} />
    </group>
  );
};

/* ============ Main exported component ============ */

export type TreasureKind = "sword" | "pill" | "bagua" | "scroll" | "beast";

const renderers: Record<TreasureKind, (color: string) => JSX.Element> = {
  sword: (c) => <FlyingSword color={c} />,
  pill: (c) => <PillCauldron color={c} />,
  bagua: (c) => <BaguaDisc color={c} />,
  scroll: (c) => <SpiritScroll color={c} />,
  beast: (c) => <SpiritBeastOrb color={c} />,
};

interface Treasure3DProps {
  kind: TreasureKind;
  color?: string;
  className?: string;
}

export const Treasure3D = ({ kind, color = "#34d399", className }: Treasure3DProps) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color={color} />
      <pointLight position={[-3, -3, 3]} intensity={1} color="#fcd34d" />
      {renderers[kind](color)}
    </Canvas>
  </div>
);

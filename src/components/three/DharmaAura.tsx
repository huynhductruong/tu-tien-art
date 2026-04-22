import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ============ DHARMA AURA — vòng tròn rune + hạt sáng + aura xoay ============ */

const RuneTickRing = ({
  radius,
  speed,
  count,
  color,
  tilt = [0, 0, 0],
}: {
  radius: number;
  speed: number;
  count: number;
  color: string;
  tilt?: [number, number, number];
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  const items = useMemo(() => Array.from({ length: count }), [count]);
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        {/* The ring torus */}
        <mesh>
          <torusGeometry args={[radius, 0.015, 16, 128]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        {/* Ticks distributed around the ring */}
        {items.map((_, i) => {
          const angle = (i / count) * Math.PI * 2;
          const isMajor = i % 4 === 0;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={isMajor ? [0.22, 0.06, 0.05] : [0.12, 0.04, 0.03]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isMajor ? 2.5 : 1.5} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

const FloatingDots = ({ radius, count, color }: { radius: number; count: number; color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * 0.1;
  });
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          phase: Math.random() * Math.PI * 2,
        };
      }),
    [count, radius],
  );
  return (
    <group ref={ref}>
      {items.map((p, i) => (
        <FloatingDot key={i} {...p} color={color} />
      ))}
    </group>
  );
};

const FloatingDot = ({ x, y, phase, color }: { x: number; y: number; phase: number; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime;
      ref.current.position.z = Math.sin(t * 1.5 + phase) * 0.3;
      const intensity = 1 + Math.sin(t * 2 + phase) * 0.5;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 2;
    }
  });
  return (
    <mesh ref={ref} position={[x, y, 0]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
};

const AuraCore = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      const scale = 1 + Math.sin(t * 1.2) * 0.1;
      ref.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
};

const Mandala = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.05;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, -0.5]} rotation={[0, 0, angle]}>
            <ringGeometry args={[0.15, 0.4, 16, 1, 0, Math.PI / 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

const colorMap = {
  jade: { primary: "#34d399", secondary: "#fcd34d", accent: "#a7f3d0", core: "#6ee7b7" },
  gold: { primary: "#fcd34d", secondary: "#34d399", accent: "#fef3c7", core: "#fde68a" },
  crimson: { primary: "#fb7185", secondary: "#fcd34d", accent: "#fecaca", core: "#fda4af" },
} as const;

interface DharmaAuraProps {
  variant?: keyof typeof colorMap;
  showCore?: boolean;
  className?: string;
}

const DharmaScene = ({ variant, showCore }: { variant: keyof typeof colorMap; showCore: boolean }) => {
  const colors = colorMap[variant];
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.8} color={colors.primary} />
      <pointLight position={[-5, -5, 5]} intensity={1.2} color={colors.secondary} />

      {showCore && <AuraCore color={colors.core} />}
      <Mandala color={colors.primary} />

      <RuneTickRing radius={2.0} speed={0.35} count={16} color={colors.primary} />
      <RuneTickRing radius={2.5} speed={-0.25} count={20} color={colors.secondary} tilt={[Math.PI / 5, Math.PI / 6, 0]} />
      <RuneTickRing radius={3.0} speed={0.18} count={24} color={colors.accent} tilt={[-Math.PI / 4, Math.PI / 4, 0]} />
      <RuneTickRing radius={3.5} speed={-0.12} count={28} color={colors.primary} tilt={[Math.PI / 3, -Math.PI / 5, 0]} />

      <FloatingDots radius={1.6} count={10} color={colors.secondary} />
      <FloatingDots radius={2.8} count={14} color={colors.primary} />

      <Sparkles count={150} scale={7} size={3} speed={0.5} color={colors.primary} />
      <Sparkles count={80} scale={5} size={2} speed={0.7} color={colors.secondary} />
    </>
  );
};

export const DharmaAura = ({ variant = "jade", showCore = true, className }: DharmaAuraProps) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <DharmaScene variant={variant} showCore={showCore} />
    </Canvas>
  </div>
);

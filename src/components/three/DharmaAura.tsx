import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Text3D, Center } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

/* ============ DHARMA AURA — vòng tròn rune + hạt sáng + aura xoay ============ */

const RuneRing = ({ radius, speed, runes, color }: { radius: number; speed: number; runes: string; color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  const chars = runes.split("");
  return (
    <group ref={ref}>
      {chars.map((char, i) => {
        const angle = (i / chars.length) * Math.PI * 2;
        return (
          <group
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <Suspense fallback={null}>
              <Center>
                <Text3D
                  font="/fonts/helvetiker_regular.typeface.json"
                  size={0.18}
                  height={0.02}
                  curveSegments={4}
                >
                  {char}
                  <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.2}
                    toneMapped={false}
                  />
                </Text3D>
              </Center>
            </Suspense>
          </group>
        );
      })}
    </group>
  );
};

const SimpleRuneRing = ({ radius, speed, count, color }: { radius: number; speed: number; count: number; color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  const items = useMemo(() => Array.from({ length: count }), [count]);
  return (
    <group ref={ref}>
      {/* The ring itself */}
      <mesh>
        <torusGeometry args={[radius, 0.018, 16, 128]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {items.map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <boxGeometry args={[0.15, 0.05, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const AuraCore = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.08;
      ref.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.3, 64, 64]} />
      <meshBasicMaterial color="#6ee7b7" transparent opacity={0.18} />
    </mesh>
  );
};

interface DharmaAuraProps {
  /** Tone of the aura. */
  variant?: "jade" | "gold" | "crimson";
  /** Show glowing core */
  showCore?: boolean;
  className?: string;
}

const colorMap = {
  jade: { primary: "#34d399", secondary: "#fcd34d", accent: "#a7f3d0" },
  gold: { primary: "#fcd34d", secondary: "#34d399", accent: "#fef3c7" },
  crimson: { primary: "#fb7185", secondary: "#fcd34d", accent: "#fecaca" },
};

const DharmaScene = ({ variant = "jade", showCore = true }: { variant: DharmaAuraProps["variant"]; showCore: boolean }) => {
  const colors = colorMap[variant!];
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={colors.primary} />
      <pointLight position={[-5, -5, 5]} intensity={1} color={colors.secondary} />

      {showCore && <AuraCore />}

      {/* Concentric rotating rings */}
      <SimpleRuneRing radius={2.2} speed={0.3} count={12} color={colors.primary} />
      <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <SimpleRuneRing radius={2.6} speed={-0.2} count={16} color={colors.secondary} />
      </group>
      <group rotation={[-Math.PI / 5, Math.PI / 3, 0]}>
        <SimpleRuneRing radius={3.0} speed={0.15} count={20} color={colors.accent} />
      </group>

      {/* Runes ring (text) */}
      <Float floatIntensity={0.4} rotationIntensity={0.2} speed={1}>
        <RuneRing radius={1.7} speed={-0.4} runes="道法自然天人合一玄真清虚" color={colors.primary} />
      </Float>

      {/* Sparkles all around */}
      <Sparkles count={120} scale={6} size={3} speed={0.4} color={colors.primary} />
      <Sparkles count={60} scale={4} size={2} speed={0.6} color={colors.secondary} />
    </>
  );
};

export const DharmaAura = ({ variant = "jade", showCore = true, className }: DharmaAuraProps) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <DharmaScene variant={variant} showCore={showCore} />
    </Canvas>
  </div>
);

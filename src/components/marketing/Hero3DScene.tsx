
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Sphere, Ring } from '@react-three/drei';
import { Globe3D } from './Globe3D';
import { FinancialHologram } from './FinancialHologram';
import * as THREE from 'three';

interface Hero3DSceneProps {
  className?: string;
}

function AnimatedRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Ring args={[2.5, 2.6, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#3B968F" transparent opacity={0.3} />
      </Ring>
      <Ring args={[3, 3.1, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.2} />
      </Ring>
      <Ring args={[3.5, 3.6, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#3B968F" transparent opacity={0.1} />
      </Ring>
    </group>
  );
}

function USDTParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Sphere
            args={[0.02]}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
            ]}
          >
            <meshBasicMaterial color="#26A17B" />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#E8FDFF" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#3B968F"
        castShadow
      />
      <pointLight
        position={[-5, -5, -5]}
        intensity={0.5}
        color="#00D4FF"
      />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.8}
        color="#FFFFFF"
        angle={Math.PI / 4}
        penumbra={1}
        castShadow
      />
    </>
  );
}

export function Hero3DScene({ className = "" }: Hero3DSceneProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneLighting />
          <Stars
            radius={100}
            depth={50}
            count={2000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          
          <Globe3D />
          <AnimatedRings />
          <USDTParticles />
          <FinancialHologram />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            maxDistance={10}
            minDistance={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

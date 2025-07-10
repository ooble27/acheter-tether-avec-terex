
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, OrbitControls, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

function USDTCoin({ position }: { position: [number, number, number] }) {
  const coinRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.01;
      coinRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={coinRef} position={position}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#26A17B" metalness={0.8} roughness={0.2} />
        
        {/* Logo USDT sur la face */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Texte USDT */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <textGeometry args={['USDT', { font: undefined, size: 0.15, height: 0.01 }]} />
          <meshStandardMaterial color="#26A17B" />
        </mesh>
      </mesh>
    </Float>
  );
}

function TerexOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.005;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial 
          color="#3B968F" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#3B968F"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function ParticleRing() {
  const ringRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      temp.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.2,
        color: Math.random() > 0.5 ? "#3B968F" : "#4BA89F"
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={ringRef}>
      {particles.map((particle, i) => (
        <Float key={i} speed={2 + Math.random()} rotationIntensity={0.5}>
          <mesh position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color={particle.color} 
              metalness={0.8} 
              roughness={0.2}
              emissive={particle.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#3B968F" intensity={0.5} />
      
      {/* Orbe central Terex */}
      <TerexOrb />
      
      {/* Pièces USDT flottantes */}
      <USDTCoin position={[-3, 2, 1]} />
      <USDTCoin position={[3, -1, 2]} />
      <USDTCoin position={[1, 3, -2]} />
      <USDTCoin position={[-2, -2, -1]} />
      
      {/* Anneau de particules */}
      <ParticleRing />
      
      {/* Anneaux décoratifs */}
      <Float speed={0.5} rotationIntensity={0.1}>
        <Ring args={[3.5, 3.7, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#3B968F" transparent opacity={0.3} />
        </Ring>
      </Float>
      
      <Float speed={0.3} rotationIntensity={0.1}>
        <Ring args={[5, 5.2, 32]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#4BA89F" transparent opacity={0.2} />
        </Ring>
      </Float>
      
      {/* Contrôles de caméra */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function ModernCrypto3D() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Effet de fond avec gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-terex-accent/10 via-transparent to-transparent" />
      
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
      
      {/* Overlay avec effets de lumière */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-16 h-16 bg-terex-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-8 w-12 h-12 bg-terex-accent-light/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-terex-accent/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

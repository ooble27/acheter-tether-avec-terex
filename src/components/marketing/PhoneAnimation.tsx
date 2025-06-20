import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

function Phone() {
  const phoneRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (phoneRef.current) {
      // Animation de rotation douce
      phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      phoneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={phoneRef}>
      {/* Corps du téléphone */}
      <RoundedBox
        args={[2, 4, 0.2]}
        radius={0.2}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Écran noir */}
      <RoundedBox
        ref={screenRef}
        args={[1.8, 3.6, 0.05]}
        radius={0.15}
        smoothness={4}
        position={[0, 0, 0.13]}
      >
        <meshStandardMaterial color="#000000" />
      </RoundedBox>
      
      {/* Interface Terex - Fond */}
      <RoundedBox
        args={[1.7, 3.4, 0.01]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0.16]}
      >
        <meshStandardMaterial color="#0F172A" />
      </RoundedBox>
      
      {/* Logo TEREX */}
      <Text
        position={[0, 1.2, 0.17]}
        fontSize={0.3}
        color="#3B968F"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        TEREX
      </Text>
      
      {/* Bouton principal */}
      <RoundedBox
        args={[1.4, 0.4, 0.01]}
        radius={0.05}
        position={[0, 0.5, 0.17]}
      >
        <meshStandardMaterial color="#3B968F" />
      </RoundedBox>
      
      {/* Éléments d'interface */}
      <RoundedBox
        args={[1.4, 0.3, 0.01]}
        radius={0.05}
        position={[0, 0, 0.17]}
      >
        <meshStandardMaterial color="#374151" />
      </RoundedBox>
      
      <RoundedBox
        args={[1.4, 0.3, 0.01]}
        radius={0.05}
        position={[0, -0.4, 0.17]}
      >
        <meshStandardMaterial color="#374151" />
      </RoundedBox>
      
      {/* Texte de l'app */}
      <Text
        position={[0, -1, 0.17]}
        fontSize={0.15}
        color="#3B968F"
        anchorX="center"
        anchorY="middle"
      >
        USDT Exchange
      </Text>
    </group>
  );
}

export function PhoneAnimation() {
  return (
    <div className="w-full h-80 relative">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <Phone />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Effet de glow */}
      <div className="absolute inset-0 bg-gradient-radial from-terex-accent/20 via-transparent to-transparent blur-3xl" />
    </div>
  );
}

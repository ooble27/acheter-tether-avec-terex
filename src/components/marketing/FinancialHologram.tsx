
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface HologramData {
  title: string;
  value: string;
  position: [number, number, number];
  color: string;
}

const financialData: HologramData[] = [
  { title: "USDT/CFA", value: "655.50", position: [-3, 2, 1], color: "#3B968F" },
  { title: "Transferts", value: "24/7", position: [3, 1.5, -1], color: "#00D4FF" },
  { title: "Pays", value: "6", position: [-2.5, -1.5, 2], color: "#26A17B" },
  { title: "Commission", value: "0%", position: [2.8, -1, 1.5], color: "#E8FDFF" },
];

function HologramCard({ data }: { data: HologramData }) {
  const cardRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.lookAt(0, 0, 0);
      
      // Subtle floating animation
      const time = state.clock.elapsedTime;
      cardRef.current.position.y = data.position[1] + Math.sin(time + data.position[0]) * 0.1;
    }
    
    if (glowRef.current) {
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.2}
    >
      <group ref={cardRef} position={data.position}>
        {/* Glow effect background */}
        <Plane ref={glowRef} args={[1.2, 0.8]}>
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </Plane>
        
        {/* Card background */}
        <Plane args={[1, 0.6]} position={[0, 0, 0.01]}>
          <meshBasicMaterial
            color="#0A0A0B"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </Plane>
        
        {/* Border */}
        <Box args={[1, 0.6, 0.01]} position={[0, 0, 0.005]}>
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.4}
            wireframe
          />
        </Box>
        
        {/* Title text */}
        <Text
          position={[0, 0.1, 0.02]}
          fontSize={0.08}
          color="#E8FDFF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {data.title}
        </Text>
        
        {/* Value text */}
        <Text
          position={[0, -0.1, 0.02]}
          fontSize={0.12}
          color={data.color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {data.value}
        </Text>
      </group>
    </Float>
  );
}

function FloatingUSDTLogo() {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float
      speed={0.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group ref={logoRef} position={[0, 3, 0]}>
        {/* USDT Ring */}
        <mesh>
          <torusGeometry args={[0.3, 0.05, 16, 100]} />
          <meshBasicMaterial
            color="#26A17B"
            emissive="#26A17B"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Center dot */}
        <mesh>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial
            color="#26A17B"
            emissive="#26A17B"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* USDT Text */}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.1}
          color="#26A17B"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          USDT
        </Text>
      </group>
    </Float>
  );
}

export function FinancialHologram() {
  return (
    <group>
      {financialData.map((data, index) => (
        <HologramCard key={index} data={data} />
      ))}
      <FloatingUSDTLogo />
    </group>
  );
}


import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Line, OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// Globe component with rotating Earth
function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 32]} position={[0, 0, 0]}>
      <meshPhongMaterial
        color="#3B968F"
        transparent
        opacity={0.8}
        emissive="#1a5c56"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

// Data flow lines connecting continents
function DataFlows() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
    }
  });

  const flows = useMemo(() => {
    const points = [
      // Europe to Africa flows
      [new THREE.Vector3(0.5, 1, 1.5), new THREE.Vector3(0, -1, 1.8)],
      [new THREE.Vector3(-0.3, 0.8, 1.6), new THREE.Vector3(0.2, -1.2, 1.7)],
      // North America to Africa flows
      [new THREE.Vector3(-1.5, 0.5, 1), new THREE.Vector3(0.3, -1, 1.9)],
      // Asia to Africa flows
      [new THREE.Vector3(1.8, 0.3, 0.5), new THREE.Vector3(0.5, -1.1, 1.6)],
    ];
    
    return points.map((points, index) => (
      <Line
        key={index}
        points={points}
        color="#26A17B"
        lineWidth={3}
        transparent
        opacity={0.8}
      />
    ));
  }, []);

  return <group ref={linesRef}>{flows}</group>;
}

// Floating USDT particles
function USDTParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.005;
      particlesRef.current.children.forEach((child, index) => {
        const time = state.clock.elapsedTime;
        child.position.y = Math.sin(time + index) * 0.2;
      });
    }
  });

  const particles = useMemo(() => {
    const positions: [number, number, number][] = [
      [3, 0.5, 0],
      [-2.5, 1, 1],
      [1.5, -1, 2],
      [-1, -0.5, -2.5],
      [2, 1.5, -1],
    ];
    
    return positions.map((pos, index) => (
      <Sphere key={index} args={[0.1, 16, 16]} position={pos}>
        <meshStandardMaterial 
          color="#26A17B" 
          emissive="#26A17B" 
          emissiveIntensity={0.5} 
        />
      </Sphere>
    ));
  }, []);

  return <group ref={particlesRef}>{particles}</group>;
}

// Orbiting rings
function OrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.x += 0.01;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.008;
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.02, 8, 100]} />
        <meshBasicMaterial color="#3B968F" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.015, 8, 100]} />
        <meshBasicMaterial color="#26A17B" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

// Main 3D Scene
export function Globe3D() {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3B968F" intensity={0.5} />
        
        <Stars
          radius={300}
          depth={60}
          count={1000}
          factor={7}
          saturation={0}
          fade
          speed={0.5}
        />
        
        <EarthGlobe />
        <DataFlows />
        <USDTParticles />
        <OrbitRings />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

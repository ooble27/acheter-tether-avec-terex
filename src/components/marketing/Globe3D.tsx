
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CountryPoint {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

const africaCountries: CountryPoint[] = [
  { name: "Sénégal", lat: 14.6928, lng: -17.4467, color: "#3B968F" },
  { name: "Côte d'Ivoire", lat: 7.5400, lng: -5.5471, color: "#3B968F" },
  { name: "Mali", lat: 17.5707, lng: -3.9962, color: "#3B968F" },
  { name: "Burkina Faso", lat: 12.2383, lng: -1.5616, color: "#3B968F" },
  { name: "Niger", lat: 17.6078, lng: 8.0817, color: "#3B968F" },
  { name: "Nigeria", lat: 9.0765, lng: 8.6753, color: "#3B968F" },
];

function latLngToVector3(lat: number, lng: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function CountryMarker({ country, globeRadius }: { country: CountryPoint; globeRadius: number }) {
  const markerRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(country.lat, country.lng, globeRadius + 0.05);
  
  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + country.lat) * 0.2;
      markerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <Sphere ref={markerRef} args={[0.02]}>
        <meshBasicMaterial color={country.color} />
      </Sphere>
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.05}
        color="#E8FDFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {country.name}
      </Text>
    </group>
  );
}

function ConnectionArcs() {
  const arcsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (arcsRef.current) {
      arcsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const arcs = useMemo(() => {
    const arcGeometries = [];
    
    for (let i = 0; i < africaCountries.length - 1; i++) {
      const start = latLngToVector3(africaCountries[i].lat, africaCountries[i].lng, 1.1);
      const end = latLngToVector3(africaCountries[i + 1].lat, africaCountries[i + 1].lng, 1.1);
      
      const curve = new THREE.QuadraticBezierCurve3(
        start,
        start.clone().lerp(end, 0.5).multiplyScalar(1.3),
        end
      );
      
      const geometry = new THREE.TubeGeometry(curve, 20, 0.005, 8, false);
      arcGeometries.push(geometry);
    }
    
    return arcGeometries;
  }, []);

  return (
    <group ref={arcsRef}>
      {arcs.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial 
            color="#00D4FF" 
            transparent 
            opacity={0.6}
            emissive="#00D4FF"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Globe3D() {
  const globeRef = useRef<THREE.Mesh>(null);
  const globeRadius = 1;
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Create a simple Earth-like texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient for Earth-like appearance
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.3, '#3B968F'); // Terex green for land
    gradient.addColorStop(0.7, '#228B22'); // Forest green
    gradient.addColorStop(1, '#1E90FF'); // Deep blue
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Add some continent-like shapes
    ctx.fillStyle = '#2F4F2F';
    ctx.fillRect(100, 80, 150, 80); // Africa-like shape
    ctx.fillRect(300, 60, 120, 100);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      <Sphere ref={globeRef} args={[globeRadius, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          transparent
          opacity={0.9}
          emissive="#0A0A0B"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {africaCountries.map((country, index) => (
        <CountryMarker 
          key={index} 
          country={country} 
          globeRadius={globeRadius} 
        />
      ))}
      
      <ConnectionArcs />
    </group>
  );
}

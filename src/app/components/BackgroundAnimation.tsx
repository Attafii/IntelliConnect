'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedSpheres() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(100)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            Math.sin(i) * 10,
            Math.cos(i) * 10,
            Math.sin(i + Math.PI) * 10,
          ]}          scale={0.05}
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4299e1"
            transparent
            opacity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
}

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 20] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <AnimatedSpheres />
      </Canvas>
    </div>
  );
}

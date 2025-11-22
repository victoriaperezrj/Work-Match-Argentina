import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField({ mousePosition }) {
  const pointsRef = useRef();
  const particleCount = 1000;

  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }

    return positions;
  }, []);

  // Store original positions for smooth mouse interaction
  const originalPositions = useMemo(() => positions.slice(), [positions]);

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Original position
      const originalX = originalPositions[i3];
      const originalY = originalPositions[i3 + 1];
      const originalZ = originalPositions[i3 + 2];

      // Gentle floating animation
      const floatY = Math.sin(time * 0.3 + i * 0.1) * 0.1;
      const floatX = Math.cos(time * 0.2 + i * 0.15) * 0.05;

      // Mouse interaction - subtle repulsion
      const mouseInfluence = 2;
      const dx = originalX - mousePosition.x * 10;
      const dy = originalY - mousePosition.y * 10;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - distance / mouseInfluence);

      const pushX = dx * force * 0.3;
      const pushY = dy * force * 0.3;

      // Apply all transformations
      positions[i3] = originalX + floatX + pushX;
      positions[i3 + 1] = originalY + floatY + pushY;
      positions[i3 + 2] = originalZ + Math.sin(time * 0.5 + i * 0.05) * 0.1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Gentle rotation
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4285F4"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectionLines({ mousePosition }) {
  const linesRef = useRef();
  const lineCount = 50;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(lineCount * 6); // 2 points per line
    const colors = new Float32Array(lineCount * 6); // RGB for each point

    for (let i = 0; i < lineCount; i++) {
      // Random line positions
      positions[i * 6] = (Math.random() - 0.5) * 15;
      positions[i * 6 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 6 + 2] = (Math.random() - 0.5) * 8;

      positions[i * 6 + 3] = (Math.random() - 0.5) * 15;
      positions[i * 6 + 4] = (Math.random() - 0.5) * 15;
      positions[i * 6 + 5] = (Math.random() - 0.5) * 8;

      // Gradient colors (cyan to purple)
      const color1 = new THREE.Color(0x00BCD4);
      const color2 = new THREE.Color(0x9C27B0);

      colors[i * 6] = color1.r;
      colors[i * 6 + 1] = color1.g;
      colors[i * 6 + 2] = color1.b;

      colors[i * 6 + 3] = color2.r;
      colors[i * 6 + 4] = color2.g;
      colors[i * 6 + 5] = color2.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle opacity pulsing
    linesRef.current.material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={lineCount * 2}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function InteractiveParticles() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField mousePosition={mousePosition.current} />
        <ConnectionLines mousePosition={mousePosition.current} />
      </Canvas>
    </div>
  );
}

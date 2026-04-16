"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float, OrbitControls, Center } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

function CorticalPoints({ scene, color }: { scene: THREE.Group; color: number }) {
  // Extract all geometries safely from the nested GLTF scene
  const meshes = useMemo(() => {
    const arr: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        arr.push(child as THREE.Mesh);
      }
    });
    return arr;
  }, [scene]);

  return (
    <group>
      {meshes.map((mesh, i) => (
        <points
          key={i}
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        >
          <pointsMaterial
            size={0.6}
            color={color}
            transparent
            opacity={0.7}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  );
}

function UnifiedBrain() {
  const leftBrain = useGLTF("/models/brain-left-hemisphere-1b9f386f.glb");
  const rightBrain = useGLTF("/models/brain-right-hemisphere-f0dea562.glb");

  return (
    <Center scale={0.5}>
      <group>
        <CorticalPoints scene={leftBrain.scene} color={0x00ffff} />
        <CorticalPoints scene={rightBrain.scene} color={0x00ffff} />
      </group>
    </Center>
  );
}

export function BrainModel() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing hover:opacity-100 opacity-80 transition-opacity">
      <Canvas
        camera={{ position: [0, 0, 120], fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <UnifiedBrain />
          </Float>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/brain-left-hemisphere-1b9f386f.glb");
useGLTF.preload("/models/brain-right-hemisphere-f0dea562.glb");

"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float, OrbitControls, Center } from "@react-three/drei";
import { Suspense, useMemo, useEffect } from "react";
import * as THREE from "three";

function CorticalPoints({ scene, color, skipCount = 4 }: { scene: THREE.Group; color: number, skipCount?: number }) {
  const pointsGeometries = useMemo(() => {
    const arr: { geo: THREE.BufferGeometry, position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3 }[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const oldPositions = mesh.geometry.attributes.position.array;
        const newPositions = [];

        for (let j = 0; j < oldPositions.length; j += 3 * skipCount) {
          newPositions.push(oldPositions[j], oldPositions[j + 1], oldPositions[j + 2]);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        geo.computeBoundingSphere();
        geo.computeBoundingBox();

        arr.push({
          geo,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale
        });
      }
    });
    return arr;
  }, [scene, skipCount]);

  return (
    <group>
      {pointsGeometries.map((item, i) => (
        <points
          key={i}
          geometry={item.geo}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <pointsMaterial
            size={0.8}
            color={color}
            transparent={true}
            opacity={0.9}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      ))}
    </group>
  );
}

function CompositeModel() {
  const leftBrain = useGLTF("/models/brain-left-hemisphere-1b9f386f.glb");
  const rightBrain = useGLTF("/models/brain-right-hemisphere-f0dea562.glb");
  const headModel = useGLTF("/models/head-9ddb57ac.glb");

  useEffect(() => {
    const headMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.4,
      transmission: 0.9,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    headModel.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = headMaterial;
      }
    });
  }, [headModel]);

  return (
    <Center scale={0.55}>
      <group>
        <group rotation={[0, Math.PI / 2, 0]} position={[-5, 12, 0]}>
          <CorticalPoints scene={leftBrain.scene} color={0xffffff} skipCount={1} />
          <CorticalPoints scene={rightBrain.scene} color={0xffffff} skipCount={1} />
        </group>

        <group scale={110} position={[0, -42, -6]}>
          <primitive object={headModel.scene} />
        </group>
      </group>
    </Center>
  );
}

export function BrainModel() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing hover:opacity-100 opacity-90 transition-opacity z-10 pointer-events-auto md:translate-x-[10%] md:-translate-y-[5%]">
      <Canvas
        camera={{ position: [0, 0, 160], fov: 50, near: 0.1, far: 3000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={5} />
        <spotLight position={[-50, -50, -50]} angle={0.2} penumbra={1} intensity={2} />
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
            <CompositeModel />
          </Float>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/brain-left-hemisphere-1b9f386f.glb");
useGLTF.preload("/models/brain-right-hemisphere-f0dea562.glb");
useGLTF.preload("/models/head-9ddb57ac.glb");

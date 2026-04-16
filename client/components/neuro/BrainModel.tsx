"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useEffect } from "react";
import * as THREE from "three";

function CorticalPoints({ scene, color, skipCount = 8 }: { scene: THREE.Group; color: number; skipCount?: number }) {
  const pointsGeometries = useMemo(() => {
    const arr: { geo: THREE.BufferGeometry; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const oldPos = mesh.geometry.attributes.position.array;
        const newPos: number[] = [];
        for (let j = 0; j < oldPos.length; j += 3 * skipCount) {
          newPos.push(oldPos[j], oldPos[j + 1], oldPos[j + 2]);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(newPos, 3));
        geo.computeBoundingSphere();
        geo.computeBoundingBox();
        arr.push({ geo, position: mesh.position.clone(), rotation: mesh.rotation.clone(), scale: mesh.scale.clone() });
      }
    });
    return arr;
  }, [scene, skipCount]);

  return (
    <group>
      {pointsGeometries.map((item, i) => (
        <points key={i} geometry={item.geo} position={item.position} rotation={item.rotation} scale={item.scale}>
          <pointsMaterial
            size={0.5}
            color={color}
            transparent
            opacity={0.85}
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
      opacity: 0.2,
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
    <group scale={0.55}>
      <group rotation={[0, Math.PI / 2, 0]} position={[0, -15, 5]}>
        <CorticalPoints scene={leftBrain.scene} color={0x00ffff} skipCount={6} />
        <CorticalPoints scene={rightBrain.scene} color={0x00ffff} skipCount={6} />
      </group>

      <group scale={110} position={[0, -55, -6]}>
        <primitive object={headModel.scene} />
      </group>
    </group>
  );
}

export function BrainModel() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
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
          <CompositeModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/brain-left-hemisphere-1b9f386f.glb");
useGLTF.preload("/models/brain-right-hemisphere-f0dea562.glb");
useGLTF.preload("/models/head-9ddb57ac.glb");

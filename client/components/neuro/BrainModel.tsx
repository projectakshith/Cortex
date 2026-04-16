"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CorticalPoints({ scene, color, skipCount = 8, pulsate = false }: { scene: THREE.Group; color: number | string; skipCount?: number; pulsate?: boolean }) {
  const pointsGeometries = useMemo(() => {
    const arr: { geo: THREE.BufferGeometry; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3; phase: number }[] = [];
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
        arr.push({ geo, position: mesh.position.clone(), rotation: mesh.rotation.clone(), scale: mesh.scale.clone(), phase: Math.random() * Math.PI * 2 });
      }
    });
    return arr;
  }, [scene, skipCount]);

  const materialRefs = useRef<(THREE.PointsMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    if (pulsate) {
      const time = clock.getElapsedTime();
      pointsGeometries.forEach((item, i) => {
        const mat = materialRefs.current[i];
        if (mat) {
          const sine = (Math.sin(time * 3 + item.phase) + 1) / 2;
          // Interpolate primarily onto the Red channel
          mat.color.setRGB(1, 1 - sine, 1 - sine);
        }
      });
    }
  });

  return (
    <group>
      {pointsGeometries.map((item, i) => (
        <points key={i} geometry={item.geo} position={item.position} rotation={item.rotation} scale={item.scale}>
          <pointsMaterial
            ref={(el) => { materialRefs.current[i] = el; }}
            size={0.5}
            color={color as THREE.ColorRepresentation}
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

function LegacyBrainHeadComposite({ forceRed = false }: { forceRed?: boolean }) {
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
    <group scale={0.45}>
      <group rotation={[0, Math.PI / 2, 0]} position={[0, -15, 5]}>
        <CorticalPoints scene={leftBrain.scene} color={forceRed ? 0xff0000 : 0x00ffff} skipCount={6} pulsate={forceRed} />
        <CorticalPoints scene={rightBrain.scene} color={forceRed ? 0xff0000 : 0x00ffff} skipCount={6} pulsate={forceRed} />
      </group>
      <group scale={110} position={[0, -55, -6]}>
        <primitive object={headModel.scene} />
      </group>
    </group>
  );
}

function RawNeuralNetworkMesh() {
  const leftBrain = useGLTF("/models/brain-left-hemisphere-1b9f386f.glb");
  const rightBrain = useGLTF("/models/brain-right-hemisphere-f0dea562.glb");

  return (
    <group scale={0.45} position={[0, -10, 0]}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <CorticalPoints scene={leftBrain.scene} color={0xffffff} skipCount={3} pulsate={true} />
        <CorticalPoints scene={rightBrain.scene} color={0xffffff} skipCount={3} pulsate={true} />
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// DATA-DRIVEN HEATMAP MODEL (Meta TRIBE v2 BOLD)
// ----------------------------------------------------------------------------

function HeatmapHemisphere({ sceneUrl, binUrl, active }: { sceneUrl: string; binUrl: string; active: boolean }) {
  const { scene } = useGLTF(sceneUrl);
  const [colorsBuffer, setColorsBuffer] = useState<Uint8Array | null>(null);

  useEffect(() => {
    fetch(binUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => setColorsBuffer(new Uint8Array(buffer)))
      .catch((err) => console.warn("Failed to load binary tensor:", err));
  }, [binUrl]);

  const renderedScene = useMemo(() => {
    const cloned = scene.clone();
    let globalFaceOffset = 0;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        let geo = mesh.geometry.clone();

        if (active && colorsBuffer) {
          // Force geometry to be non-indexed purely to support face-colors
          if (geo.index) geo = geo.toNonIndexed();

          const numVertices = geo.attributes.position.count;
          const numFaces = numVertices / 3;

          const colorArray = new Uint8Array(numVertices * 3);
          for (let f = 0; f < numFaces; f++) {
            const bufIdx = (globalFaceOffset + f) * 3;
            if (bufIdx + 2 < colorsBuffer.length) {
              const r = colorsBuffer[bufIdx];
              const g = colorsBuffer[bufIdx + 1];
              const b = colorsBuffer[bufIdx + 2];

              // Apply extracted RGB across all exactly 3 vertices of the triangle face
              colorArray[f * 9 + 0] = r; colorArray[f * 9 + 1] = g; colorArray[f * 9 + 2] = b;
              colorArray[f * 9 + 3] = r; colorArray[f * 9 + 4] = g; colorArray[f * 9 + 5] = b;
              colorArray[f * 9 + 6] = r; colorArray[f * 9 + 7] = g; colorArray[f * 9 + 8] = b;
            }
          }
          geo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3, true));
          geo.computeVertexNormals();

          mesh.geometry = geo;
          mesh.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.6,
            metalness: 0.2,
            flatShading: true // Enforces faceted geometry perfectly capturing BOLD visuals
          });
          globalFaceOffset += numFaces;
        } else {
          mesh.geometry = geo;
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x888888, // Natural anatomical shadow grey
            roughness: 0.5,
            metalness: 0.1,
            flatShading: false // Suppress flat shading on natural meshes allowing standard PBR
          });
        }
      }
    });
    return cloned;
  }, [scene, colorsBuffer, active]);

  return <primitive object={renderedScene} />;
}

// ----------------------------------------------------------------------------
// EXPORTS
// ----------------------------------------------------------------------------

export function BrainModel() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 160], fov: 50, near: 0.1, far: 3000 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={5} />
        <spotLight position={[-50, -50, -50]} angle={0.2} penumbra={1} intensity={2} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
          <LegacyBrainHeadComposite forceRed={false} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function HUDHeadModel() {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 140], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.0} />
        <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={5} color="#ffffff" />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.0} />
          <LegacyBrainHeadComposite forceRed={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function PureBrainModel() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 120], fov: 50, near: 0.1, far: 3000 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={5} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={true} autoRotate autoRotateSpeed={3.0} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 1.2} />
          <RawNeuralNetworkMesh />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function SolidHeatmapBrain({ isProcessing, metricsSync = false }: { isProcessing: boolean, metricsSync?: boolean }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 100], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[100, 100, 100]} angle={0.3} penumbra={1} intensity={6} color="#ffffff" castShadow />
        <spotLight position={[-100, -10, 50]} angle={0.3} penumbra={1} intensity={3} color="#ffffff" />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={metricsSync ? 3.0 : 0.5} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />

          <group scale={0.3} position={[0, -5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <HeatmapHemisphere
              sceneUrl="/models/brain-left-hemisphere-1b9f386f.glb"
              binUrl="/models/vanessen-2023-timeline-0-start-750-left-hemisphere-face-colors-prediction.uint8rgb.bin"
              active={metricsSync}
            />
            <HeatmapHemisphere
              sceneUrl="/models/brain-right-hemisphere-f0dea562.glb"
              binUrl="/models/vanessen-2023-timeline-0-start-750-right-hemisphere-face-colors-prediction.uint8rgb.bin"
              active={metricsSync}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/brain-left-hemisphere-inflated-23f77205.glb");
useGLTF.preload("/models/brain-right-hemisphere-inflated-1ded8aca.glb");
useGLTF.preload("/models/brain-left-hemisphere-1b9f386f.glb");
useGLTF.preload("/models/brain-right-hemisphere-f0dea562.glb");
useGLTF.preload("/models/head-9ddb57ac.glb");

"use client";

import React, { useRef, useEffect, useState } from "react";
import type { Material } from "three";

// Dynamically import Three.js to avoid build-time resolution issues
let THREE: typeof import("three") | null = null;
let Canvas: any = null;
let useFrame: any = null;
let Float: any = null;
let Environment: any = null;
let PresentationControls: any = null;
let ContactShadows: any = null;

interface ThreeCanvasProps {
  modelPath?: string;
}

// Loading state component
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive-50 to-olive-100">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-olive-400/30 border-t-olive-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-olive-600/60 text-sm">Loading 3D...</p>
      </div>
    </div>
  );
}

// Static fallback when Three.js is unavailable
function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive-50 to-olive-100">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-olive-200 to-olive-300 flex items-center justify-center shadow-lg">
          <svg
            className="w-12 h-12 text-olive-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
        </div>
        <p className="text-olive-700 font-medium">Interactive 3D</p>
        <p className="text-olive-500/70 text-sm mt-1">Premium visual experience</p>
      </div>
    </div>
  );
}

// Abstract shape component using vanilla Three.js
function ThreeJSCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || !THREE) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7f0); // olive-50 equivalent
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xa3b18a, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Create geometry - Icosahedron (low-poly sphere)
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a5d23, // olive-600
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (meshRef.current) {
        meshRef.current.rotation.y += 0.003;
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
        meshRef.current.position.y = Math.sin(time) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        const material = meshRef.current.material as Material | Material[];
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: "300px" }}
    />
  );
}

export default function ThreeCanvas({ modelPath }: ThreeCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    // Dynamically import Three.js
    const loadThree = async () => {
      try {
        const threeModule = await import("three");
        THREE = threeModule;
        setIsLoaded(true);
      } catch (error) {
        // Silently handle Three.js load failure - fallback UI will display
        if (process.env.NODE_ENV === 'development') {
          console.warn("Three.js failed to load:", error);
        }
        setLoadFailed(true);
      }
    };

    loadThree();
  }, []);

  if (loadFailed) {
    return <StaticFallback />;
  }

  if (!isLoaded) {
    return <LoadingFallback />;
  }

  return <ThreeJSCanvas />;
}

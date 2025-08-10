// src/components/ProductStory.jsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Lottie from 'react-lottie-player';

// Make sure to have dna_helix.json and morphPath.json in src/assets/
import dnaHelix from '../assets/dna_helix.json';
import morphData from '../assets/morphPath.json';

gsap.registerPlugin(ScrollTrigger);

export default function ProductStory() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const morphRef = useRef();

  useEffect(() => {
    // Setup horizontal scroll of sections
    const sections = gsap.utils.toArray('.story-section');
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => '+=' + containerRef.current.offsetWidth,
      },
    });

    // Vertical fade-in animations on elements with "fade-in" class
    gsap.utils.toArray('.fade-in').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        }
      );
    });

    // SVG path morphing on scroll
    gsap.to(morphRef.current, {
      scrollTrigger: {
        trigger: morphRef.current,
        start: 'top center',
        scrub: true,
      },
      attr: { d: morphData.path2 }, // morph to second path
      duration: 3,
      ease: 'power2.inOut',
    });

    // Setup Three.js 3D scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background

    // Create geometry: Torus Knot
    const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Add light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 10;

    // Responsive resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex w-[400vw] h-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      {/* Section 1 */}
      <div className="story-section w-screen h-full flex flex-col items-center justify-center bg-black text-white text-4xl font-bold transition-transform duration-300 hover:scale-105">
        <svg width="200" height="200" viewBox="0 0 100 100">
          <path
            ref={morphRef}
            fill="#00ffff"
            d={morphData.path1}
            style={{ transition: 'd 0.3s ease-in-out' }}
          />
        </svg>
        <div className="fade-in">Gene Editing</div>
        <p className="fade-in text-lg mt-4 max-w-md text-gray-300">
          CRISPR-based precision editing to correct genetic defects at their
          root cause.
        </p>
        <Lottie
          loop
          animationData={dnaHelix}
          play
          style={{ width: 200, height: 200 }}
          className="fade-in"
        />
      </div>

      {/* Section 2 */}
      <div className="story-section w-screen h-full flex flex-col items-center justify-center bg-green-900 text-white text-4xl font-bold transition-transform duration-300 hover:scale-105">
        <div className="fade-in">Precision Medicine</div>
        <p className="fade-in text-lg mt-4 max-w-md text-gray-300">
          Personalized therapies tailored to your genetic profile.
        </p>
      </div>

      {/* Section 3 */}
      <div className="story-section w-screen h-full flex flex-col items-center justify-center bg-blue-900 text-white text-4xl font-bold transition-transform duration-300 hover:scale-105">
        <div className="fade-in">Bioinformatics</div>
        <p className="fade-in text-lg mt-4 max-w-md text-gray-300">
          Big data meets biology—making sense of genomic data like never before.
        </p>
      </div>

      {/* Section 4 */}
      <div className="story-section w-screen h-full flex flex-col items-center justify-center bg-purple-900 text-white text-4xl font-bold transition-transform duration-300 hover:scale-105">
        <div className="fade-in">Future of Life</div>
        <p className="fade-in text-lg mt-4 max-w-md text-gray-300">
          Innovating at the intersection of life science, tech, and AI.
        </p>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Creates a circular glowing soft sprite texture dynamically
 * for high-resolution anti-aliased 3D point rendering.
 */
const createGlowParticleTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const ParticleCanvas = ({ theme = "dark" }) => {
  const mountRef = useRef(null);
  const themeRef = useRef(theme);
  const updateThemeRef = useRef(null);

  useEffect(() => {
    themeRef.current = theme;
    if (updateThemeRef.current) {
      updateThemeRef.current(theme);
    }
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 2000);
    camera.position.set(0, 20, 240);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isLightInitial = themeRef.current === "light";
    const particleTexture = createGlowParticleTexture();

    // ==========================================
    // 2. 3D DIGITAL NEURAL WAVE TERRAIN
    // Positioned gracefully in lower-third
    // ==========================================
    const cols = 64;
    const rows = 40;
    const waveCount = cols * rows;
    const planeWidth = 1700;
    const planeDepth = 1100;

    const waveGeometry = new THREE.PlaneGeometry(planeWidth, planeDepth, cols - 1, rows - 1);
    waveGeometry.rotateX(-Math.PI * 0.48);
    waveGeometry.translate(0, -135, -70);

    const wavePosAttr = waveGeometry.attributes.position;
    const baseWavePositions = new Float32Array(wavePosAttr.array.length);
    baseWavePositions.set(wavePosAttr.array);

    // Gradient vertex colors along the wave
    const waveColors = new Float32Array(waveCount * 3);
    const applyWaveColors = (isLight) => {
      const colorA = isLight ? new THREE.Color("#2563eb") : new THREE.Color("#38bdf8");
      const colorB = isLight ? new THREE.Color("#4f46e5") : new THREE.Color("#3b82f6");
      const colorC = isLight ? new THREE.Color("#0284c7") : new THREE.Color("#818cf8");

      for (let i = 0; i < waveCount; i++) {
        const ratio = (i % cols) / cols;
        const color = ratio < 0.5 ? colorA.clone().lerp(colorB, ratio * 2) : colorB.clone().lerp(colorC, (ratio - 0.5) * 2);
        waveColors[i * 3] = color.r;
        waveColors[i * 3 + 1] = color.g;
        waveColors[i * 3 + 2] = color.b;
      }
      waveGeometry.setAttribute("color", new THREE.BufferAttribute(waveColors, 3));
      if (waveGeometry.attributes.color) {
        waveGeometry.attributes.color.needsUpdate = true;
      }
    };
    applyWaveColors(isLightInitial);

    // Wave Points Material
    const wavePointsMat = new THREE.PointsMaterial({
      size: isLightInitial ? 3.0 : 3.6,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: isLightInitial ? 0.45 : 0.8,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wavePoints = new THREE.Points(waveGeometry, wavePointsMat);
    scene.add(wavePoints);

    // Subtle Wave Wireframe Lattice
    const waveWireMat = new THREE.MeshBasicMaterial({
      color: isLightInitial ? 0x2563eb : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: isLightInitial ? 0.04 : 0.07,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    const waveMesh = new THREE.Mesh(waveGeometry, waveWireMat);
    scene.add(waveMesh);

    // ==========================================
    // 3. HOLOGRAPHIC GYROSCOPIC AI CORE
    // Framed gracefully to the right of header
    // ==========================================
    const coreGroup = new THREE.Group();
    const isMobile = width < 768;
    coreGroup.position.set(isMobile ? 0 : 160, isMobile ? 10 : 38, isMobile ? -50 : -35);
    if (isMobile) {
      coreGroup.scale.set(0.65, 0.65, 0.65);
    } else {
      coreGroup.scale.set(0.88, 0.88, 0.88);
    }
    scene.add(coreGroup);

    // Ring 1 (Outer Torus)
    const ring1Geo = new THREE.TorusGeometry(68, 0.65, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: isLightInitial ? 0x2563eb : 0x60a5fa,
      transparent: true,
      opacity: isLightInitial ? 0.4 : 0.38,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    // Ring 2 (Middle Counter-Rotating Torus)
    const ring2Geo = new THREE.TorusGeometry(54, 0.65, 16, 90);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: isLightInitial ? 0x4f46e5 : 0x38bdf8,
      transparent: true,
      opacity: isLightInitial ? 0.45 : 0.42,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.38;
    coreGroup.add(ring2);

    // Ring 3 (Inner Torus)
    const ring3Geo = new THREE.TorusGeometry(42, 0.6, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: isLightInitial ? 0x0284c7 : 0x818cf8,
      transparent: true,
      opacity: isLightInitial ? 0.35 : 0.32,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI * 0.45;
    coreGroup.add(ring3);

    // Inner Quantum Nucleus (Wireframe Icosahedron)
    const nucleusGeo = new THREE.IcosahedronGeometry(26, 1);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: isLightInitial ? 0x1d4ed8 : 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: isLightInitial ? 0.25 : 0.22,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    // Satellite Orbital Particles
    const satCount = 24;
    const satGeo = new THREE.BufferGeometry();
    const satPositions = new Float32Array(satCount * 3);
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 80 + (Math.random() - 0.5) * 6;
      satPositions[i * 3] = Math.cos(angle) * radius;
      satPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      satPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    satGeo.setAttribute("position", new THREE.BufferAttribute(satPositions, 3));
    const satMat = new THREE.PointsMaterial({
      size: isLightInitial ? 3.6 : 4.2,
      map: particleTexture,
      color: isLightInitial ? 0x2563eb : 0x60a5fa,
      transparent: true,
      opacity: isLightInitial ? 0.75 : 0.85,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    const satPoints = new THREE.Points(satGeo, satMat);
    coreGroup.add(satPoints);

    // ==========================================
    // 4. FLOATING COSMIC SYNAPSE SPARKS
    // ==========================================
    const cosmicCount = 220;
    const cosmicGeo = new THREE.BufferGeometry();
    const cosmicPositions = new Float32Array(cosmicCount * 3);
    const cosmicSpeeds = new Float32Array(cosmicCount);

    for (let i = 0; i < cosmicCount; i++) {
      cosmicPositions[i * 3] = (Math.random() - 0.5) * 650;
      cosmicPositions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      cosmicPositions[i * 3 + 2] = (Math.random() - 0.5) * 350;
      cosmicSpeeds[i] = 0.2 + Math.random() * 0.4;
    }
    cosmicGeo.setAttribute("position", new THREE.BufferAttribute(cosmicPositions, 3));

    const cosmicMat = new THREE.PointsMaterial({
      size: isLightInitial ? 2.6 : 3.0,
      map: particleTexture,
      color: isLightInitial ? 0x3b82f6 : 0x93c5fd,
      transparent: true,
      opacity: isLightInitial ? 0.45 : 0.65,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cosmicParticles = new THREE.Points(cosmicGeo, cosmicMat);
    scene.add(cosmicParticles);

    // ==========================================
    // 5. MOUSE & THEME INTERACTION
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 20;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
      targetCameraX = normX * 16;
      targetCameraY = 20 + normY * 10;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Dynamic Theme Switching
    updateThemeRef.current = (newTheme) => {
      const isLight = newTheme === "light";
      applyWaveColors(isLight);

      // Wave materials
      wavePointsMat.size = isLight ? 3.0 : 3.6;
      wavePointsMat.opacity = isLight ? 0.45 : 0.8;
      wavePointsMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      wavePointsMat.needsUpdate = true;

      waveWireMat.color.set(isLight ? 0x2563eb : 0x3b82f6);
      waveWireMat.opacity = isLight ? 0.04 : 0.07;
      waveWireMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      waveWireMat.needsUpdate = true;

      // Core Rings
      ring1Mat.color.set(isLight ? 0x2563eb : 0x60a5fa);
      ring1Mat.opacity = isLight ? 0.4 : 0.38;
      ring1Mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      ring1Mat.needsUpdate = true;

      ring2Mat.color.set(isLight ? 0x4f46e5 : 0x38bdf8);
      ring2Mat.opacity = isLight ? 0.45 : 0.42;
      ring2Mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      ring2Mat.needsUpdate = true;

      ring3Mat.color.set(isLight ? 0x0284c7 : 0x818cf8);
      ring3Mat.opacity = isLight ? 0.35 : 0.32;
      ring3Mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      ring3Mat.needsUpdate = true;

      nucleusMat.color.set(isLight ? 0x1d4ed8 : 0x93c5fd);
      nucleusMat.opacity = isLight ? 0.25 : 0.22;
      nucleusMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      nucleusMat.needsUpdate = true;

      satMat.color.set(isLight ? 0x2563eb : 0x60a5fa);
      satMat.opacity = isLight ? 0.75 : 0.85;
      satMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      satMat.needsUpdate = true;

      cosmicMat.color.set(isLight ? 0x3b82f6 : 0x93c5fd);
      cosmicMat.opacity = isLight ? 0.45 : 0.65;
      cosmicMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      cosmicMat.needsUpdate = true;
    };

    // ==========================================
    // 6. ANIMATION RENDER LOOP
    // ==========================================
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Fluid Harmonic Wave Formulation
      const currentPos = waveGeometry.attributes.position;
      const count = currentPos.count;
      for (let i = 0; i < count; i++) {
        const bx = baseWavePositions[i * 3];
        const by = baseWavePositions[i * 3 + 1];

        const waveZ =
          Math.sin(bx * 0.006 + elapsed * 1.0) * Math.cos(by * 0.006 + elapsed * 0.75) * 18 +
          Math.sin((bx + by) * 0.0035 + elapsed * 0.55) * 10 +
          Math.sin(bx * 0.01 - elapsed * 0.6) * 6;

        currentPos.setZ(i, waveZ);
      }
      currentPos.needsUpdate = true;

      // Animate Gyroscopic AI Core
      ring1.rotation.x = elapsed * 0.2;
      ring1.rotation.y = elapsed * 0.28;

      ring2.rotation.y = -elapsed * 0.25;
      ring2.rotation.z = elapsed * 0.22;

      ring3.rotation.x = -elapsed * 0.26;
      ring3.rotation.z = -elapsed * 0.18;

      // Nucleus gentle pulse
      const pulseScale = 1 + Math.sin(elapsed * 2.0) * 0.05;
      nucleus.scale.set(pulseScale, pulseScale, pulseScale);
      nucleus.rotation.y = elapsed * 0.35;
      nucleus.rotation.x = elapsed * 0.22;

      satPoints.rotation.y = elapsed * 0.45;

      // Core interactive tilt from mouse with smooth damping
      coreGroup.rotation.y = mouseX * 0.3;
      coreGroup.rotation.x = -mouseY * 0.2;

      // Animate Cosmic Dust floating
      const cPos = cosmicGeo.attributes.position;
      for (let i = 0; i < cosmicCount; i++) {
        let py = cPos.getY(i);
        py += cosmicSpeeds[i] * 0.22;
        if (py > 250) py = -250;
        cPos.setY(i, py);
      }
      cPos.needsUpdate = true;

      // Smooth camera motion
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 7. WINDOW RESIZE HANDLER
    // ==========================================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Responsive adjustments
      const nowMobile = w < 768;
      coreGroup.position.set(nowMobile ? 0 : 160, nowMobile ? 10 : 38, nowMobile ? -50 : -35);
      if (nowMobile) {
        coreGroup.scale.set(0.65, 0.65, 0.65);
      } else {
        coreGroup.scale.set(0.88, 0.88, 0.88);
      }
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 8. CLEANUP ON UNMOUNT
    // ==========================================
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      waveGeometry.dispose();
      wavePointsMat.dispose();
      waveWireMat.dispose();

      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      satGeo.dispose();
      satMat.dispose();

      cosmicGeo.dispose();
      cosmicMat.dispose();

      particleTexture.dispose();
      renderer.dispose();
      updateThemeRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="three-particle-mount" aria-hidden="true" />;
};

export default ParticleCanvas;

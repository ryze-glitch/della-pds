'use client';

import { useEffect, useRef, useState } from 'react';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

// Stemma in 3D: lastra con spessore (strati sovrapposti), luci, riflesso che
// scorre e inclinazione che segue il mouse. Three.js viene caricato a parte,
// solo se il browser supporta WebGL; altrimenti resta l'immagine statica.
export function Crest3D({ className = '', fallbackClass = 'h-full w-auto', glow = true }) {
  const host = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || !hasWebGL()) return undefined;
    let disposed = false;
    let raf = 0;
    let teardown = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
      camera.position.set(0, 0, 10);
      scene.add(new THREE.AmbientLight(0xffffff, 1.05));
      const key = new THREE.DirectionalLight(0xfff1d6, 2.4);
      key.position.set(3, 4, 6);
      scene.add(key);
      const rim = new THREE.PointLight(0x4fb8ff, 26, 24);
      rim.position.set(-4, 1.5, 3);
      scene.add(rim);

      let tex;
      try {
        tex = await new THREE.TextureLoader().loadAsync('/assets/crest.png');
      } catch (e) {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      if (disposed) {
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      const H = 4;
      const W = H * (tex.image.width / tex.image.height);
      const geo = new THREE.PlaneGeometry(W, H);
      const group = new THREE.Group();
      const mats = [];
      const LAYERS = 18;
      const DEPTH = 0.34;
      for (let i = 0; i < LAYERS; i++) {
        const t = i / (LAYERS - 1);
        const shade = 0.18 + 0.82 * t; // gli strati dietro sono più scuri: dà il bordo di metallo
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          alphaTest: 0.5,
          color: new THREE.Color(shade, shade * 0.97, shade * 0.9),
          metalness: 0.35,
          roughness: 0.5,
          side: THREE.DoubleSide,
        });
        mats.push(mat);
        const m = new THREE.Mesh(geo, mat);
        m.position.z = -DEPTH / 2 + DEPTH * t;
        group.add(m);
      }

      // riflesso luminoso che attraversa lo stemma
      const sheen = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTex: { value: tex }, uTime: { value: 0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `
          varying vec2 vUv; uniform sampler2D uTex; uniform float uTime;
          void main(){
            float a = texture2D(uTex, vUv).a;
            float p = fract(uTime * 0.16);
            float d = (vUv.x * 0.8 + vUv.y * 0.6) - (p * 2.4 - 0.5);
            float band = exp(-d * d * 90.0);
            gl_FragColor = vec4(vec3(1.0, 0.93, 0.78) * band * 0.7, a * band * 0.7);
          }`,
      });
      const sheenMesh = new THREE.Mesh(geo, sheen);
      sheenMesh.position.z = DEPTH / 2 + 0.01;
      group.add(sheenMesh);
      scene.add(group);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // inquadra lo stemma con un po' di margine
        const fit = (H * 1.28) / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.position.z = Math.max(fit, (W * 1.3) / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
      io.observe(el);

      const clock = new THREE.Clock();
      let first = true;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        group.rotation.y = Math.sin(t * 0.55) * 0.42 + mouse.x * 0.35;
        group.rotation.x = -mouse.y * 0.2 + Math.sin(t * 0.4) * 0.04;
        group.position.y = Math.sin(t * 0.9) * 0.08;
        key.position.x = 3 + mouse.x * 2;
        sheen.uniforms.uTime.value = t;
        renderer.render(scene, camera);
        if (first) {
          first = false;
          setReady(true);
        }
      };
      loop();

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        ro.disconnect();
        io.disconnect();
        mats.forEach((m) => m.dispose());
        sheen.dispose();
        geo.dispose();
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      teardown();
    };
  }, []);

  return (
    <div ref={host} className={className}>
      {glow ? (
        <>
          <div aria-hidden="true" className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(12,18,28,0.82),transparent)]" />
          <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(23,168,189,0.22),transparent)] blur-2xl" />
        </>
      ) : null}
      <img
        src="/assets/crest.png"
        alt="Stemma della Polizia di Stato"
        className={`absolute inset-0 m-auto transition-opacity duration-700 ${fallbackClass} ${ready ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}

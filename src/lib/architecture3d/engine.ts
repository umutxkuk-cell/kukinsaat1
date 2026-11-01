import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { BRAND_3D_COLORS, MATERIAL_PROFILES, materialProfileForName, type MaterialProfileKey } from "./palette";
import type { EngineHandle, SceneDefinition, Vector3Tuple } from "./types";

type EngineOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  definition: SceneDefinition;
  modelUrl: string;
  mobile: boolean;
  signal: AbortSignal;
  onReady(hasContinuousMotion: boolean): void;
  onError(error: Error): void;
};

function vector(values: Vector3Tuple): THREE.Vector3 {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function makeMaterial(key: MaterialProfileKey): THREE.Material {
  const profile = MATERIAL_PROFILES[key];
  if (profile.type === "glass") {
    return new THREE.MeshPhysicalMaterial({
      name: `KUK_${key.toUpperCase()}`,
      color: profile.color,
      metalness: profile.metalness,
      roughness: profile.roughness,
      transmission: profile.transmission,
      thickness: profile.thickness,
      ior: profile.ior,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }
  return new THREE.MeshStandardMaterial({
    name: `KUK_${key.toUpperCase()}`,
    color: profile.color,
    metalness: profile.metalness,
    roughness: profile.roughness,
  });
}

/**
 * Apply the brand PBR profile only when an artist explicitly names a glTF
 * material KUK_CONCRETE, KUK_STONE, etc. All other authored PBR textures stay
 * intact — this is essential for realistic high-end materials.
 */
function assignTaggedMaterials(model: THREE.Object3D, scene: SceneDefinition, owned: Set<THREE.Material>) {
  const cache = new Map<MaterialProfileKey, THREE.Material>();
  const fromName = (material: THREE.Material): THREE.Material => {
    const key = materialProfileForName(material.name);
    if (!key) return material;
    owned.add(material);
    let preset = cache.get(key);
    if (!preset) {
      preset = makeMaterial(key);
      cache.set(key, preset);
      owned.add(preset);
    }
    return preset;
  };

  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = !scene.lighting.shadows ? false : true;
    object.receiveShadow = scene.lighting.shadows;
    object.material = Array.isArray(object.material)
      ? object.material.map(fromName)
      : fromName(object.material);
  });
}

function disposeModel(model: THREE.Object3D | null, owned: Set<THREE.Material>) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>(owned);
  const textures = new Set<THREE.Texture>();

  model?.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
    }
  });

  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) {
    const properties = material as unknown as Record<string, unknown>;
    for (const name of ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap", "alphaMap"]) {
      const value = properties[name];
      if (value instanceof THREE.Texture) textures.add(value);
    }
    material.dispose();
  }
  for (const texture of textures) texture.dispose();
}

async function fetchGLTF(urlString: string, signal: AbortSignal) {
  const url = new URL(urlString, window.location.href);
  if (url.origin !== window.location.origin) {
    throw new Error("3D modeller aynı kaynaktan servis edilmelidir.");
  }
  const response = await fetch(url, { signal, credentials: "same-origin" });
  if (!response.ok) throw new Error(`3D model yüklenemedi (${response.status}).`);

  // parseAsync also supports .gltf JSON; GLB is recommended because all
  // resources are packed into a single request.
  const isJSON = url.pathname.toLowerCase().endsWith(".gltf");
  const data = isJSON ? await response.text() : await response.arrayBuffer();
  if (signal.aborted) throw new DOMException("Model isteği iptal edildi.", "AbortError");
  const baseURL = new URL(".", url).href;
  return new GLTFLoader().parseAsync(data, baseURL);
}

/**
 * Creates a real WebGL scene after the model has loaded. No geometry, dummy
 * buildings or fake 3D visuals are generated here. Actual model assets are
 * introduced independently in later sessions.
 */
export async function mountArchitectureEngine({
  canvas,
  container,
  definition,
  modelUrl,
  mobile,
  signal,
  onReady,
  onError,
}: EngineOptions): Promise<EngineHandle> {
  if (signal.aborted) throw new DOMException("3D oturumu iptal edildi.", "AbortError");

  const gltf = await fetchGLTF(modelUrl, signal);
  if (signal.aborted) {
    disposeModel(gltf.scene, new Set());
    throw new DOMException("3D oturumu iptal edildi.", "AbortError");
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "high-performance",
      preserveDrawingBuffer: false,
    });
  } catch (error) {
    disposeModel(gltf.scene, new Set());
    throw error;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = definition.lighting.exposure;
  renderer.setClearColor(BRAND_3D_COLORS.mineral, 0);
  renderer.shadowMap.enabled = !mobile && definition.lighting.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const cameraSetup = definition.camera;
  const camera = new THREE.PerspectiveCamera(
    mobile ? cameraSetup.mobileFov : cameraSetup.fov,
    1,
    cameraSetup.near,
    cameraSetup.far,
  );
  const basePosition = vector(mobile ? cameraSetup.mobilePosition : cameraSetup.position);
  const lookAt = vector(cameraSetup.target);
  const introOffset = vector(cameraSetup.introOffset);
  camera.position.copy(basePosition).add(introOffset);
  camera.lookAt(lookAt);

  const light = definition.lighting;
  scene.add(new THREE.HemisphereLight("#f7f6f2", "#8c9a9f", light.hemisphereIntensity));
  const key = new THREE.DirectionalLight("#fff9f1", light.keyIntensity);
  key.position.copy(vector(light.keyPosition));
  key.castShadow = renderer.shadowMap.enabled;
  if (key.castShadow) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 40;
    key.shadow.bias = -0.00025;
  }
  scene.add(key);
  const fill = new THREE.DirectionalLight("#c7dae2", light.fillIntensity);
  fill.position.copy(vector(light.fillPosition));
  scene.add(fill);
  const rim = new THREE.DirectionalLight("#e9e1d5", light.rimIntensity);
  rim.position.copy(vector(light.rimPosition));
  scene.add(rim);

  const ownedMaterials = new Set<THREE.Material>();
  const model = new THREE.Group();
  model.add(gltf.scene);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  if (bounds.isEmpty() || !Number.isFinite(maxDimension) || maxDimension < 0.0001) {
    disposeModel(gltf.scene, ownedMaterials);
    renderer.dispose();
    throw new Error("3D model görünür geometri içermiyor.");
  }
  const center = bounds.getCenter(new THREE.Vector3());
  const normalizedScale = 2 / maxDimension;
  model.scale.setScalar(normalizedScale);
  model.position.copy(center).multiplyScalar(-normalizedScale);
  assignTaggedMaterials(gltf.scene, definition, ownedMaterials);
  scene.add(model);

  const playClips = definition.motion.playAuthoredClips && gltf.animations.length > 0;
  const mixer = playClips ? new THREE.AnimationMixer(gltf.scene) : null;
  if (mixer) for (const clip of gltf.animations) mixer.clipAction(clip).play();

  let disposed = false;
  let visible = true;
  let paused = false;
  let raf = 0;
  let pointerX = 0;
  let pointerY = 0;
  let scrollShift = 0;
  let introStart = performance.now();
  let lastFrame = introStart;
  let readySent = false;
  const motion = definition.motion;

  function requestFrame() {
    if (disposed || !visible || paused || document.hidden || raf) return;
    raf = requestAnimationFrame(draw);
  }

  function draw(now: number) {
    raf = 0;
    if (disposed || !visible || paused || document.hidden) return;

    const t = motion.introDurationMs > 0
      ? Math.min(1, (now - introStart) / motion.introDurationMs)
      : 1;
    const ease = 1 - (1 - t) ** 3;
    const desired = basePosition.clone().addScaledVector(introOffset, 1 - ease);
    if (!mobile) {
      desired.x += pointerX * motion.pointerAmplitude;
      desired.y += -pointerY * motion.pointerAmplitude * 0.65;
    }
    desired.y += scrollShift * motion.scrollAmplitude;
    const distance = camera.position.distanceTo(desired);
    camera.position.lerp(desired, t < 1 ? 0.16 : 0.14);
    camera.lookAt(lookAt);
    if (mixer) mixer.update(Math.min((now - lastFrame) / 1000, 0.05));
    lastFrame = now;
    renderer.render(scene, camera);

    if (!readySent) {
      readySent = true;
      onReady(playClips);
    }
    // After the intro settles, no more frames are scheduled unless the
    // model has authored animation clips or the user actually interacts.
    if (t < 1 || distance > 0.0008 || mixer) requestFrame();
  }

  function resize() {
    if (disposed) return;
    const width = Math.round(container.clientWidth);
    const height = Math.round(container.clientHeight);
    if (width < 1 || height < 1) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestFrame();
  }

  function pointerMove(event: PointerEvent) {
    if (mobile || motion.pointerAmplitude <= 0) return;
    const rect = container.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    requestFrame();
  }

  function pointerLeave() {
    pointerX = 0;
    pointerY = 0;
    requestFrame();
  }

  function scroll() {
    if (motion.scrollAmplitude <= 0) return;
    const rect = container.getBoundingClientRect();
    scrollShift = Math.max(-1, Math.min(1, (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) / window.innerHeight));
    requestFrame();
  }

  function visibilityChange() {
    if (!document.hidden) {
      lastFrame = performance.now();
      requestFrame();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function contextLost(event: Event) {
    event.preventDefault();
    if (!disposed) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      onError(new Error("WebGL bağlamı kayboldu; statik görsel korunuyor."));
    }
  }

  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
  observer?.observe(container);
  window.addEventListener("resize", resize, { passive: true });
  container.addEventListener("pointermove", pointerMove, { passive: true });
  container.addEventListener("pointerleave", pointerLeave);
  window.addEventListener("scroll", scroll, { passive: true });
  document.addEventListener("visibilitychange", visibilityChange);
  canvas.addEventListener("webglcontextlost", contextLost);
  resize();
  scroll();
  requestFrame();

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    observer?.disconnect();
    window.removeEventListener("resize", resize);
    container.removeEventListener("pointermove", pointerMove);
    container.removeEventListener("pointerleave", pointerLeave);
    window.removeEventListener("scroll", scroll);
    document.removeEventListener("visibilitychange", visibilityChange);
    canvas.removeEventListener("webglcontextlost", contextLost);
    mixer?.stopAllAction();
    disposeModel(gltf.scene, ownedMaterials);
    renderer.dispose();
  };

  if (signal.aborted) dispose();
  else signal.addEventListener("abort", dispose, { once: true });

  return {
    get hasContinuousMotion() { return playClips; },
    setVisible(next: boolean) {
      visible = next;
      if (!next && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (next) {
        lastFrame = performance.now();
        requestFrame();
      }
    },
    setPaused(next: boolean) {
      paused = next;
      if (next && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (!next) {
        introStart = Math.min(introStart, performance.now() - motion.introDurationMs);
        lastFrame = performance.now();
        requestFrame();
      }
    },
    dispose,
  };
}

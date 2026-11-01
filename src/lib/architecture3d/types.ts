export const SCENE_IDS = ["home", "kurumsal", "hizmetler", "projeler", "iletisim"] as const;

export type SceneId = (typeof SCENE_IDS)[number];
export type Vector3Tuple = readonly [number, number, number];
export type VisualStatus = "poster" | "loading" | "ready" | "error";

export type CameraPreset = Readonly<{
  /** Camera coordinates in the model's normalized unit-space. */
  position: Vector3Tuple;
  target: Vector3Tuple;
  mobilePosition: Vector3Tuple;
  fov: number;
  mobileFov: number;
  near: number;
  far: number;
  /** Small displacement from the target camera pose during the initial reveal. */
  introOffset: Vector3Tuple;
}>;

export type LightingPreset = Readonly<{
  hemisphereIntensity: number;
  keyPosition: Vector3Tuple;
  keyIntensity: number;
  fillPosition: Vector3Tuple;
  fillIntensity: number;
  rimPosition: Vector3Tuple;
  rimIntensity: number;
  exposure: number;
  shadows: boolean;
}>;

export type MotionPreset = Readonly<{
  introDurationMs: number;
  /** The largest camera offset in normalized model units, not radians. */
  pointerAmplitude: number;
  scrollAmplitude: number;
  /** Opt-in for authored glTF animation clips; never rotate the entire building. */
  playAuthoredClips: boolean;
}>;

export type SceneDefinition = Readonly<{
  id: SceneId;
  posterSrc: string;
  posterAlt: string;
  /** No page model is supplied in this infrastructure-only phase. */
  modelSrc: string | null;
  mobileModelSrc: string | null;
  mobileMode: "poster" | "low";
  camera: CameraPreset;
  lighting: LightingPreset;
  motion: MotionPreset;
}>;

export type EngineHandle = {
  setVisible(visible: boolean): void;
  setPaused(paused: boolean): void;
  dispose(): void;
  readonly hasContinuousMotion: boolean;
};

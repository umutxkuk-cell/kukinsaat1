/** Canonical KUK brand colors. These are not forced onto authored glTF textures. */
export const BRAND_3D_COLORS = Object.freeze({
  engineeringBlue: "#1F435C",
  mineral: "#EEEAE2",
  graphite: "#20262B",
  terracotta: "#A34E3A",
  lightStone: "#E5E1D9",
  steelGray: "#626B73",
});

export type MaterialProfile = Readonly<{
  color: string;
  metalness: number;
  roughness: number;
  type: "standard" | "glass";
  transmission?: number;
  thickness?: number;
  ior?: number;
}>;

/**
 * A neutral PBR baseline for deliberately tagged, untextured model surfaces.
 * Artist-supplied glTF materials and textures remain untouched otherwise.
 * In Blender: use material names such as KUK_CONCRETE or KUK_GLASS.
 */
export const MATERIAL_PROFILES = {
  concrete: {
    type: "standard",
    color: "#c9c7c1",
    metalness: 0,
    roughness: 0.94,
  },
  boardConcrete: {
    type: "standard",
    color: "#bbb9b2",
    metalness: 0,
    roughness: 0.92,
  },
  stone: {
    type: "standard",
    color: BRAND_3D_COLORS.lightStone,
    metalness: 0,
    roughness: 0.86,
  },
  steel: {
    type: "standard",
    color: BRAND_3D_COLORS.steelGray,
    metalness: 0.67,
    roughness: 0.44,
  },
  aluminum: {
    type: "standard",
    color: "#8b9ca3",
    metalness: 0.72,
    roughness: 0.36,
  },
  graphite: {
    type: "standard",
    color: BRAND_3D_COLORS.graphite,
    metalness: 0.08,
    roughness: 0.82,
  },
  terracotta: {
    type: "standard",
    color: BRAND_3D_COLORS.terracotta,
    metalness: 0,
    roughness: 0.88,
  },
  glass: {
    type: "glass",
    color: "#d6e3e4",
    metalness: 0,
    roughness: 0.12,
    transmission: 0.64,
    thickness: 0.14,
    ior: 1.48,
  },
} as const satisfies Record<string, MaterialProfile>;

export type MaterialProfileKey = keyof typeof MATERIAL_PROFILES;

/** Only explicitly prefixed glTF material names receive a preset. */
export function materialProfileForName(name: string): MaterialProfileKey | null {
  const key = name.replace(/^KUK[_-]/i, "").toLowerCase();
  if (!/^KUK[_-]/i.test(name)) return null;
  const known = (Object.keys(MATERIAL_PROFILES) as MaterialProfileKey[]).find(
    (candidate) => candidate.toLowerCase() === key,
  );
  return known ?? null;
}

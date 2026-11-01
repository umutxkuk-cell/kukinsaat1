"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_3D_COLORS } from "@/lib/architecture3d/palette";
import { getArchitectureScene } from "@/lib/architecture3d/scenes";
import type { EngineHandle, SceneId, VisualStatus } from "@/lib/architecture3d/types";

type Props = {
  scene: SceneId;
  /** Optional local GLB/glTF override. Usually set modelSrc in scenes.ts instead. */
  modelSrc?: string | null;
  className?: string;
  posterFit?: "cover" | "contain";
  decorative?: boolean;
  onStatusChange?: (status: VisualStatus) => void;
};

/**
 * Poster-first progressive 3D stage. Nothing in the existing site mounts
 * this component yet: all five pages retain their original DOM and artwork.
 *
 * With modelSrc=null no Three.js code, canvas or model request is made.
 * With a model it only imports Three.js after entering the viewport.
 */
export function ArchitecturalScene({
  scene,
  modelSrc,
  className = "relative block h-full w-full",
  posterFit = "contain",
  decorative = true,
  onStatusChange,
}: Props) {
  const definition = getArchitectureScene(scene);
  const configuredModel = modelSrc === undefined ? definition.modelSrc : modelSrc;
  const [status, setStatus] = useState<VisualStatus>("poster");
  const [capabilitiesReady, setCapabilitiesReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hasContinuousMotion, setHasContinuousMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [retry, setRetry] = useState(0);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const visibleRef = useRef(false);
  const pausedRef = useRef(false);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setReducedMotion(reduced.matches);
      setMobile(small.matches);
      setCapabilitiesReady(true);
    };
    const id = window.setTimeout(update, 0);
    reduced.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      window.clearTimeout(id);
      reduced.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!configuredModel && !definition.mobileModelSrc) return;
    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => {
        visibleRef.current = true;
        setSeen(true);
        engineRef.current?.setVisible(true);
      }, 0);
      return () => window.clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        visibleRef.current = visible;
        engineRef.current?.setVisible(visible);
        if (visible) setSeen(true);
      },
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [configuredModel, definition.mobileModelSrc, scene]);

  const selectedModel = mobile && definition.mobileMode === "low"
    ? (definition.mobileModelSrc ?? configuredModel)
    : configuredModel;
  const allowed = capabilitiesReady && !reducedMotion && Boolean(selectedModel) &&
    (!mobile || definition.mobileMode === "low") && seen;
  const key = `${scene}|${selectedModel ?? "none"}|${retry}`;

  useEffect(() => {
    if (!allowed || !selectedModel || !containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const controller = new AbortController();
    let cancelled = false;
    let failed = false;
    const timer = window.setTimeout(() => {
      setStatus("loading");
      onStatusChangeRef.current?.("loading");
    }, 0);

    // This import is the only path to the Three.js bundle. No model configured
    // means no WebGL code downloads and no rendering work on production pages.
    void import("@/lib/architecture3d/engine")
      .then(({ mountArchitectureEngine }) => mountArchitectureEngine({
        canvas,
        container,
        definition,
        modelUrl: selectedModel,
        mobile,
        signal: controller.signal,
        onReady: (continuous) => {
          if (cancelled || failed) return;
          window.clearTimeout(timer);
          setHasContinuousMotion(continuous);
          setReadyKey(key);
          setStatus("ready");
          onStatusChangeRef.current?.("ready");
        },
        onError: () => {
          if (cancelled) return;
          window.clearTimeout(timer);
          failed = true;
          setReadyKey(null);
          setStatus("error");
          onStatusChangeRef.current?.("error");
          engineRef.current?.dispose();
          engineRef.current = null;
        },
      }))
      .then((handle) => {
        if (cancelled || failed || controller.signal.aborted) {
          handle.dispose();
          return;
        }
        engineRef.current = handle;
        handle.setVisible(visibleRef.current);
        handle.setPaused(pausedRef.current);
      })
      .catch(() => {
        if (cancelled || controller.signal.aborted) return;
        window.clearTimeout(timer);
        setReadyKey(null);
        setStatus("error");
        onStatusChangeRef.current?.("error");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [allowed, definition, key, mobile, selectedModel]);

  const showCanvas = allowed && engineRef.current !== null && readyKey === key && status === "ready";
  const showPauseButton = showCanvas && hasContinuousMotion;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ backgroundColor: BRAND_3D_COLORS.mineral }}
      data-architecture-scene={scene}
      data-3d-status={showCanvas ? "ready" : status === "error" ? "error" : "poster"}
    >
      {allowed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full ${showCanvas ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={definition.posterSrc}
        alt={decorative ? "" : definition.posterAlt}
        aria-hidden={decorative ? true : undefined}
        loading="eager"
        decoding="async"
        className={`pointer-events-none absolute inset-0 h-full w-full ${showCanvas ? "opacity-0" : "opacity-100"}`}
        style={{ objectFit: posterFit }}
      />
      {status === "loading" && <span role="status" className="sr-only">3D sahne yükleniyor.</span>}
      {showPauseButton && (
        <button
          type="button"
          aria-label={paused ? "3D animasyonu sürdür" : "3D animasyonu durdur"}
          aria-pressed={paused}
          onClick={() => {
            const next = !paused;
            pausedRef.current = next;
            setPaused(next);
            engineRef.current?.setPaused(next);
          }}
          className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center border border-ink/25 bg-bg/90 px-3 text-xs font-semibold text-ink backdrop-blur-sm hover:bg-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {paused ? "Oynat" : "Durdur"}
        </button>
      )}
      {status === "error" && selectedModel && !reducedMotion && (
        <button
          type="button"
          onClick={() => {
            setStatus("poster");
            setRetry((value) => value + 1);
          }}
          className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center border border-ink/25 bg-bg/90 px-3 text-xs font-semibold text-ink hover:bg-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          3D görüntüyü yeniden dene
        </button>
      )}
    </div>
  );
}

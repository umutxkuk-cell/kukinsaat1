"use client";

import { useEffect, useRef, useState } from "react";
import "./custom-cursor.css";

type CursorMode = "idle" | "interactive" | "native";

const NATIVE_TARGETS = [
  "input",
  "textarea",
  "select",
  "option",
  "iframe",
  "video",
  "audio",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='textbox']",
  "[role='slider']",
  "[disabled]",
  "[aria-disabled='true']",
  "[data-cursor='native']",
].join(",");

const INTERACTIVE_TARGETS = [
  "a[href]",
  "button",
  "summary",
  "label[for]",
  "[role='button']",
  "[role='link']",
  "[data-cursor='link']",
].join(",");

const TEXT_TARGETS = "p, h1, h2, h3, h4, h5, h6, blockquote, [data-cursor='text']";

function getMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "idle";
  if (target.closest(NATIVE_TARGETS)) return "native";
  if (target.closest(INTERACTIVE_TARGETS)) return "interactive";
  if (target.closest(TEXT_TARGETS)) return "native";
  return "idle";
}

export function CustomCursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(finePointer.matches && !reducedMotion.matches);

    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const layer = layerRef.current;
    const follower = followerRef.current;
    const point = pointRef.current;
    if (!layer || !follower || !point) return;

    let x = 0;
    let y = 0;
    let followX = 0;
    let followY = 0;
    let frame = 0;
    let shown = false;
    let hasMoved = false;
    let mode: CursorMode = "idle";

    const place = (element: HTMLElement, left: number, top: number) => {
      element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };

    const placeFollower = (left: number, top: number, dx = 0, dy = 0) => {
      const distance = Math.hypot(dx, dy);
      const movement = Math.min(distance / 48, 1);
      const angle = distance > 0.15 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      const stretch = 1 + movement * 0.12;
      const squash = 1 - movement * 0.06;
      follower.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${angle}deg) scale(${stretch}, ${squash})`;
    };

    const hide = () => {
      shown = false;
      layer.classList.remove("is-visible", "is-pressed");
      document.body.classList.remove("custom-cursor-active");
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    // The follower only animates while it is catching up with the pointer.
    const follow = () => {
      const dx = x - followX;
      const dy = y - followY;
      const distance = Math.hypot(dx, dy);
      if (distance > 48) {
        followX = x - (dx / distance) * 48;
        followY = y - (dy / distance) * 48;
      }
      const easing = mode === "interactive" ? 0.3 : 0.24;
      followX += (x - followX) * easing;
      followY += (y - followY) * easing;
      placeFollower(followX, followY, x - followX, y - followY);

      if (Math.hypot(x - followX, y - followY) > 0.15) {
        frame = window.requestAnimationFrame(follow);
      } else {
        followX = x;
        followY = y;
        placeFollower(x, y);
        frame = 0;
      }
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }

      x = event.clientX;
      y = event.clientY;
      mode = getMode(event.target);
      if (mode === "native") {
        hide();
        return;
      }

      layer.dataset.mode = mode;
      place(point, x, y);
      if (!shown) {
        followX = x;
        followY = y;
        placeFollower(x, y);
        shown = true;
        layer.classList.add("is-visible");
        document.body.classList.add("custom-cursor-active");
      }
      if (!frame) frame = window.requestAnimationFrame(follow);
    };

    const onMove = (event: PointerEvent) => {
      hasMoved = true;
      updatePointer(event);
    };
    const onOver = (event: PointerEvent) => {
      if (hasMoved) updatePointer(event);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      if (!shown) return;
      layer.classList.add("is-pressed");

      const ripple = rippleRef.current;
      if (ripple && typeof ripple.animate === "function") {
        ripple.getAnimations().forEach((animation) => animation.cancel());
        ripple.animate(
          [
            { opacity: 0.55, transform: "scale(0.65)" },
            { opacity: 0, transform: "scale(1.55)" },
          ],
          { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    };
    const onUp = () => layer.classList.remove("is-pressed");
    const onOut = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !event.relatedTarget) hide();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        hasMoved = false;
        hide();
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      hide();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} className="kuk-cursor" data-mode="idle" aria-hidden="true">
      <div ref={followerRef} className="kuk-cursor__follower">
        <span className="kuk-cursor__halo" />
      </div>
      <div ref={pointRef} className="kuk-cursor__point">
        <span ref={rippleRef} className="kuk-cursor__ripple" />
        <span className="kuk-cursor__dot" />
      </div>
    </div>
  );
}
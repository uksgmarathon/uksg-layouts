<script setup lang="ts">
import gsap from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { onBeforeUnmount, ref, useCssModule } from 'vue';

gsap.registerPlugin(Physics2DPlugin);

/**
 * Layer that fires a burst of confetti and sparkles when "burst" is called.
 * Fills its (positioned) parent; the pieces are free to fly outside of it.
 */
const style = useCssModule();
const colours = ['#44a0e3', '#d00c27', '#4bd133', '#0091ff', '#f0b429', '#ffffff'];
const layer = ref<HTMLElement>();
let tl: gsap.core.Timeline | undefined;

function burst(count = 90) {
  const elem = layer.value;
  if (!elem) return;
  const { width, height } = elem.getBoundingClientRect();
  tl?.kill();
  elem.replaceChildren();
  tl = gsap.timeline({ onComplete: () => elem.replaceChildren() });

  // Confetti, launched upwards from across the middle of the area and falling back down.
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    const isCircle = Math.random() < 0.3;
    const size = gsap.utils.random(7, 12);
    piece.className = style.Piece;
    Object.assign(piece.style, {
      width: `${size}px`,
      height: `${isCircle ? size : size * 1.6}px`,
      borderRadius: isCircle ? '50%' : '1px',
      background: gsap.utils.random(colours),
      left: `${gsap.utils.random(0.2, 0.8) * width}px`,
      top: `${height / 2}px`,
    });
    elem.appendChild(piece);
    const duration = gsap.utils.random(2.2, 3.4);
    tl.to(piece, {
      duration,
      physics2D: { velocity: gsap.utils.random(450, 950), angle: gsap.utils.random(215, 325), gravity: 900 },
      rotation: gsap.utils.random(-900, 900),
      rotationX: gsap.utils.random(-720, 720),
      ease: 'none',
    }, gsap.utils.random(0, 0.15));
    tl.to(piece, { opacity: 0, duration: 0.6 }, duration - 0.45);
  }

  // Sparkles that twinkle around the area.
  for (let i = 0; i < 14; i += 1) {
    const sparkle = document.createElement('div');
    sparkle.className = style.Sparkle;
    sparkle.textContent = '✦';
    Object.assign(sparkle.style, {
      left: `${gsap.utils.random(-0.05, 1.05) * width}px`,
      top: `${gsap.utils.random(0, 1) * height}px`,
      fontSize: `${gsap.utils.random(16, 34)}px`,
      color: Math.random() < 0.5 ? '#ffffff' : '#f0b429',
    });
    elem.appendChild(sparkle);
    tl.fromTo(
      sparkle,
      { scale: 0, rotation: -90, opacity: 1 },
      { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(3)', repeat: 1, yoyo: true, repeatDelay: 0.15 },
      gsap.utils.random(0, 1.6),
    );
  }
}

onBeforeUnmount(() => tl?.kill());
defineExpose({ burst });
</script>

<template>
  <div
    ref="layer"
    :class="$style.Layer"
  />
</template>

<style lang="scss" module>
.Layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.Piece {
  position: absolute;
  will-change: transform;
}

.Sparkle {
  position: absolute;
  margin: -0.5em 0 0 -0.5em;
  line-height: 1;
  text-shadow: 0 0 8px rgba(240, 180, 41, 0.9), 0 0 16px rgba(255, 255, 255, 0.6);
  will-change: transform;
}
</style>

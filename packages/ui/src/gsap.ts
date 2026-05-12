import { gsap } from 'gsap';
import { motion } from './tokens.js';

/**
 * Tasteful, opinionated GSAP helpers. The aim is energy where it earns its keep —
 * not animation for animation's sake.
 */

export { gsap };

/** Stagger a list of cards in on scroll/mount. */
export function revealStagger(targets: gsap.TweenTarget, opts: { delay?: number } = {}) {
  return gsap.from(targets, {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'expo.out',
    stagger: 0.06,
    delay: opts.delay ?? 0,
    clearProps: 'transform,opacity',
  });
}

/** Hero entrance — title splits, accent underline draws. */
export function heroEntrance(scope: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const title = scope.querySelectorAll<HTMLElement>('[data-hero-line]');
  const accent = scope.querySelector<HTMLElement>('[data-hero-accent]');
  const meta = scope.querySelectorAll<HTMLElement>('[data-hero-meta]');

  tl.from(title, { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 })
    .from(accent, { scaleX: 0, transformOrigin: '0 50%', duration: 0.7 }, '-=0.4')
    .from(meta, { y: 16, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.3');

  return tl;
}

/** Card hover — float + tilt the corner; pair with `data-card-pop` on the element. */
export function bindCardPop(card: HTMLElement) {
  const enter = () =>
    gsap.to(card, {
      y: -4,
      duration: 0.32,
      ease: 'power3.out',
      boxShadow: '0 2px 0 rgba(10,19,48,0.06), 0 24px 48px -16px rgba(10,19,48,0.22)',
    });
  const leave = () =>
    gsap.to(card, {
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      clearProps: 'box-shadow',
    });
  card.addEventListener('mouseenter', enter);
  card.addEventListener('mouseleave', leave);
  return () => {
    card.removeEventListener('mouseenter', enter);
    card.removeEventListener('mouseleave', leave);
  };
}

/** Draw a blueprint-style grid behind a hero — animates in on mount. */
export function drawBlueprintGrid(svg: SVGElement) {
  const lines = svg.querySelectorAll<SVGLineElement>('line');
  return gsap.from(lines, {
    drawSVG: '0%',
    opacity: 0,
    duration: 0.8,
    stagger: 0.005,
    ease: 'sine.out',
  });
}

export const easing = motion.ease;
export const duration = motion.duration;

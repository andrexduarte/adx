export const PORTRAIT_TITLE = 'Front-end developer';
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const phase = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function portraitProgress(top: number, height: number, viewport: number, inset: number): number {
  return clamp((inset - top) / Math.max(1, height - viewport + inset));
}

export function portraitFrame(progress: number) {
  return {
    formation: ease(phase(progress, .04, .4)),
    lift: ease(phase(progress, .53, .68)),
    title: PORTRAIT_TITLE.slice(0, Math.floor(PORTRAIT_TITLE.length * phase(progress, .7, .8))),
    tools: Array.from({ length: 7 }, (_, index) => ease(phase(progress, .81 + index * .016, .86 + index * .016))),
    links: ease(phase(progress, .96, .995)),
    cue: 1 - phase(progress, .08, .2),
  };
}

// Stable seeds keep each dot on the same path when scrolling backwards or resizing.
export function portraitNoise(index: number, salt: number): number {
  let value = Math.imul(index + 1, 0x45d9f3b) ^ Math.imul(salt + 1, 0x27d4eb2d);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export interface PortraitDot {
  x: number; y: number; spreadX: number; spreadY: number;
  radius: number; color: number; delay: number; bend: number;
}

export function samplePortrait(data: Uint8ClampedArray, width: number, height: number): PortraitDot[] {
  const dots: PortraitDot[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const offset = index * 4;
      const r = data[offset], g = data[offset + 1], b = data[offset + 2];
      const alpha = data[offset + 3] / 255;
      const light = (r * .2126 + g * .7152 + b * .0722) / 255;
      if (alpha < .3 || light < .15 || portraitNoise(index, 0) > Math.pow(light, .7) * alpha * .82) continue;
      dots.push({
        x: (x + .5) / width, y: (y + .5) / height,
        spreadX: portraitNoise(index, 1), spreadY: portraitNoise(index, 2),
        radius: .4 + light * .35,
        color: r > g * 1.3 && b < 145 ? 2 : light > .62 ? 0 : 1,
        delay: portraitNoise(index, 3) * .16,
        bend: (portraitNoise(index, 4) - .5) * 100,
      });
    }
  }
  return dots;
}

export function portraitDotPosition(dot: PortraitDot, formation: number, width: number, height: number, box: { x: number; y: number; size: number }) {
  const t = ease((formation - dot.delay) / (1 - dot.delay));
  const fromX = dot.spreadX * width, fromY = dot.spreadY * height;
  const toX = box.x + dot.x * box.size, toY = box.y + dot.y * box.size;
  const bend = Math.sin(t * Math.PI) * dot.bend;
  return { x: fromX + (toX - fromX) * t + bend, y: fromY + (toY - fromY) * t - bend * .45 };
}

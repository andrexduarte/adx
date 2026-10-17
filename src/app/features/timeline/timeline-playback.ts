import type { Entry } from '../../core/content/models';

export type TimelineFrame =
  | { kind: 'moment'; anchor: string; label: string; moment: Entry }
  | { kind: 'landscape'; anchor: string; label: string };

export function careerFrames(moments: readonly Entry[]): TimelineFrame[] {
  const frames: TimelineFrame[] = [];
  for (const moment of moments) {
    if (moment.slug === '2008') continue;
    const current = moment.slug === '2025';
    frames.push({
      kind: 'moment',
      // The original 2025 anchor still belongs to the detailed Arena story.
      anchor: current ? 'momento-trade-arena' : 'momento-' + moment.slug,
      label: `${moment.year} — ${moment.company}`,
      moment: current ? { ...moment, title: 'Front-end developer · experimentando IA', excerpt: 'Desde o verão de 2025 — atual' } : moment,
    });
  }
  return frames;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function timelinePosition(top: number, height: number, viewport: number, inset: number, count: number): number {
  return clamp((inset - top) / Math.max(1, height - viewport + inset)) * Math.max(0, count);
}
export function timelineIndex(position: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.floor(position)));
}
export function timelineFrame(position: number, index: number, count: number) {
  const incoming = index === 0 ? 1 : ease((position - index + .14) / .28);
  const outgoing = index === count - 1 ? 0 : ease((position - index - 1 + .14) / .28);
  return { opacity: incoming * (1 - outgoing), offset: (1 - incoming - outgoing) * 28 };
}

// A continuous agenda wheel: the centered event grows while its neighbours remain visible.
export function careerAgendaFrame(position: number, index: number, count: number) {
  const center = Math.max(0, Math.min(count - 1, position - .25));
  const offset = index - center;
  const distance = Math.abs(offset);
  return { offset, scale: 1 - Math.min(1, distance) * .24, opacity: distance <= 1 ? 1 - distance * .55 : .45 * (1 - clamp((distance - 1) / .65)) };
}

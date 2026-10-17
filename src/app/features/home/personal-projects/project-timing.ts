// Keep scene identities stable while removing hidden scenes from scroll time.
export function visibleProjectScenes(_project: 'nos' | 'wakawa'): readonly number[] {
  return [0, 1, 2, 3, 5];
}

// Read-only audit on 2026-10-17: all 360 origin heads matched GitHub.
// Union of commits reachable from origin branches, authored by André's two
// verified identities. Unique SHA, no merges, rename-aware numstat.
// Excludes local-only branches and stash. Line totals are cumulative activity,
// including reapplied patches, not a count of unique surviving source lines.
export const ARENA_REPOSITORY_ACTIVITY = {
  repository: 'trade-arena/arena-app-front-end',
  retrievedAt: '2026-10-17',
  commits: 1313,
  additions: 534546,
  deletions: 311560,
} as const;

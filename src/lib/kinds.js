/** Builds filter options ("All" plus each kind that has items) with counts. */
export function kindOptions(kinds, items) {
  return [
    { id: 'all', label: 'All', count: items.length },
    ...kinds
      .map((k) => ({ ...k, count: items.filter((p) => p.kind === k.id).length }))
      .filter((k) => k.count > 0),
  ]
}

export function SkeletonCard() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse glass-panel rounded-lg p-md">
      <div className="flex gap-md">
        <div className="w-16 h-16 rounded-lg bg-surface-container-high flex-shrink-0" />
        <div className="flex-1 space-y-sm">
          <div className="h-4 bg-surface-container-high rounded w-3/4" />
          <div className="h-3 bg-surface-container-high rounded w-1/2" />
          <div className="h-3 bg-surface-container-high rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

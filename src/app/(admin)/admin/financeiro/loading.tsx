export default function FinanceiroLoading() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-surface-container-low rounded-lg" />
          <div className="h-4 w-96 bg-surface-container-low rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-surface-container-low rounded-xl" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px] bg-surface-container-low rounded-2xl border border-outline-variant/30" />
        <div className="h-[350px] bg-surface-container-low rounded-2xl border border-outline-variant/30" />
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-surface-container-low rounded-lg" />
          <div className="h-10 w-64 bg-surface-container-low rounded-xl" />
        </div>
        <div className="h-[400px] bg-surface-container-low rounded-2xl border border-outline-variant/30" />
      </div>
    </div>
  );
}

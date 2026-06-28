// Lightweight loading placeholders shown as Suspense fallbacks while streamed
// server content resolves.

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export const TableSkeleton = ({ rows = 6, columns = 5 }: TableSkeletonProps) => (
  <div className="component-table" role="status" aria-label="Loading…">
    <div
      className="component-table-header"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: columns }).map((_, c) => (
        <Bar key={c} className="h-4 w-20" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className="component-table-row"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, c) => (
          <Bar key={c} className="h-5" />
        ))}
      </div>
    ))}
  </div>
);

type FormSkeletonProps = {
  fields?: number;
};

export const FormSkeleton = ({ fields = 4 }: FormSkeletonProps) => (
  <div className="flex flex-col gap-6 max-w-2xl" role="status" aria-label="Loading…">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="flex items-center gap-6">
        <Bar className="h-5 w-48" />
        <Bar className="h-10 flex-1" />
      </div>
    ))}
  </div>
);

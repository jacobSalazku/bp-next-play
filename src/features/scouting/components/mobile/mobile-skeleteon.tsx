const MobileSkeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-6 rounded-xl bg-gray-950 px-2 py-4">
      <div className="mb-6 h-8 w-1/2 rounded bg-gray-700" />
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-9 w-20 rounded-full bg-gray-800" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-24 rounded-xl bg-green-900" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-24 rounded-xl bg-red-900" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-24 rounded-xl bg-gray-800" />
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-gray-900 p-4">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-700" />
        <div className="grid grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-6 rounded bg-gray-800" />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-6 rounded bg-gray-600" />
          ))}
        </div>
      </div>
      <div className="h-12 w-full rounded-xl bg-orange-200/50" />
    </div>
  );
};

export default MobileSkeleton;

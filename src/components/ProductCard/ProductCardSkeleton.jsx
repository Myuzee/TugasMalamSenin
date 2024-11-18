export default function ProductCardSkeleton() {
    return (
      <div className="flex flex-col max-w-[370px] flex-wrap p-[16px] bg-[#081116] animate-pulse">
        <div className="w-full h-[300px] bg-gray-700 mb-4" />
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
          <div className="h-6 bg-gray-700 rounded w-1/3" />
          <div className="h-12 bg-gray-700 rounded mt-[28px]" />
        </div>
      </div>
    );
  }
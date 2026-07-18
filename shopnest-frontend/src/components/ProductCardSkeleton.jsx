const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-1/3 skeleton rounded" />
      <div className="h-5 w-3/4 skeleton rounded" />
      <div className="h-4 w-1/2 skeleton rounded" />
    </div>
  </div>
);

export default ProductCardSkeleton;

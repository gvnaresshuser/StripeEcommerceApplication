import { Link } from "react-router-dom";
import type { Product } from "../../api/productApi";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden h-full cursor-pointer">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800">
            {product.name}
          </h2>

          <p className="mt-2 text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">
              ${Number(product.price).toFixed(2)}
            </span>

            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

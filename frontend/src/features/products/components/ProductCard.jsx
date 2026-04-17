import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { title, description, price, images } = product;
  const mainImage = images?.[0]?.url || "https://via.placeholder.com/300";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-lacquered-licorice/5">
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-albescent-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-copper-green border border-copper-green/20">
          {price.currency} {price.amount.toLocaleString()}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-lacquered-licorice mb-2 line-clamp-1 group-hover:text-copper-green transition-colors">
          {title}
        </h3>
        <p className="text-lacquered-licorice/60 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        
        <div className="flex items-center gap-3 pt-4 border-t border-lacquered-licorice/5">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-playing-hooky/10 text-playing-hooky hover:bg-playing-hooky hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <FaEdit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <FaTrash size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

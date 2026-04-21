import { FaEdit, FaTrash, FaLayerGroup } from "react-icons/fa";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { title, description, price, images, variants } = product;
  const mainImage = images?.[0]?.url;
  const inStock = (variants?.[0]?.stock ?? product.stock) > 0;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-lacquered-licorice/5 hover:shadow-2xl hover:shadow-lacquered-licorice/8 transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-desert-khaki/10">
        {mainImage ? (
          <img src={mainImage} alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-lacquered-licorice/5">
            <FaLayerGroup size={32} className="text-lacquered-licorice/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-lacquered-licorice/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inStock ? "bg-copper-green text-albescent-white" : "bg-lacquered-licorice/60 text-albescent-white"}`}>
            {inStock ? "Live" : "Out of Stock"}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-albescent-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <span className="text-[11px] font-black text-copper-green">
            {price.currency} {price.amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/30 mb-1">
          {variants?.length > 0 ? `${variants.length} variant${variants.length > 1 ? "s" : ""}` : "No variants"}
        </p>
        <h3 className="font-black text-lacquered-licorice text-sm uppercase tracking-tight line-clamp-1 group-hover:text-copper-green transition-colors duration-300 mb-1">
          {title}
        </h3>
        <p className="text-lacquered-licorice/40 text-xs font-medium line-clamp-2 min-h-[2rem] leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-2.5 mt-4 pt-4 border-t border-lacquered-licorice/5">
          <button onClick={() => onEdit(product._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-playing-hooky/8 text-playing-hooky hover:bg-playing-hooky hover:text-white transition-all duration-200 text-[10px] font-black uppercase tracking-widest">
            <FaEdit size={11} /> Edit
          </button>
          <button onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-[10px] font-black uppercase tracking-widest">
            <FaTrash size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

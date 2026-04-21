import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useCart } from "../../cart/hook/useCart";
import Loader from "../../auth/components/Loader";
import Nav from "../components/Nav";
import {
  FaShoppingCart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaArrowLeft,
} from "react-icons/fa";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { handleGetProductDetails } = useProduct();
  const { handleAddToCart } = useCart();
  const loading = useSelector((state) => state.product.loading);
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToBag = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedVariant && product?.variants?.length > 0) {
      alert("Please select a variant (size/color) first!");
      return;
    }

    const res = await handleAddToCart({
      productId: product._id,
      varientId: selectedVariant?._id || product.variants[0]._id, // Fallback if no variants but somehow reachable
      quantity: 1,
    });

    if (res.success) {
      navigate("/cart");
    }
  };

  async function getProductDetails() {
    const res = await handleGetProductDetails(productId);
    setProduct(res);
  }

  // Derived states for dynamic updates
  const displayImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product?.images || [];

  const displayPrice = selectedVariant?.price || product?.price;
  const displayStock = selectedVariant
    ? selectedVariant.stock
    : product?.stock || 0;

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  if (loading && !product) return <Loader />;

  // Handle both null product and error objects returned by the hook
  if (!product || product.error) {
    return (
      <div className="min-h-screen bg-albescent-white flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-black text-lacquered-licorice mb-4 uppercase">
            {product?.error ? "Error Loading Product" : "Product Not Found"}
          </h1>
          <p className="text-lacquered-licorice/60 mb-8 italic max-w-sm text-sm">
            {product?.error ||
              "The product you are looking for might have been removed or is unavailable."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-copper-green text-albescent-white px-6 py-2.5 rounded-full font-black tracking-widest text-xs hover:bg-lacquered-licorice transition-all shadow-lg active:scale-95"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-albescent-white flex flex-col font-sans px-2 sm:px-0">
      <Nav />

      <main className="flex-1 container mx-auto max-w-6xl px-6 py-4 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-lacquered-licorice/60 hover:text-copper-green transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border border-lacquered-licorice/10 flex items-center justify-center group-hover:bg-copper-green group-hover:text-albescent-white transition-all shadow-sm">
            <FaArrowLeft size={12} />
          </div>
          <span className="font-black uppercase tracking-widest text-[10px]">
            Go Back
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Product Images (Swiper) */}
          <div className="space-y-4  w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-desert-khaki/10 border border-lacquered-licorice/5 shadow-xl group">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                navigation={{
                  prevEl: ".swiper-prev",
                  nextEl: ".swiper-next",
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="w-full h-full"
                onSlideChange={(swiper) =>
                  setActiveImageIndex(swiper.activeIndex)
                }
              >
                {displayImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.url}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button className="swiper-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-albescent-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lacquered-licorice z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-copper-green hover:text-albescent-white shadow-lg">
                <FaChevronLeft size={14} />
              </button>
              <button className="swiper-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-albescent-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lacquered-licorice z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-copper-green hover:text-albescent-white shadow-lg">
                <FaChevronRight size={14} />
              </button>
            </div>

            {/* Thumbnail Gallery (Desktop) */}
            <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImageIndex === index
                      ? "border-copper-green scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {product.brand && (
                  <span className="px-2 py-0.5 bg-copper-green/10 text-copper-green text-[9px] font-black tracking-widest uppercase rounded-full border border-copper-green/20">
                    {product.brand}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-playing-hooky/10 text-playing-hooky text-[9px] font-black tracking-widest uppercase rounded-full border border-playing-hooky/20">
                  {product.category || "Premium Edit"}
                </span>
                <span className="px-2 py-0.5 bg-lacquered-licorice/10 text-lacquered-licorice/60 text-[9px] font-black tracking-widest uppercase rounded-full border border-lacquered-licorice/20">
                  {product.gender || "Unisex"}
                </span>
                {displayStock <= 5 && displayStock > 0 && (
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest italic">
                    Only {displayStock} left!
                  </span>
                )}
                {displayStock === 0 && (
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">
                    Out of Stock!
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-lacquered-licorice tracking-tighter uppercase leading-tight">
                {product.title}
              </h1>
              {product.Seller && (
                <p className="text-[10px] font-bold text-lacquered-licorice/40 uppercase tracking-widest">
                  Sold by: <span className="text-copper-green">{product.Seller.fullname}</span>
                </p>
              )}
              {displayPrice && (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-copper-green">
                    {displayPrice.currency}{" "}
                    {displayPrice.amount?.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-lacquered-licorice/30 line-through">
                    {displayPrice.currency}{" "}
                    {(displayPrice.amount * 1.25).toFixed(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-desert-khaki/20 rounded-2xl border border-lacquered-licorice/5">
              <p className="text-lacquered-licorice/70 text-sm font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant Selection */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-lacquered-licorice">
                    Select Variant
                  </h3>
                  {selectedVariant && (
                    <button
                      onClick={() => setSelectedVariant(null)}
                      className="text-[9px] font-black uppercase tracking-widest text-copper-green hover:text-lacquered-licorice transition-colors underline underline-offset-4"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariant === variant;
                    const attributesText = Object.values(variant.attributes || {}).join(" / ");
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(isSelected ? null : variant)}
                        className={`group relative px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          isSelected
                            ? "bg-lacquered-licorice text-albescent-white border-lacquered-licorice shadow-lg scale-105"
                            : "bg-white text-lacquered-licorice border-lacquered-licorice/5 hover:border-copper-green/40 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-albescent-white" : "text-lacquered-licorice"}`}>
                            {attributesText}
                          </span>
                          {!isSelected && (
                            <span className="text-[8px] font-bold text-lacquered-licorice/30 uppercase">
                              {variant.price.currency} {variant.price.amount}
                            </span>
                          )}
                        </div>
                        
                        {/* Stock status indicator */}
                        {variant.stock <= 5 && (
                          <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border-2 border-white ${variant.stock === 0 ? "bg-red-600" : "bg-orange-500"} shadow-sm`} title={variant.stock === 0 ? "Out of stock" : `Only ${variant.stock} left`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specifications Section */}
            {(selectedVariant?.attributes || (product.variants?.length > 0 && product.variants[0].attributes)) && (
              <div className="space-y-4 pt-4 border-t border-lacquered-licorice/5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-lacquered-licorice">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(selectedVariant?.attributes || (product.variants?.length > 0 ? product.variants[0].attributes : {})).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-lacquered-licorice/5">
                        <span className="text-[10px] font-bold text-lacquered-licorice/40 uppercase tracking-wider">{key}</span>
                        <span className="text-[10px] font-black text-lacquered-licorice uppercase tracking-wider">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Hidden fallback if no variants */}
            {(!product.variants || product.variants.length === 0) && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-lacquered-licorice">
                    Size
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black bg-transparent text-lacquered-licorice/40 border-2 border-lacquered-licorice/10 cursor-not-allowed opacity-50"
                      disabled
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToBag}
                className="flex-1 group bg-copper-green text-albescent-white py-3.5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-lacquered-licorice transition-all duration-500 shadow-lg active:scale-95"
              >
                <FaShoppingCart
                  size={14}
                  className="group-hover:scale-110 transition-transform"
                />
                ADD TO BAG
              </button>
              <button className="w-full sm:w-14 h-11 sm:h-auto rounded-2xl border-2 border-lacquered-licorice/10 flex items-center justify-center text-lacquered-licorice hover:bg-lacquered-licorice hover:text-albescent-white transition-all duration-300 group shadow-sm">
                <FaHeart
                  size={14}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-lacquered-licorice/5">
              <div className="flex flex-col items-center text-center gap-1.5">
                <FaTruck className="text-copper-green text-lg" />
                <span className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/60">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <FaUndo className="text-copper-green text-lg" />
                <span className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/60">
                  7-Day Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <FaShieldAlt className="text-copper-green text-lg" />
                <span className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/60">
                  Secure Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-8 bg-lacquered-licorice text-albescent-white/20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[9px] font-black tracking-[0.4em] uppercase">
            © 2026 SNITCH CLOTHING PVT LTD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;

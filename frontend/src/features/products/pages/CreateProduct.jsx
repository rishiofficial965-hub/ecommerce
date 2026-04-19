import { useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct.js";
import { LuPackagePlus, LuImagePlus, LuX, LuPlus, LuTrash2, LuLayers } from "react-icons/lu";
import Loader from "../../auth/components/Loader.jsx";
import Nav from "../components/Nav.jsx";

const CreateProduct = () => {
  const { loading } = useSelector((state) => state.auth);
  const { handleCreateProduct } = useProduct();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variants, setVariants] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant Helpers
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        stock: 0,
        priceAmount: formData.priceAmount,
        priceCurrency: formData.priceCurrency,
        attributes: [{ key: "", value: "" }],
        images: [],
        imagePreviews: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    variants[index].imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return newVariants;
    });
  };

  const handleVariantAttributeChange = (vIndex, aIndex, field, value) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      const newAttrs = [...newVariants[vIndex].attributes];
      newAttrs[aIndex] = { ...newAttrs[aIndex], [field]: value };
      newVariants[vIndex] = { ...newVariants[vIndex], attributes: newAttrs };
      return newVariants;
    });
  };

  const addAttribute = (vIndex) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        attributes: [...newVariants[vIndex].attributes, { key: "", value: "" }],
      };
      return newVariants;
    });
  };

  const removeAttribute = (vIndex, aIndex) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        attributes: newVariants[vIndex].attributes.filter((_, i) => i !== aIndex),
      };
      return newVariants;
    });
  };

  const handleVariantImageChange = (vIndex, e) => {
    const files = Array.from(e.target.files);
    setVariants((prev) => {
      const newVariants = [...prev];
      const previews = files.map((file) => URL.createObjectURL(file));
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        images: [...newVariants[vIndex].images, ...files],
        imagePreviews: [...newVariants[vIndex].imagePreviews, ...previews],
      };
      return newVariants;
    });
  };

  const removeVariantImage = (vIndex, iIndex) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      URL.revokeObjectURL(newVariants[vIndex].imagePreviews[iIndex]);
      const newImages = newVariants[vIndex].images.filter((_, i) => i !== iIndex);
      const newPreviews = newVariants[vIndex].imagePreviews.filter(
        (_, i) => i !== iIndex,
      );
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        images: newImages,
        imagePreviews: newPreviews,
      };
      return newVariants;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("priceAmount", formData.priceAmount);
    data.append("priceCurrency", formData.priceCurrency);

    images.forEach((image) => {
      data.append("images", image);
    });

    // Handle variants
    const serializedVariants = variants.map((v, index) => {
      // Append files with unique keys
      v.images.forEach((img) => {
        data.append(`variant_${index}_images`, img);
      });

      // Format attributes Map
      const attrs = {};
      v.attributes.forEach((attr) => {
        if (attr.key && attr.value) attrs[attr.key] = attr.value;
      });

      return {
        stock: v.stock,
        priceAmount: v.priceAmount,
        priceCurrency: v.priceCurrency,
        attributes: attrs,
      };
    });

    data.append("variants", JSON.stringify(serializedVariants));

    const result = await handleCreateProduct(data);

    if (result && !result.error) {
      // Success: Clear form
      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      });
      setImages([]);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews([]);
      // Clear variant previews
      variants.forEach((v) =>
        v.imagePreviews.forEach((url) => URL.revokeObjectURL(url)),
      );
      setVariants([]);
      alert("Product created successfully!");
    } else if (result?.error) {
      alert(result.error);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
    <Nav/>
    <main className="min-h-screen py-12 px-4 flex items-center justify-center font-['Inter']">
      <div className="max-w-4xl w-full bg-lacquered-licorice/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-playing-hooky/30">
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Sidebar / Info Section */}
          <div className="md:col-span-2 bg-copper-green p-8 text-albescent-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <LuPackagePlus size={48} className="mb-6 opacity-80" />
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                Create New Product
              </h1>
              <p className="text-playing-hooky text-lg leading-relaxed mix-blend-screen opacity-90">
                Showcase your items to the world. Fill in the details to list
                your property or product on Snitch.
              </p>
            </div>

            <div className="mt-12 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">Rich Media Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">
                  Global Currency Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">
                  SEO Optimized Listings
                </span>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-playing-hooky/20 rounded-full blur-3xl animate-soft-rotate" />
          </div>

          {/* Form Section */}
          <div className="md:col-span-3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Vintage Leather Jacket"
                  className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-3 text-albescent-white placeholder:text-playing-hooky/60 focus:outline-none focus:ring-2 focus:ring-copper-green focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your product..."
                  rows="4"
                  className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-3 text-albescent-white placeholder:text-playing-hooky/60 focus:outline-none focus:ring-2 focus:ring-copper-green focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-3 text-albescent-white placeholder:text-playing-hooky/60 focus:outline-none focus:ring-2 focus:ring-copper-green focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">
                    Currency
                  </label>
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-3 text-albescent-white focus:outline-none focus:ring-2 focus:ring-copper-green focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">
                  Product Images
                </label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-playing-hooky/30 group"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-lacquered-licorice/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <LuX className="text-white" size={20} />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-playing-hooky/40 rounded-lg cursor-pointer hover:border-copper-green hover:bg-copper-green/10 transition-all text-playing-hooky hover:text-copper-green">
                      <LuImagePlus size={24} />
                      <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">
                        Add
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-6 pt-6 border-t border-playing-hooky/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-albescent-white flex items-center gap-2">
                    <LuLayers className="text-copper-green" size={24} />
                    Product Variants
                  </h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 text-sm font-semibold text-albescent-white hover:text-copper-green transition-colors bg-copper-green/10 px-4 py-2 rounded-lg"
                  >
                    <LuPlus size={18} />
                    Add Variant
                  </button>
                </div>

                {variants.map((variant, vIndex) => (
                  <div
                    key={vIndex}
                    className="bg-lacquered-licorice/50 border border-playing-hooky/30 rounded-2xl p-6 space-y-6 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeVariant(vIndex)}
                      className="absolute top-4 right-4 text-playing-hooky hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <LuTrash2 size={20} />
                    </button>

                    <h4 className="text-sm font-bold uppercase tracking-widest text-playing-hooky">
                      Variant #{vIndex + 1}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-albescent-white text-xs font-medium mb-1 ml-1">
                          Price
                        </label>
                        <input
                          type="number"
                          name="priceAmount"
                          value={variant.priceAmount}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          placeholder="Variant Price"
                          className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-2 text-albescent-white text-sm focus:outline-none focus:ring-2 focus:ring-copper-green transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-albescent-white text-xs font-medium mb-1 ml-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          placeholder="Stock Quantity"
                          className="w-full bg-lacquered-licorice border border-playing-hooky/40 rounded-xl px-4 py-2 text-albescent-white text-sm focus:outline-none focus:ring-2 focus:ring-copper-green transition-all"
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="space-y-3">
                      <label className="block text-albescent-white text-xs font-medium ml-1">
                        Attributes (e.g. Color: Red)
                      </label>
                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Key"
                            value={attr.key}
                            onChange={(e) =>
                              handleVariantAttributeChange(
                                vIndex,
                                aIndex,
                                "key",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-lacquered-licorice border border-playing-hooky/40 rounded-lg px-3 py-2 text-albescent-white text-xs focus:outline-none focus:ring-1 focus:ring-copper-green"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={attr.value}
                            onChange={(e) =>
                              handleVariantAttributeChange(
                                vIndex,
                                aIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-lacquered-licorice border border-playing-hooky/40 rounded-lg px-3 py-2 text-albescent-white text-xs focus:outline-none focus:ring-1 focus:ring-copper-green"
                          />
                          <button
                            type="button"
                            onClick={() => removeAttribute(vIndex, aIndex)}
                            className="text-playing-hooky hover:text-red-400 p-2"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addAttribute(vIndex)}
                        className="text-[10px] uppercase tracking-wider font-bold text-copper-green hover:underline flex items-center gap-1"
                      >
                        <LuPlus size={12} /> Add Attribute
                      </button>
                    </div>

                    {/* Variant Images */}
                    <div>
                      <label className="block text-albescent-white text-xs font-medium mb-2 ml-1">
                        Variant Images
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.imagePreviews.map((url, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-playing-hooky/30 group/img"
                          >
                            <img
                              src={url}
                              alt="variant"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(vIndex, i)}
                              className="absolute inset-0 bg-lacquered-licorice/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <LuX size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-playing-hooky/40 rounded-lg cursor-pointer hover:border-copper-green hover:bg-copper-green/10 transition-all text-playing-hooky hover:text-copper-green">
                          <LuImagePlus size={20} />
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleVariantImageChange(vIndex, e)}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-copper-green text-albescent-white font-bold py-4 rounded-xl shadow-lg hover:bg-copper-green/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Create Listing
                <LuPackagePlus
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default CreateProduct;

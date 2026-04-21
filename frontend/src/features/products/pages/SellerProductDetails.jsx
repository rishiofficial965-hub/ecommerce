import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  LuPackage,
  LuImagePlus,
  LuX,
  LuPlus,
  LuTrash2,
  LuLayers,
  LuSave,
  LuArrowLeft,
} from "react-icons/lu";
import Loader from "../../auth/components/Loader";
import Nav from "../components/Nav";

const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails, handleUpdateProduct } = useProduct();
  const loading = useSelector((state) => state.product.loading);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [variants, setVariants] = useState([]);

  async function getProductDetails() {
    const res = await handleGetProductDetails(productId);
    if (res && !res.error) {
      setFormData({
        title: res.title,
        description: res.description,
        priceAmount: res.price.amount,
        priceCurrency: res.price.currency,
      });
      setExistingImages(res.images || []);
      setVariants(
        (res.variants || []).map((v) => ({
          stock: v.stock,
          priceAmount: v.price.amount,
          priceCurrency: v.price.currency,
          attributes: Object.entries(v.attributes || {}).map(
            ([key, value]) => ({
              key,
              value,
            }),
          ),
          existingImages: v.images || [],
          newImages: [],
          newImagePreviews: [],
        })),
      );
    }
  }

  useEffect(() => {
    if (productId) getProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
        existingImages: [],
        newImages: [],
        newImagePreviews: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    variants[index].newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
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
        attributes: newVariants[vIndex].attributes.filter(
          (_, i) => i !== aIndex,
        ),
      };
      return newVariants;
    });
  };

  const handleVariantNewImageChange = (vIndex, e) => {
    const files = Array.from(e.target.files);
    setVariants((prev) => {
      const newVariants = [...prev];
      const previews = files.map((file) => URL.createObjectURL(file));
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        newImages: [...newVariants[vIndex].newImages, ...files],
        newImagePreviews: [
          ...newVariants[vIndex].newImagePreviews,
          ...previews,
        ],
      };
      return newVariants;
    });
  };

  const removeVariantNewImage = (vIndex, iIndex) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      URL.revokeObjectURL(newVariants[vIndex].newImagePreviews[iIndex]);
      const newImages = newVariants[vIndex].newImages.filter(
        (_, i) => i !== iIndex,
      );
      const newPreviews = newVariants[vIndex].newImagePreviews.filter(
        (_, i) => i !== iIndex,
      );
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        newImages: newImages,
        newImagePreviews: newPreviews,
      };
      return newVariants;
    });
  };

  const removeVariantExistingImage = (vIndex, iIndex) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      const newExisting = newVariants[vIndex].existingImages.filter(
        (_, i) => i !== iIndex,
      );
      newVariants[vIndex] = {
        ...newVariants[vIndex],
        existingImages: newExisting,
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
    // Send existing images that we want to KEEP
    data.append("existingImages", JSON.stringify(existingImages));

    // Only upload if new images are provided
    if (newImages.length > 0) {
      newImages.forEach((image) => {
        data.append("images", image);
      });
    }

    // Handle variants
    const serializedVariants = variants.map((v, index) => {
      // Append new files with unique keys
      v.newImages.forEach((img) => {
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
        // Include existing images URLs so backend knows what to KEEP
        images: v.existingImages,
      };
    });

    data.append("variants", JSON.stringify(serializedVariants));

    const result = await handleUpdateProduct(productId, data);

    if (result && result.success) {
      alert("Product updated successfully!");
      navigate("/seller/dashboard");
    } else if (result?.error) {
      alert(result.error);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Nav />
      <main className="min-h-screen py-8 px-4 flex items-center justify-center font-['Inter']">
        <div className="max-w-4xl w-full bg-lacquered-licorice/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-playing-hooky/30">
          <div className="grid grid-cols-1 md:grid-cols-5 h-full">
            {/* Sidebar / Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-copper-green to-playing-hooky p-8 text-albescent-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <button
                  onClick={() => navigate(-1)}
                  className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
                >
                  <LuArrowLeft size={16} />
                  Back
                </button>
                <LuPackage size={42} className="mb-4 opacity-90" />
                <h1 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">
                  Edit Product
                </h1>
                <p className="text-albescent-white/80 text-sm leading-relaxed font-medium">
                  Refine your listing. You can update the basic info, manage
                  variants, and refresh your product's visual presence.
                </p>
              </div>

              {/* Decorative background glass element */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Scrollable Form Section */}
            <div className="md:col-span-3 p-6 md:p-10 max-h-[85vh] overflow-y-auto scrollbar-hide">
              <form onSubmit={handleSubmit} className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-desert-khaki border-b border-playing-hooky/20 pb-2">
                    General Information
                  </h3>
                  <div>
                    <label className="block text-albescent-white/90 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-4 py-3 text-sm text-albescent-white focus:outline-none focus:ring-2 focus:ring-copper-green transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-albescent-white/90 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-4 py-3 text-sm text-albescent-white focus:outline-none focus:ring-2 focus:ring-copper-green transition-all resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-albescent-white/90 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                        Base Price
                      </label>
                      <input
                        type="number"
                        name="priceAmount"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-4 py-3 text-sm text-albescent-white focus:outline-none focus:ring-2 focus:ring-copper-green transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-albescent-white/90 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                        Currency
                      </label>
                      <select
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-4 py-3 text-sm text-albescent-white focus:outline-none focus:ring-2 focus:ring-copper-green transition-all cursor-pointer appearance-none"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-desert-khaki border-b border-playing-hooky/20 pb-2">
                    Product Imagery
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-albescent-white/90 text-[10px] font-bold uppercase tracking-wider mb-1 ml-1">
                      Current & New Images
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, i) => (
                        <div
                          key={`existing-${i}`}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-playing-hooky/30 group"
                        >
                          <img
                            src={img.url}
                            className="w-full h-full object-cover grayscale-[30%] opacity-80"
                            alt="existing"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            className="absolute inset-0 bg-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <LuTrash2 className="text-white" size={18} />
                          </button>
                          <div className="absolute top-0 right-0 p-1 bg-lacquered-licorice/40">
                            <span className="text-[6px] font-bold text-white uppercase italic">
                              Orig
                            </span>
                          </div>
                        </div>
                      ))}
                      {newImagePreviews.map((url, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-copper-green shadow-lg shadow-copper-green/20 group"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                            alt="new"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute inset-0 bg-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <LuX className="text-white" size={18} />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-playing-hooky/40 rounded-xl cursor-pointer hover:border-copper-green hover:bg-copper-green/10 transition-all text-playing-hooky hover:text-copper-green">
                        <LuImagePlus size={20} />
                        <span className="text-[7px] mt-1 font-bold uppercase tracking-tighter">
                          Add New
                        </span>
                        <input
                          type="file"
                          multiple
                          onChange={handleNewImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    {(newImages.length > 0 || existingImages.length > 0)}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-playing-hooky/20 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-desert-khaki">
                      Product Variants
                    </h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-albescent-white hover:text-copper-green transition-colors bg-white/5 py-1.5 px-3 rounded-lg border border-white/5"
                    >
                      <LuPlus size={14} />
                      New Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {variants.map((v, vIndex) => (
                      <div
                        key={vIndex}
                        className="bg-lacquered-licorice/40 border border-playing-hooky/20 rounded-2xl p-5 space-y-4 relative group hover:border-playing-hooky/40 transition-all shadow-inner"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-playing-hooky flex items-center gap-2">
                            <LuLayers size={14} className="text-copper-green" />
                            Variant #{vIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeVariant(vIndex)}
                            className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-albescent-white/40 mb-1.5 ml-1">
                              Variant Price
                            </label>
                            <input
                              type="number"
                              name="priceAmount"
                              value={v.priceAmount}
                              onChange={(e) => handleVariantChange(vIndex, e)}
                              className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-3 py-2 text-xs text-albescent-white focus:ring-1 focus:ring-copper-green outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-albescent-white/40 mb-1.5 ml-1">
                              In Stock
                            </label>
                            <input
                              type="number"
                              name="stock"
                              value={v.stock}
                              onChange={(e) => handleVariantChange(vIndex, e)}
                              className="w-full bg-lacquered-licorice border border-playing-hooky/30 rounded-xl px-3 py-2 text-xs text-albescent-white focus:ring-1 focus:ring-copper-green outline-none"
                            />
                          </div>
                        </div>

                        {/* Attributes Array */}
                        <div className="space-y-3">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-albescent-white/40 ml-1">
                            Technical Attributes
                          </label>
                          {v.attributes.map((attr, aIndex) => (
                            <div key={aIndex} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Attribute (e.g. Color)"
                                value={attr.key}
                                onChange={(e) =>
                                  handleVariantAttributeChange(
                                    vIndex,
                                    aIndex,
                                    "key",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 bg-lacquered-licorice border border-playing-hooky/30 rounded-lg px-2 py-1.5 text-[10px] text-albescent-white focus:border-copper-green outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. Crimson)"
                                value={attr.value}
                                onChange={(e) =>
                                  handleVariantAttributeChange(
                                    vIndex,
                                    aIndex,
                                    "value",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 bg-lacquered-licorice border border-playing-hooky/30 rounded-lg px-2 py-1.5 text-[10px] text-albescent-white focus:border-copper-green outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeAttribute(vIndex, aIndex)}
                                className="text-red-400/40 hover:text-red-400 px-1"
                              >
                                <LuX size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addAttribute(vIndex)}
                            className="text-[9px] font-bold uppercase tracking-wider text-copper-green hover:brightness-125 flex items-center gap-1 mt-1 ml-1"
                          >
                            <LuPlus size={10} /> Add Property
                          </button>
                        </div>

                        {/* Variant Imagery */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-albescent-white/40 ml-1">
                            Media
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {v.existingImages.map((img, i) => (
                              <div
                                key={`v-existing-${i}`}
                                className="relative w-10 h-10 rounded-lg overflow-hidden border border-playing-hooky/20 group/vex"
                              >
                                <img
                                  src={img.url}
                                  className="w-full h-full object-cover grayscale-[50%] opacity-60"
                                  alt="v-orig"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantExistingImage(vIndex, i)
                                  }
                                  className="absolute inset-0 bg-red-500/30 flex items-center justify-center opacity-0 group-hover/vex:opacity-100 transition-opacity"
                                >
                                  <LuTrash2 size={12} className="text-white" />
                                </button>
                              </div>
                            ))}
                            {v.newImagePreviews.map((url, i) => (
                              <div
                                key={`v-new-${i}`}
                                className="relative w-10 h-10 rounded-lg overflow-hidden border border-copper-green group/vimg"
                              >
                                <img
                                  src={url}
                                  className="w-full h-full object-cover"
                                  alt="v-new"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantNewImage(vIndex, i)
                                  }
                                  className="absolute inset-0 bg-red-500/30 flex items-center justify-center opacity-0 group-hover/vimg:opacity-100 transition-opacity"
                                >
                                  <LuX size={12} className="text-white" />
                                </button>
                              </div>
                            ))}
                            <label className="w-10 h-10 flex items-center justify-center border-2 border-dashed border-playing-hooky/30 rounded-lg cursor-pointer hover:border-copper-green hover:bg-copper-green/10 transition-all text-playing-hooky">
                              <LuImagePlus size={16} />
                              <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                  handleVariantNewImageChange(vIndex, e)
                                }
                                className="hidden"
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-copper-green to-playing-hooky text-albescent-white font-black py-4 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 group text-sm uppercase tracking-[0.2em] mt-8"
                >
                  <LuSave
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Update Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SellerProductDetails;

import { useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct.js";
import { LuPackagePlus, LuImagePlus, LuX } from "react-icons/lu";
import Loader from "../../auth/components/Loader.jsx";

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
      imagePreviews.forEach(url => URL.revokeObjectURL(url)); // Clean up memory
      setImagePreviews([]);
      alert("Product created successfully!");
    } else if (result?.error) {
      alert(result.error);
    }
  };

  if(loading) return <Loader/>

  return (
    <main className="min-h-screen py-12 px-4 flex items-center justify-center font-['Inter']">
      <div className="max-w-4xl w-full bg-lacquered-licorice/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-playing-hooky/30">
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Sidebar / Info Section */}
          <div className="md:col-span-2 bg-copper-green p-8 text-albescent-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <LuPackagePlus size={48} className="mb-6 opacity-80" />
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Create New Product</h1>
              <p className="text-playing-hooky text-lg leading-relaxed mix-blend-screen opacity-90">
                Showcase your items to the world. Fill in the details to list your property or product on Snitch.
              </p>
            </div>
            
            <div className="mt-12 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">Rich Media Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">Global Currency Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-desert-khaki animate-pulse" />
                <span className="text-sm opacity-70">SEO Optimized Listings</span>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-playing-hooky/20 rounded-full blur-3xl animate-soft-rotate" />
          </div>

          {/* Form Section */}
          <div className="md:col-span-3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">Product Title</label>
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
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">Description</label>
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
                  <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">Price</label>
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
                  <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">Currency</label>
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
                <label className="block text-albescent-white text-sm font-medium mb-2 ml-1">Product Images</label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-playing-hooky/30 group">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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
                      <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">Add</span>
                      <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-copper-green text-albescent-white font-bold py-4 rounded-xl shadow-lg hover:bg-copper-green/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Create Listing
                <LuPackagePlus size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateProduct;


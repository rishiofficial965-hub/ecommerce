import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    loading: false,
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSellerProducts, setProducts, setProductLoading } = productSlice.actions;
export default productSlice.reducer;

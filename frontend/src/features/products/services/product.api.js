import axios from "axios"

const productApi = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export const createProduct = async (data) => {
    const response = await productApi.post("/create", data)
    return response.data
}

export const getSellerProducts = async () => {
    const response = await productApi.get("/seller")
    return response.data
}
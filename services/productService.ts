import { ProductType } from "@/types/types";
import axios from "axios";

const productHelper = {
  getProducts: async () => {
    const products = await axios.get("/api/products");
    return products.data;
  },
  getProductById: async (id: string) => {
    const product = await axios.get(`/api/products?id=${id}`);
    return product.data;
  },
  deleteProduct: async (id: string) => {
    const deletedProduct = await axios.delete(`/api/products?id=${id}`);
    return deletedProduct.data;
  },
  createProduct: async (data: ProductType) => {
    const createdData = await axios.post("/api/products", data);
  },
  updateProduct: async (data: ProductType, _id: string) => {
    const updatedData = await axios.put("/api/products", { ...data, _id });
  },
};

export default productHelper;

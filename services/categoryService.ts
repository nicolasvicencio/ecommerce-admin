import axios from "axios";

export default {
  createCategory: async (name: string) => {
    const category = await axios.post("/api/categories", { name });
    return category.data;
  },
  getCategories: async () => {
    const categories = await axios.get("/api/categories");
    return categories.data;
  },
};

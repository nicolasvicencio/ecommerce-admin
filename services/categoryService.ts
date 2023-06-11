import { PropertyType } from "@/types/types";
import axios from "axios";
import { ObjectId } from "mongodb";

export type Data = {
  categoryName: string;
  parentCategory?: string | ObjectId;
  properties?: PropertyType[] | PropertyType;
};

export default {
  createCategory: async (data: Data) => {
    const category = await axios.post("/api/categories", data);
    return category.data;
  },
  getCategories: async () => {
    const categories = await axios.get("/api/categories");
    return categories.data;
  },
  editCategories: async (_id: ObjectId, data: {}) => {
    const category = await axios.put("/api/categories", { ...data, _id });
    return category.data;
  },
  deleteCategory: async (id: ObjectId) => {
    const deletedCategory = await axios.delete("/api/categories?id=" + id);
    return deletedCategory.data;
  },
};

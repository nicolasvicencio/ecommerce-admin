import { Layout } from "@/components";
import categoryService from "@/services/categoryService";
import React, { FormEvent, useEffect, useState } from "react";

type CategoryType = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
};

export default function categories() {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    await categoryService.createCategory(categoryName);
    setCategoryName("");
    fetchCategories();
  };

  const fetchCategories = () => {
    categoryService.getCategories().then((res) => setCategories(res));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>New category name</label>
      <form
        className="flex gap-2 items-center justify-center"
        onSubmit={addCategory}
      >
        <input
          className="mb-0"
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button className="btn btn-primary p-1">Add</button>
      </form>

      <table className="mt-4">
        <thead>
          <tr>
            <th>Category name</th>
          </tr>
        </thead>
        <tbody>
          {categories &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

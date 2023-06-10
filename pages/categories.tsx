import { Layout } from "@/components";
import categoryService, { Data } from "@/services/categoryService";
import { ObjectId } from "mongodb";
import React, { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type CategoryType = {
  _id: ObjectId;
  name: string;
  parent: CategoryType;
  createdAt: string;
  updatedAt: string;
  _v: number;
};

export default function categories() {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [parentCategory, setParentCategory] = useState<string | ObjectId>("");
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );
  const MySwal = withReactContent(Swal);

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    const data: Data = { categoryName, parentCategory };

    if (editedCategory) {
      parentCategory === ""
        ? await categoryService.editCategories(editedCategory._id, {
            categoryName,
          })
        : await categoryService.editCategories(editedCategory._id, data);
      setEditedCategory(null);
    } else {
      parentCategory === ""
        ? await categoryService.createCategory({ categoryName })
        : await categoryService.createCategory(data);
    }

    setCategoryName("");
    fetchCategories();
  };

  const fetchCategories = () => {
    categoryService.getCategories().then((res) => setCategories(res));
  };

  const editCategory = (category: CategoryType) => {
    setEditedCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parent?._id);
  };

  const deleteCategory = async (category: CategoryType) => {
    MySwal.fire({
      title: (
        <p>
          Delete category <b>'{category.name}'</b> ?
        </p>
      ),
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d55",
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: async () => {
        const res = await categoryService.deleteCategory(category._id);
        fetchCategories();
        if (res) MySwal.fire(<p>Category removed!</p>);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new Category"}
      </label>
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
        <select
          className="mb-0"
          value={parentCategory as string}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">No parent category</option>
          {categories.map((category: CategoryType) => (
            // @ts-ignore
            <option value={category._id!}>{category.name}</option>
          ))}
        </select>
        <button className="btn btn-primary p-1">
          {editedCategory ? "Update" : "Add"}
        </button>
      </form>

      <table className="mt-4">
        <thead>
          <tr>
            <th>Category name</th>
            <th>Parent category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category.parent?.name}</td>
                <td className="gap-2 flex">
                  <button
                    className="btn btn-primary"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

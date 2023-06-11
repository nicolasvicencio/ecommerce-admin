import { Layout } from "@/components";
import categoryService, { Data } from "@/services/categoryService";
import { CategoryHandlerParams, CategoryType } from "@/types/types";
import { ObjectId } from "mongodb";
import React, { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function categories() {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [parentCategory, setParentCategory] = useState<string | ObjectId>("");
  const [properties, setProperties] = useState<Array<any>>();
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (categoryName === "") return;
    const configProperties = properties?.map((p) => {
      return {
        name: p.name,
        values: p.values.split(","),
      };
    });

    const data: Data = {
      categoryName,
      parentCategory,
      properties: configProperties || [],
    };

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
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };
  const fetchCategories = () => {
    categoryService.getCategories().then((res) => setCategories(res));
  };

  const editCategory = (category: CategoryType) => {
    setEditedCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties);
  };

  const deleteCategory = async (category: CategoryType) => {
    const MySwal = withReactContent(Swal);
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
        await categoryService.deleteCategory(category._id);
        fetchCategories();
      },
    });
  };

  function cancelEdited() {
    setEditedCategory(null);
    setCategoryName("");
    setParentCategory("");
    setProperties([]);
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyNameChange({
    index,
    property,
    newValue,
  }: CategoryHandlerParams) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newValue;
      return properties;
    });
  }
  function handlePropertyValuesChange({
    index,
    property,
    newValue,
  }: CategoryHandlerParams) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  }
  function removeProperty(indexToRemove: number) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

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
      <form className="gap-1 flex flex-col" onSubmit={addCategory}>
        <div className="flex gap-2 items-center">
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
        </div>
        <div>
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn btn-default p-0"
          >
            Add property
          </button>
          {properties?.length > 0 &&
            properties?.map((property, index) => (
              <div className="flex gap-1 mt-2 items-center ">
                <input
                  type="text"
                  className="mb-0"
                  placeholder="Property name (example: color)"
                  onChange={(e) =>
                    handlePropertyNameChange({
                      index,
                      property,
                      newValue: e.target.value,
                    })
                  }
                  value={property.name}
                />
                <input
                  className="mb-0"
                  type="text"
                  placeholder="Values, comma separated"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange({
                      index,
                      property,
                      newValue: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="btn btn-default "
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-2 items-center">
          {editedCategory && (
            <button
              type="button"
              className="btn btn-default py-2"
              onClick={cancelEdited}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary p-1 mt-2 w-fit">
            {editedCategory ? "Update" : "Save"}
          </button>
        </div>
      </form>
      {!editedCategory && (
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
      )}
    </Layout>
  );
}

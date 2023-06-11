import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import productService from "@/services/productService";
import { CategoryType, ProductType } from "@/types/types";
import uploadService from "@/services/uploadService";
import { Spinner } from "../Spinner";
import { ReactSortable } from "react-sortablejs";
import categoryService from "@/services/categoryService";

export type ProductFormProps = {
  _id?: string;
  title?: string;
  category: string;
  description?: string;
  price?: string;
  images?: [];
  properties: {};
};

const ProductForm = ({
  _id,
  title: currentTitle,
  category: currentCategory,
  description: currentDescription,
  price: currentPrice,
  images: currentImages,
  properties: currentProperties,
}: ProductFormProps) => {
  const [title, setTitle] = useState<string>(currentTitle || "");
  const [category, setCategory] = useState<any>(currentCategory || "");
  const [description, setDescription] = useState<string>(
    currentDescription || ""
  );
  const [price, setPrice] = useState<string>(currentPrice || "");
  const [productProperties, setProductProperties] = useState<any>(
    currentProperties || {}
  );
  const [images, setImages] = useState<[]>(currentImages || []);
  const [goToProduct, setGoToProduct] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const router = useRouter();

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    const data: ProductType = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      productService.updateProduct(data, _id);
    } else {
      productService.createProduct(data);
    }
    setGoToProduct(true);
  };

  if (goToProduct) {
    router.push("/products");
  }

  const uploadImage = async (e: any) => {
    const files = e.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();

      for (const file of files) {
        data.append("file", file);
      }
      const response = await uploadService.createUpload(data);
      setImages((prev): any => {
        return [...prev, ...response.links];
      });
      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images: never[]) => setImages(images as []);
  const propertiesToFill = [];
  if (categories?.length > 0 && category) {
    let categoryInfo = categories.find((c) => c._id === category);
    console.log(categoryInfo);
    //@ts-ignore
    propertiesToFill.push(...categoryInfo?.properties);
    while (categoryInfo?.parent?._id) {
      const parentCategory = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?._id
      );
      console.log(parentCategory);
      propertiesToFill.push(...parentCategory?.properties);
      categoryInfo = parentCategory;
    }
  }
  function changeProductProperties(propertyName: any, value: string) {
    setProductProperties((prev: any) => {
      const newProductProps = { ...prev };
      newProductProps[propertyName] = value;
      return newProductProps;
    });
  }

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res: CategoryType[]) => setCategories(res));
  }, []);

  return (
    <form onSubmit={saveProduct}>
      <label> Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories?.length! > 0 &&
          categories?.map((category) => (
            //@ts-ignore
            <option value={category._id}>{category.name}</option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                className="w-fit"
                value={productProperties[p.name]}
                onChange={(e) =>
                  changeProductProperties(p.name, e.target.value)
                }
              >
                {p.values.map((value) => (
                  <option value={value}>
                    {value[0].toUpperCase() + value.substring(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Images </label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-2 items-center justify-center"
        >
          {!!images?.length &&
            images.map((image: string) => (
              <div
                key={image}
                className="h-24 w-24 shadow-md rounded-sm border border-gray-300"
              >
                <img src={image} alt="image" className="rounded-md "></img>
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="w-24 h-24 flex justify-center ">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 flex flex-col gap-1 justify-center items-center text-sm text-neutral-800 bg-white shadow-md border-gray-400 rounded-sm hover:bg-gray-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImage} />
        </label>
      </div>
      <label> Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label> Price (in USD)</label>
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button className="btn-primary" type="submit">
        {_id ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default ProductForm;

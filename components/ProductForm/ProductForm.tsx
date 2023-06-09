import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import productService from "@/services/productService";
import { Product } from "@/types/types";
import uploadService from "@/services/uploadService";
import { Spinner } from "../Spinner";
import { ReactSortable } from "react-sortablejs";

export type ProductFormProps = {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  images?: [];
};

const ProductForm = ({
  _id,
  title: currentTitle,
  description: currentDescription,
  price: currentPrice,
  images: currentImages,
}: ProductFormProps) => {
  const [title, setTitle] = useState<string>(currentTitle || "");
  const [description, setDescription] = useState<string>(
    currentDescription || ""
  );
  const [price, setPrice] = useState<string>(currentPrice || "");
  const [images, setImages] = useState<[]>(currentImages || []);
  const [goToProduct, setGoToProduct] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  console.log({ currentImages });

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    const data: Product = { title, description, price, images };

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

  const updateImagesOrder = (images: never[]) => setImages(images as []) 
  

  return (
    <form onSubmit={saveProduct}>
      <label> Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Images </label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((image: string) => (
              <div key={image} className="h-24 w-24">
                <img src={image} alt="image" className="rounded-md "></img>
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="w-24 h-24 flex justify-center ">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-16 flex gap-1 justify-center items-center text-sm text-neutral-500 bg-gray-200 rounder-sm hover:bg-gray-100 cursor-pointer">
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

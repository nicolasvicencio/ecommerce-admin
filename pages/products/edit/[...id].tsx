import { Layout, ProductForm } from "@/components";
import productService from "@/services/productService";
import { ProductType } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EditProuctPage() {
  const [productData, setProductData] = useState<ProductType>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    productService
      .getProductById(id[0])
      .then((res: ProductType) => setProductData(res));
  }, [id]);

  return (
    <Layout>
      <h1>Edit Product</h1>
      {/* @ts-ignore */}
      {productData && <ProductForm {...productData} />}
    </Layout>
  );
}

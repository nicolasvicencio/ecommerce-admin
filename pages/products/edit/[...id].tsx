import { Layout, ProductForm } from "@/components";
import productService from "@/services/productService";
import { Product } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EditProuctPage() {
  const [productData, setProductData] = useState<Product>();
  const router = useRouter();
  const {id} = router.query

  useEffect(() => {
    if (!id) return;
    productService.getProductById(id[0]).then((res: Product) => setProductData(res));
  }, [id]);

  return (
    <Layout>
      {/* @ts-ignore */}
      <ProductForm {...productData} />
    </Layout>
  );
}

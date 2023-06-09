import { Layout } from "@/components";
import productService from "@/services/productService";
import { Product } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {};

export default function DeletePage({}: Props) {
	const [productInfo, setProductInfo] = useState<Product | null>(null)
  const router = useRouter();
	const {id} = router.query

  const goBack = () => {
    router.push("/products");
  };

  const deleteProduct = async() => {
   await productService.deleteProduct(id![0])
    goBack()
  }

	useEffect(() => {
		if(!id) return
		productService.getProductById(id![0]).then((res: Product) => setProductInfo(res))
	}, [id])

  if(!productInfo) return <Layout><div>Loading...</div></Layout>

  return (
    <Layout>
      <h1 className="text-center mb-4">Do you really want to delete &nbsp; "{productInfo?.title}" ?</h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>Yes</button>
        <button className="btn-default" onClick={goBack}>No</button>
      </div>
    </Layout>
  );
}

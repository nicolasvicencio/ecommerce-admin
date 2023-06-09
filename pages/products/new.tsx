
import { Layout, ProductForm } from '@/components';
import React from 'react'

type Props = {}

export default function NewProduct({}: Props) {
	return (
		<Layout>
			<h1>Create product</h1>
			<ProductForm />
		</Layout>
  );
}
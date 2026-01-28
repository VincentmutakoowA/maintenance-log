'use client'

import ProductForm from "@/app/admin/products/product-form"
import { useParams } from "next/navigation"

export default function EditProductPage() {
  const { id } = useParams()
  return <ProductForm productId={id as string} />
}

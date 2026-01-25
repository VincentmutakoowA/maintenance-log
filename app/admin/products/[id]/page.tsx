'use client'

import ProductForm from "@/components/product-form"
import { useParams } from "next/navigation"

export default function EditProductPage() {
  const { id } = useParams()
  return <ProductForm productId={id as string} />
}

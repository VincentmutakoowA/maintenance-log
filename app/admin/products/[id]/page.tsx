'use client'

import ProductForm from "@/app/admin/products/form"
import { useParams } from "next/navigation"

export default function EditProductPage() {
  const { id } = useParams()
  return <ProductForm productId={id as string} />
}

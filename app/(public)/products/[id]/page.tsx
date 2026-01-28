'use client'

import ProductInfo from "@/app/(public)/products/product-info"
import { useParams } from "next/navigation"

export default function ProductInfoPage() {
  const { id } = useParams()
  return <ProductInfo productId={id as string} />
}

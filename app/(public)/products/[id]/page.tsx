'use client'

import ProductInfo from "@/components/product-info"
import { useParams } from "next/navigation"

export default function ProductInfoPage() {
  const { id } = useParams()
  return <ProductInfo productId={id as string} />
}

'use client'

import ProductInfo from "@/app/(public)/products/info"
import { useParams } from "next/navigation"

export default function ProductInfoPage() {
  const { id } = useParams()
  return <ProductInfo productId={id as string} />
}

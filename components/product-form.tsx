'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Cover from "@/components/product-cover"

export default function ProductForm({ productId }: { productId?: string }) {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const isEdit = Boolean(productId)

  // fetch product if editing
  useEffect(() => {
    if (!productId) return

    const loadProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("name, price, cover_url")
        .eq("id", productId)
        .single()

      if (data) {
        setName(data.name)
        setPrice(String(data.price))
        setCoverUrl(data.cover_url)
        //console.log("Image url ", coverUrl)
      }
    }

    loadProduct()
  }, [productId, supabase])

  const saveProduct = async () => {
    setLoading(true)

    const payload = {
      id: productId,
      name,
      price: Number(price),
      cover_url: coverUrl,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from("products")
      .upsert(payload)

    setLoading(false)

    if (error) {
      alert(error.message)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Product" : "Add Product"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <Input
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <Cover
          uid={productId ?? "new"}
          url={coverUrl}
          size={150}
          onUpload={setCoverUrl}
        />
      </CardContent>

      <CardFooter>
        <Button onClick={saveProduct} disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </CardFooter>
    </Card>
  )
}

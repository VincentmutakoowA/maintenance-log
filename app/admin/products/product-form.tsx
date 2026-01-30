'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCover from "@/app/admin/products/product-cover"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getProductById, saveProductAction, deleteProductAction } from "./actions"
import ProductAvailabilitySelect from "./product-availability-select"
import { AvailabilityStatus } from "@/lib/types"



export default function ProductForm({ productId }: { productId?: string }) {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [coverPath, setCoverPath] = useState<string | null>(null)
  const [availability, setAvailability] = useState<AvailabilityStatus>("available")
  const isEdit = Boolean(productId)


  // fetch product if editing
  useEffect(() => {
    if (!productId) return
    const loadProduct = async () => {
      const data = await getProductById(productId)
      if (data) {
        setName(data.name)
        setPrice(String(data.price))
        setCoverUrl(data.cover_url)
        setCoverPath(data.cover_path)
        //console.log("Image url ", coverUrl)
      }
    }
    loadProduct()
  }, [productId, supabase])

  return (
    <Card className="max-w-xl">

      <CardHeader>
        <CardTitle>{isEdit ? "Edit" : "Add"}</CardTitle>
      </CardHeader>

      <form action={saveProductAction}>
        {/**/}
        {isEdit && (<input type="hidden" name="id" value={productId} />)}
        <input type="hidden" name="cover_url" value={coverUrl ?? ""} />
        <input type="hidden" name="cover_path" value={coverPath ?? ""} />
        <input type="hidden" name="availability" value={availability} />

        <CardContent className="space-y-4">
          <Input
            name="name"
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />

          <ProductAvailabilitySelect
            availability={availability}
            onChange={setAvailability}>
          </ProductAvailabilitySelect>


          <Label>Cover Image</Label>

          <ProductCover
            uid={productId ?? "new"}
            url={coverUrl}
            size={150}
            onUpload={(url, path) => {
              setCoverUrl(url)
              setCoverPath(path)
            }}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>

          {isEdit && (

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" type="button">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Are you sure you want to delete this? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>

                  <Button variant="destructive" onClick={async () => {
                    setLoading(true)
                    await deleteProductAction(productId!, coverPath)
                    setLoading(false)
                  }} disabled={loading}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </form>

    </Card>
  )
}

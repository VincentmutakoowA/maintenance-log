'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCover from "@/app/admin/products/cover"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getProductById, saveProductAction, deleteProductAction } from "./actions"
import ProductAvailabilitySelect from "./availability-select"
import { AvailabilityStatus } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import ProductMediaUpload from "./media-upload"
import { PRODUCT_IMAGE_BUCKET, PRODUCT_VIDEO_BUCKET } from "@/lib/config"
import ProductFeaturedSelect from "./featured-select"
import { Spinner } from "@/components/ui/spinner"



export default function ProductForm({ productId }: { productId?: string }) {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [coverPath, setCoverPath] = useState<string | null>(null)
  const [availability, setAvailability] = useState<AvailabilityStatus>("available")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imagePaths, setImagePaths] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [videoPaths, setVideoPaths] = useState<string[]>([])
  const [featured, setFeatured] = useState(false)

  const isEdit = Boolean(productId)


  // fetch product if editing
  useEffect(() => {
    if (!productId) return
    const loadProduct = async () => {
      const data = await getProductById(productId)
      if (data) {
        setName(data.name)
        setPrice(String(data.price))
        setDescription(data.description || "")
        setAvailability(data.availability as AvailabilityStatus)
        setCoverUrl(data.cover_url)
        setCoverPath(data.cover_path)
        setImages(data.images_urls || [])
        setImagePaths(data.images_paths || [])
        setVideos(data.videos_urls || [])
        setVideoPaths(data.videos_paths || [])
        setFeatured(data.featured)
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
        <input type="hidden" name="featured" value={featured ? "true" : "false"} />
        <input type="hidden" name="images_urls" value={JSON.stringify(images)} />
        <input type="hidden" name="images_paths" value={JSON.stringify(imagePaths)} />
        <input type="hidden" name="videos_urls" value={JSON.stringify(videos)} />
        <input type="hidden" name="videos_paths" value={JSON.stringify(videoPaths)} />


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

          <ProductFeaturedSelect
            featured={featured}
            onChange={setFeatured}>
          </ProductFeaturedSelect>

          <Textarea
            placeholder="Enter the description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            >

          </Textarea>

          <Label>Cover Image</Label>

          <ProductCover
            uid={productId ?? "new"}
            url={coverUrl}
            onUpload={(url, path) => {
              setCoverUrl(url)
              setCoverPath(path)
            }}
          />

          <Label>Images</Label>
          <ProductMediaUpload
            bucket={PRODUCT_IMAGE_BUCKET}
            uid={productId ?? "new"}
            urls={images}
            paths={imagePaths}
            accept="image/*"
            onChange={(urls, paths) => {
              setImages(urls)
              setImagePaths(paths)
            }}
          >
          </ProductMediaUpload>

          <Label>Videos</Label>
          <ProductMediaUpload
            bucket={PRODUCT_VIDEO_BUCKET}
            uid={productId ?? "new"}
            urls={videos}
            paths={videoPaths}
            accept="video/*"
            onChange={(urls, paths) => {
              setVideos(urls)
              setVideoPaths(paths)
            }}
          >
          </ProductMediaUpload>

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
                  }} disabled={loading}>Delete {loading && <Spinner />} </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </form>

    </Card>
  )
}

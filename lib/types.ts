export type TypeProduct = {
    id: string
    name: string
    price: string
    cover_url: string | null
    availability: AvailabilityStatus
    description: string | null
    images_urls: string[]
    images_paths: string[]
    videos_urls: string[]
    videos_paths: string[]
    featured: boolean
}

export type TypeProductCard = {
    id: string
    name: string
    price: string
    cover_url: string | null
    availability: AvailabilityStatus
    featured: boolean
}

export type AvailabilityStatus =
  | "available"
  | "limited_availability"
  | "out_of_stock"
  | "unavailable"
  | "active"
  | "paused"
  | "at_capacity"

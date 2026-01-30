export type TypeProduct = {
    id: string
    name: string
    price: string
    cover_url: string | null
    availability: AvailabilityStatus
}

export type AvailabilityStatus =
  | "available"
  | "limited_availability"
  | "out_of_stock"
  | "unavailable"
  | "active"
  | "paused"
  | "at_capacity"

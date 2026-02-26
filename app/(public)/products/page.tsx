import ProductClient from "./products-client"

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1

  return <ProductClient param={page} />
}

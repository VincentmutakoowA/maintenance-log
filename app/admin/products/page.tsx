import ProductsAdminClient from "./products-admin-client"

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1

  return <ProductsAdminClient user={null} param={page} />
}

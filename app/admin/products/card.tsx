import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import Link from 'next/link'
import { Button } from "../../../components/ui/button";
import { TypeProductCard } from "@/lib/types";
import ProductStatus from "@/components/status";
import Image from "next/image";

export default function ProductAdminCard({ product }: { product: TypeProductCard }) {
    console.log('Product, ', product.cover_url)

    return (
        <Card className="p-0">

            <div className="relative w-full  aspect-[16/9]">
                <Image
                    src={product.cover_url || ''}
                    alt="Product cover"
                    className="relative object-cover"
                    fill
                />
            </div>

            <CardHeader>
                <CardAction className="grid gap-2">
                    <ProductStatus status={product.availability}></ProductStatus>
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline">Edit</Button>
                    </Link>
                </CardAction>
                <CardTitle> {product.name}</CardTitle>
                <p>${product.price}</p>

            </CardHeader>

        </Card>
    )
}
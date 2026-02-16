import { Card, CardHeader, CardTitle, CardAction, CardFooter } from "@/components/ui/card";
import Link from 'next/link'
import { Button } from "../../../components/ui/button";
import { TypeProductCard } from "@/lib/types";
import ProductStatus from "@/components/status";
import Image from "next/image";
import { CURRENCY } from "@/lib/config";

export default function ProductAdminCard({ product }: { product: TypeProductCard }) {
    console.log('Product, ', product.cover_url)

    return (
        <Card className={`p-0 ${product.featured ? 'border border-primary' : 'border'} relative overflow-hidden`}>

            <div className="relative w-full  aspect-[16/9]">
                <Image
                    src={product.cover_url || ''}
                    alt="Product cover"
                    className="relative object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
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
                <p>{product.price ? `${CURRENCY} ${product.price}` : ''}</p>

            </CardHeader>
            <CardFooter></CardFooter>

        </Card>
    )
}
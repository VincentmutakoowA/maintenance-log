import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardAction } from "../../../components/ui/card";
import Link from 'next/link'
import { Button } from "../../../components/ui/button";
import { TypeProduct } from "@/lib/types";
import ProductStatus from "@/components/status";

export default function ProductAdminCard({ product }: { product: TypeProduct }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className="relative">

            <img
                src={product.cover_url || ''}
                alt="Product cover"
                className="relative aspect-[16/9] w-full object-cover"
            />


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
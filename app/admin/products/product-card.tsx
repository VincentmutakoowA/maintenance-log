import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "../../../components/ui/card";
import Link from 'next/link'
import { Button } from "../../../components/ui/button";
import { TypeProduct } from "@/lib/types";

export default function ProductAdminCard({ product }: { product: TypeProduct }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className="relative">

            <img
                src={product.cover_url || ''}
                alt="Product cover"
                className="relative aspect-[16/9] w-full object-cover"
            />


            <CardContent className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p>${product.price}</p>
                </div>
                <Link href={`/admin/products/${product.id}`}>
                    <Button variant="outline">Edit</Button>
                </Link>
            </CardContent>
            
        </Card>
    )
}
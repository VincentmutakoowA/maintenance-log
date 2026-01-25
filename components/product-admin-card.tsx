import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import Link from 'next/link'
import { Button } from "./ui/button";
import { TypeProduct } from "@/lib/types";

export default function ProductAdminCard({ product }: { product: TypeProduct }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className="relative">

            <img 
            src='https://tyojjcclfkgzmxoftjxu.supabase.co/storage/v1/object/public/product_cover/new-0.940704586267367.jpg'
            alt="Product cover"
            className="relative aspect-[16/9] w-full object-cover"
            />

            <CardContent>
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price}</p>
            </CardContent>


            <CardFooter>
                <Link href={`/admin/products/${product.id}`}>
                    <Button variant="outline">Edit</Button>
                </Link>
            </CardFooter>

        </Card>
    )
}
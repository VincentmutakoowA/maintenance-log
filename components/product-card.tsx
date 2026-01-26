import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import Link from 'next/link'
import Image from "next/image";
import { Button } from "./ui/button";
import { TypeProduct } from "@/lib/types";

export default function ProductCard({ product }: { product: TypeProduct }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className="relative">

            <Image
                src={product.cover_url || ''}
                alt="Product cover"
                className="relative aspect-[16/9] w-full object-cover"
                width={256}
                height={500}
            />

            <CardContent>
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price}</p>
            </CardContent>

        </Card>
    )
}
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/card";
import Link from 'next/link'
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { TypeProduct } from "@/lib/types";

export default function ProductCard({ product }: { product: TypeProduct }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className="pt-0">

            <div className="relative aspect-[16/9] w-full">
                <Image
                    src={product.cover_url || ''}
                    alt="Product cover"
                    className="object-cover"
                    fill
                    loading="lazy"
                />
            </div>

            <CardContent>
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price}</p>
            </CardContent>

        </Card>
    )
}
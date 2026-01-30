import { Card, CardHeader, CardContent, CardFooter, CardAction } from "../../../components/ui/card";
import Image from "next/image";
import { TypeProduct } from "@/lib/types";
import ProductStatus from "@/components/status";
//import { AvailabilityStatus } from "@/lib/types";

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

            <CardHeader>
                <CardAction>
                    <ProductStatus status={product.availability}></ProductStatus>
                </CardAction>

                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price}</p>
            </CardHeader>

        </Card>
    )
}
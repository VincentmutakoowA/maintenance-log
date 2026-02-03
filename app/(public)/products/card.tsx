import { Card, CardHeader, CardAction } from "@/components/ui/card";
import Image from "next/image";
import { TypeProductCard } from "@/lib/types";
import ProductStatus from "@/components/status";

export default function ProductCard({ product }: { product: TypeProductCard }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className={`pt-0 ${product.featured ? 'border border-primary' : ''} relative overflow-hidden`}>

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

            {product.featured && (
                <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                </div>
            )}

        </Card>
    )
}


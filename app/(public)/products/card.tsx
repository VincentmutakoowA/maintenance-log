import { Card, CardHeader, CardAction } from "@/components/ui/card";
import Image from "next/image";
import { TypeProductCard } from "@/lib/types";
import ProductStatus from "@/components/status";
import { CURRENCY } from "@/lib/config";

export default function ProductCard({ product }: { product: TypeProductCard }) {

    console.log('Product, ', product.cover_url)

    return (
        <Card className={`pt-0 ${product.featured ? 'border border-primary' : 'border'} relative overflow-hidden`}>

            <div className="relative aspect-[16/9] w-full">
                {product.cover_url ?
                    <Image
                        src={product.cover_url || ''}
                        alt="Product cover"
                        className="relative object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                    /> : <div className="flex items-center justify-center w-full h-full bg-muted">
                        <span className="text-sm text-muted-foreground">No image</span>
                    </div>}
            </div>

            <CardHeader>
                <CardAction>
                    <ProductStatus status={product.availability}></ProductStatus>
                </CardAction>

                <h3 className="font-semibold">{product.name}</h3>
                <p>{product.price ? `${CURRENCY} ${product.price}` : ''}</p>

            </CardHeader>

            {product.featured && (
                <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                </div>
            )}

        </Card>
    )
}


import { Button } from "@/components/ui/button";
import { PRODUCT_OR_SERVICE } from "@/lib/config";
import Link from "next/link";

export default function Page() {
  return (
    <div>
            <Link href="/admin/products">
                <Button className="ml-4">Manage {PRODUCT_OR_SERVICE}</Button>
            </Link>
    </div>
  );
}
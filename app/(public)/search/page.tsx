import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { Input } from '@/components/ui/input'

export default function SearchPage() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
            <Input
                type="search"
                placeholder={`Search ${PRODUCT_OR_SERVICE.toLowerCase()}...`}
                className="w-full max-w-lg mb-4"
            />
            {/* Implement search results display here */}
        </div>
    )
}
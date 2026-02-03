import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductFeaturedSelect({ featured, onChange }: { featured: boolean, onChange: (value: boolean) => void }) {
    return (
        <Select value={featured ? "true" : "false"} onValueChange={value => onChange(value === "true")}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="true">Featured</SelectItem>
                    <SelectItem value="false">Not featured</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
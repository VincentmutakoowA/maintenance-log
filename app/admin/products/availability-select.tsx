import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvailabilityStatus } from "@/lib/types"

export default function ProductAvailabilitySelect({ availability, onChange }: { availability: AvailabilityStatus, onChange: (value: AvailabilityStatus) => void }) {
    return (
        <Select value={availability} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Availability Status</SelectLabel>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="limited_availability">Limited availability</SelectItem>
                    <SelectItem value="out_of_stock">Out of stock</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="at_capacity">At capacity</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
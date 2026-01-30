"use client";

import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status";
import { AvailabilityStatus } from "@/lib/types";
import { label } from "motion/react-client";

type ProductStatusProps = {
    status: AvailabilityStatus
}

const statusMap: Record<
    AvailabilityStatus, "online" | "offline" | "maintenance" | "degraded">
    = {
    available: "online", active: "online",
    limited_availability: "degraded",
    out_of_stock: "offline",
    paused: "offline",
    unavailable: "offline",
    at_capacity: "maintenance"
}

const labelMap: Record<AvailabilityStatus, string> = {
    available: "Available",
    limited_availability: "Limited availability",
    out_of_stock: "Out of stock",
    unavailable: "Unavailable",
    active: "Active",
    paused: "Paused",
    at_capacity: "At capacity",
}

const ProductStatus = ({ status }: ProductStatusProps) => (
    <Status status={statusMap[status]}>
        <StatusIndicator />
        <StatusLabel>{labelMap[status]}</StatusLabel>

    </Status>
);

export default ProductStatus;

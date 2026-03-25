'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllFaultReportsAction,
    addFaultReportAction,
    updateFaultReportStatusAction,
    deleteFaultReportAction,
    getAllComputersAction,
} from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Plus, Clock, CheckCircle2, Wrench, Trash2 } from "lucide-react"

const PRIORITY_COLORS: Record<string, string> = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock size={12} className="inline mr-1" />,
    in_progress: <Wrench size={12} className="inline mr-1" />,
    resolved: <CheckCircle2 size={12} className="inline mr-1" />,
}

function StatusBadge({ status }: { status: string }) {
    const label = status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status] ?? ""}`}>
            {STATUS_ICONS[status]}
            {label}
        </span>
    )
}

function PriorityBadge({ priority }: { priority: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[priority] ?? ""}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    )
}

function FaultReportCard({ report, onStatusChange, onDelete }: {
    report: any
    onStatusChange: (id: string, status: string) => void
    onDelete: (id: string) => void
}) {
    const [updating, setUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true)
        await updateFaultReportStatusAction(report.id, newStatus)
        onStatusChange(report.id, newStatus)
        setUpdating(false)
    }

    return (
        <Card className="border border-border">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-semibold text-foreground truncate">
                            {report.computers?.asset_tag ?? "Unknown Computer"}
                        </p>
                        {report.computers?.laboratories?.lab_name && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {report.computers.laboratories.lab_name}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <PriorityBadge priority={report.priority} />
                        <StatusBadge status={report.status} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {report.description}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString("en-UG", {
                            day: "numeric", month: "short", year: "numeric"
                        })}
                        {report.profiles?.full_name && (
                            <> · {report.profiles.full_name}</>
                        )}
                    </p>

                    <div className="flex items-center gap-1.5">
                        {report.status !== "resolved" && (
                            <Select
                                value={report.status}
                                onValueChange={handleStatusChange}
                                disabled={updating}
                            >
                                <SelectTrigger className="h-7 text-xs w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        <button
                            onClick={() => onDelete(report.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="Delete report"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AddReportForm({
    computers,
    onClose,
    onSaved,
}: {
    computers: any[]
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const initialState = { success: false, error: null }
    const [state, formAction] = useActionState(addFaultReportAction, initialState)
    const [computerId, setComputerId] = useState("")
    const [priority, setPriority] = useState("medium")

    return (
        <Card className="p-4">
            <div className="w-full max-w-lg mx-auto">
                <h2 className="text-lg font-semibold mb-6">Report a Fault</h2>

                <form action={formAction}>
                    <input type="hidden" name="computer_id" value={computerId} />
                    <input type="hidden" name="priority" value={priority} />

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Computer <span className="text-red-500">*</span>
                            </label>
                            <Select value={computerId} onValueChange={setComputerId} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select computer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {computers.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.asset_tag}
                                            {c.laboratories?.lab_name && ` — ${c.laboratories.lab_name}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                placeholder="Describe the fault in detail…"
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={!computerId}>
                            Submit Report
                        </Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>

                    {state?.success && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                                Fault report submitted successfully!
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={async () => { await onSaved(); onClose() }}
                            >
                                Back to reports
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </Card>
    )
}

export default function FaultReportForm() {
    const [reports, setReports] = useState<any[] | null>(null)
    const [computers, setComputers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filterStatus, setFilterStatus] = useState("all")

    const fetchData = async () => {
        setLoading(true)
        const [rpts, comps] = await Promise.all([
            getAllFaultReportsAction(),
            getAllComputersAction(),
        ])
        if (rpts) setReports(rpts)
        if (comps) setComputers(comps)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleStatusChange = (id: string, newStatus: string) => {
        setReports(prev => prev?.map(r => r.id === id ? { ...r, status: newStatus } : r) ?? null)
    }

    const handleDelete = async (id: string) => {
        await deleteFaultReportAction(id)
        setReports(prev => prev?.filter(r => r.id !== id) ?? null)
    }

    const filtered = reports?.filter(r =>
        filterStatus === "all" || r.status === filterStatus
    ) ?? []

    if (showForm) {
        return (
            <div className="w-full max-w-6xl">
                <AddReportForm
                    computers={computers}
                    onClose={() => setShowForm(false)}
                    onSaved={fetchData}
                />
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl">
            <Card>
                {loading ? (
                    <CardContent className="aspect-square sm:aspect-video flex items-center justify-center">
                        <Spinner />
                    </CardContent>
                ) : !reports || reports.length === 0 ? (
                    <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                        <AlertTriangle size={40} className="text-muted-foreground" />
                        <p className="text-muted-foreground">No fault reports yet.</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus size={16} className="mr-2" /> Report a Fault
                        </Button>
                    </CardContent>
                ) : (
                    <div className="p-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex flex-wrap gap-2">
                                {["all", "pending", "in_progress", "resolved"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${filterStatus === s
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {s === "all" ? "All" :
                                            s === "in_progress" ? "In Progress" :
                                                s.charAt(0).toUpperCase() + s.slice(1)}
                                        {" "}
                                        <span className="font-normal opacity-70">
                                            ({s === "all" ? reports.length : reports.filter(r => r.status === s).length})
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <Button onClick={() => setShowForm(true)}>
                                <Plus size={16} className="mr-2" /> Report Fault
                            </Button>
                        </div>

                        {/* Reports grid */}
                        {filtered.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                No reports with this status.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map(report => (
                                    <FaultReportCard
                                        key={report.id}
                                        report={report}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}
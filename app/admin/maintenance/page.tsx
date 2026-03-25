'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllMaintenanceLogsAction,
    addMaintenanceLogAction,
    deleteMaintenanceLogAction,
    getAllPreventiveScheduleAction,
    addPreventiveScheduleAction,
    updatePreventiveScheduleStatusAction,
    deletePreventiveScheduleAction,
    getAllComputersAction,
    getAllFaultReportsAction,
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
import { Wrench, CalendarClock, Plus, Trash2, CheckCircle2 } from "lucide-react"

//------------------------------------------------------------------------------
// Shared helpers
//------------------------------------------------------------------------------

const TYPE_COLORS: Record<string, string> = {
    corrective: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    preventive: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
}

const SCHED_STATUS_COLORS: Record<string, string> = {
    pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

function TypeBadge({ type }: { type: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[type] ?? ""}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    )
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-UG", {
        day: "numeric", month: "short", year: "numeric",
    })
}

//------------------------------------------------------------------------------
// Maintenance Log Form
//------------------------------------------------------------------------------

function MaintenanceLogForm({
    computers,
    faultReports,
    onClose,
    onSaved,
}: {
    computers: any[]
    faultReports: any[]
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const initialState = { success: false, error: null }
    const [state, formAction] = useActionState(addMaintenanceLogAction, initialState)
    const [computerId, setComputerId] = useState("")
    const [faultReportId, setFaultReportId] = useState("")
    const [maintenanceType, setMaintenanceType] = useState("corrective")

    const pendingFaults = faultReports.filter(r => r.status !== "resolved")

    return (
        <Card className="p-4">
            <div className="w-full max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold mb-6">Log Maintenance Work</h2>

                <form action={formAction}>
                    <input type="hidden" name="computer_id" value={computerId} />
                    <input type="hidden" name="fault_report_id" value={faultReportId} />
                    <input type="hidden" name="maintenance_type" value={maintenanceType} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Computer <span className="text-red-500">*</span>
                            </label>
                            <Select value={computerId} onValueChange={setComputerId}>
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
                            <label className="block text-sm font-medium mb-1">Maintenance Type</label>
                            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="corrective">Corrective</SelectItem>
                                    <SelectItem value="preventive">Preventive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {maintenanceType === "corrective" && pendingFaults.length > 0 && (
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Linked Fault Report <span className="text-muted-foreground font-normal">(optional)</span>
                                </label>
                                <Select value={faultReportId} onValueChange={setFaultReportId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select fault report" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {pendingFaults.map(r => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.computers?.asset_tag ?? "?"} — {r.description.slice(0, 50)}…
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">Problem Identified</label>
                            <textarea
                                name="problem_identified"
                                rows={2}
                                placeholder="Describe the problem found…"
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Action Taken <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="action_taken"
                                rows={3}
                                required
                                placeholder="Describe what was done…"
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Parts Replaced</label>
                            <Input
                                name="parts_replaced"
                                placeholder="e.g. RAM, HDD"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Cost (UGX)</label>
                            <Input
                                type="number"
                                name="cost"
                                placeholder="e.g. 50000"
                                min="0"
                                step="500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Next Maintenance Date</label>
                            <Input
                                type="date"
                                name="next_maintenance_date"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={!computerId}>
                            Save Log
                        </Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>

                    {state?.success && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                                Maintenance log saved!
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={async () => { await onSaved(); onClose() }}
                            >
                                Back to logs
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </Card>
    )
}

//------------------------------------------------------------------------------
// Preventive Schedule Form
//------------------------------------------------------------------------------

function PreventiveScheduleForm({
    computers,
    onClose,
    onSaved,
}: {
    computers: any[]
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const initialState = { success: false, error: null }
    const [state, formAction] = useActionState(addPreventiveScheduleAction, initialState)
    const [computerId, setComputerId] = useState("")

    return (
        <Card className="p-4">
            <div className="w-full max-w-lg mx-auto">
                <h2 className="text-lg font-semibold mb-6">Schedule Preventive Maintenance</h2>

                <form action={formAction}>
                    <input type="hidden" name="computer_id" value={computerId} />

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Computer <span className="text-red-500">*</span>
                            </label>
                            <Select value={computerId} onValueChange={setComputerId}>
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
                            <label className="block text-sm font-medium mb-1">
                                Scheduled Date <span className="text-red-500">*</span>
                            </label>
                            <Input type="date" name="scheduled_date" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Task Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="task_description"
                                rows={3}
                                required
                                placeholder="e.g. Clean dust, update OS patches, check hardware…"
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={!computerId}>
                            Schedule Task
                        </Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>

                    {state?.success && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                                Scheduled successfully!
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={async () => { await onSaved(); onClose() }}
                            >
                                Back to schedule
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </Card>
    )
}

//------------------------------------------------------------------------------
// Main Component
//------------------------------------------------------------------------------

type ActiveTab = "logs" | "schedule"
type ActiveForm = "log" | "schedule" | null

export default function MaintenanceFlow() {
    const [tab, setTab] = useState<ActiveTab>("logs")
    const [activeForm, setActiveForm] = useState<ActiveForm>(null)

    const [logs, setLogs] = useState<any[] | null>(null)
    const [schedule, setSchedule] = useState<any[] | null>(null)
    const [computers, setComputers] = useState<any[]>([])
    const [faultReports, setFaultReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        const [l, s, c, f] = await Promise.all([
            getAllMaintenanceLogsAction(),
            getAllPreventiveScheduleAction(),
            getAllComputersAction(),
            getAllFaultReportsAction(),
        ])
        if (l) setLogs(l)
        if (s) setSchedule(s)
        if (c) setComputers(c)
        if (f) setFaultReports(f)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleMarkDone = async (id: string) => {
        await updatePreventiveScheduleStatusAction(id, "completed")
        setSchedule(prev => prev?.map(s => s.id === id ? { ...s, status: "completed" } : s) ?? null)
    }

    const handleDeleteLog = async (id: string) => {
        await deleteMaintenanceLogAction(id)
        setLogs(prev => prev?.filter(l => l.id !== id) ?? null)
    }

    const handleDeleteSchedule = async (id: string) => {
        await deletePreventiveScheduleAction(id)
        setSchedule(prev => prev?.filter(s => s.id !== id) ?? null)
    }

    // Forms
    if (activeForm === "log") {
        return (
            <div className="w-full max-w-6xl">
                <MaintenanceLogForm
                    computers={computers}
                    faultReports={faultReports}
                    onClose={() => setActiveForm(null)}
                    onSaved={fetchData}
                />
            </div>
        )
    }

    if (activeForm === "schedule") {
        return (
            <div className="w-full max-w-6xl">
                <PreventiveScheduleForm
                    computers={computers}
                    onClose={() => setActiveForm(null)}
                    onSaved={fetchData}
                />
            </div>
        )
    }

    const overdue = schedule?.filter(s =>
        s.status === "pending" && new Date(s.scheduled_date) < new Date()
    ) ?? []

    return (
        <div className="w-full max-w-6xl space-y-4">
            {/* Overdue alert */}
            {overdue.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-orange-800 dark:text-orange-200">
                    <CalendarClock size={16} className="shrink-0" />
                    <span>
                        <strong>{overdue.length}</strong> preventive maintenance task{overdue.length !== 1 ? "s are" : " is"} overdue.
                    </span>
                </div>
            )}

            {/* Tab bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex border rounded-lg overflow-hidden">
                    {(["logs", "schedule"] as ActiveTab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t === "logs" ? "Maintenance Logs" : "Preventive Schedule"}
                            {t === "schedule" && overdue.length > 0 && (
                                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-orange-500 text-white">
                                    {overdue.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <Button
                    size="sm"
                    onClick={() => setActiveForm(tab === "logs" ? "log" : "schedule")}
                >
                    <Plus size={14} className="mr-1.5" />
                    {tab === "logs" ? "Log Work" : "Schedule Task"}
                </Button>
            </div>

            <Card>
                {loading ? (
                    <CardContent className="aspect-square sm:aspect-video flex items-center justify-center">
                        <Spinner />
                    </CardContent>
                ) : tab === "logs" ? (
                    // ── Maintenance Logs ──
                    !logs || logs.length === 0 ? (
                        <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                            <Wrench size={40} className="text-muted-foreground" />
                            <p className="text-muted-foreground">No maintenance logs yet.</p>
                            <Button onClick={() => setActiveForm("log")}>
                                <Plus size={16} className="mr-2" /> Log Maintenance Work
                            </Button>
                        </CardContent>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Computer</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Action Taken</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Cost</th>
                                        <th className="py-3 px-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-t hover:bg-muted/20 transition-colors">
                                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                                {formatDate(log.resolved_at)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-mono font-medium text-xs">{log.computers?.asset_tag ?? "—"}</p>
                                                {log.computers?.laboratories?.lab_name && (
                                                    <p className="text-xs text-muted-foreground">{log.computers.laboratories.lab_name}</p>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 hidden sm:table-cell">
                                                <TypeBadge type={log.maintenance_type} />
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                                                <p className="line-clamp-2 text-muted-foreground">{log.action_taken}</p>
                                                {log.parts_replaced && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Parts: {log.parts_replaced}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                                                {log.cost != null ? `UGX ${log.cost.toLocaleString()}` : "—"}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                    aria-label="Delete log"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    // ── Preventive Schedule ──
                    !schedule || schedule.length === 0 ? (
                        <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                            <CalendarClock size={40} className="text-muted-foreground" />
                            <p className="text-muted-foreground">No scheduled maintenance tasks.</p>
                            <Button onClick={() => setActiveForm("schedule")}>
                                <Plus size={16} className="mr-2" /> Schedule a Task
                            </Button>
                        </CardContent>
                    ) : (
                        <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {schedule.map(task => {
                                    const isOverdue = task.status === "pending" && new Date(task.scheduled_date) < new Date()
                                    return (
                                        <Card
                                            key={task.id}
                                            className={`border ${isOverdue ? "border-orange-300 dark:border-orange-700" : "border-border"}`}
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-mono text-sm font-semibold">
                                                            {task.computers?.asset_tag ?? "Unknown"}
                                                        </p>
                                                        {task.computers?.laboratories?.lab_name && (
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {task.computers.laboratories.lab_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${SCHED_STATUS_COLORS[task.status] ?? ""}`}>
                                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                    </span>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                                    {task.task_description}
                                                </p>
                                                <p className={`text-xs font-medium mb-3 ${isOverdue ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`}>
                                                    <CalendarClock size={11} className="inline mr-1" />
                                                    {isOverdue ? "Overdue · " : ""}{formatDate(task.scheduled_date)}
                                                </p>

                                                <div className="flex items-center gap-1.5">
                                                    {task.status === "pending" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs"
                                                            onClick={() => handleMarkDone(task.id)}
                                                        >
                                                            <CheckCircle2 size={12} className="mr-1" />
                                                            Mark Done
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteSchedule(task.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-auto"
                                                        aria-label="Delete task"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )
                )}
            </Card>
        </div>
    )
}
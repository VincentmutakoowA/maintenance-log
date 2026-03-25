'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllComputersAction,
    getAllLaboratoriesAction,
    addComputerAction,
    deleteComputerAction,
    updateComputerStatusAction,
} from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PenBox, Monitor, Plus, ChevronDown, ChevronUp } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
    working: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    faulty: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    under_repair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    retired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

const STATUS_LABELS: Record<string, string> = {
    working: "Working",
    faulty: "Faulty",
    under_repair: "Under Repair",
    retired: "Retired",
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status] ?? STATUS_COLORS.retired}`}>
            {STATUS_LABELS[status] ?? status}
        </span>
    )
}

function ComputerForm({
    computer,
    laboratories,
    onClose,
    onSaved,
}: {
    computer?: any
    laboratories: any[]
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const initialState = { success: false, error: null }
    const [state, formAction] = useActionState(addComputerAction, initialState)
    const [labId, setLabId] = useState(computer?.lab_id ?? "")
    const [status, setStatus] = useState(computer?.status ?? "working")

    return (
        <Card className="p-4">
            <div className="w-full max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold mb-6">
                    {computer ? "Edit Computer" : "Add Computer"}
                </h2>

                <form action={formAction}>
                    <input type="hidden" name="id" value={computer?.id ?? ""} />
                    <input type="hidden" name="lab_id" value={labId} />
                    <input type="hidden" name="status" value={status} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Asset Tag <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="asset_tag"
                                defaultValue={computer?.asset_tag ?? ""}
                                placeholder="e.g. LAB-001"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Serial Number</label>
                            <Input
                                name="serial_number"
                                defaultValue={computer?.serial_number ?? ""}
                                placeholder="e.g. SN123456"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Laboratory</label>
                            <Select value={labId} onValueChange={setLabId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select laboratory" />
                                </SelectTrigger>
                                <SelectContent>
                                    {laboratories.map(lab => (
                                        <SelectItem key={lab.id} value={lab.id}>
                                            {lab.lab_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="working">Working</SelectItem>
                                    <SelectItem value="faulty">Faulty</SelectItem>
                                    <SelectItem value="under_repair">Under Repair</SelectItem>
                                    <SelectItem value="retired">Retired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Processor</label>
                            <Input
                                name="processor"
                                defaultValue={computer?.processor ?? ""}
                                placeholder="e.g. Intel Core i5-12400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">RAM</label>
                            <Input
                                name="ram"
                                defaultValue={computer?.ram ?? ""}
                                placeholder="e.g. 16GB DDR4"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Storage</label>
                            <Input
                                name="storage"
                                defaultValue={computer?.storage ?? ""}
                                placeholder="e.g. 512GB SSD"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Operating System</label>
                            <Input
                                name="operating_system"
                                defaultValue={computer?.operating_system ?? ""}
                                placeholder="e.g. Windows 11 Pro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Purchase Date</label>
                            <Input
                                type="date"
                                name="purchase_date"
                                defaultValue={computer?.purchase_date ?? ""}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit">
                            {computer ? "Save Changes" : "Add Computer"}
                        </Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        {computer && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () => {
                                    await deleteComputerAction(computer.id)
                                    await onSaved()
                                    onClose()
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </div>

                    {state?.success && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                                {computer ? "Computer updated successfully!" : "Computer added successfully!"}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={async () => {
                                    await onSaved()
                                    onClose()
                                }}
                            >
                                Back to list
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </Card>
    )
}

function ComputerRow({
    computer,
    onEdit,
}: {
    computer: any
    onEdit: (c: any) => void
}) {
    const [expanded, setExpanded] = useState(false)

    return (
        <>
            <tr className="border-b hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-mono text-sm font-medium">{computer.asset_tag}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {computer.laboratories?.lab_name ?? <span className="italic text-muted-foreground/60">Unassigned</span>}
                </td>
                <td className="py-3 px-4 text-sm hidden md:table-cell text-muted-foreground">
                    {computer.processor ?? "—"}
                </td>
                <td className="py-3 px-4 text-sm hidden lg:table-cell text-muted-foreground">
                    {computer.ram ?? "—"}
                </td>
                <td className="py-3 px-4">
                    <StatusBadge status={computer.status} />
                </td>
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(computer)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Edit computer"
                        >
                            <PenBox size={16} />
                        </button>
                        <button
                            onClick={() => setExpanded(v => !v)}
                            className="text-muted-foreground hover:text-foreground transition-colors md:hidden"
                            aria-label="Toggle details"
                        >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-muted/20 border-b md:hidden">
                    <td colSpan={6} className="px-4 py-3">
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <dt className="text-muted-foreground font-medium">Lab</dt>
                                <dd>{computer.laboratories?.lab_name ?? "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground font-medium">Processor</dt>
                                <dd>{computer.processor ?? "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground font-medium">RAM</dt>
                                <dd>{computer.ram ?? "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground font-medium">Storage</dt>
                                <dd>{computer.storage ?? "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground font-medium">OS</dt>
                                <dd>{computer.operating_system ?? "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground font-medium">Serial</dt>
                                <dd className="font-mono text-xs">{computer.serial_number ?? "—"}</dd>
                            </div>
                        </dl>
                    </td>
                </tr>
            )}
        </>
    )
}

export default function ComputerList() {
    const [computers, setComputers] = useState<any[] | null>(null)
    const [laboratories, setLaboratories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingComputer, setEditingComputer] = useState<any | null>(null)
    const [filterLab, setFilterLab] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const fetchData = async () => {
        setLoading(true)
        const [comps, labs] = await Promise.all([
            getAllComputersAction(),
            getAllLaboratoriesAction(),
        ])
        if (comps) setComputers(comps)
        if (labs) setLaboratories(labs)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const filtered = computers?.filter(c => {
        const labMatch = filterLab === "all" || c.lab_id === filterLab
        const statusMatch = filterStatus === "all" || c.status === filterStatus
        return labMatch && statusMatch
    }) ?? []

    if (showForm) {
        return (
            <div className="w-full max-w-6xl">
                <ComputerForm
                    computer={editingComputer}
                    laboratories={laboratories}
                    onClose={() => { setShowForm(false); setEditingComputer(null) }}
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
                ) : !computers || computers.length === 0 ? (
                    <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                        <Monitor size={40} className="text-muted-foreground" />
                        <p className="text-muted-foreground">No computers registered yet.</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus size={16} className="mr-2" /> Add Computer
                        </Button>
                    </CardContent>
                ) : (
                    <div className="p-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex flex-wrap gap-2">
                                <Select value={filterLab} onValueChange={setFilterLab}>
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="All Laboratories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Laboratories</SelectItem>
                                        {laboratories.map(lab => (
                                            <SelectItem key={lab.id} value={lab.id}>{lab.lab_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="working">Working</SelectItem>
                                        <SelectItem value="faulty">Faulty</SelectItem>
                                        <SelectItem value="under_repair">Under Repair</SelectItem>
                                        <SelectItem value="retired">Retired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                    {filtered.length} computer{filtered.length !== 1 ? "s" : ""}
                                </span>
                                <Button onClick={() => { setEditingComputer(null); setShowForm(true) }}>
                                    <Plus size={16} className="mr-2" /> Add Computer
                                </Button>
                            </div>
                        </div>

                        {/* Summary badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["working", "faulty", "under_repair", "retired"].map(s => {
                                const count = computers.filter(c => c.status === s).length
                                if (count === 0) return null
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-opacity ${STATUS_COLORS[s]} ${filterStatus !== "all" && filterStatus !== s ? "opacity-40" : ""}`}
                                    >
                                        {count} {STATUS_LABELS[s]}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset Tag</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Lab</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Processor</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">RAM</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                                        <th className="py-3 px-4 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-muted-foreground">
                                                No computers match the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(computer => (
                                            <ComputerRow
                                                key={computer.id}
                                                computer={computer}
                                                onEdit={(c) => { setEditingComputer(c); setShowForm(true) }}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
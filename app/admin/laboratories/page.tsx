'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllLaboratoriesAction,
    addLaboratoryAction,
    deleteLaboratoryAction,
    getAllComputersAction,
} from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    FlaskConical,
    Plus,
    PenBox,
    MapPin,
    Monitor,
    ChevronDown,
    ChevronUp,
    X,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

type Lab = {
    id: string
    lab_name: string
    location: string | null
    created_at: string
}

type Computer = {
    id: string
    lab_id: string | null
    asset_tag: string
    processor: string | null
    ram: string | null
    storage: string | null
    operating_system: string | null
    status: "working" | "faulty" | "under_repair" | "retired"
}

type LabStats = {
    total: number
    working: number
    faulty: number
    under_repair: number
    retired: number
    computers: Computer[]
}

type LabWithStats = Lab & LabStats

const STATUS_DOT: Record<string, string> = {
    working: "bg-green-500",
    faulty: "bg-red-500",
    under_repair: "bg-yellow-500",
    retired: "bg-gray-400",
}

const STATUS_PILL: Record<string, string> = {
    working: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    faulty: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    under_repair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    retired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

const STATUS_LABEL: Record<string, string> = {
    working: "Working",
    faulty: "Faulty",
    under_repair: "Under Repair",
    retired: "Retired",
}

function buildLabStats(labs: Lab[], computers: Computer[]): LabWithStats[] {
    return labs.map(lab => {
        const labComputers = computers.filter(c => c.lab_id === lab.id)
        return {
            ...lab,
            total: labComputers.length,
            working: labComputers.filter(c => c.status === "working").length,
            faulty: labComputers.filter(c => c.status === "faulty").length,
            under_repair: labComputers.filter(c => c.status === "under_repair").length,
            retired: labComputers.filter(c => c.status === "retired").length,
            computers: labComputers,
        }
    })
}

// ---------------------------------------------------------------------------
// Lab Form (add / edit)
// ---------------------------------------------------------------------------

function LabForm({
    lab,
    onClose,
    onSaved,
}: {
    lab?: Lab | null
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const initialState = { success: false, error: null }
    const [state, formAction] = useActionState(addLaboratoryAction, initialState)

    return (
        <Card className="p-6">
            <div className="w-full max-w-sm mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">
                        {lab ? "Edit Laboratory" : "Add Laboratory"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="id" value={lab?.id ?? ""} />

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="name"
                            defaultValue={lab?.lab_name ?? ""}
                            placeholder="e.g. Computer Lab A"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Location{" "}
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                        </label>
                        <Input
                            name="location"
                            defaultValue={lab?.location ?? ""}
                            placeholder="e.g. Block B, 2nd Floor"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button type="submit">
                            {lab ? "Save Changes" : "Add Laboratory"}
                        </Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        {lab && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="ml-auto"
                                onClick={async () => {
                                    await deleteLaboratoryAction(lab.id)
                                    await onSaved()
                                    onClose()
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </div>

                    {state?.success && (
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                                {lab ? "Laboratory updated!" : "Laboratory added!"}
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

// ---------------------------------------------------------------------------
// Status bar — thin segmented bar showing computer status breakdown
// ---------------------------------------------------------------------------

function StatusBar({ stats }: { stats: LabStats }) {
    if (stats.total === 0) return null
    const segments = [
        { key: "working", count: stats.working },
        { key: "faulty", count: stats.faulty },
        { key: "under_repair", count: stats.under_repair },
        { key: "retired", count: stats.retired },
    ].filter(s => s.count > 0)

    return (
        <div className="flex rounded-full overflow-hidden h-1.5 gap-px mt-3">
            {segments.map(({ key, count }) => (
                <div
                    key={key}
                    title={`${count} ${STATUS_LABEL[key]}`}
                    className={`${STATUS_DOT[key]} transition-all`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                />
            ))}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Computer row inside an expanded lab
// ---------------------------------------------------------------------------

function ComputerRow({ computer }: { computer: Computer }) {
    return (
        <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/40 transition-colors">
            <span
                className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[computer.status]}`}
                title={STATUS_LABEL[computer.status]}
            />
            <span className="font-mono text-sm font-medium text-foreground shrink-0 w-24 truncate">
                {computer.asset_tag}
            </span>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${STATUS_PILL[computer.status]}`}>
                {STATUS_LABEL[computer.status]}
            </span>
            <div className="flex gap-3 ml-auto text-xs text-muted-foreground hidden sm:flex">
                {computer.processor && <span>{computer.processor}</span>}
                {computer.ram && <span>{computer.ram}</span>}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Lab Card
// ---------------------------------------------------------------------------

function LabCard({
    lab,
    onEdit,
}: {
    lab: LabWithStats
    onEdit: (lab: Lab) => void
}) {
    const [expanded, setExpanded] = useState(false)

    const hasIssues = lab.faulty > 0 || lab.under_repair > 0

    return (
        <Card
            className={`border transition-shadow hover:shadow-md ${
                hasIssues ? "border-orange-200 dark:border-orange-800" : "border-border"
            }`}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                    {/* Icon */}
                    <div className="mt-0.5 p-1.5 rounded-md bg-muted shrink-0">
                        <FlaskConical size={16} className="text-muted-foreground" />
                    </div>

                    {/* Title + location */}
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight truncate">
                            {lab.lab_name}
                        </CardTitle>
                        {lab.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin size={10} />
                                {lab.location}
                            </p>
                        )}
                    </div>

                    {/* Edit button */}
                    <button
                        onClick={() => onEdit(lab)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0"
                        aria-label={`Edit ${lab.lab_name}`}
                    >
                        <PenBox size={15} />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Stat pills */}
                {lab.total === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No computers assigned</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-1.5">
                            {(["working", "faulty", "under_repair", "retired"] as const).map(s => {
                                const count = lab[s as keyof LabStats] as number
                                if (count === 0) return null
                                return (
                                    <span
                                        key={s}
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_PILL[s]}`}
                                    >
                                        {count} {STATUS_LABEL[s]}
                                    </span>
                                )
                            })}
                        </div>
                        <StatusBar stats={lab} />
                    </>
                )}

                {/* Footer: total count + expand toggle */}
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Monitor size={11} />
                        {lab.total} computer{lab.total !== 1 ? "s" : ""}
                    </span>

                    {lab.total > 0 && (
                        <button
                            onClick={() => setExpanded(v => !v)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        >
                            {expanded ? (
                                <>Hide <ChevronUp size={13} /></>
                            ) : (
                                <>View computers <ChevronDown size={13} /></>
                            )}
                        </button>
                    )}
                </div>

                {/* Expanded computer list */}
                {expanded && lab.computers.length > 0 && (
                    <div className="mt-3 border-t pt-3 space-y-0.5">
                        {lab.computers.map(c => (
                            <ComputerRow key={c.id} computer={c} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ---------------------------------------------------------------------------
// Unassigned computers panel
// ---------------------------------------------------------------------------

function UnassignedPanel({ computers }: { computers: Computer[] }) {
    const [expanded, setExpanded] = useState(false)
    if (computers.length === 0) return null

    return (
        <Card className="border-dashed border-muted-foreground/30">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-muted">
                            <Monitor size={16} className="text-muted-foreground" />
                        </div>
                        <CardTitle className="text-base font-semibold text-muted-foreground">
                            Unassigned
                        </CardTitle>
                    </div>
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                    {computers.length} computer{computers.length !== 1 ? "s" : ""} not assigned to any lab
                </p>
                {expanded && (
                    <div className="mt-3 border-t pt-3 space-y-0.5">
                        {computers.map(c => (
                            <ComputerRow key={c.id} computer={c} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ---------------------------------------------------------------------------
// Summary bar across top
// ---------------------------------------------------------------------------

function SummaryBar({ labs, unassigned }: { labs: LabWithStats[]; unassigned: Computer[] }) {
    const total = labs.reduce((s, l) => s + l.total, 0) + unassigned.length
    const working = labs.reduce((s, l) => s + l.working, 0) + unassigned.filter(c => c.status === "working").length
    const faulty = labs.reduce((s, l) => s + l.faulty, 0) + unassigned.filter(c => c.status === "faulty").length
    const under_repair = labs.reduce((s, l) => s + l.under_repair, 0) + unassigned.filter(c => c.status === "under_repair").length

    if (total === 0) return null

    return (
        <div className="flex flex-wrap gap-4 text-sm px-1">
            <span className="text-muted-foreground">
                <strong className="text-foreground font-semibold">{labs.length}</strong>{" "}
                {labs.length === 1 ? "lab" : "labs"}
            </span>
            <span className="text-muted-foreground">
                <strong className="text-foreground font-semibold">{total}</strong>{" "}
                computers total
            </span>
            {working > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    <strong className="text-foreground font-semibold">{working}</strong> working
                </span>
            )}
            {faulty > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    <strong className="text-foreground font-semibold">{faulty}</strong> faulty
                </span>
            )}
            {under_repair > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                    <strong className="text-foreground font-semibold">{under_repair}</strong> under repair
                </span>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Laboratories() {
    const [labs, setLabs] = useState<LabWithStats[]>([])
    const [unassigned, setUnassigned] = useState<Computer[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingLab, setEditingLab] = useState<Lab | null>(null)

    const fetchData = async () => {
        setLoading(true)
        const [rawLabs, rawComputers] = await Promise.all([
            getAllLaboratoriesAction(),
            getAllComputersAction(),
        ])

        const labList: Lab[] = rawLabs ?? []
        const computerList: Computer[] = (rawComputers ?? []) as Computer[]

        setLabs(buildLabStats(labList, computerList))
        setUnassigned(computerList.filter(c => !c.lab_id))
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const openEdit = (lab: Lab) => {
        setEditingLab(lab)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingLab(null)
    }

    // ── Form view ──────────────────────────────────────────────────────────
    if (showForm) {
        return (
            <div className="w-full max-w-6xl">
                <LabForm
                    lab={editingLab}
                    onClose={closeForm}
                    onSaved={fetchData}
                />
            </div>
        )
    }

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-full max-w-6xl">
                <Card>
                    <CardContent className="aspect-square sm:aspect-video flex items-center justify-center">
                        <Spinner />
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── Empty state ────────────────────────────────────────────────────────
    if (labs.length === 0) {
        return (
            <div className="w-full max-w-6xl">
                <Card>
                    <CardContent className="aspect-square sm:aspect-video flex flex-col gap-4 items-center justify-center">
                        <div className="p-4 rounded-full bg-muted">
                            <FlaskConical size={32} className="text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium">No laboratories yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Add your first lab to start tracking computers.
                            </p>
                        </div>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus size={16} className="mr-2" />
                            Add Laboratory
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── Main list ──────────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-6xl space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SummaryBar labs={labs} unassigned={unassigned} />
                <Button
                    onClick={() => { setEditingLab(null); setShowForm(true) }}
                    className="shrink-0"
                >
                    <Plus size={16} className="mr-2" />
                    Add Laboratory
                </Button>
            </div>

            {/* Lab cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {labs.map(lab => (
                    <LabCard
                        key={lab.id}
                        lab={lab}
                        onEdit={openEdit}
                    />
                ))}

                {/* Unassigned computers shown as a ghost card */}
                <UnassignedPanel computers={unassigned} />
            </div>
        </div>
    )
}
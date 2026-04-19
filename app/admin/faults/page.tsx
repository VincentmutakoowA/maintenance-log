'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllFaultReportsAction, addFaultReportAction,
    updateFaultReportStatusAction, deleteFaultReportAction, getAllComputersAction,
} from "../actions"
import { Plus, X, Clock, Wrench, CheckCircle2, Trash2 } from "lucide-react"
import {
    ModalProps, FaultFormProps, FaultReportWithRelations, ComputerWithLab,
    ActionState, BadgeMapEntry, StatusBadgeMapEntry,
} from "@/lib/types"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3";

const PRIORITY_MAP = {
    high:   { bg: "#fee2e2", text: "#b91c1c", label: "High" },
    medium: { bg: "#fef3c7", text: "#b45309", label: "Medium" },
    low:    { bg: "#dbeafe", text: "#1d4ed8", label: "Low" },
} as Record<string, BadgeMapEntry>

const STATUS_MAP = {
    pending:    { bg: "#fef3c7", text: "#b45309", label: "Pending",     Icon: Clock },
    in_progress:{ bg: "#dbeafe", text: "#1d4ed8", label: "In Progress", Icon: Wrench },
    resolved:   { bg: "#dcfce7", text: "#15803d", label: "Resolved",    Icon: CheckCircle2 },
} as Record<string, StatusBadgeMapEntry>

function Badge({ type, value }: { type: "priority" | "status"; value: string }) {
    const map = type === "priority" ? PRIORITY_MAP : STATUS_MAP
    const m = map[value] ?? { bg: "#f3f4f6", text: "#6b7280", label: value }
    return <span style={{ fontSize: 11, fontWeight: 600, background: m.bg, color: m.text, padding: "2px 8px", borderRadius: 999 }}>{m.label}</span>
}

function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "auto", maxHeight: "90vh" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={17} /></button>
                </div>
                <div style={{ padding: 20 }}>{children}</div>
            </div>
        </div>
    )
}

function FaultForm({ computers, onClose, onSaved }: FaultFormProps) {
    const [state, formAction] = useActionState(addFaultReportAction, { success: false })
    const [computerId, setComputerId] = useState("")
    const [priority, setPriority] = useState("medium")

    useEffect(() => { if ((state as ActionState).success) { onSaved(); onClose() } }, [state, onSaved, onClose])

    return (
        <form action={formAction}>
            <input type="hidden" name="computer_id" value={computerId} />
            <input type="hidden" name="priority" value={priority} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Computer *</label>
                <select value={computerId} onChange={e => setComputerId(e.target.value)} required
                    style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}>
                    <option value="">Select computer</option>
                    {computers.map((c: ComputerWithLab) => (
                        <option key={c.id} value={c.id}>{c.asset_tag} — {c.laboratories?.lab_name ?? "No Lab"}</option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Fault Description *</label>
                <textarea name="description" required rows={4}
                    style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", outline: "none" }}
                    placeholder="Describe the fault in detail..." />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Submit Fault</button>
            </div>
        </form>
    )
}

export default function FaultsPage() {
    const [faults, setFaults] = useState<FaultReportWithRelations[]>([])
    const [computers, setComputers] = useState<ComputerWithLab[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filterStatus, setFilterStatus] = useState("")
    const [filterPriority, setFilterPriority] = useState("")

    const load = async () => {
        const [f, c] = await Promise.all([getAllFaultReportsAction(), getAllComputersAction()])
        setFaults(f ?? []); setComputers(c ?? []); setLoading(false)
    }

    useEffect(() => {
        Promise.all([getAllFaultReportsAction(), getAllComputersAction()]).then(([f, c]) => {
            setFaults(f ?? []); setComputers(c ?? []); setLoading(false)
        })
    }, [])

    const handleStatusChange = async (id: string, status: string) => {
        await updateFaultReportStatusAction(id, status)
        setFaults(fs => fs.map(f => f.id === id ? { ...f, status: status as FaultReportWithRelations["status"] } : f))
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this fault report?")) return
        await deleteFaultReportAction(id)
        setFaults(fs => fs.filter(f => f.id !== id))
    }

    const filtered = faults.filter(f => {
        if (filterStatus && f.status !== filterStatus) return false
        if (filterPriority && f.priority !== filterPriority) return false
        return true
    })

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading fault reports...</div>

    const counts = {
        pending: faults.filter(f => f.status === "pending").length,
        in_progress: faults.filter(f => f.status === "in_progress").length,
        resolved: faults.filter(f => f.status === "resolved").length,
    }

    return (
        <div style={{ maxWidth: 1000 }}>
            <div className="page-hdr" style={{ marginBottom: 18 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Fault Reports</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{faults.length} total reports</div>
                </div>
                <button onClick={() => setShowForm(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Plus size={15} /> Report Fault
                </button>
            </div>

            {/* Summary cards */}
            <div className="stat-grid-3" style={{ marginBottom: 18 }}>
                {[
                    { label: "Pending", count: counts.pending, bg: "#fef3c7", text: "#b45309" },
                    { label: "In Progress", count: counts.in_progress, bg: "#dbeafe", text: "#1d4ed8" },
                    { label: "Resolved", count: counts.resolved, bg: "#dcfce7", text: "#15803d" },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: s.text }}>{s.count}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: s.text }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filter-row" style={{ marginBottom: 14 }}>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                    style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Fault cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.length === 0 ? (
                    <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 40, textAlign: "center", color: "#9ca3af" }}>
                        No fault reports found.
                    </div>
                ) : filtered.map(f => (
                    <div key={f.id} style={{ background: "#fff", border: `1px solid ${f.priority === "high" && f.status !== "resolved" ? "#fca5a5" : GREEN_LIGHT}`, borderRadius: 12, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{f.computers?.asset_tag ?? "Unknown"}</span>
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>{f.computers?.laboratories?.lab_name ?? ""}</span>
                                    <Badge type="priority" value={f.priority} />
                                    <Badge type="status" value={f.status} />
                                </div>
                                <div style={{ fontSize: 13.5, color: "#374151", marginBottom: 6 }}>{f.description}</div>
                                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                                    Reported by {f.profiles?.full_name ?? "Unknown"} · {new Date(f.created_at).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" })}
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                                {f.status !== "resolved" && (
                                    <select value={f.status} onChange={e => handleStatusChange(f.id, e.target.value)}
                                        style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 7, padding: "5px 8px", fontSize: 12, fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                )}
                                <button onClick={() => handleDelete(f.id)}
                                    style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer" }}>
                                    <Trash2 size={13} color="#dc2626" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <Modal title="Report a Fault" onClose={() => setShowForm(false)}>
                    <FaultForm computers={computers} onClose={() => setShowForm(false)} onSaved={load} />
                </Modal>
            )}
        </div>
    )
}

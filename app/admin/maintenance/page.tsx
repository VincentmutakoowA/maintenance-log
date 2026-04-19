'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllMaintenanceLogsAction, addMaintenanceLogAction, deleteMaintenanceLogAction,
    getAllPreventiveScheduleAction, addPreventiveScheduleAction,
    updatePreventiveScheduleStatusAction, deletePreventiveScheduleAction,
    getAllComputersAction, getAllFaultReportsAction,
} from "../actions"
import { Plus, X, CalendarClock, Trash2, CheckCircle2 } from "lucide-react"
import {
    ModalProps, ChildrenProps, SelectFieldProps, LogFormProps, ScheduleFormProps,
    ComputerWithLab, FaultReportWithRelations, MaintenanceLogWithRelations,
    PreventiveScheduleWithRelations, ActionState, SelectOption,
} from "@/lib/types"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"

function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={17} /></button>
                </div>
                <div style={{ padding: 20 }}>{children}</div>
            </div>
        </div>
    )
}

function FieldLabel({ children }: ChildrenProps) {
    return <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{children}</label>
}

function FSelect({ name, value, onChange, options, placeholder, required }: SelectFieldProps) {
    return (
        <select name={name} value={value} onChange={e => onChange(e.target.value)} required={required}
            style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}>
            <option value="">{placeholder}</option>
            {options.map((o: SelectOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    )
}

function LogForm({ computers, faultReports, onClose, onSaved }: LogFormProps) {
    const [state, formAction] = useActionState(addMaintenanceLogAction, { success: false })
    const [computerId, setComputerId] = useState("")
    const [faultId, setFaultId] = useState("")
    const [mType, setMType] = useState("corrective")

    useEffect(() => { if ((state as ActionState).success) { onSaved(); onClose() } }, [state, onSaved, onClose])

    const pendingFaults = faultReports.filter((r: FaultReportWithRelations) => r.status !== "resolved")

    return (
        <form action={formAction}>
            <input type="hidden" name="computer_id" value={computerId} />
            <input type="hidden" name="fault_report_id" value={faultId} />
            <input type="hidden" name="maintenance_type" value={mType} />
            <div style={{ display: "grid", gap: 12 }}>
                <div>
                    <FieldLabel>Computer *</FieldLabel>
                    <FSelect value={computerId} onChange={setComputerId} required placeholder="Select computer"
                        options={computers.map((c: ComputerWithLab) => ({ value: c.id, label: `${c.asset_tag} — ${c.laboratories?.lab_name ?? "No Lab"}` }))} />
                </div>
                <div>
                    <FieldLabel>Linked Fault Report (optional)</FieldLabel>
                    <FSelect value={faultId} onChange={setFaultId} placeholder="Select fault (optional)"
                        options={pendingFaults.map((r: FaultReportWithRelations) => ({ value: r.id, label: `${r.computers?.asset_tag ?? "?"} — ${r.description.slice(0, 50)}` }))} />
                </div>
                <div>
                    <FieldLabel>Maintenance Type</FieldLabel>
                    <FSelect value={mType} onChange={setMType} placeholder="Select type"
                        options={[{ value: "corrective", label: "Corrective" }, { value: "preventive", label: "Preventive" }]} />
                </div>
                <div>
                    <FieldLabel>Problem Identified</FieldLabel>
                    <textarea name="problem_identified" rows={2}
                        style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }}
                        placeholder="Describe the problem found..." />
                </div>
                <div>
                    <FieldLabel>Action Taken *</FieldLabel>
                    <textarea name="action_taken" required rows={3}
                        style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }}
                        placeholder="What was done to fix the issue..." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <FieldLabel>Parts Replaced</FieldLabel>
                        <input name="parts_replaced" style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit" }} placeholder="e.g. RAM, HDD" />
                    </div>
                    <div>
                        <FieldLabel>Cost (UGX)</FieldLabel>
                        <input name="cost" type="number" min="0" step="100"
                            style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit" }} placeholder="0" />
                    </div>
                </div>
                <div>
                    <FieldLabel>Next Maintenance Date</FieldLabel>
                    <input name="next_maintenance_date" type="date"
                        style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit" }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Log Maintenance</button>
            </div>
        </form>
    )
}

function ScheduleForm({ computers, onClose, onSaved }: ScheduleFormProps) {
    const [state, formAction] = useActionState(addPreventiveScheduleAction, { success: false })
    const [computerId, setComputerId] = useState("")
    useEffect(() => { if ((state as ActionState).success) { onSaved(); onClose() } }, [state, onSaved, onClose])
    return (
        <form action={formAction}>
            <input type="hidden" name="computer_id" value={computerId} />
            <div style={{ display: "grid", gap: 12 }}>
                <div>
                    <FieldLabel>Computer *</FieldLabel>
                    <FSelect value={computerId} onChange={setComputerId} required placeholder="Select computer"
                        options={computers.map((c: ComputerWithLab) => ({ value: c.id, label: `${c.asset_tag} — ${c.laboratories?.lab_name ?? ""}` }))} />
                </div>
                <div>
                    <FieldLabel>Scheduled Date *</FieldLabel>
                    <input name="scheduled_date" type="date" required style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit" }} />
                </div>
                <div>
                    <FieldLabel>Task Description *</FieldLabel>
                    <textarea name="task_description" required rows={3}
                        style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }}
                        placeholder="Describe the preventive maintenance task..." />
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Schedule</button>
            </div>
        </form>
    )
}

function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" })
}

export default function MaintenancePage() {
    const [logs, setLogs] = useState<MaintenanceLogWithRelations[]>([])
    const [schedules, setSchedules] = useState<PreventiveScheduleWithRelations[]>([])
    const [computers, setComputers] = useState<ComputerWithLab[]>([])
    const [faultReports, setFaultReports] = useState<FaultReportWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [showLogForm, setShowLogForm] = useState(false)
    const [showSchedForm, setShowSchedForm] = useState(false)
    const [tab, setTab] = useState<"logs" | "schedule">("logs")

    const load = async () => {
        const [l, s, c, f] = await Promise.all([
            getAllMaintenanceLogsAction(), getAllPreventiveScheduleAction(),
            getAllComputersAction(), getAllFaultReportsAction(),
        ])
        setLogs(l ?? []); setSchedules(s ?? []); setComputers(c ?? []); setFaultReports(f ?? [])
        setLoading(false)
    }

    useEffect(() => {
        Promise.all([
            getAllMaintenanceLogsAction(), getAllPreventiveScheduleAction(),
            getAllComputersAction(), getAllFaultReportsAction(),
        ]).then(([l, s, c, f]) => {
            setLogs(l ?? []); setSchedules(s ?? []); setComputers(c ?? []); setFaultReports(f ?? [])
            setLoading(false)
        })
    }, [])

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading maintenance data...</div>

    return (
        <div style={{ maxWidth: 1050 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Maintenance</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{logs.length} logs · {schedules.length} scheduled tasks</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setShowSchedForm(true)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", color: GREEN, border: `1.5px solid ${GREEN}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>
                        <CalendarClock size={14} /> Schedule
                    </button>
                    <button onClick={() => setShowLogForm(true)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>
                        <Plus size={14} /> Log Maintenance
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `2px solid ${GREEN_LIGHT}` }}>
                {(["logs", "schedule"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{ padding: "8px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: tab === t ? 700 : 400, color: tab === t ? GREEN : "#6b7280", borderBottom: `2px solid ${tab === t ? GREEN : "transparent"}`, marginBottom: -2, fontFamily: "inherit", textTransform: "capitalize" }}>
                        {t === "logs" ? `Maintenance Logs (${logs.length})` : `Scheduled Tasks (${schedules.length})`}
                    </button>
                ))}
            </div>

            {tab === "logs" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {logs.length === 0 ? (
                        <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 40, textAlign: "center", color: "#9ca3af" }}>No maintenance logs yet.</div>
                    ) : logs.map(l => (
                        <div key={l.id} style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{l.computers?.asset_tag ?? "?"}</span>
                                        <span style={{ fontSize: 12, color: "#6b7280" }}>{l.computers?.laboratories?.lab_name ?? ""}</span>
                                        <span style={{ fontSize: 11, fontWeight: 600, background: l.maintenance_type === "corrective" ? "#fee2e2" : "#dbeafe", color: l.maintenance_type === "corrective" ? "#b91c1c" : "#1d4ed8", padding: "2px 8px", borderRadius: 999 }}>
                                            {l.maintenance_type}
                                        </span>
                                    </div>
                                    {l.problem_identified && <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 4 }}><b>Problem:</b> {l.problem_identified}</div>}
                                    <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}><b>Action:</b> {l.action_taken}</div>
                                    {l.parts_replaced && <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 4 }}>Parts: {l.parts_replaced}</div>}
                                    <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "#9ca3af", flexWrap: "wrap" }}>
                                        <span>By {l.profiles?.full_name ?? "Unknown"}</span>
                                        <span>{fmt(l.resolved_at)}</span>
                                        {l.cost && <span style={{ color: "#15803d", fontWeight: 600 }}>UGX {Number(l.cost).toLocaleString()}</span>}
                                        {l.next_maintenance_date && <span>Next: {fmt(l.next_maintenance_date)}</span>}
                                    </div>
                                </div>
                                <button onClick={async () => { if (confirm("Delete this log?")) { await deleteMaintenanceLogAction(l.id); setLogs(ls => ls.filter(x => x.id !== l.id)) }}}
                                    style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer", marginLeft: 10, flexShrink: 0 }}>
                                    <Trash2 size={13} color="#dc2626" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {schedules.length === 0 ? (
                        <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 40, textAlign: "center", color: "#9ca3af" }}>No scheduled tasks yet.</div>
                    ) : schedules.map(s => {
                        const isPast = new Date(s.scheduled_date) < new Date() && s.status === "pending"
                        return (
                            <div key={s.id} style={{ background: "#fff", border: `1px solid ${isPast ? "#fca5a5" : GREEN_LIGHT}`, borderRadius: 12, padding: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                                            <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{s.computers?.asset_tag ?? "?"}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>{s.computers?.laboratories?.lab_name ?? ""}</span>
                                            <span style={{ fontSize: 11, fontWeight: 600, background: s.status === "completed" ? "#dcfce7" : isPast ? "#fee2e2" : "#fef3c7", color: s.status === "completed" ? "#15803d" : isPast ? "#b91c1c" : "#b45309", padding: "2px 8px", borderRadius: 999 }}>
                                                {s.status === "completed" ? "Completed" : isPast ? "Overdue" : "Pending"}
                                            </span>
                                            <span style={{ fontSize: 12, color: "#374151" }}>{fmt(s.scheduled_date)}</span>
                                        </div>
                                        <div style={{ fontSize: 13, color: "#374151" }}>{s.task_description}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                                        {s.status !== "completed" && (
                                            <button onClick={async () => { await updatePreventiveScheduleStatusAction(s.id, "completed"); setSchedules(sc => sc.map(x => x.id === s.id ? { ...x, status: "completed" } : x)) }}
                                                style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer" }}>
                                                <CheckCircle2 size={13} color={GREEN} />
                                            </button>
                                        )}
                                        <button onClick={async () => { if (confirm("Delete?")) { await deletePreventiveScheduleAction(s.id); setSchedules(sc => sc.filter(x => x.id !== s.id)) }}}
                                            style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer" }}>
                                            <Trash2 size={13} color="#dc2626" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {showLogForm && <Modal title="Log Maintenance Work" onClose={() => setShowLogForm(false)}><LogForm computers={computers} faultReports={faultReports} onClose={() => setShowLogForm(false)} onSaved={load} /></Modal>}
            {showSchedForm && <Modal title="Schedule Preventive Maintenance" onClose={() => setShowSchedForm(false)}><ScheduleForm computers={computers} onClose={() => setShowSchedForm(false)} onSaved={load} /></Modal>}
        </div>
    )
}

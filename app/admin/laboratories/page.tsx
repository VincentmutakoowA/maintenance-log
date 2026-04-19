'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllLaboratoriesAction, addLaboratoryAction, deleteLaboratoryAction, getAllComputersAction,
} from "../actions"
import { Plus, X, Pencil, Trash2, FlaskConical, MapPin, Monitor, ChevronDown, ChevronUp } from "lucide-react"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"; const YELLOW = "#e6f10f"

const STATUS_DOT: Record<string, string> = {
    working: "#16a34a", faulty: "#dc2626", under_repair: "#d97706", retired: "#9ca3af",
}

function Modal({ title, onClose, children }: any) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={17} /></button>
                </div>
                <div style={{ padding: 20 }}>{children}</div>
            </div>
        </div>
    )
}

function LabForm({ lab, onClose, onSaved }: any) {
    const [state, formAction] = useActionState(addLaboratoryAction, { success: false })
    useEffect(() => { if ((state as any).success) { onSaved(); onClose() } }, [state])
    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={lab?.id ?? ""} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Laboratory Name *</label>
                <input name="name" defaultValue={lab?.lab_name} required
                    style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", outline: "none" }}
                    placeholder="e.g. Computer Lab 1" />
            </div>
            <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Location</label>
                <input name="location" defaultValue={lab?.location ?? ""}
                    style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", outline: "none" }}
                    placeholder="e.g. Block A, Floor 2" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                    {lab ? "Update Lab" : "Add Laboratory"}
                </button>
            </div>
        </form>
    )
}

export default function LaboratoriesPage() {
    const [labs, setLabs] = useState<any[]>([])
    const [computers, setComputers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const load = async () => {
        const [l, c] = await Promise.all([getAllLaboratoriesAction(), getAllComputersAction()])
        setLabs(l ?? []); setComputers(c ?? []); setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this laboratory? All computers in it will become unassigned.")) return
        await deleteLaboratoryAction(id)
        setLabs(ls => ls.filter(l => l.id !== id))
    }

    const getLabComputers = (labId: string) => computers.filter(c => c.lab_id === labId)

    const labStats = (labId: string) => {
        const cs = getLabComputers(labId)
        return {
            total: cs.length,
            working: cs.filter(c => c.status === "working").length,
            faulty: cs.filter(c => c.status === "faulty").length,
            repair: cs.filter(c => c.status === "under_repair").length,
        }
    }

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading laboratories...</div>

    return (
        <div style={{ maxWidth: 900 }}>
            <div className="page-hdr" style={{ marginBottom: 22 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Laboratories</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{labs.length} lab{labs.length !== 1 ? "s" : ""} · {computers.length} computers total</div>
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Plus size={15} /> Add Laboratory
                </button>
            </div>

            {labs.length === 0 ? (
                <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 14, padding: 60, textAlign: "center", color: "#9ca3af" }}>
                    <FlaskConical size={40} color={GREEN_LIGHT} style={{ margin: "0 auto 12px" }} />
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No laboratories yet</div>
                    <div style={{ fontSize: 13 }}>Add your first lab to start registering computers.</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {labs.map(lab => {
                        const stats = labStats(lab.id)
                        const isOpen = expanded[lab.id]
                        const labComputers = getLabComputers(lab.id)
                        return (
                            <div key={lab.id} style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 14, overflow: "hidden" }}>
                                {/* Lab header */}
                                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 10, background: GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <FlaskConical size={22} color={GREEN} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 700 }}>{lab.lab_name}</div>
                                            {lab.location && (
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                                                    <MapPin size={12} /> {lab.location}
                                                </div>
                                            )}
                                        </div>
                                        {/* Mini stats */}
                                        <div style={{ display: "flex", gap: 10, marginLeft: 16, flexWrap: "wrap" }}>
                                            {[
                                                { label: "Total", count: stats.total, color: "#374151" },
                                                { label: "Working", count: stats.working, color: "#15803d" },
                                                { label: "Faulty", count: stats.faulty, color: "#dc2626" },
                                                { label: "Repair", count: stats.repair, color: "#d97706" },
                                            ].map(s => (
                                                <div key={s.label} style={{ textAlign: "center", minWidth: 42 }}>
                                                    <div style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.count}</div>
                                                    <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 10, flexWrap: "wrap" }}>
                                        <button onClick={() => { setEditing(lab); setShowForm(true) }}
                                            style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontFamily: "inherit", color: GREEN, fontWeight: 600 }}>
                                            <Pencil size={12} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(lab.id)}
                                            style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontFamily: "inherit", color: "#dc2626", fontWeight: 600 }}>
                                            <Trash2 size={12} /> Delete
                                        </button>
                                        {labComputers.length > 0 && (
                                            <button onClick={() => setExpanded(e => ({ ...e, [lab.id]: !isOpen }))}
                                                style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${GREEN_LIGHT}`, background: isOpen ? GREEN_LIGHT : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontFamily: "inherit", color: "#374151" }}>
                                                <Monitor size={12} /> {labComputers.length}
                                                {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Expandable computer list */}
                                {isOpen && labComputers.length > 0 && (
                                    <div style={{ borderTop: `1px solid ${GREEN_LIGHT}`, overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
                                            <thead>
                                                <tr style={{ background: "#f7faf6" }}>
                                                    {["Asset Tag", "Processor", "RAM", "Storage", "OS", "Status"].map(h => (
                                                        <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, fontSize: 11.5, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {labComputers.map(c => (
                                                    <tr key={c.id} style={{ borderTop: `1px solid #f0f7ee` }}>
                                                        <td style={{ padding: "8px 14px", fontWeight: 700, fontFamily: "monospace", fontSize: 12.5 }}>{c.asset_tag}</td>
                                                        <td style={{ padding: "8px 14px", color: "#374151" }}>{c.processor ?? "—"}</td>
                                                        <td style={{ padding: "8px 14px", color: "#374151" }}>{c.ram ?? "—"}</td>
                                                        <td style={{ padding: "8px 14px", color: "#374151" }}>{c.storage ?? "—"}</td>
                                                        <td style={{ padding: "8px 14px", color: "#374151" }}>{c.operating_system ?? "—"}</td>
                                                        <td style={{ padding: "8px 14px" }}>
                                                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600 }}>
                                                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_DOT[c.status] ?? "#9ca3af", display: "inline-block" }} />
                                                                {c.status.replace("_", " ")}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {showForm && (
                <Modal title={editing ? "Edit Laboratory" : "Add Laboratory"} onClose={() => setShowForm(false)}>
                    <LabForm lab={editing} onClose={() => setShowForm(false)} onSaved={load} />
                </Modal>
            )}
        </div>
    )
}
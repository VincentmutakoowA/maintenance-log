'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllComputersAction, getAllLaboratoriesAction, addComputerAction, deleteComputerAction,
    updateComputerStatusAction, getAllProcessorTypesAction, getAllRamSizesAction,
} from "../actions"
import { Plus, Pencil, Trash2, Monitor, X, ChevronDown } from "lucide-react"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"; const YELLOW = "#e6f10f"

const STATUS_OPTS = [
    { value: "working",    label: "Working",    color: "#dcfce7", text: "#15803d" },
    { value: "faulty",     label: "Faulty",     color: "#fee2e2", text: "#b91c1c" },
    { value: "under_repair",label:"Under Repair",color:"#fef3c7", text: "#b45309" },
    { value: "retired",    label: "Retired",    color: "#f3f4f6", text: "#6b7280" },
]

const OS_OPTS = ["Windows 10","Windows 11","Ubuntu 20.04","Ubuntu 22.04","Ubuntu 24.04","macOS","ChromeOS","Other"]

function StatusBadge({ status }: { status: string }) {
    const s = STATUS_OPTS.find(o => o.value === status) ?? STATUS_OPTS[3]
    return <span style={{ fontSize: 11, fontWeight: 600, background: s.color, color: s.text, padding: "2px 8px", borderRadius: 999 }}>{s.label}</span>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
                </div>
                <div style={{ padding: 22 }}>{children}</div>
            </div>
        </div>
    )
}

function Select({ name, value, onChange, options, placeholder }: any) {
    return (
        <select name={name} value={value} onChange={e => onChange(e.target.value)}
            style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, background: "#fff", fontFamily: "inherit", appearance: "auto" }}>
            <option value="">{placeholder}</option>
            {options.map((o: any) => (
                <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
            ))}
        </select>
    )
}

function Input({ name, defaultValue, placeholder, type = "text", required }: any) {
    return (
        <input name={name} defaultValue={defaultValue} placeholder={placeholder} type={type} required={required}
            style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", outline: "none" }} />
    )
}

function Label({ children }: any) {
    return <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{children}</label>
}

function ComputerForm({ computer, labs, processors, ramSizes, onClose, onSaved }: any) {
    const [state, formAction] = useActionState(addComputerAction, { success: false })
    const [labId, setLabId] = useState(computer?.lab_id ?? "")
    const [status, setStatus] = useState(computer?.status ?? "working")
    const [processor, setProcessor] = useState(computer?.processor ?? "")
    const [ram, setRam] = useState(computer?.ram ?? "")
    const [os, setOs] = useState(computer?.operating_system ?? "")

    useEffect(() => {
        if ((state as any).success) { onSaved(); onClose() }
    }, [state])

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={computer?.id ?? ""} />
            <input type="hidden" name="lab_id" value={labId} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="processor" value={processor} />
            <input type="hidden" name="ram" value={ram} />
            <input type="hidden" name="operating_system" value={os} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><Label>Asset Tag *</Label><Input name="asset_tag" defaultValue={computer?.asset_tag} placeholder="e.g. LAB-001" required /></div>
                <div><Label>Serial Number</Label><Input name="serial_number" defaultValue={computer?.serial_number} placeholder="e.g. SN123456" /></div>

                <div>
                    <Label>Laboratory</Label>
                    <Select name="_lab_id" value={labId} onChange={setLabId} placeholder="Select lab"
                        options={labs.map((l: any) => ({ value: l.id, label: l.lab_name }))} />
                </div>

                <div>
                    <Label>Processor</Label>
                    <Select name="_processor" value={processor} onChange={setProcessor} placeholder="Select processor"
                        options={processors.map((p: any) => ({ value: p.name, label: p.name }))} />
                </div>

                <div>
                    <Label>RAM</Label>
                    <Select name="_ram" value={ram} onChange={setRam} placeholder="Select RAM"
                        options={ramSizes.map((r: any) => ({ value: r.size, label: r.size }))} />
                </div>

                <div><Label>Storage</Label><Input name="storage" defaultValue={computer?.storage} placeholder="e.g. 256 GB SSD" /></div>

                <div>
                    <Label>Operating System</Label>
                    <Select name="_os" value={os} onChange={setOs} placeholder="Select OS" options={OS_OPTS} />
                </div>

                <div><Label>Purchase Date</Label><Input name="purchase_date" defaultValue={computer?.purchase_date} type="date" /></div>

                <div>
                    <Label>Status</Label>
                    <Select name="_status" value={status} onChange={setStatus} placeholder="Select status"
                        options={STATUS_OPTS.map(s => ({ value: s.value, label: s.label }))} />
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontSize: 13.5, fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit" }}>
                    {computer ? "Update Computer" : "Add Computer"}
                </button>
            </div>
        </form>
    )
}

export default function ComputersPage() {
    const [computers, setComputers] = useState<any[]>([])
    const [labs, setLabs] = useState<any[]>([])
    const [processors, setProcessors] = useState<any[]>([])
    const [ramSizes, setRamSizes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [filterStatus, setFilterStatus] = useState("")
    const [filterLab, setFilterLab] = useState("")
    const [search, setSearch] = useState("")

    const load = async () => {
        const [c, l, p, r] = await Promise.all([
            getAllComputersAction(), getAllLaboratoriesAction(), getAllProcessorTypesAction(), getAllRamSizesAction()
        ])
        setComputers(c ?? []); setLabs(l ?? []); setProcessors(p ?? []); setRamSizes(r ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this computer? This cannot be undone.")) return
        await deleteComputerAction(id)
        setComputers(cs => cs.filter(c => c.id !== id))
    }

    const filtered = computers.filter(c => {
        if (filterStatus && c.status !== filterStatus) return false
        if (filterLab && c.lab_id !== filterLab) return false
        if (search && !c.asset_tag.toLowerCase().includes(search.toLowerCase()) &&
            !(c.serial_number ?? "").toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading computers...</div>

    return (
        <div style={{ maxWidth: 1100 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Computer Inventory</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{computers.length} device{computers.length !== 1 ? "s" : ""} registered</div>
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Plus size={15} /> Add Computer
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by asset tag..."
                    style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontFamily: "inherit", flex: 1, minWidth: 160, outline: "none" }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select value={filterLab} onChange={e => setFilterLab(e.target.value)}
                    style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
                    <option value="">All Labs</option>
                    {labs.map(l => <option key={l.id} value={l.id}>{l.lab_name}</option>)}
                </select>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: GREEN_LIGHT }}>
                            {["Asset Tag","Laboratory","Processor","RAM","Storage","OS","Status","Actions"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#2d4a2d", borderBottom: `1px solid ${GREEN_LIGHT}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No computers found.</td></tr>
                        ) : filtered.map(c => (
                            <tr key={c.id} style={{ borderBottom: `1px solid #f0f7ee` }}>
                                <td style={{ padding: "9px 14px", fontWeight: 600, fontFamily: "monospace" }}>{c.asset_tag}</td>
                                <td style={{ padding: "9px 14px", color: "#6b7280" }}>{c.laboratories?.lab_name ?? "—"}</td>
                                <td style={{ padding: "9px 14px", color: "#374151" }}>{c.processor ?? "—"}</td>
                                <td style={{ padding: "9px 14px", color: "#374151" }}>{c.ram ?? "—"}</td>
                                <td style={{ padding: "9px 14px", color: "#374151" }}>{c.storage ?? "—"}</td>
                                <td style={{ padding: "9px 14px", color: "#374151" }}>{c.operating_system ?? "—"}</td>
                                <td style={{ padding: "9px 14px" }}><StatusBadge status={c.status} /></td>
                                <td style={{ padding: "9px 14px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button onClick={() => { setEditing(c); setShowForm(true) }}
                                            style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer" }}>
                                            <Pencil size={13} color={GREEN} />
                                        </button>
                                        <button onClick={() => handleDelete(c.id)}
                                            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer" }}>
                                            <Trash2 size={13} color="#dc2626" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editing ? "Edit Computer" : "Add Computer"} onClose={() => setShowForm(false)}>
                    <ComputerForm computer={editing} labs={labs} processors={processors} ramSizes={ramSizes}
                        onClose={() => setShowForm(false)} onSaved={load} />
                </Modal>
            )}
        </div>
    )
}

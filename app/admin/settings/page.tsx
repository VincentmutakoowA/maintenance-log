'use client'

import { useEffect, useState } from "react"
import {
    getAllProcessorTypesAction, addProcessorTypeAction, deleteProcessorTypeAction,
    getAllRamSizesAction,
} from "../actions"
import { Plus, Cpu, MemoryStick, X } from "lucide-react"
import { SectionCardProps, ProcessorType, RamSize } from "@/lib/types"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3";

function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
    return (
        <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", alignItems: "center", gap: 10, background: "#f7faf6" }}>
                <Icon size={17} color={GREEN} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
            </div>
            <div style={{ padding: 20 }}>{children}</div>
        </div>
    )
}

function ProcessorManager() {
    const [processors, setProcessors] = useState<ProcessorType[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState("")
    const [adding, setAdding] = useState(false)

    const load = async () => {
        const p = await getAllProcessorTypesAction()
        setProcessors(p ?? []); setLoading(false)
    }
    useEffect(() => {
        getAllProcessorTypesAction().then(p => { setProcessors(p ?? []); setLoading(false) })
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim()) return
        setAdding(true)
        const fd = new FormData(); fd.set("name", newName.trim())
        await addProcessorTypeAction({}, fd)
        setNewName(""); await load(); setAdding(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this processor type?")) return
        await deleteProcessorTypeAction(id)
        setProcessors(ps => ps.filter(p => p.id !== id))
    }

    return (
        <>
            <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Intel Core i5 (13th Gen)" required
                    style={{ flex: 1, border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", outline: "none" }} />
                <button type="submit" disabled={adding}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Plus size={14} /> Add
                </button>
            </form>
            {loading ? <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</div> : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {processors.length === 0 ? (
                        <div style={{ fontSize: 13, color: "#9ca3af" }}>No processor types yet. Add one above.</div>
                    ) : processors.map(p => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, background: GREEN_LIGHT, borderRadius: 8, padding: "6px 12px", fontSize: 13 }}>
                            <span style={{ color: "#2d4a2d" }}>{p.name}</span>
                            <button onClick={() => handleDelete(p.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}>
                                <X size={13} color="#6b7280" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

function RamViewer() {
    const [ramSizes, setRamSizes] = useState<RamSize[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => { getAllRamSizesAction().then(r => { setRamSizes(r ?? []); setLoading(false) }) }, [])
    return loading ? <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</div> : (
        <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                RAM sizes are pre-configured system values used in the computer registration dropdown.
                Contact your system administrator to add custom sizes.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ramSizes.map(r => (
                    <div key={r.id} style={{ background: GREEN_LIGHT, borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#2d4a2d", fontWeight: 600 }}>
                        {r.size}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function SettingsPage() {
    return (
        <div style={{ maxWidth: 700 }}>
            <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>System Settings</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Manage processor types and system configuration</div>
            </div>

            <SectionCard title="Processor Types" icon={Cpu}>
                <ProcessorManager />
            </SectionCard>

            <SectionCard title="RAM Sizes" icon={MemoryStick}>
                <RamViewer />
            </SectionCard>

            <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>About This System</div>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 20px", fontSize: 13, wordBreak: "break-word" }}>
                    {[
                        ["System", "USJM Maintenance Log Management System"],
                        ["Institution", "University of Saint Joseph Mbarara"],
                        ["Database", "PostgreSQL via Supabase"],
                        ["Framework", "Next.js"],
                        ["Version", "2.0"],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: "contents" }}>
                            <span key={k + "k"} style={{ color: "#9ca3af", fontWeight: 600 }}>{k}</span>
                            <span key={k + "v"} style={{ color: "#374151" }}>{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

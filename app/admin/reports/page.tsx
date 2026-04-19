'use client'

import { useEffect, useState } from "react"
import { getReportDataAction, getAllLaboratoriesAction } from "../actions"
import { FileText, Download, Filter, Printer } from "lucide-react"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"; const YELLOW = "#e6f10f"

function fmt(d: string) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" })
}

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
    const escape = (v: string) => `"${(v ?? "").toString().replace(/"/g, '""')}"`
    const lines = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))]
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
}

function downloadMaintenanceCSV(logs: any[]) {
    const headers = ["Date", "Asset Tag", "Laboratory", "Technician", "Type", "Problem", "Action Taken", "Parts Replaced", "Cost (UGX)", "Next Maintenance"]
    const rows = logs.map(l => [
        fmt(l.resolved_at),
        l.computers?.asset_tag ?? "",
        l.computers?.laboratories?.lab_name ?? "",
        l.profiles?.full_name ?? "",
        l.maintenance_type ?? "",
        l.problem_identified ?? "",
        l.action_taken ?? "",
        l.parts_replaced ?? "",
        l.cost != null ? String(l.cost) : "",
        l.next_maintenance_date ? fmt(l.next_maintenance_date) : "",
    ])
    downloadCSV(`maintenance_logs_${new Date().toISOString().slice(0,10)}.csv`, rows, headers)
}

function downloadFaultsCSV(faults: any[]) {
    const headers = ["Date Reported", "Asset Tag", "Laboratory", "Reported By", "Priority", "Status", "Description"]
    const rows = faults.map(f => [
        fmt(f.created_at),
        f.computers?.asset_tag ?? "",
        f.computers?.laboratories?.lab_name ?? "",
        f.profiles?.full_name ?? "",
        f.priority ?? "",
        f.status ?? "",
        f.description ?? "",
    ])
    downloadCSV(`fault_reports_${new Date().toISOString().slice(0,10)}.csv`, rows, headers)
}

function downloadInventoryCSV(computers: any[]) {
    const headers = ["Asset Tag", "Laboratory", "Processor", "RAM", "Storage", "OS", "Status", "Purchase Date"]
    const rows = computers.map(c => [
        c.asset_tag ?? "",
        c.laboratories?.lab_name ?? "",
        c.processor ?? "",
        c.ram ?? "",
        c.storage ?? "",
        c.operating_system ?? "",
        c.status ?? "",
        c.purchase_date ? fmt(c.purchase_date) : "",
    ])
    downloadCSV(`computer_inventory_${new Date().toISOString().slice(0,10)}.csv`, rows, headers)
}

function SummaryCard({ title, value, sub, color }: any) {
    return (
        <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 10, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color ?? GREEN }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#0f1a0f" }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>}
        </div>
    )
}

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [labs, setLabs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [labId, setLabId] = useState("")
    const [activeTab, setActiveTab] = useState<"maintenance" | "faults" | "inventory">("maintenance")

    useEffect(() => { getAllLaboratoriesAction().then(l => setLabs(l ?? [])) }, [])

    const loadReport = async () => {
        setLoading(true)
        const d = await getReportDataAction(from || undefined, to || undefined, labId || undefined)
        setData(d); setLoading(false)
    }

    useEffect(() => { loadReport() }, [])

    const handlePrint = () => window.print()

    const ml = data?.maintenanceLogs ?? []
    const fr = data?.faultReports ?? []
    const computers = data?.computers ?? []
    const totalCost = ml.reduce((s: number, l: any) => s + (l.cost ?? 0), 0)
    const resolvedFaults = fr.filter((f: any) => f.status === "resolved").length
    const pendingFaults = fr.filter((f: any) => f.status === "pending").length
    const workingComputers = computers.filter((c: any) => c.status === "working").length

    return (
        <div style={{ maxWidth: 1100 }}>
            <style>{`@media print { .no-print { display: none !important; } }`}</style>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Reports</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Generate and download maintenance reports</div>
                </div>
                <button onClick={handlePrint} className="no-print"
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fff", color: "#374151", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontFamily: "inherit", fontWeight: 600 }}>
                    <Printer size={15} /> Print
                </button>
            </div>

            {/* Filters */}
            <div className="no-print" style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 18, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>From Date</label>
                    <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                        style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>To Date</label>
                    <input type="date" value={to} onChange={e => setTo(e.target.value)}
                        style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Laboratory</label>
                    <select value={labId} onChange={e => setLabId(e.target.value)}
                        style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
                        <option value="">All Laboratories</option>
                        {labs.map(l => <option key={l.id} value={l.id}>{l.lab_name}</option>)}
                    </select>
                </div>
                <button onClick={loadReport} disabled={loading}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Filter size={14} /> {loading ? "Loading..." : "Apply Filters"}
                </button>
            </div>

            {/* Report header (prints) */}
            <div style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #005f00 100%)`, color: "#fff", borderRadius: 12, padding: "18px 22px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Maintenance Report</div>
                        <div style={{ fontSize: 13, opacity: 0.85 }}>University of Saint Joseph Mbarara · Computer Laboratories</div>
                        {(from || to) && (
                            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                                Period: {from ? fmt(from) : "All time"} — {to ? fmt(to) : "Present"}
                            </div>
                        )}
                        {labId && labs.find(l => l.id === labId) && (
                            <div style={{ fontSize: 12, opacity: 0.75 }}>Lab: {labs.find(l => l.id === labId)?.lab_name}</div>
                        )}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8, textAlign: "right" }}>
                        Generated: {new Date().toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                </div>
            </div>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 22 }}>
                <SummaryCard title="Maintenance Logs" value={ml.length} sub="in selected period" color={GREEN} />
                <SummaryCard title="Total Cost" value={`UGX ${totalCost.toLocaleString()}`} sub="maintenance spend" color="#7c3aed" />
                <SummaryCard title="Fault Reports" value={fr.length} sub={`${resolvedFaults} resolved, ${pendingFaults} pending`} color="#d97706" />
                <SummaryCard title="Computers" value={computers.length} sub={`${workingComputers} working`} color="#2563eb" />
            </div>

            {/* Tabs + Download */}
            <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: `2px solid ${GREEN_LIGHT}`, paddingBottom: 0 }}>
                <div style={{ display: "flex" }}>
                    {(["maintenance", "faults", "inventory"] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            style={{ padding: "8px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? GREEN : "#6b7280", borderBottom: `2px solid ${activeTab === t ? GREEN : "transparent"}`, marginBottom: -2, fontFamily: "inherit", textTransform: "capitalize" }}>
                            {t === "maintenance" ? `Maintenance (${ml.length})` : t === "faults" ? `Faults (${fr.length})` : `Inventory (${computers.length})`}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
                    {activeTab === "maintenance" && ml.length > 0 && (
                        <button onClick={() => downloadMaintenanceCSV(ml)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", background: YELLOW, color: "#0f1a0f", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12.5, fontFamily: "inherit" }}>
                            <Download size={13} /> Download CSV
                        </button>
                    )}
                    {activeTab === "faults" && fr.length > 0 && (
                        <button onClick={() => downloadFaultsCSV(fr)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", background: YELLOW, color: "#0f1a0f", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12.5, fontFamily: "inherit" }}>
                            <Download size={13} /> Download CSV
                        </button>
                    )}
                    {activeTab === "inventory" && computers.length > 0 && (
                        <button onClick={() => downloadInventoryCSV(computers)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", background: YELLOW, color: "#0f1a0f", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12.5, fontFamily: "inherit" }}>
                            <Download size={13} /> Download CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Tables */}
            {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading report data...</div>
            ) : (
                <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, overflow: "hidden" }}>
                    {activeTab === "maintenance" && (
                        <>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                                <thead>
                                    <tr style={{ background: GREEN_LIGHT }}>
                                        {["Date", "Asset Tag", "Lab", "Technician", "Type", "Problem / Action", "Parts", "Cost (UGX)"].map(h => (
                                            <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontWeight: 600, fontSize: 11.5, color: "#2d4a2d" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ml.length === 0 ? (
                                        <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No maintenance logs in this period.</td></tr>
                                    ) : ml.map((l: any) => (
                                        <tr key={l.id} style={{ borderBottom: "1px solid #f0f7ee" }}>
                                            <td style={{ padding: "8px 13px", whiteSpace: "nowrap" }}>{fmt(l.resolved_at)}</td>
                                            <td style={{ padding: "8px 13px", fontWeight: 700, fontFamily: "monospace", fontSize: 12 }}>{l.computers?.asset_tag ?? "—"}</td>
                                            <td style={{ padding: "8px 13px", color: "#6b7280" }}>{l.computers?.laboratories?.lab_name ?? "—"}</td>
                                            <td style={{ padding: "8px 13px", color: "#374151" }}>{l.profiles?.full_name ?? "—"}</td>
                                            <td style={{ padding: "8px 13px" }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, background: l.maintenance_type === "corrective" ? "#fee2e2" : "#dbeafe", color: l.maintenance_type === "corrective" ? "#b91c1c" : "#1d4ed8", padding: "2px 7px", borderRadius: 999 }}>{l.maintenance_type ?? "—"}</span>
                                            </td>
                                            <td style={{ padding: "8px 13px", maxWidth: 240 }}>
                                                {l.problem_identified && <div style={{ color: "#6b7280", marginBottom: 2 }}>{l.problem_identified}</div>}
                                                <div>{l.action_taken}</div>
                                            </td>
                                            <td style={{ padding: "8px 13px", color: "#6b7280" }}>{l.parts_replaced ?? "—"}</td>
                                            <td style={{ padding: "8px 13px", fontWeight: 600, color: l.cost ? "#15803d" : "#9ca3af" }}>{l.cost ? Number(l.cost).toLocaleString() : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                {ml.length > 0 && (
                                    <tfoot>
                                        <tr style={{ background: "#f7faf6" }}>
                                            <td colSpan={7} style={{ padding: "9px 13px", fontWeight: 700, textAlign: "right" }}>Total Cost:</td>
                                            <td style={{ padding: "9px 13px", fontWeight: 800, color: GREEN }}>UGX {totalCost.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </>
                    )}

                    {activeTab === "faults" && (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                            <thead>
                                <tr style={{ background: GREEN_LIGHT }}>
                                    {["Date", "Asset Tag", "Lab", "Reported By", "Priority", "Status", "Description"].map(h => (
                                        <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontWeight: 600, fontSize: 11.5, color: "#2d4a2d" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fr.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No fault reports in this period.</td></tr>
                                ) : fr.map((f: any) => (
                                    <tr key={f.id} style={{ borderBottom: "1px solid #f0f7ee" }}>
                                        <td style={{ padding: "8px 13px", whiteSpace: "nowrap" }}>{fmt(f.created_at)}</td>
                                        <td style={{ padding: "8px 13px", fontWeight: 700, fontFamily: "monospace", fontSize: 12 }}>{f.computers?.asset_tag ?? "—"}</td>
                                        <td style={{ padding: "8px 13px", color: "#6b7280" }}>{f.computers?.laboratories?.lab_name ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>{f.profiles?.full_name ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, background: f.priority === "high" ? "#fee2e2" : f.priority === "medium" ? "#fef3c7" : "#dbeafe", color: f.priority === "high" ? "#b91c1c" : f.priority === "medium" ? "#b45309" : "#1d4ed8", padding: "2px 7px", borderRadius: 999 }}>{f.priority}</span>
                                        </td>
                                        <td style={{ padding: "8px 13px" }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, background: f.status === "resolved" ? "#dcfce7" : f.status === "in_progress" ? "#dbeafe" : "#fef3c7", color: f.status === "resolved" ? "#15803d" : f.status === "in_progress" ? "#1d4ed8" : "#b45309", padding: "2px 7px", borderRadius: 999 }}>{f.status.replace("_", " ")}</span>
                                        </td>
                                        <td style={{ padding: "8px 13px", color: "#374151", maxWidth: 260 }}>{f.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "inventory" && (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                            <thead>
                                <tr style={{ background: GREEN_LIGHT }}>
                                    {["Asset Tag", "Lab", "Processor", "RAM", "Storage", "OS", "Status", "Purchase Date"].map(h => (
                                        <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontWeight: 600, fontSize: 11.5, color: "#2d4a2d" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {computers.length === 0 ? (
                                    <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No computers found.</td></tr>
                                ) : computers.map((c: any) => (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #f0f7ee" }}>
                                        <td style={{ padding: "8px 13px", fontWeight: 700, fontFamily: "monospace", fontSize: 12 }}>{c.asset_tag}</td>
                                        <td style={{ padding: "8px 13px", color: "#6b7280" }}>{c.laboratories?.lab_name ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>{c.processor ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>{c.ram ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>{c.storage ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>{c.operating_system ?? "—"}</td>
                                        <td style={{ padding: "8px 13px" }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, background: c.status === "working" ? "#dcfce7" : c.status === "faulty" ? "#fee2e2" : c.status === "under_repair" ? "#fef3c7" : "#f3f4f6", color: c.status === "working" ? "#15803d" : c.status === "faulty" ? "#b91c1c" : c.status === "under_repair" ? "#b45309" : "#6b7280", padding: "2px 7px", borderRadius: 999 }}>
                                                {c.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td style={{ padding: "8px 13px", color: "#6b7280" }}>{c.purchase_date ? fmt(c.purchase_date) : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}

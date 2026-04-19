'use client'

import { useEffect, useState } from "react"
import { getDashboardStatsAction, getCurrentUserProfileAction } from "../actions"
import { Monitor, AlertTriangle, Wrench, FlaskConical, CheckCircle2, Clock, CalendarCheck, DollarSign } from "lucide-react"

const GREEN = "#008e00"
const GREEN_LIGHT = "#d7e6d3"
const YELLOW = "#e6f10f"

type Stats = Awaited<ReturnType<typeof getDashboardStatsAction>>

function StatCard({ title, value, sub, icon: Icon, accent, topColor }: {
    title: string; value: number | string; sub?: string; icon: React.ElementType; accent?: string; topColor?: string
}) {
    return (
        <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: topColor ?? GREEN }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={17} color={accent ?? GREEN} />
                </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f1a0f", lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{sub}</div>}
        </div>
    )
}

function ProgressBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = total ? Math.round((count / total) * 100) : 0
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#4b6b4b", width: 90, flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#f0f7ee", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, width: 30, textAlign: "right" }}>{count}</span>
        </div>
    )
}

export default function AdminHome() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getDashboardStatsAction(), getCurrentUserProfileAction()]).then(([s, p]) => {
            setStats(s); setProfile(p); setLoading(false)
        })
    }, [])

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${GREEN_LIGHT}`, borderTopColor: GREEN, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
    if (!stats) return null

    const role = profile?.role ?? "staff"
    const greeting = role === "admin" ? "Welcome back, Administrator" : role === "technician" ? "Technician Dashboard" : "Staff Dashboard"

    return (
        <div style={{ maxWidth: 1100, animation: "fadeIn 0.25s ease" }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Greeting */}
            <div style={{ marginBottom: 24, background: `linear-gradient(135deg, ${GREEN} 0%, #005f00 100%)`, borderRadius: 14, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{greeting}</div>
                    <div style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>
                        {profile?.full_name ? `Logged in as ${profile.full_name}` : "University of Saint Joseph Mbarara"}
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    {stats.highPriorityFaults > 0 && (
                        <div style={{ background: "#dc2626", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>
                            ⚠ {stats.highPriorityFaults} high-priority fault{stats.highPriorityFaults > 1 ? "s" : ""}
                        </div>
                    )}
                    {stats.upcomingSchedules > 0 && (
                        <div style={{ background: YELLOW, color: "#0f1a0f", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                            📅 {stats.upcomingSchedules} upcoming schedule{stats.upcomingSchedules > 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
                <StatCard title="Total Computers" value={stats.totalComputers} sub={`${stats.workingComputers} working`} icon={Monitor} />
                <StatCard title="Faulty / Repair" value={stats.faultyComputers + stats.underRepair} sub={`${stats.faultyComputers} faulty, ${stats.underRepair} in repair`} icon={Wrench} accent="#dc2626" topColor="#dc2626" />
                <StatCard title="Pending Faults" value={stats.pendingFaults} sub={`${stats.inProgressFaults} in progress`} icon={AlertTriangle} accent="#d97706" topColor="#d97706" />
                <StatCard title="Resolved" value={stats.resolvedFaults} sub="maintenance completed" icon={CheckCircle2} accent={GREEN} topColor={GREEN} />
                {role === "admin" && (
                    <>
                        <StatCard title="Laboratories" value={stats.totalLabs} sub={`${stats.totalMaintenanceLogs} log entries`} icon={FlaskConical} />
                        <StatCard title="Maintenance Cost" value={`UGX ${stats.totalCost.toLocaleString()}`} sub="total recorded spend" icon={DollarSign} accent="#7c3aed" topColor="#7c3aed" />
                    </>
                )}
            </div>

            {/* Status breakdown */}
            {stats.totalComputers > 0 && (
                <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#0f1a0f" }}>Computer Status</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <ProgressBar label="Working" count={stats.workingComputers} total={stats.totalComputers} color={GREEN} />
                        <ProgressBar label="Faulty" count={stats.faultyComputers} total={stats.totalComputers} color="#dc2626" />
                        <ProgressBar label="Under Repair" count={stats.underRepair} total={stats.totalComputers} color="#d97706" />
                        <ProgressBar label="Retired" count={stats.retiredComputers} total={stats.totalComputers} color="#9ca3af" />
                    </div>
                </div>
            )}

            {/* Fault overview */}
            {(stats.pendingFaults + stats.inProgressFaults + stats.resolvedFaults) > 0 && (
                <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#0f1a0f" }}>Fault Report Overview</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[
                            { label: "Pending", count: stats.pendingFaults, color: "#fef3c7", text: "#b45309" },
                            { label: "In Progress", count: stats.inProgressFaults, color: "#dbeafe", text: "#1d4ed8" },
                            { label: "Resolved", count: stats.resolvedFaults, color: "#dcfce7", text: "#15803d" },
                        ].map(s => (
                            <div key={s.label} style={{ background: s.color, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                                <div style={{ fontSize: 26, fontWeight: 800, color: s.text }}>{s.count}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: s.text, marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

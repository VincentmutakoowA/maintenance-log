'use client'

import { useEffect, useState } from "react"
import { getDashboardStatsAction } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Monitor, AlertTriangle, Wrench, FlaskConical } from "lucide-react"

type Stats = Awaited<ReturnType<typeof getDashboardStatsAction>>

function StatCard({
    title,
    value,
    sub,
    icon: Icon,
    accent,
}: {
    title: string
    value: number | string
    sub?: string
    icon: React.ElementType
    accent?: string
}) {
    return (
        <Card className="border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon size={18} className={accent ?? "text-muted-foreground"} />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </CardContent>
        </Card>
    )
}

export default function AdminHome() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboardStatsAction().then(s => {
            setStats(s)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <Spinner />
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="w-full max-w-6xl space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">Overview</h2>
                <p className="text-sm text-muted-foreground">Summary of your computer labs at a glance.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Computers"
                    value={stats.totalComputers}
                    sub={`${stats.workingComputers} working`}
                    icon={Monitor}
                />
                <StatCard
                    title="Faulty"
                    value={stats.faultyComputers}
                    sub={`${stats.underRepair} under repair`}
                    icon={Wrench}
                    accent={stats.faultyComputers > 0 ? "text-red-500" : "text-muted-foreground"}
                />
                <StatCard
                    title="Pending Faults"
                    value={stats.pendingFaults}
                    sub={stats.highPriorityFaults > 0 ? `${stats.highPriorityFaults} high priority` : "No high priority"}
                    icon={AlertTriangle}
                    accent={stats.pendingFaults > 0 ? "text-orange-500" : "text-muted-foreground"}
                />
                <StatCard
                    title="Laboratories"
                    value={stats.totalLabs}
                    sub={`${stats.totalMaintenanceLogs} maintenance logs`}
                    icon={FlaskConical}
                />
            </div>

            {/* Status breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Computer Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.totalComputers === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No computers registered yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {[
                                { label: "Working", count: stats.workingComputers, color: "bg-green-500" },
                                { label: "Faulty", count: stats.faultyComputers, color: "bg-red-500" },
                                { label: "Under Repair", count: stats.underRepair, color: "bg-yellow-500" },
                                { label: "Retired", count: stats.totalComputers - stats.workingComputers - stats.faultyComputers - stats.underRepair, color: "bg-gray-400" },
                            ].filter(s => s.count > 0).map(({ label, count, color }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
                                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`${color} h-2 rounded-full transition-all`}
                                            style={{ width: `${Math.round((count / stats.totalComputers) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
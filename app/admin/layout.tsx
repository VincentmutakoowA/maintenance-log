'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentUserProfileAction } from "@/app/admin/actions"
import { ProfileWithEmail } from "@/lib/types"
import {
    LayoutDashboard, Monitor, AlertTriangle, Wrench, FlaskConical,
    FileText, Settings, Users, LogOut, ChevronRight, Menu
} from "lucide-react"

const GREEN = "#008e00"
const GREEN_LIGHT = "#d7e6d3"
const YELLOW = "#e6f10f"

const NAV_ITEMS = [
    { href: "/admin/home",         label: "Dashboard",    icon: LayoutDashboard, adminOnly: false },
    { href: "/admin/faults",       label: "Fault Reports",icon: AlertTriangle,   adminOnly: false },
    { href: "/admin/maintenance",  label: "Maintenance",  icon: Wrench,          adminOnly: false },
    { href: "/admin/computers",    label: "Computers",    icon: Monitor,         adminOnly: true  },
    { href: "/admin/laboratories", label: "Laboratories", icon: FlaskConical,    adminOnly: true  },
    { href: "/admin/reports",      label: "Reports",      icon: FileText,        adminOnly: false },
    { href: "/admin/users",        label: "Users",        icon: Users,           adminOnly: true  },
    { href: "/admin/settings",     label: "Settings",     icon: Settings,        adminOnly: true  },
]

type SidebarProps = {
    pathname: string
    role: string
    initials: string
    profile: ProfileWithEmail | null
    visibleNav: typeof NAV_ITEMS
    onNavClick: () => void
}

function Sidebar({ pathname, role, initials, profile, visibleNav, onNavClick }: SidebarProps) {
    return (
        <div style={{ width: 232, minHeight: "100vh", background: "#fff", borderRight: `1px solid ${GREEN_LIGHT}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${GREEN_LIGHT}` }}>
                <div style={{ background: GREEN, color: "#fff", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, background: YELLOW, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Wrench size={15} color="#0f1a0f" />
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>MaintainLog</div>
                        <div style={{ fontSize: 10, opacity: 0.85 }}>USJM System</div>
                    </div>
                </div>
            </div>
            <div style={{ padding: "10px 16px 4px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: role === "admin" ? GREEN : role === "technician" ? "#b45309" : "#2563eb", background: role === "admin" ? GREEN_LIGHT : role === "technician" ? "#fef3c7" : "#dbeafe", padding: "3px 8px", borderRadius: 4 }}>
                    {role}
                </span>
            </div>
            <nav style={{ flex: 1, paddingTop: 4, paddingBottom: 12 }}>
                {visibleNav.map(item => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon
                    return (
                        <Link key={item.href} href={item.href} onClick={onNavClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 8, fontSize: 13.5, fontWeight: active ? 600 : 400, color: active ? "#fff" : "#2d4a2d", background: active ? GREEN : "transparent", textDecoration: "none", margin: "1px 8px", transition: "all 0.12s" }}>
                            <Icon size={16} />
                            {item.label}
                            {active && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
                        </Link>
                    )
                })}
            </nav>
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${GREEN_LIGHT}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name ?? "Loading..."}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.email ?? ""}</div>
                    </div>
                </div>
                <form action="/auth/signout" method="post">
                    <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151", fontFamily: "inherit" }}>
                        <LogOut size={13} /> Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [profile, setProfile] = useState<ProfileWithEmail | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => { getCurrentUserProfileAction().then(setProfile) }, [])

    const role = profile?.role ?? "staff"
    const initials = profile?.full_name
        ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?"

    const visibleNav = NAV_ITEMS.filter(n => !n.adminOnly || role === "admin")

    const sidebarProps: SidebarProps = {
        pathname, role, initials, profile, visibleNav,
        onNavClick: () => setMobileOpen(false),
    }

    const currentLabel = NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label ?? "Dashboard"

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f7faf6", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "auto", display: "flex" }} className="hidden lg:flex">
                <Sidebar {...sidebarProps} />
            </div>
            {mobileOpen && <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.25)" }} onClick={() => setMobileOpen(false)} />}
            {mobileOpen && <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}><Sidebar {...sidebarProps} /></div>}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${GREEN} 55%, ${YELLOW} 100%)`, flexShrink: 0 }} />
                <header style={{ background: "#fff", borderBottom: `1px solid ${GREEN_LIGHT}`, padding: "11px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button className="lg:hidden" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Menu size={21} /></button>
                        <div>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f1a0f" }}>{currentLabel}</div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>University of Saint Joseph Mbarara</div>
                        </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {new Date().toLocaleDateString("en-UG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </div>
                </header>
                <main style={{ flex: 1, padding: "22px", overflow: "auto" }}>{children}</main>
            </div>
        </div>
    )
}

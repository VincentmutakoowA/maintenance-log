'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Wrench, Eye, EyeOff, AlertCircle } from "lucide-react"

const GREEN = "#008e00"
const GREEN_DARK = "#006800"
const GREEN_LIGHT = "#d7e6d3"
const YELLOW = "#e6f10f"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError("Invalid email or password. Please try again.")
            setLoading(false)
        } else {
            router.push("/admin/home")
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f7faf6",
            display: "flex",
            fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
            {/* Left panel */}
            <div style={{
                width: "45%",
                background: `linear-gradient(160deg, ${GREEN} 0%, #004d00 100%)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "48px 52px",
                position: "relative",
                overflow: "hidden",
            }} className="hidden lg:flex">

                {/* Background pattern */}
                <svg style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }} width="100%" height="100%">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Yellow accent blob */}
                <div style={{
                    position: "absolute", bottom: -80, right: -60,
                    width: 320, height: 320,
                    background: YELLOW,
                    borderRadius: "50%",
                    opacity: 0.12,
                }} />
                <div style={{
                    position: "absolute", top: 100, right: 40,
                    width: 120, height: 120,
                    background: YELLOW,
                    borderRadius: "50%",
                    opacity: 0.08,
                }} />

                {/* Logo */}
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 44, height: 44,
                            background: YELLOW,
                            borderRadius: 12,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Wrench size={22} color="#0f1a0f" />
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>MaintainLog</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", textTransform: "uppercase" }}>USJM System</div>
                        </div>
                    </div>
                </div>

                {/* Main copy */}
                <div style={{ position: "relative" }}>
                    <div style={{
                        display: "inline-block",
                        background: YELLOW,
                        color: "#0f1a0f",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "5px 12px",
                        borderRadius: 6,
                        marginBottom: 20,
                    }}>
                        Computer Lab Management
                    </div>
                    <h1 style={{
                        fontSize: 38,
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1.15,
                        marginBottom: 18,
                    }}>
                        Centralised<br />maintenance<br />tracking.
                    </h1>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, maxWidth: 320 }}>
                        Log faults, schedule preventive maintenance, and track every repair across all computer laboratories at USJM.
                    </p>

                    {/* Feature pills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32 }}>
                        {[
                            "Fault reporting & tracking",
                            "Maintenance log history",
                            "Role-based access control",
                            "Downloadable reports",
                        ].map(f => (
                            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)" }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ position: "relative", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    University of Saint Joseph Mbarara · Faculty of Education & Sciences
                </div>
            </div>

            {/* Right panel — login form */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
            }}>
                <div style={{ width: "100%", maxWidth: 400 }}>

                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
                        <div style={{ width: 38, height: 38, background: GREEN, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Wrench size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 17, fontWeight: 800, color: "#0f1a0f" }}>MaintainLog</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>USJM</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f1a0f", marginBottom: 6 }}>Sign in</h2>
                        <p style={{ fontSize: 14, color: "#6b7280" }}>Enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@usjm.ac.ug"
                                style={{
                                    width: "100%",
                                    border: `1.5px solid ${error ? "#fca5a5" : GREEN_LIGHT}`,
                                    borderRadius: 10,
                                    padding: "11px 14px",
                                    fontSize: 14,
                                    fontFamily: "inherit",
                                    outline: "none",
                                    background: "#fff",
                                    color: "#0f1a0f",
                                    transition: "border-color 0.15s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={e => e.target.style.borderColor = GREEN}
                                onBlur={e => e.target.style.borderColor = error ? "#fca5a5" : GREEN_LIGHT}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%",
                                        border: `1.5px solid ${error ? "#fca5a5" : GREEN_LIGHT}`,
                                        borderRadius: 10,
                                        padding: "11px 42px 11px 14px",
                                        fontSize: 14,
                                        fontFamily: "inherit",
                                        outline: "none",
                                        background: "#fff",
                                        color: "#0f1a0f",
                                        transition: "border-color 0.15s",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={e => e.target.style.borderColor = GREEN}
                                    onBlur={e => e.target.style.borderColor = error ? "#fca5a5" : GREEN_LIGHT}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, color: "#9ca3af" }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 9, padding: "10px 14px", marginBottom: 18 }}>
                                <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: "#b91c1c" }}>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: loading ? "#6b9e6b" : GREEN,
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                fontSize: 15,
                                fontWeight: 700,
                                fontFamily: "inherit",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "background 0.15s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}>
                            {loading ? (
                                <>
                                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                                    Signing in...
                                </>
                            ) : "Sign in"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                        <div style={{ flex: 1, height: 1, background: GREEN_LIGHT }} />
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>role-based access</span>
                        <div style={{ flex: 1, height: 1, background: GREEN_LIGHT }} />
                    </div>

                    {/* Role legend */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                            { role: "Admin",      desc: "Full access",    color: GREEN,    bg: GREEN_LIGHT },
                            { role: "Technician", desc: "Log & maintain", color: "#b45309", bg: "#fef3c7" },
                            { role: "Staff",      desc: "Report faults",  color: "#2563eb", bg: "#dbeafe" },
                        ].map(r => (
                            <div key={r.role} style={{ background: r.bg, borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.role}</div>
                                <div style={{ fontSize: 11, color: r.color, opacity: 0.8, marginTop: 2 }}>{r.desc}</div>
                            </div>
                        ))}
                    </div>

                    <p style={{ marginTop: 28, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                        University of Saint Joseph Mbarara · Computer Lab System
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
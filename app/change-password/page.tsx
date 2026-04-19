'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Wrench, Eye, EyeOff, CheckCircle2 } from "lucide-react"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"; const YELLOW = "#e6f10f"

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [done, setDone] = useState(false)
    const router = useRouter()

    const requirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
        { label: "At least one number", met: /\d/.test(password) },
        { label: "Passwords match", met: password === confirm && confirm.length > 0 },
    ]
    const allMet = requirements.every(r => r.met)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!allMet) return
        setLoading(true); setError("")
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            setError(error.message); setLoading(false); return
        }
        // Clear must_change_password flag
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from("profiles").update({ must_change_password: false }).eq("id", user.id)
        }
        setDone(true)
        setTimeout(() => router.push("/admin/home"), 1800)
    }

    const inp = (label: string, value: string, onChange: (v: string) => void, isPassword = false) => (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={isPassword && !showPw ? "password" : "text"}
                    value={value} onChange={e => onChange(e.target.value)} required
                    style={{ width: "100%", border: `1.5px solid ${GREEN_LIGHT}`, borderRadius: 10, padding: isPassword ? "11px 42px 11px 14px" : "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = GREEN}
                    onBlur={e => e.target.style.borderColor = GREEN_LIGHT}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShowPw(s => !s)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: "100vh", background: "#f7faf6", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 420 }}>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
                    <div style={{ width: 42, height: 42, background: GREEN, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Wrench size={20} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f1a0f" }}>MaintainLog</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>USJM</div>
                    </div>
                </div>

                <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 16, padding: 30, boxShadow: "0 4px 24px rgba(0,142,0,0.07)" }}>
                    {/* Yellow banner */}
                    <div style={{ background: YELLOW, borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ fontSize: 18, flexShrink: 0 }}>🔐</div>
                        <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f1a0f" }}>Set your new password</div>
                            <div style={{ fontSize: 12.5, color: "#374151", marginTop: 2 }}>You were given a temporary password by your administrator. Create a new one to continue.</div>
                        </div>
                    </div>

                    {done ? (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <CheckCircle2 size={48} color={GREEN} style={{ margin: "0 auto 12px" }} />
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1a0f", marginBottom: 6 }}>Password updated!</div>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>Redirecting to dashboard…</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {inp("New Password", password, setPassword, true)}
                            {inp("Confirm New Password", confirm, setConfirm)}

                            {/* Requirements */}
                            <div style={{ marginBottom: 20, background: "#f7faf6", borderRadius: 9, padding: "12px 14px" }}>
                                {requirements.map(r => (
                                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, fontSize: 12.5 }}>
                                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: r.met ? GREEN : GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            {r.met && (
                                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                    <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <span style={{ color: r.met ? "#374151" : "#9ca3af" }}>{r.label}</span>
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div style={{ background: "#fee2e2", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 14 }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={!allMet || loading}
                                style={{ width: "100%", padding: 12, background: allMet ? GREEN : GREEN_LIGHT, color: allMet ? "#fff" : "#9ca3af", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: allMet ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                                {loading ? "Saving…" : "Set New Password"}
                            </button>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
                    University of Saint Joseph Mbarara
                </p>
            </div>
        </div>
    )
}

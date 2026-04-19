'use client'

import { useEffect, useState, useActionState } from "react"
import {
    getAllUsersAction, createUserAction, deleteUserAction,
    updateUserRoleAction, resetTempPasswordAction,
} from "../user-actions"
import { Plus, X, Trash2, Shield, Wrench, User, Copy, RefreshCw, KeyRound } from "lucide-react"
import { ModalProps, ResetPasswordModalProps, ProfileWithEmail, ActionState } from "@/lib/types"

const GREEN = "#008e00"; const GREEN_LIGHT = "#d7e6d3"; const YELLOW = "#e6f10f"

const ROLES = [
    { value: "admin",       label: "Admin",       Icon: Shield, color: GREEN,    bg: GREEN_LIGHT },
    { value: "technician",  label: "Technician",  Icon: Wrench, color: "#b45309", bg: "#fef3c7" },
    { value: "staff",       label: "Staff",        Icon: User,   color: "#2563eb", bg: "#dbeafe" },
]

function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", maxHeight: "90vh", overflow: "auto" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${GREEN_LIGHT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={17} /></button>
                </div>
                <div style={{ padding: 22 }}>{children}</div>
            </div>
        </div>
    )
}

function generatePassword() {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$"
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function AddUserForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [state, formAction, pending] = useActionState(createUserAction, { success: false })
    const [role, setRole] = useState("staff")
    const [tempPw, setTempPw] = useState(() => generatePassword())
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if ((state as ActionState).success) { onSaved(); onClose() }
    }, [state, onSaved, onClose])

    const copyPw = () => {
        navigator.clipboard.writeText(tempPw)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    const fld = (label: string, name: string, type = "text", placeholder = "") => (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
            <input name={name} type={type} placeholder={placeholder} required={name !== "full_name"}
                style={{ width: "100%", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>
    )

    return (
        <form action={formAction}>
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="temp_password" value={tempPw} />

            {fld("Full Name", "full_name", "text", "e.g. John Mwesigwa")}
            {fld("Email Address *", "email", "email", "e.g. j.mwesigwa@usjm.ac.ug")}

            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Role</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {ROLES.map(r => {
                        const Icon = r.Icon
                        const active = role === r.value
                        return (
                            <button key={r.value} type="button" onClick={() => setRole(r.value)}
                                style={{ padding: "10px 8px", borderRadius: 9, border: `2px solid ${active ? r.color : GREEN_LIGHT}`, background: active ? r.bg : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.12s" }}>
                                <Icon size={16} color={r.color} style={{ margin: "0 auto 4px" }} />
                                <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.label}</div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Temp password */}
            <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                    Temporary Password <span style={{ fontWeight: 400, color: "#9ca3af" }}>(share with user)</span>
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 12px", fontSize: 13.5, fontFamily: "monospace", background: "#f7faf6", color: "#0f1a0f", display: "flex", alignItems: "center", overflow: "hidden" }}>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tempPw}</span>
                    </div>
                    <button type="button" onClick={() => setTempPw(generatePassword())} title="Regenerate"
                        style={{ padding: "8px 10px", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, background: "#fff", cursor: "pointer" }}>
                        <RefreshCw size={14} color="#6b7280" />
                    </button>
                    <button type="button" onClick={copyPw} title="Copy"
                        style={{ padding: "8px 12px", border: "none", borderRadius: 8, background: copied ? GREEN : YELLOW, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: copied ? "#fff" : "#0f1a0f", display: "flex", alignItems: "center", gap: 5 }}>
                        <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
                <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 6 }}>
                    The user must change this password after their first login.
                </p>
            </div>

            {(state as ActionState).error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#b91c1c" }}>
                    {(state as ActionState).error}
                </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5 }}>Cancel</button>
                <button type="submit" disabled={pending}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: pending ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13.5, fontFamily: "inherit", opacity: pending ? 0.7 : 1 }}>
                    {pending ? "Creating..." : "Create User"}
                </button>
            </div>
        </form>
    )
}

function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
    const [tempPw, setTempPw] = useState(() => generatePassword())
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState("")

    const handleReset = async () => {
        setLoading(true); setError("")
        try {
            await resetTempPasswordAction(user.id, tempPw)
            setDone(true)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "An unexpected error occurred")
        }
        setLoading(false)
    }

    const copyPw = () => { navigator.clipboard.writeText(tempPw); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    return (
        <div>
            <p style={{ fontSize: 13.5, color: "#374151", marginBottom: 16 }}>
                Reset temporary password for <strong>{user.full_name ?? user.email}</strong>. The user will be required to set a new password on their next login.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, padding: "8px 12px", fontFamily: "monospace", fontSize: 13.5, background: "#f7faf6" }}>
                    {tempPw}
                </div>
                <button type="button" onClick={() => setTempPw(generatePassword())}
                    style={{ padding: "8px 10px", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 8, background: "#fff", cursor: "pointer" }}>
                    <RefreshCw size={14} color="#6b7280" />
                </button>
                <button type="button" onClick={copyPw}
                    style={{ padding: "8px 12px", border: "none", borderRadius: 8, background: copied ? GREEN : YELLOW, color: copied ? "#fff" : "#0f1a0f", cursor: "pointer", fontWeight: 600, fontSize: 12.5, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
                    <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            {error && <div style={{ background: "#fee2e2", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
            {done ? (
                <div style={{ background: "#dcfce7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    ✓ Password reset. Share the new temporary password with the user.
                </div>
            ) : (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={handleReset} disabled={loading}
                        style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default function UsersPage() {
    const [users, setUsers] = useState<ProfileWithEmail[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [resetUser, setResetUser] = useState<ProfileWithEmail | null>(null)
    const [updatingRole, setUpdatingRole] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        const u = await getAllUsersAction()
        setUsers(u); setLoading(false)
    }
    useEffect(() => {
        getAllUsersAction().then(u => { setUsers(u); setLoading(false) })
    }, [])

    const handleRoleChange = async (userId: string, role: string) => {
        setUpdatingRole(userId)
        await updateUserRoleAction(userId, role)
        setUsers(us => us.map(u => u.id === userId ? { ...u, role: role as ProfileWithEmail["role"] } : u))
        setUpdatingRole(null)
    }

    const handleDelete = async (user: ProfileWithEmail) => {
        if (!confirm(`Delete ${user.full_name ?? user.email}? This permanently removes their account and cannot be undone.`)) return
        await deleteUserAction(user.id)
        setUsers(us => us.filter(u => u.id !== user.id))
    }

    const counts = {
        admin: users.filter(u => u.role === "admin").length,
        technician: users.filter(u => u.role === "technician").length,
        staff: users.filter(u => u.role === "staff").length,
    }

    return (
        <div style={{ maxWidth: 960 }}>
            <div className="page-hdr" style={{ marginBottom: 22 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>User Management</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{users.length} registered user{users.length !== 1 ? "s" : ""}</div>
                </div>
                <button onClick={() => setShowAdd(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13.5, fontFamily: "inherit" }}>
                    <Plus size={15} /> Add User
                </button>
            </div>

            {/* Role counts */}
            <div className="stat-grid-3" style={{ marginBottom: 22 }}>
                {ROLES.map(r => {
                    const Icon = r.Icon; const count = counts[r.value as keyof typeof counts]
                    return (
                        <div key={r.value} style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={20} color={r.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f1a0f" }}>{count}</div>
                                <div style={{ fontSize: 12, color: "#6b7280" }}>{r.label}{count !== 1 ? "s" : ""}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Users table */}
            <div style={{ background: "#fff", border: `1px solid ${GREEN_LIGHT}`, borderRadius: 12, overflowX: "auto" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>Loading users...</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 720 }}>
                        <thead>
                            <tr style={{ background: GREEN_LIGHT }}>
                                {["User", "Email", "Role", "Last Sign In", "Status", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, fontSize: 11.5, color: "#2d4a2d" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No users found.</td></tr>
                            ) : users.map(u => {
                                const initials = u.full_name
                                    ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                                    : (u.email?.[0] ?? "?").toUpperCase()
                                return (
                                    <tr key={u.id} style={{ borderBottom: "1px solid #f0f7ee" }}>
                                        <td style={{ padding: "10px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                                    {initials}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{u.full_name ?? "—"}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "10px 16px", color: "#6b7280", fontSize: 12.5 }}>{u.email ?? "—"}</td>
                                        <td style={{ padding: "10px 16px" }}>
                                            <select value={u.role} disabled={updatingRole === u.id}
                                                onChange={e => handleRoleChange(u.id, e.target.value)}
                                                style={{ border: `1px solid ${GREEN_LIGHT}`, borderRadius: 7, padding: "5px 8px", fontSize: 12.5, fontFamily: "inherit", background: "#fff", cursor: "pointer", opacity: updatingRole === u.id ? 0.5 : 1 }}>
                                                <option value="admin">Admin</option>
                                                <option value="technician">Technician</option>
                                                <option value="staff">Staff</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: "10px 16px", color: "#9ca3af", fontSize: 12 }}>
                                            {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" }) : "Never"}
                                        </td>
                                        <td style={{ padding: "10px 16px" }}>
                                            {u.must_change_password ? (
                                                <span style={{ fontSize: 11, fontWeight: 600, background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: 999 }}>Temp password</span>
                                            ) : (
                                                <span style={{ fontSize: 11, fontWeight: 600, background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 999 }}>Active</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "10px 16px" }}>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => setResetUser(u)} title="Reset password"
                                                    style={{ padding: "5px 9px", borderRadius: 6, border: `1px solid ${GREEN_LIGHT}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151", fontFamily: "inherit" }}>
                                                    <KeyRound size={12} color={GREEN} /> Reset PW
                                                </button>
                                                <button onClick={() => handleDelete(u)} title="Delete user"
                                                    style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer" }}>
                                                    <Trash2 size={13} color="#dc2626" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {showAdd && (
                <Modal title="Add New User" onClose={() => setShowAdd(false)}>
                    <AddUserForm onClose={() => setShowAdd(false)} onSaved={load} />
                </Modal>
            )}
            {resetUser && (
                <Modal title="Reset Temporary Password" onClose={() => setResetUser(null)}>
                    <ResetPasswordModal user={resetUser} onClose={() => { setResetUser(null); load() }} />
                </Modal>
            )}
        </div>
    )
}

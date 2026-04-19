"use server"

import { createClient } from "@/lib/supabase/server"
import {
    ProfileWithEmail, Laboratory, ProcessorType, RamSize,
    ComputerWithLab, FaultReportWithRelations, MaintenanceLogWithRelations,
    PreventiveScheduleWithRelations, ActionState, DashboardStats, ReportFilteredData,
    LaboratoryInsert, ProcessorTypeInsert, ComputerInsert, FaultReportInsert,
    MaintenanceLogInsert,
} from "@/lib/types"

//------------------------------------------------------------------------------
// LABORATORIES
//------------------------------------------------------------------------------

export async function getAllLaboratoriesAction(): Promise<Laboratory[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("laboratories")
        .select("*")
        .order("lab_name", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

export async function addLaboratoryAction(prevState: ActionState, formData: FormData) {
    const id = formData.get("id") as string | null
    const labName = formData.get("name") as string
    const location = formData.get("location") as string | null
    const supabase = await createClient()
    const payload: LaboratoryInsert = { lab_name: labName }
    if (location) payload.location = location
    if (id) payload.id = id
    const { error } = await supabase.from("laboratories").upsert(payload, { onConflict: "id" }).select().single()
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteLaboratoryAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("laboratories").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// PROCESSOR TYPES
//------------------------------------------------------------------------------

export async function getAllProcessorTypesAction(): Promise<ProcessorType[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("processor_types").select("*").order("name", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

export async function addProcessorTypeAction(prevState: ActionState, formData: FormData) {
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const supabase = await createClient()
    const payload: ProcessorTypeInsert = { name }
    if (id) payload.id = id
    const { error } = await supabase.from("processor_types").upsert(payload, { onConflict: "id" }).select().single()
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteProcessorTypeAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("processor_types").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// RAM SIZES
//------------------------------------------------------------------------------

export async function getAllRamSizesAction(): Promise<RamSize[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("ram_sizes").select("*").order("sort_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

//------------------------------------------------------------------------------
// COMPUTERS
//------------------------------------------------------------------------------

export async function getAllComputersAction(): Promise<ComputerWithLab[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("computers").select(`*, laboratories(lab_name)`).order("asset_tag", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

export async function addComputerAction(prevState: ActionState, formData: FormData) {
    const id = formData.get("id") as string | null
    const supabase = await createClient()
    const payload: ComputerInsert = {
        asset_tag: formData.get("asset_tag") as string,
        serial_number: (formData.get("serial_number") as string) || null,
        lab_id: (formData.get("lab_id") as string) || null,
        processor: (formData.get("processor") as string) || null,
        ram: (formData.get("ram") as string) || null,
        storage: (formData.get("storage") as string) || null,
        operating_system: (formData.get("operating_system") as string) || null,
        purchase_date: (formData.get("purchase_date") as string) || null,
        status: (formData.get("status") as string) || "working",
    }
    if (id) payload.id = id
    const { error } = await supabase.from("computers").upsert(payload, { onConflict: "id" }).select().single()
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteComputerAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("computers").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

export async function updateComputerStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("computers").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// FAULT REPORTS
//------------------------------------------------------------------------------

export async function getAllFaultReportsAction(): Promise<FaultReportWithRelations[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("fault_reports")
        .select(`*, computers(asset_tag, laboratories(lab_name)), profiles(full_name)`)
        .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data
}

export async function addFaultReportAction(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const payload: FaultReportInsert = {
        computer_id: formData.get("computer_id") as string,
        description: formData.get("description") as string,
        priority: (formData.get("priority") as string) || "medium",
        status: "pending",
    }
    if (user?.id) payload.reported_by = user.id
    const { error } = await supabase.from("fault_reports").insert(payload).select().single()
    if (error) throw new Error(error.message)
    await supabase.from("computers").update({ status: "faulty" }).eq("id", payload.computer_id)
    return { success: true }
}

export async function updateFaultReportStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("fault_reports").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
}

export async function deleteFaultReportAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("fault_reports").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// MAINTENANCE LOGS
//------------------------------------------------------------------------------

export async function getAllMaintenanceLogsAction(): Promise<MaintenanceLogWithRelations[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("maintenance_logs")
        .select(`*, computers(asset_tag, laboratories(lab_name)), profiles(full_name), fault_reports(description, priority)`)
        .order("resolved_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data
}

export async function addMaintenanceLogAction(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const payload: MaintenanceLogInsert = {
        computer_id: formData.get("computer_id") as string,
        action_taken: formData.get("action_taken") as string,
        maintenance_type: (formData.get("maintenance_type") as string) || "corrective",
        problem_identified: (formData.get("problem_identified") as string) || null,
        parts_replaced: (formData.get("parts_replaced") as string) || null,
        next_maintenance_date: (formData.get("next_maintenance_date") as string) || null,
        cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
    }
    if (user?.id) payload.technician_id = user.id
    const faultReportId = formData.get("fault_report_id") as string | null
    if (faultReportId) payload.fault_report_id = faultReportId
    const { error } = await supabase.from("maintenance_logs").insert(payload).select().single()
    if (error) throw new Error(error.message)
    if (faultReportId) {
        await supabase.from("fault_reports").update({ status: "resolved" }).eq("id", faultReportId)
    }
    await supabase.from("computers").update({ status: "working" }).eq("id", payload.computer_id)
    return { success: true }
}

export async function deleteMaintenanceLogAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("maintenance_logs").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// PREVENTIVE SCHEDULE
//------------------------------------------------------------------------------

export async function getAllPreventiveScheduleAction(): Promise<PreventiveScheduleWithRelations[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("preventive_schedule")
        .select(`*, computers(asset_tag, laboratories(lab_name))`)
        .order("scheduled_date", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

export async function addPreventiveScheduleAction(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const payload = {
        computer_id: formData.get("computer_id") as string,
        scheduled_date: formData.get("scheduled_date") as string,
        task_description: formData.get("task_description") as string,
        status: "pending",
    }
    const { error } = await supabase.from("preventive_schedule").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function updatePreventiveScheduleStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("preventive_schedule").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
}

export async function deletePreventiveScheduleAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("preventive_schedule").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// PROFILES / USERS
//------------------------------------------------------------------------------

export async function getAllProfilesAction(): Promise<ProfileWithEmail[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").select("*").order("full_name", { ascending: true })
    if (error) throw new Error(error.message)
    return data
}

export async function getCurrentUserProfileAction(): Promise<ProfileWithEmail | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (error) return null
    return { ...data, email: user.email ?? null, last_sign_in: null }
}

export async function updateProfileRoleAction(userId: string, role: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)
    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// DASHBOARD STATS
//------------------------------------------------------------------------------

export async function getDashboardStatsAction(): Promise<DashboardStats> {
    const supabase = await createClient()
    const [computers, faultReports, maintenanceLogs, labs, schedules] = await Promise.all([
        supabase.from("computers").select("id, status"),
        supabase.from("fault_reports").select("id, status, priority"),
        supabase.from("maintenance_logs").select("id, maintenance_type, cost, resolved_at"),
        supabase.from("laboratories").select("id"),
        supabase.from("preventive_schedule").select("id, status, scheduled_date"),
    ])
    const totalComputers = computers.data?.length ?? 0
    const workingComputers = computers.data?.filter(c => c.status === "working").length ?? 0
    const faultyComputers = computers.data?.filter(c => c.status === "faulty").length ?? 0
    const underRepair = computers.data?.filter(c => c.status === "under_repair").length ?? 0
    const retiredComputers = computers.data?.filter(c => c.status === "retired").length ?? 0
    const pendingFaults = faultReports.data?.filter(r => r.status === "pending").length ?? 0
    const inProgressFaults = faultReports.data?.filter(r => r.status === "in_progress").length ?? 0
    const resolvedFaults = faultReports.data?.filter(r => r.status === "resolved").length ?? 0
    const highPriorityFaults = faultReports.data?.filter(r => r.priority === "high" && r.status !== "resolved").length ?? 0
    const totalCost = maintenanceLogs.data?.reduce((sum, l) => sum + (l.cost ?? 0), 0) ?? 0
    const now = new Date()
    const upcomingSchedules = schedules.data?.filter(s =>
        s.status === "pending" && new Date(s.scheduled_date) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length ?? 0
    return {
        totalComputers, workingComputers, faultyComputers, underRepair, retiredComputers,
        pendingFaults, inProgressFaults, resolvedFaults, highPriorityFaults,
        totalMaintenanceLogs: maintenanceLogs.data?.length ?? 0,
        totalLabs: labs.data?.length ?? 0,
        totalCost, upcomingSchedules,
    }
}

//------------------------------------------------------------------------------
// REPORT DATA
//------------------------------------------------------------------------------

export async function getReportDataAction(from?: string, to?: string, labId?: string): Promise<ReportFilteredData> {
    const supabase = await createClient()
    let logsQuery = supabase
        .from("maintenance_logs")
        .select(`*, computers(asset_tag, lab_id, laboratories(lab_name, id)), profiles(full_name), fault_reports(description, priority)`)
        .order("resolved_at", { ascending: false })
    if (from) logsQuery = logsQuery.gte("resolved_at", from)
    if (to)   logsQuery = logsQuery.lte("resolved_at", to + "T23:59:59")

    let faultsQuery = supabase
        .from("fault_reports")
        .select(`*, computers(asset_tag, lab_id, laboratories(lab_name, id)), profiles(full_name)`)
        .order("created_at", { ascending: false })
    if (from) faultsQuery = faultsQuery.gte("created_at", from)
    if (to)   faultsQuery = faultsQuery.lte("created_at", to + "T23:59:59")

    const [logs, faults, computers, labs] = await Promise.all([
        logsQuery,
        faultsQuery,
        supabase.from("computers").select(`*, laboratories(lab_name, id)`).order("asset_tag"),
        supabase.from("laboratories").select("*").order("lab_name"),
    ])

    let filteredLogs = logs.data ?? []
    let filteredFaults = faults.data ?? []
    let filteredComputers = computers.data ?? []

    if (labId) {
        filteredLogs = filteredLogs.filter((l) => (l.computers as { lab_id?: string } | null)?.lab_id === labId)
        filteredFaults = filteredFaults.filter((f) => (f.computers as { lab_id?: string } | null)?.lab_id === labId)
        filteredComputers = filteredComputers.filter((c) => (c as { lab_id?: string }).lab_id === labId)
    }

    return {
        maintenanceLogs: filteredLogs,
        faultReports: filteredFaults,
        computers: filteredComputers,
        laboratories: labs.data ?? [],
    }
}

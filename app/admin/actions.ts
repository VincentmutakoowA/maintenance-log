"use server"

import { createClient } from "@/lib/supabase/server"

//------------------------------------------------------------------------------
// LABORATORIES
//------------------------------------------------------------------------------

export async function getAllLaboratoriesAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("laboratories")
        .select("*")
        .order("lab_name", { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

export async function getLaboratoryByIdAction(labId: string): Promise<any | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("laboratories")
        .select("*")
        .eq("id", labId)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function addLaboratoryAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string | null
    const labName = formData.get("name") as string
    const location = formData.get("location") as string | null

    const supabase = await createClient()

    const payload: any = { lab_name: labName }
    if (location) payload.location = location
    if (id) payload.id = id

    const { error } = await supabase
        .from("laboratories")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteLaboratoryAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("laboratories")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// COMPUTERS
//------------------------------------------------------------------------------

export async function getAllComputersAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("computers")
        .select(`*, laboratories(lab_name)`)
        .order("asset_tag", { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

export async function getComputersByLabAction(labId: string): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("computers")
        .select(`*, laboratories(lab_name)`)
        .eq("lab_id", labId)
        .order("asset_tag", { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

export async function addComputerAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string | null
    const supabase = await createClient()

    const payload: any = {
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

    const { error } = await supabase
        .from("computers")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteComputerAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("computers")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function updateComputerStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("computers")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// FAULT REPORTS
//------------------------------------------------------------------------------

export async function getAllFaultReportsAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("fault_reports")
        .select(`
            *,
            computers(asset_tag, laboratories(lab_name)),
            profiles(full_name)
        `)
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function addFaultReportAction(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const payload: any = {
        computer_id: formData.get("computer_id") as string,
        description: formData.get("description") as string,
        priority: (formData.get("priority") as string) || "medium",
        status: "pending",
    }

    const reportedBy = formData.get("reported_by") as string | null
    if (reportedBy) payload.reported_by = reportedBy

    const { error } = await supabase
        .from("fault_reports")
        .insert(payload)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return { success: true }
}

export async function updateFaultReportStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("fault_reports")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function deleteFaultReportAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("fault_reports")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// MAINTENANCE LOGS
//------------------------------------------------------------------------------

export async function getAllMaintenanceLogsAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("maintenance_logs")
        .select(`
            *,
            computers(asset_tag, laboratories(lab_name)),
            profiles(full_name),
            fault_reports(description, priority)
        `)
        .order("resolved_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function addMaintenanceLogAction(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const payload: any = {
        computer_id: formData.get("computer_id") as string,
        action_taken: formData.get("action_taken") as string,
        maintenance_type: (formData.get("maintenance_type") as string) || "corrective",
        problem_identified: (formData.get("problem_identified") as string) || null,
        parts_replaced: (formData.get("parts_replaced") as string) || null,
        next_maintenance_date: (formData.get("next_maintenance_date") as string) || null,
        cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
    }

    const technicianId = formData.get("technician_id") as string | null
    if (technicianId) payload.technician_id = technicianId

    const faultReportId = formData.get("fault_report_id") as string | null
    if (faultReportId) payload.fault_report_id = faultReportId

    const { error } = await supabase
        .from("maintenance_logs")
        .insert(payload)
        .select()
        .single()

    if (error) throw new Error(error.message)

    // If linked to fault report, mark it as resolved
    if (faultReportId) {
        await supabase
            .from("fault_reports")
            .update({ status: "resolved" })
            .eq("id", faultReportId)
    }

    // Update computer status based on maintenance type
    const computerStatus = payload.maintenance_type === "corrective" ? "working" : "working"
    await supabase
        .from("computers")
        .update({ status: computerStatus })
        .eq("id", payload.computer_id)

    return { success: true }
}

export async function deleteMaintenanceLogAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("maintenance_logs")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// PREVENTIVE SCHEDULE
//------------------------------------------------------------------------------

export async function getAllPreventiveScheduleAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("preventive_schedule")
        .select(`*, computers(asset_tag, laboratories(lab_name))`)
        .order("scheduled_date", { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

export async function addPreventiveScheduleAction(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const payload = {
        computer_id: formData.get("computer_id") as string,
        scheduled_date: formData.get("scheduled_date") as string,
        task_description: formData.get("task_description") as string,
        status: "pending",
    }

    const { error } = await supabase
        .from("preventive_schedule")
        .insert(payload)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return { success: true }
}

export async function updatePreventiveScheduleStatusAction(id: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("preventive_schedule")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function deletePreventiveScheduleAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("preventive_schedule")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}

//------------------------------------------------------------------------------
// PROFILES
//------------------------------------------------------------------------------

export async function getAllProfilesAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

//------------------------------------------------------------------------------
// DASHBOARD STATS
//------------------------------------------------------------------------------

export async function getDashboardStatsAction() {
    const supabase = await createClient()

    const [computers, faultReports, maintenanceLogs, labs] = await Promise.all([
        supabase.from("computers").select("id, status"),
        supabase.from("fault_reports").select("id, status, priority"),
        supabase.from("maintenance_logs").select("id, maintenance_type"),
        supabase.from("laboratories").select("id"),
    ])

    const totalComputers = computers.data?.length ?? 0
    const workingComputers = computers.data?.filter(c => c.status === "working").length ?? 0
    const faultyComputers = computers.data?.filter(c => c.status === "faulty").length ?? 0
    const underRepair = computers.data?.filter(c => c.status === "under_repair").length ?? 0

    const pendingFaults = faultReports.data?.filter(r => r.status === "pending").length ?? 0
    const highPriorityFaults = faultReports.data?.filter(r => r.priority === "high" && r.status !== "resolved").length ?? 0

    return {
        totalComputers,
        workingComputers,
        faultyComputers,
        underRepair,
        pendingFaults,
        highPriorityFaults,
        totalMaintenanceLogs: maintenanceLogs.data?.length ?? 0,
        totalLabs: labs.data?.length ?? 0,
    }
}
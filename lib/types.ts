// ============================================================
// USJM Maintenance Log System — Types
// ============================================================

// ---- Enums ----

export type UserRole = "admin" | "technician" | "staff"

export type ComputerStatus = "working" | "faulty" | "under_repair" | "retired"

export type FaultPriority = "low" | "medium" | "high"

export type FaultStatus = "pending" | "in_progress" | "resolved"

export type MaintenanceType = "corrective" | "preventive"

export type ScheduleStatus = "pending" | "completed"

// ---- Database row types ----

export type Profile = {
    id: string
    full_name: string | null
    role: UserRole
    must_change_password: boolean
    created_at: string
}

export type ProfileWithEmail = Profile & {
    email: string | null
    last_sign_in: string | null
}

export type Laboratory = {
    id: string
    lab_name: string
    location: string | null
    created_at: string
}

export type Computer = {
    id: string
    lab_id: string | null
    asset_tag: string
    serial_number: string | null
    processor: string | null
    ram: string | null
    storage: string | null
    operating_system: string | null
    purchase_date: string | null
    status: ComputerStatus
    created_at: string
}

export type ComputerWithLab = Computer & {
    laboratories: Pick<Laboratory, "lab_name"> | null
}

export type FaultReport = {
    id: string
    computer_id: string | null
    reported_by: string | null
    description: string
    priority: FaultPriority
    status: FaultStatus
    created_at: string
}

export type FaultReportWithRelations = FaultReport & {
    computers: (Pick<Computer, "asset_tag"> & {
        laboratories: Pick<Laboratory, "lab_name"> | null
    }) | null
    profiles: Pick<Profile, "full_name"> | null
}

export type MaintenanceLog = {
    id: string
    computer_id: string | null
    technician_id: string | null
    fault_report_id: string | null
    problem_identified: string | null
    action_taken: string
    parts_replaced: string | null
    maintenance_type: MaintenanceType | null
    next_maintenance_date: string | null
    cost: number | null
    resolved_at: string
}

export type MaintenanceLogWithRelations = MaintenanceLog & {
    computers: (Pick<Computer, "asset_tag"> & {
        laboratories: Pick<Laboratory, "lab_name"> | null
    }) | null
    profiles: Pick<Profile, "full_name"> | null
    fault_reports: Pick<FaultReport, "description" | "priority"> | null
}

export type PreventiveSchedule = {
    id: string
    computer_id: string | null
    scheduled_date: string
    task_description: string
    status: ScheduleStatus
    created_at: string
}

export type PreventiveScheduleWithRelations = PreventiveSchedule & {
    computers: (Pick<Computer, "asset_tag"> & {
        laboratories: Pick<Laboratory, "lab_name"> | null
    }) | null
}

export type ProcessorType = {
    id: string
    name: string
    created_at: string
}

export type RamSize = {
    id: string
    size: string
    sort_order: number
}

// ---- Dashboard stats ----

export type DashboardStats = {
    totalComputers: number
    workingComputers: number
    faultyComputers: number
    underRepair: number
    retiredComputers: number
    pendingFaults: number
    inProgressFaults: number
    resolvedFaults: number
    highPriorityFaults: number
    totalMaintenanceLogs: number
    totalLabs: number
    totalCost: number
    upcomingSchedules: number
}

// ---- Report data ----

export type ReportData = {
    maintenanceLogs: MaintenanceLogWithRelations[]
    faultReports: FaultReportWithRelations[]
    computers: ComputerWithLab[]
    laboratories: Laboratory[]
}

// ---- Form action states ----

export type ActionState = {
    success?: boolean
    error?: string
}

// ---- UI helper types ----

export type SelectOption = {
    value: string
    label: string
}

export type ModalProps = {
    title: string
    onClose: () => void
    children: React.ReactNode
}

export type SummaryCardProps = {
    title: string
    value: string | number
    sub?: string
    color?: string
}

export type SectionCardProps = {
    title: string
    icon: React.ComponentType<{ size?: number; color?: string }>
    children: React.ReactNode
}

// ---- Component prop types ----

export type LogFormProps = {
    computers: ComputerWithLab[]
    faultReports: FaultReportWithRelations[]
    onClose: () => void
    onSaved: () => void
}

export type ScheduleFormProps = {
    computers: ComputerWithLab[]
    onClose: () => void
    onSaved: () => void
}

export type FaultFormProps = {
    computers: ComputerWithLab[]
    onClose: () => void
    onSaved: () => void
}

export type ComputerFormProps = {
    computer: ComputerWithLab | null
    labs: Laboratory[]
    processors: ProcessorType[]
    ramSizes: RamSize[]
    onClose: () => void
    onSaved: () => void
}

export type SelectFieldProps = {
    name?: string
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder: string
    required?: boolean
}

export type InputFieldProps = {
    name: string
    defaultValue?: string | null
    placeholder?: string
    type?: string
    required?: boolean
}

export type ChildrenProps = {
    children: React.ReactNode
}

export type ResetPasswordModalProps = {
    user: ProfileWithEmail
    onClose: () => void
}

// ---- Insert payload types ----

export type LaboratoryInsert = {
    id?: string
    lab_name: string
    location?: string | null
}

export type ProcessorTypeInsert = {
    id?: string
    name: string
}

export type ComputerInsert = {
    id?: string
    asset_tag: string
    serial_number: string | null
    lab_id: string | null
    processor: string | null
    ram: string | null
    storage: string | null
    operating_system: string | null
    purchase_date: string | null
    status: string
}

export type FaultReportInsert = {
    computer_id: string
    description: string
    priority: string
    status: string
    reported_by?: string
}

export type MaintenanceLogInsert = {
    computer_id: string
    action_taken: string
    maintenance_type: string
    problem_identified: string | null
    parts_replaced: string | null
    next_maintenance_date: string | null
    cost: number | null
    technician_id?: string
    fault_report_id?: string
}

export type PreventiveScheduleInsert = {
    computer_id: string
    scheduled_date: string
    task_description: string
    status: string
}

// ---- Badge map types ----

export type BadgeMapEntry = {
    bg: string
    text: string
    label: string
}

export type StatusBadgeMapEntry = BadgeMapEntry & {
    Icon?: React.ComponentType<{ size?: number; color?: string }>
}

// ---- Report filter types ----

export type ReportFilteredData = {
    maintenanceLogs: MaintenanceLogWithRelations[]
    faultReports: FaultReportWithRelations[]
    computers: ComputerWithLab[]
    laboratories: Laboratory[]
}
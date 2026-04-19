# USJM Maintenance Log System — Redesign v2

## What changed

### New Design
- **Brand colors**: #008e00 (green), #e6f10f (yellow), #d7e6d3 (light green), white
- **Font**: DM Sans (headings) + DM Mono (asset tags) — import via globals.css
- **Layout**: Persistent sidebar navigation with role-aware menu items
- **Role badge**: Shown in sidebar (Admin / Technician / Staff)

### New Features
1. **Role-based navigation** — sidebar only shows items the user's role can access
2. **Processor types** — Admins manage a list (Settings page); used as dropdown when adding computers
3. **RAM sizes** — Pre-seeded dropdown (2 GB → 128 GB) when registering computers
4. **Reports page** — Filter by date range + lab, view Maintenance / Faults / Inventory tabs, **Download CSV** button per tab, **Print** button
5. **Users page** — See all registered users, change their role (admin only)
6. **Settings page** — Manage processor types (add / delete), view RAM sizes

### Files changed / added
```
app/globals.css              ← New USJM design tokens
app/admin/layout.tsx         ← Replaced: sidebar layout, role-aware nav
app/admin/actions.ts         ← Extended: processor types, RAM, user mgmt, reports
app/admin/home/page.tsx      ← Redesigned dashboard
app/admin/computers/page.tsx ← Processor + RAM dropdowns, filter bar
app/admin/faults/page.tsx    ← Redesigned card-based layout
app/admin/maintenance/page.tsx ← Tabbed: Logs + Schedule
app/admin/laboratories/page.tsx ← Expandable computer lists per lab
app/admin/reports/page.tsx   ← NEW: filterable reports + CSV download
app/admin/settings/page.tsx  ← NEW: processor type management
app/admin/users/page.tsx     ← NEW: user role management
schema_additions.sql         ← NEW: processor_types + ram_sizes tables + RLS
```

## Database setup

Run `schema_additions.sql` against your Supabase project **after** your existing schema is applied.

It creates:
- `public.processor_types` — admin-managed processor list
- `public.ram_sizes` — pre-seeded RAM size options
- RLS policies for both tables
- Ensures `get_my_role()` SECURITY DEFINER function exists

## Continuing development

The system picks up the user's role from `profiles.role` on every page load via
`getCurrentUserProfileAction()`. To test different roles, change a user's role
on the Users page (admin only) or directly in Supabase.

## Technician vs Admin experience

| Feature           | Admin | Technician | Staff |
|-------------------|-------|-----------|-------|
| Dashboard         | ✓     | ✓         | ✓     |
| Fault Reports     | ✓     | ✓         | ✓     |
| Maintenance       | ✓     | ✓         | ✗     |
| Computers         | ✓     | ✗         | ✗     |
| Laboratories      | ✓     | ✗         | ✗     |
| Reports           | ✓     | ✓         | ✗     |
| Users             | ✓     | ✗         | ✗     |
| Settings          | ✓     | ✗         | ✗     |

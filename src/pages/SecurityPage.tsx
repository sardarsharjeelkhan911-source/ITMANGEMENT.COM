import { useState } from 'react'
import { Badge, Button, Card, FormGroup, Input, Label, Select, Table, type TableRow } from '../components/ui'
import type { AuditLog, Role, User } from '../types/bank'
import { formatDateTime } from '../utils/format'

const roleTone: Record<Role, 'blue' | 'green' | 'amber' | 'red'> = { admin: 'blue', manager: 'green', cashier: 'amber', csr: 'red' }

export const SecurityPage = ({ auditLogs, canCreateUser, onCreateUser, users }: { users: User[]; auditLogs: AuditLog[]; canCreateUser: boolean; onCreateUser: (payload: Pick<User, 'username' | 'password' | 'name' | 'role'>) => void }) => {
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'cashier' as Role })
  const [error, setError] = useState('')
  const userRows: TableRow[] = users.map((user) => ({ id: user.id, raw: { createdAt: user.createdAt }, cells: { username: user.username, name: user.name, role: <Badge tone={roleTone[user.role]}>{user.role}</Badge>, createdAt: formatDateTime(user.createdAt) } }))
  const auditRows: TableRow[] = auditLogs.map((log) => ({ id: log.id, raw: { createdAt: log.createdAt }, cells: { createdAt: formatDateTime(log.createdAt), username: log.username, role: log.role, action: log.action } }))
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card><h3 className="text-lg font-semibold text-slate-900">System Users</h3><Table columns={[{ key: 'username', label: 'Username', sortable: true }, { key: 'name', label: 'Full Name', sortable: true }, { key: 'role', label: 'Role' }, { key: 'createdAt', label: 'Created', sortable: true }]} emptyMessage="User records will appear here." rows={userRows} /></Card>
        <div className="space-y-6">
          {canCreateUser ? <Card><h3 className="text-lg font-semibold text-slate-900">Create User</h3><form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); try { onCreateUser(form); setForm({ username: '', password: '', name: '', role: 'cashier' }); setError('') } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : 'Unable to create user.') } }}><FormGroup><Label>Full Name</Label><Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></FormGroup><div className="grid gap-4 sm:grid-cols-2"><FormGroup><Label>Username</Label><Input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} /></FormGroup><FormGroup><Label>Password</Label><Input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></FormGroup></div><FormGroup><Label>Role</Label><Select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}><option value="admin">Admin</option><option value="manager">Manager</option><option value="cashier">Cashier</option><option value="csr">CSR</option></Select></FormGroup>{error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}<Button type="submit">Create User</Button></form></Card> : null}
          <Card><h3 className="mb-4 text-lg font-semibold text-slate-900">Activity / Audit Log</h3><Table columns={[{ key: 'createdAt', label: 'Timestamp', sortable: true }, { key: 'username', label: 'User', sortable: true }, { key: 'role', label: 'Role' }, { key: 'action', label: 'Action' }]} emptyMessage="Audit entries will appear here after user activity." rows={auditRows} /></Card>
        </div>
      </div>
    </div>
  )
}

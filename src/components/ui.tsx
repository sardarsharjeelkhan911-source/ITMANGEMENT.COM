import { LoaderCircle, X } from 'lucide-react'
import { useMemo, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
} as const

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
} as const

export const Button = ({ children, className = '', disabled, loading, variant = 'primary', size = 'md', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants; size?: keyof typeof buttonSizes; loading?: boolean }) => (
  <button className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`} disabled={disabled || loading} {...props}>
    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
    {children}
  </button>
)

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
export const Label = ({ children, className = '' }: { children: ReactNode; className?: string }) => <label className={`mb-1.5 block text-sm font-medium text-slate-700 ${className}`}>{children}</label>
const fieldClassName = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => <input className={`${fieldClassName} ${className}`} {...props} />
export const Select = ({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) => <select className={`${fieldClassName} ${className}`} {...props} />
export const Textarea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={`${fieldClassName} min-h-28 ${className}`} {...props} />
export const FormGroup = ({ children }: { children: ReactNode }) => <div>{children}</div>

export const Badge = ({ children, tone = 'slate' }: { children: ReactNode; tone?: 'blue' | 'green' | 'red' | 'amber' | 'slate' }) => {
  const toneClassName = { blue: 'bg-blue-50 text-blue-700 ring-blue-200', green: 'bg-emerald-50 text-emerald-700 ring-emerald-200', red: 'bg-red-50 text-red-700 ring-red-200', amber: 'bg-amber-50 text-amber-700 ring-amber-200', slate: 'bg-slate-100 text-slate-700 ring-slate-200' }[tone]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClassName}`}>{children}</span>
}

export const StatCard = ({ icon, title, value, badge }: { icon: ReactNode; title: string; value: string; badge?: string }) => (
  <Card className="flex items-start justify-between gap-4">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {badge ? <p className="mt-2 text-xs font-medium text-blue-700">{badge}</p> : null}
    </div>
    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">{icon}</div>
  </Card>
)

export const Modal = ({ children, isOpen, onClose, title }: { children: ReactNode; isOpen: boolean; onClose: () => void; title: string }) => {
  if (!isOpen) return null
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dialog-title`
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div aria-labelledby={headingId} aria-modal="true" className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl" role="dialog">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900" id={headingId}>{title}</h3>
          <button aria-label="Close dialog" className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export const ConfirmDialog = ({ confirmLabel = 'Confirm', description, isOpen, onClose, onConfirm, title }: { title: string; description: string; isOpen: boolean; onClose: () => void; onConfirm: () => void; confirmLabel?: string }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{description}</p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="button" variant="danger" onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
      </div>
    </div>
  </Modal>
)

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
  </div>
)

export const DateRangePicker = ({ endDate, label = 'Date range', onEndDateChange, onStartDateChange, startDate }: { label?: string; startDate: string; endDate: string; onStartDateChange: (value: string) => void; onEndDateChange: (value: string) => void }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    <FormGroup><Label>{label} start</Label><Input type="date" value={startDate} onChange={(event) => onStartDateChange(event.target.value)} /></FormGroup>
    <FormGroup><Label>{label} end</Label><Input type="date" value={endDate} onChange={(event) => onEndDateChange(event.target.value)} /></FormGroup>
  </div>
)

export interface TableRow { id: string; cells: Record<string, ReactNode>; raw?: Record<string, string | number> }
export interface TableColumn { key: string; label: string; sortable?: boolean; className?: string }

export const Table = ({ columns, emptyMessage, rows }: { columns: TableColumn[]; rows: TableRow[]; emptyMessage: string }) => {
  const [sortKey, setSortKey] = useState<string>(columns.find((column) => column.sortable)?.key ?? '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((left, right) => {
      const leftValue = left.raw?.[sortKey] ?? String(left.cells[sortKey] ?? '')
      const rightValue = right.raw?.[sortKey] ?? String(right.cells[sortKey] ?? '')
      const result = typeof leftValue === 'number' && typeof rightValue === 'number' ? leftValue - rightValue : String(leftValue).localeCompare(String(rightValue))
      return sortDirection === 'asc' ? result : -result
    })
  }, [rows, sortDirection, sortKey])
  if (!rows.length) return <EmptyState title="No records found" description={emptyMessage} />
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-500"><tr>{columns.map((column) => <th className={`px-4 py-3 font-semibold ${column.className ?? ''}`} key={column.key}>{column.sortable ? <button className="inline-flex items-center gap-1 text-left text-slate-600 hover:text-slate-900" onClick={() => { if (sortKey === column.key) setSortDirection((value) => value === 'asc' ? 'desc' : 'asc'); else { setSortKey(column.key); setSortDirection('asc') } }} type="button">{column.label}{sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : null}</button> : column.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">{sortedRows.map((row) => <tr className="align-top" key={row.id}>{columns.map((column) => <td className={`px-4 py-3 ${column.className ?? ''}`} key={column.key}>{row.cells[column.key] ?? '—'}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export const ToastStack = ({ toasts }: { toasts: Array<{ id: number; tone: 'success' | 'error'; message: string }> }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-3">
    {toasts.map((toast) => <div className={`min-w-72 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg ${toast.tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`} key={toast.id}>{toast.message}</div>)}
  </div>
)

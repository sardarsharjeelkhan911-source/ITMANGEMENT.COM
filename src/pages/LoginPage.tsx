import { Landmark, LockKeyhole, UserRound } from 'lucide-react'
import { Button, Card, FormGroup, Input, Label } from '../components/ui'

export const LoginPage = ({ error, onSubmit, password, setPassword, username, setUsername }: { username: string; password: string; error: string; setUsername: (value: string) => void; setPassword: (value: string) => void; onSubmit: () => void }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-10">
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:p-12">
        <div className="inline-flex rounded-2xl bg-blue-600/20 p-3 text-blue-300"><Landmark className="h-8 w-8" /></div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-blue-300">ITMANGEMENT.COM</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Professional Bank Management System</h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300">Manage customers, accounts, cash operations, service requests, reports, users, and audit logs from one localStorage-backed banking dashboard.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">{['admin/admin', 'manager/manager', 'cashier/cashier', 'csr/csr'].map((credential) => <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={credential}><p className="text-xs uppercase tracking-[0.2em] text-blue-200">Demo Login</p><p className="mt-2 text-lg font-semibold">{credential}</p></div>)}</div>
      </div>
      <Card className="p-8 lg:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Sign in to continue</h2>
        <p className="mt-2 text-sm text-slate-500">Use one of the seeded demo accounts above.</p>
        <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
          <FormGroup><Label>Username</Label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} /></div></FormGroup>
          <FormGroup><Label>Password</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Enter password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div></FormGroup>
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
          <Button className="w-full" size="lg" type="submit">Login</Button>
        </form>
      </Card>
    </div>
  </div>
)

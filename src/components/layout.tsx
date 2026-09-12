import { Bell, LogOut, Menu, Search, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { SearchResult, User } from '../types/bank'
import type { RouteDefinition } from '../utils/rbac'
import { Badge } from './ui'

export const PageTitle = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-1">
    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
)

export const Sidebar = ({ activeRoute, isOpen, onClose, onNavigate, routes, user }: { routes: RouteDefinition[]; activeRoute: string; isOpen: boolean; onClose: () => void; onNavigate: (route: string) => void; user: User }) => (
  <>
    <div className={`fixed inset-0 z-30 bg-slate-950/40 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-slate-950 text-slate-100 transition lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4"><div><p className="text-xs uppercase tracking-[0.3em] text-blue-300">ITMANGEMENT.COM</p><h2 className="text-lg font-semibold">Bank Management System</h2></div><button className="rounded-full p-2 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={onClose} type="button"><X className="h-5 w-5" /></button></div>
        <div className="border-b border-slate-800 px-5 py-4 text-sm text-slate-300">Signed in as <span className="font-semibold text-white">{user.name}</span></div>
        <nav className="flex-1 space-y-1 px-3 py-5">{routes.map((route) => { const Icon = route.icon; const active = activeRoute === route.key; return <button className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`} key={route.key} onClick={() => { onNavigate(route.key); onClose() }} type="button"><Icon className="h-5 w-5" />{route.label}</button> })}</nav>
      </div>
    </aside>
  </>
)

export const Header = ({ notifications, onLogout, onSearchSelect, search, searchResults, setSearch, title, user, onMenuClick }: { title: ReactNode; search: string; setSearch: (value: string) => void; searchResults: SearchResult[]; onSearchSelect: (result: SearchResult) => void; notifications: Array<{ id: string; label: string; meta: string }>; user: User; onLogout: () => void; onMenuClick: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden"><button className="rounded-2xl border border-slate-200 p-2 text-slate-700" onClick={onMenuClick} type="button"><Menu className="h-5 w-5" /></button><div className="text-sm font-semibold text-slate-900">Bank Management System</div></div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>{title}</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[min(100%,24rem)] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" onChange={(event) => setSearch(event.target.value)} placeholder="Search customers or accounts" value={search} />{search && searchResults.length > 0 ? <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">{searchResults.map((result) => <button className="block w-full rounded-xl px-3 py-2 text-left hover:bg-slate-50" key={result.id} onClick={() => onSearchSelect(result)} type="button"><div className="text-sm font-medium text-slate-900">{result.title}</div><div className="text-xs text-slate-500">{result.description}</div></button>)}</div> : null}</div>
            <div className="relative"><button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50" onClick={() => setShowNotifications((value) => !value)} type="button"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-blue-600" /></button>{showNotifications ? <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"><p className="mb-3 text-sm font-semibold text-slate-900">Recent alerts</p><div className="space-y-3">{notifications.map((notification) => <div className="rounded-xl bg-slate-50 p-3" key={notification.id}><p className="text-sm font-medium text-slate-800">{notification.label}</p><p className="text-xs text-slate-500">{notification.meta}</p></div>)}</div></div> : null}</div>
            <Badge tone="blue">{user.role.toUpperCase()}</Badge>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={onLogout} type="button"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

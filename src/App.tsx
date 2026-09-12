import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import './App.css'
import {
  deviceDistribution,
  devicesSeed,
  kpis,
  reportSummary,
  resolutionByTeam,
  systemHealth,
  ticketsSeed,
  ticketTrend,
  usersSeed,
} from './data/mockData'
import type { Device, Priority, Ticket, TicketStatus, User } from './types'

type ViewKey = 'dashboard' | 'tickets' | 'devices' | 'users' | 'reports'

const navItems: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'tickets', label: 'Tickets', icon: '🎫' },
  { key: 'devices', label: 'Devices', icon: '💻' },
  { key: 'users', label: 'Users', icon: '👥' },
  { key: 'reports', label: 'Reports', icon: '📈' },
]

const statusOptions: TicketStatus[] = ['Open', 'In Progress', 'Pending', 'Resolved']
const priorityOptions: Priority[] = ['Low', 'Medium', 'High', 'Critical']

const toPath = (view: ViewKey) => (view === 'dashboard' ? '/' : `/${view}`)

const fromPath = (path: string): ViewKey => {
  const cleanPath = path.replace(/^\//, '').toLowerCase()
  return navItems.find((item) => item.key === cleanPath)?.key ?? 'dashboard'
}

const getMaxNumericId = (ids: string[], prefix: string) =>
  ids.reduce((max, id) => {
    const numeric = Number.parseInt(id.replace(prefix, ''), 10)
    return Number.isNaN(numeric) ? max : Math.max(max, numeric)
  }, 0)

function App() {
  const [activeView, setActiveView] = useState<ViewKey>(() => fromPath(window.location.pathname))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [tickets, setTickets] = useState<Ticket[]>(ticketsSeed)
  const [devices, setDevices] = useState<Device[]>(devicesSeed)
  const [users] = useState<User[]>(usersSeed)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showDeviceModal, setShowDeviceModal] = useState(false)
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'All' | TicketStatus>('All')
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<'All' | Priority>('All')
  const [deviceHealthFilter, setDeviceHealthFilter] = useState<'All' | Device['health']>('All')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [creating, setCreating] = useState(false)
  const ticketIdCounterRef = useRef(getMaxNumericId(ticketsSeed.map((ticket) => ticket.id), 'INC-'))
  const deviceIdCounterRef = useRef(getMaxNumericId(devicesSeed.map((device) => device.id), 'DEV-'))

  useEffect(() => {
    const handlePopState = () => setActiveView(fromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (view: ViewKey) => {
    window.history.pushState({}, '', toPath(view))
    setActiveView(view)
  }

  const filteredTickets = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        [ticket.id, ticket.subject, ticket.requester, ticket.assignee].some((field) =>
          field.toLowerCase().includes(query),
        )
      const matchesStatus = ticketStatusFilter === 'All' || ticket.status === ticketStatusFilter
      const matchesPriority = ticketPriorityFilter === 'All' || ticket.priority === ticketPriorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [globalSearch, ticketPriorityFilter, ticketStatusFilter, tickets])

  const filteredDevices = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    return devices.filter((device) => {
      const matchesSearch =
        !query ||
        [device.name, device.id, device.owner, device.os].some((field) =>
          field.toLowerCase().includes(query),
        )
      const matchesHealth = deviceHealthFilter === 'All' || device.health === deviceHealthFilter
      return matchesSearch && matchesHealth
    })
  }, [deviceHealthFilter, devices, globalSearch])

  const filteredUsers = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    return users.filter((user) => {
      return !query || [user.name, user.role, user.department].some((field) => field.toLowerCase().includes(query))
    })
  }, [globalSearch, users])

  const handleTicketCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (creating) {
      return
    }
    const form = event.currentTarget
    const formData = new FormData(form)

    const subject = String(formData.get('subject') || '').trim()
    const requester = String(formData.get('requester') || '').trim()
    const assignee = String(formData.get('assignee') || '').trim()
    const priority = String(formData.get('priority') || 'Medium') as Priority
    const category = String(formData.get('category') || '').trim()
    const description = String(formData.get('description') || '').trim()

    if (!subject || !requester || !assignee || !category || !description) {
      return
    }

    setCreating(true)
    ticketIdCounterRef.current += 1
    const ticket: Ticket = {
      id: `INC-${ticketIdCounterRef.current}`,
      subject,
      requester,
      assignee,
      priority,
      status: 'Open',
      updatedAt: 'Just now',
      category,
      description,
    }
    setTickets((current) => [ticket, ...current])
    setShowTicketModal(false)
    form.reset()
    setCreating(false)
    setActiveView('tickets')
    window.history.pushState({}, '', '/tickets')
  }

  const handleDeviceCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') || '').trim()
    const type = String(formData.get('type') || 'Laptop') as Device['type']
    const os = String(formData.get('os') || '').trim()
    const owner = String(formData.get('owner') || '').trim()
    const location = String(formData.get('location') || '').trim()

    if (!name || !os || !owner || !location) {
      return
    }

    const device: Device = {
      id: `DEV-${++deviceIdCounterRef.current}`,
      name,
      type,
      os,
      owner,
      location,
      lastCheckIn: 'Just now',
      health: 'Healthy',
    }

    setDevices((current) => [device, ...current])
    form.reset()
    setShowDeviceModal(false)
    setActiveView('devices')
    window.history.pushState({}, '', '/devices')
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <span className="brand-mark">IT</span>
          {!sidebarCollapsed && (
            <div>
              <h1>IT Management</h1>
              <p>Operations Center</p>
            </div>
          )}
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.key}
              onClick={() => navigate(item.key)}
              className={activeView === item.key ? 'nav-item active' : 'nav-item'}
              aria-current={activeView === item.key ? 'page' : undefined}
            >
              <span aria-hidden>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <label className="search-bar" htmlFor="global-search">
            <span>🔎</span>
            <input
              id="global-search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Search tickets, devices, users..."
            />
          </label>
          <button type="button" className="icon-btn" aria-label="Notifications">
            🔔
          </button>
          <div className="profile-pill">
            <span className="avatar">RA</span>
            <div>
              <strong>Rida Ahmed</strong>
              <p>IT Manager</p>
            </div>
          </div>
        </header>

        <main className="content">
          {activeView === 'dashboard' && (
            <section className="view">
              <div className="view-header">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p>Real-time operational visibility for IT support teams.</p>
                </div>
                <div className="quick-actions">
                  <button type="button" onClick={() => setShowTicketModal(true)}>+ Create Ticket</button>
                  <button type="button" onClick={() => setShowDeviceModal(true)}>+ Add Device</button>
                </div>
              </div>

              <div className="kpi-grid">
                <KpiCard label="Open Tickets" value={String(kpis.openTickets)} tone="warning" />
                <KpiCard label="Resolved Tickets" value={String(kpis.resolvedTickets)} tone="success" />
                <KpiCard label="Managed Devices" value={String(kpis.managedDevices)} tone="default" />
                <KpiCard label="System Uptime" value={kpis.uptime} tone="info" />
              </div>

              <div className="dashboard-grid">
                <section className="panel">
                  <h3>Ticket Volume Trend</h3>
                  <SimpleBarChart data={ticketTrend} />
                </section>

                <section className="panel">
                  <h3>System Health</h3>
                  <ul className="health-list">
                    {systemHealth.map((service) => (
                      <li key={service.name}>
                        <div>
                          <strong>{service.name}</strong>
                          <p>Uptime: {service.uptime}</p>
                        </div>
                        <Badge tone={service.status === 'Operational' ? 'success' : 'warning'} text={service.status} />
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="panel">
                <h3>Recent Support Tickets</h3>
                <TicketTable tickets={tickets.slice(0, 5)} onSelect={setSelectedTicket} />
              </section>
            </section>
          )}

          {activeView === 'tickets' && (
            <section className="view">
              <div className="view-header">
                <div>
                  <h2>Tickets</h2>
                  <p>Track incidents, assign ownership, and update ticket status quickly.</p>
                </div>
                <button type="button" onClick={() => setShowTicketModal(true)}>+ Create Ticket</button>
              </div>

              <div className="filters">
                <label>
                  Status
                  <select
                    value={ticketStatusFilter}
                    onChange={(event) => setTicketStatusFilter(event.target.value as 'All' | TicketStatus)}
                  >
                    <option value="All">All</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    value={ticketPriorityFilter}
                    onChange={(event) => setTicketPriorityFilter(event.target.value as 'All' | Priority)}
                  >
                    <option value="All">All</option>
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </label>
              </div>

              {filteredTickets.length === 0 ? (
                <EmptyState message="No tickets match your current filters." />
              ) : (
                <TicketTable tickets={filteredTickets} onSelect={setSelectedTicket} />
              )}
            </section>
          )}

          {activeView === 'devices' && (
            <section className="view">
              <div className="view-header">
                <div>
                  <h2>Devices</h2>
                  <p>Manage device inventory, ownership, check-ins, and health posture.</p>
                </div>
                <button type="button" onClick={() => setShowDeviceModal(true)}>+ Add Device</button>
              </div>

              <div className="filters">
                <label>
                  Health
                  <select
                    value={deviceHealthFilter}
                    onChange={(event) => setDeviceHealthFilter(event.target.value as 'All' | Device['health'])}
                  >
                    <option value="All">All</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>

              {filteredDevices.length === 0 ? (
                <EmptyState message="No devices found. Try updating your search or filters." />
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Device</th>
                        <th>Type</th>
                        <th>OS</th>
                        <th>Owner</th>
                        <th>Location</th>
                        <th>Last Check-In</th>
                        <th>Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevices.map((device) => (
                        <tr key={device.id}>
                          <td>{device.id}</td>
                          <td>{device.name}</td>
                          <td>{device.type}</td>
                          <td>{device.os}</td>
                          <td>{device.owner}</td>
                          <td>{device.location}</td>
                          <td>{device.lastCheckIn}</td>
                          <td><Badge tone={device.health === 'Healthy' ? 'success' : device.health === 'Warning' ? 'warning' : 'danger'} text={device.health} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeView === 'users' && (
            <section className="view">
              <div className="view-header">
                <div>
                  <h2>Users</h2>
                  <p>Directory of employees, ownership footprint, and workforce status.</p>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <EmptyState message="No users match your search input." />
              ) : (
                <div className="user-grid">
                  {filteredUsers.map((user) => (
                    <article key={user.id} className="user-card">
                      <span className="avatar big">{initials(user.name)}</span>
                      <div>
                        <h3>{user.name}</h3>
                        <p>{user.role}</p>
                      </div>
                      <dl>
                        <div>
                          <dt>Department</dt>
                          <dd>{user.department}</dd>
                        </div>
                        <div>
                          <dt>Devices</dt>
                          <dd>{user.deviceCount}</dd>
                        </div>
                      </dl>
                      <Badge tone={user.status === 'Active' ? 'success' : user.status === 'Away' ? 'warning' : 'default'} text={user.status} />
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeView === 'reports' && (
            <section className="view">
              <div className="view-header">
                <div>
                  <h2>Reports</h2>
                  <p>Service quality and infrastructure distribution insights.</p>
                </div>
              </div>

              <div className="kpi-grid">
                <KpiCard label="Mean Resolution Time" value={reportSummary.meanResolution} tone="info" />
                <KpiCard label="SLA Compliance" value={reportSummary.slaCompliance} tone="success" />
                <KpiCard label="High Priority Backlog" value={String(reportSummary.highPriorityBacklog)} tone="warning" />
                <KpiCard label="Healthy Devices" value={String(reportSummary.healthyDevices)} tone="default" />
              </div>

              <div className="dashboard-grid">
                <section className="panel">
                  <h3>Ticket Resolution by Team</h3>
                  <SimpleBarChart data={resolutionByTeam.map((entry) => ({ day: entry.team, count: entry.resolved }))} />
                </section>
                <section className="panel">
                  <h3>Device Distribution</h3>
                  <ul className="distribution-list">
                    {deviceDistribution.map((entry) => (
                      <li key={entry.type}>
                        <span>{entry.type}</span>
                        <strong>{entry.count}</strong>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </section>
          )}
        </main>
      </div>

      {showTicketModal && (
        <Modal title="Create New Ticket" onClose={() => setShowTicketModal(false)}>
          <form className="form-grid" onSubmit={handleTicketCreate}>
            <label>Subject<input name="subject" required minLength={5} /></label>
            <label>Requester<input name="requester" required /></label>
            <label>Assignee<input name="assignee" required /></label>
            <label>Category<input name="category" required /></label>
            <label>
              Priority
              <select name="priority" defaultValue="Medium">
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <label className="full">Description<textarea name="description" required minLength={10} rows={4} /></label>
            <button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Ticket'}</button>
          </form>
        </Modal>
      )}

      {showDeviceModal && (
        <Modal title="Add New Device" onClose={() => setShowDeviceModal(false)}>
          <form className="form-grid" onSubmit={handleDeviceCreate}>
            <label>Device Name<input name="name" required /></label>
            <label>
              Type
              <select name="type" defaultValue="Laptop">
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Server">Server</option>
                <option value="Mobile">Mobile</option>
                <option value="Network">Network</option>
              </select>
            </label>
            <label>Operating System<input name="os" required /></label>
            <label>Owner<input name="owner" required /></label>
            <label className="full">Location<input name="location" required /></label>
            <button type="submit">Add Device</button>
          </form>
        </Modal>
      )}

      {selectedTicket && (
        <Modal title={`Ticket Details · ${selectedTicket.id}`} onClose={() => setSelectedTicket(null)}>
          <div className="ticket-detail">
            <h3>{selectedTicket.subject}</h3>
            <p>{selectedTicket.description}</p>
            <div className="detail-grid">
              <p><strong>Requester:</strong> {selectedTicket.requester}</p>
              <p><strong>Assignee:</strong> {selectedTicket.assignee}</p>
              <p><strong>Category:</strong> {selectedTicket.category}</p>
              <p><strong>Updated:</strong> {selectedTicket.updatedAt}</p>
            </div>
            <label>
              Update Status
              <select
                value={selectedTicket.status}
                onChange={(event) => {
                  const nextStatus = event.target.value as TicketStatus
                  setTickets((items) =>
                    items.map((ticket) =>
                      ticket.id === selectedTicket.id ? { ...ticket, status: nextStatus, updatedAt: 'Just now' } : ticket,
                    ),
                  )
                  setSelectedTicket((current) => (current ? { ...current, status: nextStatus, updatedAt: 'Just now' } : null))
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
        </Modal>
      )}
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: string
  tone: 'default' | 'success' | 'warning' | 'info'
}

function KpiCard({ label, value, tone }: KpiCardProps) {
  return (
    <article className={`kpi-card ${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}

function EmptyState({ message }: { message: string }) {
  return <div className="empty">{message}</div>
}

function Badge({ tone, text }: { tone: 'default' | 'success' | 'warning' | 'danger'; text: string }) {
  return <span className={`badge ${tone}`}>{text}</span>
}

function TicketTable({ tickets, onSelect }: { tickets: Ticket[]; onSelect: (ticket: Ticket) => void }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Requester</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>
                <button type="button" className="table-link" onClick={() => onSelect(ticket)}>
                  {ticket.subject}
                </button>
              </td>
              <td>{ticket.requester}</td>
              <td>{ticket.assignee}</td>
              <td>
                <Badge
                  tone={
                    ticket.priority === 'Critical'
                      ? 'danger'
                      : ticket.priority === 'High'
                        ? 'warning'
                        : 'default'
                  }
                  text={ticket.priority}
                />
              </td>
              <td>
                <Badge
                  tone={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Open' ? 'danger' : 'warning'}
                  text={ticket.status}
                />
              </td>
              <td>{ticket.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SimpleBarChart({ data }: { data: { day: string; count: number }[] }) {
  const maxValue = Math.max(...data.map((entry) => entry.count), 1)
  return (
    <div className="bar-chart" role="img" aria-label="Bar chart">
      {data.map((entry) => (
        <div className="bar-item" key={entry.day}>
          <span className="bar" style={{ height: `${(entry.count / maxValue) * 100}%` }} />
          <small>{entry.day}</small>
          <strong>{entry.count}</strong>
        </div>
      ))}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusedRef = useRef<HTMLElement | null>(null)
  const focusableSelector =
    'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'

  const handleModalKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }

    if (event.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!focusable?.length) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  useEffect(() => {
    previousFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(focusableSelector)
    firstFocusable?.focus()

    return () => {
      previousFocusedRef.current?.focus()
    }
  }, [])

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleModalKeyDown}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

export default App

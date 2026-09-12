import type { Device, Ticket, User } from '../types'

export const kpis = {
  openTickets: 48,
  resolvedTickets: 312,
  managedDevices: 684,
  uptime: '99.94%',
}

export const ticketTrend = [
  { day: 'Mon', count: 18 },
  { day: 'Tue', count: 24 },
  { day: 'Wed', count: 19 },
  { day: 'Thu', count: 28 },
  { day: 'Fri', count: 22 },
  { day: 'Sat', count: 14 },
  { day: 'Sun', count: 16 },
]

export const ticketsSeed: Ticket[] = [
  {
    id: 'INC-1042',
    subject: 'VPN access fails on remote login',
    requester: 'Aisha Khan',
    assignee: 'Noah Patel',
    priority: 'High',
    status: 'In Progress',
    updatedAt: '10 min ago',
    category: 'Network',
    description: 'User cannot establish VPN tunnel from home network after password reset.',
  },
  {
    id: 'INC-1038',
    subject: 'Outlook keeps crashing on startup',
    requester: 'Liam Chen',
    assignee: 'Mila Rivera',
    priority: 'Medium',
    status: 'Pending',
    updatedAt: '35 min ago',
    category: 'Software',
    description: 'Crash appears after latest plugin update. Need profile repair and plugin rollback.',
  },
  {
    id: 'INC-1034',
    subject: 'Laptop battery health degraded',
    requester: 'Emma Jones',
    assignee: 'Noah Patel',
    priority: 'Low',
    status: 'Open',
    updatedAt: '1 hr ago',
    category: 'Hardware',
    description: 'Battery drops from 80% to 20% in under one hour on finance laptop.',
  },
  {
    id: 'INC-1029',
    subject: 'Critical patch deployment verification',
    requester: 'SOC Team',
    assignee: 'Arman Shah',
    priority: 'Critical',
    status: 'Open',
    updatedAt: '2 hrs ago',
    category: 'Security',
    description: 'Confirm latest emergency OS patch has reached all production servers.',
  },
  {
    id: 'INC-1025',
    subject: 'Printer queue stuck at HQ-3F',
    requester: 'Admin Office',
    assignee: 'Mila Rivera',
    priority: 'Low',
    status: 'Resolved',
    updatedAt: 'Today',
    category: 'Peripherals',
    description: 'Queue was cleared and print spooler restarted. Monitoring for recurrence.',
  },
]

export const devicesSeed: Device[] = [
  {
    id: 'DEV-2201',
    name: 'SRV-DB-01',
    type: 'Server',
    os: 'Ubuntu 24.04 LTS',
    owner: 'Infrastructure',
    location: 'Data Center A',
    lastCheckIn: '2 min ago',
    health: 'Healthy',
  },
  {
    id: 'DEV-2202',
    name: 'LT-FIN-44',
    type: 'Laptop',
    os: 'Windows 11',
    owner: 'Emma Jones',
    location: 'HQ Floor 2',
    lastCheckIn: '12 min ago',
    health: 'Warning',
  },
  {
    id: 'DEV-2203',
    name: 'RTR-HQ-EDGE',
    type: 'Network',
    os: 'Cisco IOS XE',
    owner: 'Network Team',
    location: 'HQ Server Room',
    lastCheckIn: '5 min ago',
    health: 'Healthy',
  },
  {
    id: 'DEV-2204',
    name: 'MOB-SALES-09',
    type: 'Mobile',
    os: 'iOS 18',
    owner: 'Sara Malik',
    location: 'Field',
    lastCheckIn: '45 min ago',
    health: 'Critical',
  },
  {
    id: 'DEV-2205',
    name: 'DT-OPS-11',
    type: 'Desktop',
    os: 'Windows 11',
    owner: 'Ops Desk',
    location: 'NOC',
    lastCheckIn: '8 min ago',
    health: 'Healthy',
  },
]

export const usersSeed: User[] = [
  { id: 'USR-001', name: 'Noah Patel', role: 'IT Support Engineer', department: 'IT Operations', deviceCount: 8, status: 'Active' },
  { id: 'USR-002', name: 'Mila Rivera', role: 'Service Desk Specialist', department: 'IT Operations', deviceCount: 6, status: 'Active' },
  { id: 'USR-003', name: 'Arman Shah', role: 'Systems Administrator', department: 'Infrastructure', deviceCount: 12, status: 'Away' },
  { id: 'USR-004', name: 'Aisha Khan', role: 'Finance Analyst', department: 'Finance', deviceCount: 2, status: 'Offline' },
  { id: 'USR-005', name: 'Sara Malik', role: 'Sales Manager', department: 'Sales', deviceCount: 3, status: 'Active' },
]

export const systemHealth = [
  { name: 'Network Core', status: 'Operational', uptime: '99.99%' },
  { name: 'Identity Services', status: 'Operational', uptime: '99.95%' },
  { name: 'Email Gateway', status: 'Degraded', uptime: '98.91%' },
  { name: 'Backup Services', status: 'Operational', uptime: '99.88%' },
]

export const reportSummary = {
  meanResolution: '4h 18m',
  slaCompliance: '96.2%',
  highPriorityBacklog: 7,
  healthyDevices: 612,
}

export const resolutionByTeam = [
  { team: 'Service Desk', resolved: 128 },
  { team: 'Infrastructure', resolved: 84 },
  { team: 'Security', resolved: 52 },
  { team: 'Endpoint', resolved: 48 },
]

export const deviceDistribution = [
  { type: 'Laptop', count: 312 },
  { type: 'Desktop', count: 168 },
  { type: 'Server', count: 96 },
  { type: 'Mobile', count: 74 },
  { type: 'Network', count: 34 },
]

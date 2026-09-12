export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved'
export type DeviceHealth = 'Healthy' | 'Warning' | 'Critical'
export type UserStatus = 'Active' | 'Away' | 'Offline'

export interface Ticket {
  id: string
  subject: string
  requester: string
  assignee: string
  priority: Priority
  status: TicketStatus
  updatedAt: string
  category: string
  description: string
}

export interface Device {
  id: string
  name: string
  type: 'Laptop' | 'Desktop' | 'Server' | 'Mobile' | 'Network'
  os: string
  owner: string
  location: string
  lastCheckIn: string
  health: DeviceHealth
}

export interface User {
  id: string
  name: string
  role: string
  department: string
  deviceCount: number
  status: UserStatus
}

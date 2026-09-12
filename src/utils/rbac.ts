import { BadgeDollarSign, CreditCard, FileText, Gauge, LifeBuoy, Shield, Users, type LucideIcon } from 'lucide-react'
import type { Role, RouteKey } from '../types/bank'

export interface RouteDefinition {
  key: RouteKey
  label: string
  icon: LucideIcon
}

export const routes: RouteDefinition[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Gauge },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'accounts', label: 'Accounts', icon: CreditCard },
  { key: 'transactions', label: 'Transactions', icon: BadgeDollarSign },
  { key: 'csr', label: 'CSR', icon: LifeBuoy },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'security', label: 'Users & Audit', icon: Shield },
]

export const roleRouteAccess: Record<Role, RouteKey[]> = {
  admin: ['dashboard', 'customers', 'accounts', 'transactions', 'csr', 'reports', 'security'],
  manager: ['dashboard', 'customers', 'accounts', 'reports', 'security'],
  cashier: ['dashboard', 'accounts', 'transactions'],
  csr: ['dashboard', 'customers', 'csr'],
}

export const canAccessRoute = (role: Role, route: RouteKey) => roleRouteAccess[role].includes(route)
export const canManageCustomers = (role: Role) => role === 'admin' || role === 'manager'
export const canManageAccounts = (role: Role) => role === 'admin' || role === 'manager'
export const canManageTransactions = (role: Role) => role === 'admin' || role === 'cashier'
export const canManageServiceRequests = (role: Role) => role === 'admin' || role === 'csr'
export const canManageUsers = (role: Role) => role === 'admin'

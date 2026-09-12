export type Role = 'admin' | 'manager' | 'cashier' | 'csr'

export type RouteKey =
  | 'dashboard'
  | 'customers'
  | 'accounts'
  | 'transactions'
  | 'csr'
  | 'reports'
  | 'security'

export type ReportType = 'daily' | 'deposits' | 'withdrawals' | 'accounts' | 'customers' | 'profit'

export type CustomerStatus = 'active' | 'inactive' | 'suspended'
export type AccountType = 'current' | 'savings'
export type AccountStatus = 'active' | 'closed' | 'dormant'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_out' | 'transfer_in'
export type ServiceRequestType = 'complaint' | 'request'
export type ServiceRequestStatus = 'open' | 'in_progress' | 'resolved'

export interface User {
  id: string
  username: string
  password: string
  name: string
  role: Role
  createdAt: string
}

export interface Customer {
  id: string
  cnic: string
  name: string
  fatherName: string
  dob: string
  phone: string
  address: string
  status: CustomerStatus
  createdAt: string
}

export interface Account {
  id: string
  accountNumber: string
  customerId: string
  type: AccountType
  balance: number
  status: AccountStatus
  openingBalance: number
  createdAt: string
  interestRate?: number
}

export interface Transaction {
  id: string
  transactionId: string
  accountId: string
  type: TransactionType
  amount: number
  balanceAfter: number
  description: string
  relatedAccountId?: string
  createdAt: string
}

export interface ServiceRequest {
  id: string
  customerId: string
  type: ServiceRequestType
  subject: string
  description: string
  status: ServiceRequestStatus
  createdAt: string
  resolvedAt?: string
}

export interface AuditLog {
  id: string
  userId?: string
  username: string
  role: Role | 'system'
  action: string
  createdAt: string
}

export interface BankData {
  users: User[]
  customers: Customer[]
  accounts: Account[]
  transactions: Transaction[]
  serviceRequests: ServiceRequest[]
  auditLogs: AuditLog[]
}

export interface RouteState {
  selectedCustomerId?: string
  selectedAccountId?: string
  reportType?: ReportType
  transactionType?: 'deposit' | 'withdrawal' | 'transfer'
}

export interface SearchResult {
  id: string
  title: string
  description: string
  route: RouteKey
  routeState?: RouteState
}

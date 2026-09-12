import type { Account, AuditLog, Customer, ServiceRequest, Transaction, User } from '../types/bank'

const extractSequence = (value: string) => {
  const digits = value.match(/(\d+)$/)?.[1]
  return digits ? Number.parseInt(digits, 10) : 0
}

const nextPaddedValue = (values: string[], size = 5) =>
  String(values.reduce((max, value) => Math.max(max, extractSequence(value)), 0) + 1).padStart(size, '0')

export const generateCustomerId = (customers: Customer[]) => `C-${nextPaddedValue(customers.map((item) => item.id))}`
export const generateUserId = (users: User[]) => `U-${nextPaddedValue(users.map((item) => item.id))}`
export const generateServiceRequestId = (requests: ServiceRequest[]) => `SR-${nextPaddedValue(requests.map((item) => item.id))}`
export const generateAuditId = (logs: AuditLog[]) => `AL-${nextPaddedValue(logs.map((item) => item.id), 6)}`
export const generateTransactionRowId = (transactions: Transaction[]) => `TR-${nextPaddedValue(transactions.map((item) => item.id), 6)}`
export const generateTransactionId = (transactions: Transaction[]) => `TX-${nextPaddedValue(transactions.map((item) => item.transactionId), 6)}`
export const generateAccountId = (accounts: Account[]) => `A-${nextPaddedValue(accounts.map((item) => item.id))}`

export const generateAccountNumber = (accounts: Account[]) => {
  const next = String(
    accounts.reduce((max, account) => Math.max(max, extractSequence(account.accountNumber)), 0) + 1,
  ).padStart(10, '0')
  return `PK00BMST${next}`
}

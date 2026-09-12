import { createSeededBankData } from '../data/seed'
import type { AuditLog, BankData, User } from '../types/bank'
import { generateAuditId } from '../utils/id'

export const BANK_STORAGE_KEY = 'bank-management-system-v1'
export const SESSION_STORAGE_KEY = 'bank-management-session-v1'

export const loadBankData = (): BankData => {
  try {
    const raw = window.localStorage.getItem(BANK_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BankData) : createSeededBankData()
  } catch {
    return createSeededBankData()
  }
}

export const saveBankData = (data: BankData) => {
  window.localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(data))
}

export const loadSessionUserId = () => window.sessionStorage.getItem(SESSION_STORAGE_KEY)
export const saveSessionUserId = (userId: string) => window.sessionStorage.setItem(SESSION_STORAGE_KEY, userId)
export const clearSessionUserId = () => window.sessionStorage.removeItem(SESSION_STORAGE_KEY)

export const appendAuditLog = (data: BankData, action: string, user?: User | null): BankData => ({
  ...data,
  auditLogs: [
    {
      id: generateAuditId(data.auditLogs),
      userId: user?.id,
      username: user?.username ?? 'system',
      role: user?.role ?? 'system',
      action,
      createdAt: new Date().toISOString(),
    } satisfies AuditLog,
    ...data.auditLogs,
  ].slice(0, 300),
})

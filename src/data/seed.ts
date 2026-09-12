import { subDays } from 'date-fns'
import type { Account, BankData, ServiceRequest, Transaction, User } from '../types/bank'
import { formatAccountNumber } from '../utils/id'

type TransactionSeed = Pick<
  Transaction,
  'accountId' | 'type' | 'amount' | 'description' | 'createdAt' | 'relatedAccountId'
>

const seededIso = (daysAgo: number, hours: number, minutes: number) => {
  const date = subDays(new Date(), daysAgo)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

const users: User[] = [
  { id: 'U-00001', username: 'admin', password: 'admin', name: 'Ayesha Rahman', role: 'admin', createdAt: seededIso(120, 9, 0) },
  { id: 'U-00002', username: 'manager', password: 'manager', name: 'Bilal Ahmed', role: 'manager', createdAt: seededIso(110, 9, 15) },
  { id: 'U-00003', username: 'cashier', password: 'cashier', name: 'Sana Javed', role: 'cashier', createdAt: seededIso(105, 9, 30) },
  { id: 'U-00004', username: 'csr', password: 'csr', name: 'Usman Tariq', role: 'csr', createdAt: seededIso(100, 9, 45) },
]

const customers = [
  { id: 'C-00001', cnic: '4210112345671', name: 'Ali Raza', fatherName: 'Rashid Iqbal', dob: '1988-05-14', phone: '03001234567', address: 'Block 7 Gulshan-e-Iqbal, Karachi', status: 'active', createdAt: seededIso(90, 10, 0) },
  { id: 'C-00002', cnic: '3520212345678', name: 'Mariam Noor', fatherName: 'Asif Noor', dob: '1992-11-26', phone: '03217654321', address: 'Model Town, Lahore', status: 'active', createdAt: seededIso(86, 11, 10) },
  { id: 'C-00003', cnic: '6110111122233', name: 'Hamza Khan', fatherName: 'Naveed Khan', dob: '1985-08-07', phone: '03334445566', address: 'University Road, Peshawar', status: 'active', createdAt: seededIso(80, 9, 35) },
  { id: 'C-00004', cnic: '3740512345679', name: 'Sadia Bano', fatherName: 'Jamil Ahmed', dob: '1990-03-19', phone: '03451239876', address: 'Saddar, Rawalpindi', status: 'active', createdAt: seededIso(75, 13, 25) },
  { id: 'C-00005', cnic: '4130312345670', name: 'Farhan Ali', fatherName: 'Tariq Mahmood', dob: '1995-01-09', phone: '03115557788', address: 'Cantt, Multan', status: 'active', createdAt: seededIso(70, 14, 0) },
  { id: 'C-00006', cnic: '5440012345674', name: 'Zainab Fatima', fatherName: 'Akhtar Hussain', dob: '1987-07-23', phone: '03007778899', address: 'Civil Lines, Hyderabad', status: 'active', createdAt: seededIso(65, 10, 55) },
  { id: 'C-00007', cnic: '3310212345675', name: 'Ahmed Hassan', fatherName: 'Latif Hassan', dob: '1979-12-02', phone: '03225556677', address: 'G-11, Islamabad', status: 'active', createdAt: seededIso(60, 12, 20) },
  { id: 'C-00008', cnic: '1730112345676', name: 'Hira Nadeem', fatherName: 'Nadeem Akbar', dob: '1998-09-14', phone: '03469874561', address: 'Satellite Town, Quetta', status: 'active', createdAt: seededIso(54, 15, 40) },
  { id: 'C-00009', cnic: '3520119988771', name: 'Imran Yousaf', fatherName: 'Yousaf Saleem', dob: '1983-04-11', phone: '03123456789', address: 'Johar Town, Lahore', status: 'suspended', createdAt: seededIso(48, 10, 5) },
  { id: 'C-00010', cnic: '4210199988772', name: 'Rabia Siddiqui', fatherName: 'Naeem Siddiqui', dob: '1991-06-30', phone: '03315558877', address: 'North Nazimabad, Karachi', status: 'inactive', createdAt: seededIso(42, 16, 30) },
] as const

const baseAccounts: Account[] = [
  { id: 'A-00001', accountNumber: formatAccountNumber(1), customerId: 'C-00001', type: 'current', balance: 0, openingBalance: 250000, status: 'active', createdAt: seededIso(88, 10, 0) },
  { id: 'A-00002', accountNumber: formatAccountNumber(2), customerId: 'C-00002', type: 'savings', balance: 0, openingBalance: 175000, status: 'active', createdAt: seededIso(84, 10, 30), interestRate: 7 },
  { id: 'A-00003', accountNumber: formatAccountNumber(3), customerId: 'C-00003', type: 'current', balance: 0, openingBalance: 98000, status: 'active', createdAt: seededIso(79, 11, 15) },
  { id: 'A-00004', accountNumber: formatAccountNumber(4), customerId: 'C-00004', type: 'savings', balance: 0, openingBalance: 320000, status: 'active', createdAt: seededIso(72, 13, 0), interestRate: 7.5 },
  { id: 'A-00005', accountNumber: formatAccountNumber(5), customerId: 'C-00005', type: 'current', balance: 0, openingBalance: 87000, status: 'active', createdAt: seededIso(69, 14, 30) },
  { id: 'A-00006', accountNumber: formatAccountNumber(6), customerId: 'C-00006', type: 'savings', balance: 0, openingBalance: 145000, status: 'active', createdAt: seededIso(63, 11, 10), interestRate: 6.8 },
  { id: 'A-00007', accountNumber: formatAccountNumber(7), customerId: 'C-00007', type: 'savings', balance: 0, openingBalance: 410000, status: 'dormant', createdAt: seededIso(58, 9, 40), interestRate: 7.2 },
  { id: 'A-00008', accountNumber: formatAccountNumber(8), customerId: 'C-00008', type: 'current', balance: 0, openingBalance: 56000, status: 'active', createdAt: seededIso(52, 15, 0) },
]

const transactionSpecs: TransactionSeed[] = [
  { accountId: 'A-00001', type: 'deposit', amount: 25000, description: 'Salary credit', createdAt: seededIso(9, 9, 15) },
  { accountId: 'A-00002', type: 'deposit', amount: 12000, description: 'Savings top-up', createdAt: seededIso(8, 10, 5) },
  { accountId: 'A-00003', type: 'withdrawal', amount: 8000, description: 'Branch cash withdrawal', createdAt: seededIso(8, 14, 20) },
  { accountId: 'A-00004', type: 'deposit', amount: 45000, description: 'Business proceeds', createdAt: seededIso(7, 11, 45) },
  { accountId: 'A-00005', type: 'withdrawal', amount: 12000, description: 'Cheque encashment', createdAt: seededIso(7, 15, 10) },
  { accountId: 'A-00006', type: 'deposit', amount: 18000, description: 'Freelance payment', createdAt: seededIso(6, 12, 30) },
  { accountId: 'A-00001', type: 'withdrawal', amount: 10000, description: 'Cash counter withdrawal', createdAt: seededIso(6, 16, 5) },
  { accountId: 'A-00008', type: 'deposit', amount: 14000, description: 'Utility refund', createdAt: seededIso(5, 10, 40) },
  { accountId: 'A-00002', type: 'withdrawal', amount: 5000, description: 'Household cash', createdAt: seededIso(5, 13, 0) },
  { accountId: 'A-00004', type: 'withdrawal', amount: 22000, description: 'Vendor payment', createdAt: seededIso(4, 12, 20) },
  { accountId: 'A-00005', type: 'deposit', amount: 9500, description: 'Retail sale proceeds', createdAt: seededIso(4, 15, 45) },
  { accountId: 'A-00003', type: 'deposit', amount: 30000, description: 'Project bonus', createdAt: seededIso(3, 10, 15) },
  { accountId: 'A-00001', type: 'transfer_out', amount: 15000, description: 'Transfer to Mariam Noor', relatedAccountId: 'A-00002', createdAt: seededIso(3, 14, 30) },
  { accountId: 'A-00002', type: 'transfer_in', amount: 15000, description: 'Transfer from Ali Raza', relatedAccountId: 'A-00001', createdAt: seededIso(3, 14, 31) },
  { accountId: 'A-00006', type: 'transfer_out', amount: 8000, description: 'Transfer to Hira Nadeem', relatedAccountId: 'A-00008', createdAt: seededIso(2, 11, 5) },
  { accountId: 'A-00008', type: 'transfer_in', amount: 8000, description: 'Transfer from Zainab Fatima', relatedAccountId: 'A-00006', createdAt: seededIso(2, 11, 6) },
  { accountId: 'A-00004', type: 'deposit', amount: 25000, description: 'Savings deposit', createdAt: seededIso(1, 9, 50) },
  { accountId: 'A-00001', type: 'deposit', amount: 18000, description: 'Client payment', createdAt: seededIso(0, 10, 0) },
  { accountId: 'A-00003', type: 'withdrawal', amount: 6000, description: 'Emergency cash', createdAt: seededIso(0, 11, 35) },
  { accountId: 'A-00002', type: 'deposit', amount: 22000, description: 'Today branch deposit', createdAt: seededIso(0, 13, 15) },
] as const

const serviceRequests: ServiceRequest[] = [
  { id: 'SR-00001', customerId: 'C-00002', type: 'request', subject: 'Cheque book request', description: 'Customer requested a new 25-leaf cheque book.', status: 'resolved', createdAt: seededIso(10, 10, 0), resolvedAt: seededIso(8, 16, 0) },
  { id: 'SR-00002', customerId: 'C-00004', type: 'complaint', subject: 'ATM cash not dispensed', description: 'ATM debited amount without dispensing cash.', status: 'in_progress', createdAt: seededIso(4, 9, 30) },
  { id: 'SR-00003', customerId: 'C-00001', type: 'request', subject: 'Balance certificate', description: 'Required for visa documentation.', status: 'open', createdAt: seededIso(2, 12, 10) },
  { id: 'SR-00004', customerId: 'C-00006', type: 'complaint', subject: 'SMS alerts delayed', description: 'Transaction alerts are being received late.', status: 'resolved', createdAt: seededIso(7, 15, 0), resolvedAt: seededIso(5, 11, 20) },
  { id: 'SR-00005', customerId: 'C-00008', type: 'request', subject: 'Debit card activation', description: 'Customer wants newly issued card activated.', status: 'open', createdAt: seededIso(1, 14, 25) },
]

const buildTransactions = (accounts: Account[]): { accounts: Account[]; transactions: Transaction[] } => {
  const accountMap = new Map(accounts.map((account) => [account.id, { ...account, balance: account.openingBalance }]))

  const transactions = transactionSpecs.map((spec, index) => {
    const account = accountMap.get(spec.accountId)
    if (!account) throw new Error(`Seed account ${spec.accountId} not found`)
    const incoming = spec.type === 'deposit' || spec.type === 'transfer_in'
    account.balance = incoming ? account.balance + spec.amount : account.balance - spec.amount

    return {
      id: `TR-${String(index + 1).padStart(6, '0')}`,
      transactionId: `TX-${String(index + 1).padStart(6, '0')}`,
      accountId: spec.accountId,
      type: spec.type,
      amount: spec.amount,
      balanceAfter: account.balance,
      description: spec.description,
      relatedAccountId: spec.relatedAccountId,
      createdAt: spec.createdAt,
    } satisfies Transaction
  })

  return { accounts: Array.from(accountMap.values()), transactions }
}

export const createSeededBankData = (): BankData => {
  const { accounts, transactions } = buildTransactions(baseAccounts)
  return {
    users,
    customers: customers.map((customer) => ({ ...customer })),
    accounts,
    transactions,
    serviceRequests,
    auditLogs: [
      { id: 'AL-000001', userId: 'U-00001', username: 'admin', role: 'admin', action: 'Seeded application data', createdAt: seededIso(90, 8, 55) },
      { id: 'AL-000002', userId: 'U-00002', username: 'manager', role: 'manager', action: 'Reviewed previous day customer report', createdAt: seededIso(1, 8, 35) },
      { id: 'AL-000003', userId: 'U-00003', username: 'cashier', role: 'cashier', action: 'Processed morning cash deposits', createdAt: seededIso(0, 10, 5) },
      { id: 'AL-000004', userId: 'U-00004', username: 'csr', role: 'csr', action: 'Updated ATM complaint workflow', createdAt: seededIso(0, 11, 0) },
    ],
  }
}

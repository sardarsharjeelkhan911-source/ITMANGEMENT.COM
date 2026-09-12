import type { Account, AccountStatus, BankData, Customer, CustomerStatus, ServiceRequest, ServiceRequestStatus, User } from '../types/bank'
import { cnicPattern, normalise, phonePattern } from '../utils/format'
import { generateAccountId, generateAccountNumber, generateCustomerId, generateServiceRequestId, generateTransactionId, generateTransactionRowId, generateUserId } from '../utils/id'

const requirePositiveAmount = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be a positive number.')
}

const getCustomer = (data: BankData, customerId: string) => {
  const customer = data.customers.find((item) => item.id === customerId)
  if (!customer) throw new Error('Customer not found.')
  return customer
}

const getAccount = (data: BankData, accountId: string) => {
  const account = data.accounts.find((item) => item.id === accountId)
  if (!account) throw new Error('Account not found.')
  return account
}

const ensureOperationalAccount = (account: Account) => {
  if (account.status !== 'active') throw new Error('Only active accounts can be used for transactions.')
}

export const addCustomer = (data: BankData, payload: Omit<Customer, 'id' | 'createdAt'>) => {
  if (!cnicPattern.test(payload.cnic)) throw new Error('CNIC must be exactly 13 digits.')
  if (data.customers.some((customer) => customer.cnic === payload.cnic)) throw new Error('A customer with this CNIC already exists.')
  if (!payload.name.trim() || !payload.fatherName.trim() || !payload.dob || !payload.address.trim()) throw new Error('Please complete all required customer fields.')
  if (!phonePattern.test(payload.phone)) throw new Error('Phone number format is invalid.')

  const customer: Customer = { id: generateCustomerId(data.customers), createdAt: new Date().toISOString(), ...payload, name: payload.name.trim(), fatherName: payload.fatherName.trim(), address: payload.address.trim() }
  return { customer, data: { ...data, customers: [customer, ...data.customers] } }
}

export const updateCustomer = (data: BankData, customerId: string, payload: Pick<Customer, 'name' | 'phone' | 'address' | 'status'>) => {
  if (!payload.name.trim() || !payload.address.trim()) throw new Error('Name and address are required.')
  if (!phonePattern.test(payload.phone)) throw new Error('Phone number format is invalid.')
  let updatedCustomer: Customer | undefined
  const customers = data.customers.map((customer) => {
    if (customer.id !== customerId) return customer
    updatedCustomer = { ...customer, name: payload.name.trim(), phone: payload.phone.trim(), address: payload.address.trim(), status: payload.status }
    return updatedCustomer
  })
  if (!updatedCustomer) throw new Error('Customer not found.')
  return { data: { ...data, customers }, customer: updatedCustomer }
}

export const setCustomerStatus = (data: BankData, customerId: string, status: CustomerStatus) => {
  const customer = getCustomer(data, customerId)
  return updateCustomer(data, customerId, { name: customer.name, phone: customer.phone, address: customer.address, status })
}

export const openAccount = (data: BankData, payload: Pick<Account, 'customerId' | 'type' | 'openingBalance' | 'status' | 'interestRate'>) => {
  const customer = getCustomer(data, payload.customerId)
  if (customer.status !== 'active') throw new Error('Accounts can only be opened for active customers.')
  if (!Number.isFinite(payload.openingBalance) || payload.openingBalance < 0) throw new Error('Opening balance must be zero or greater.')

  const account: Account = {
    id: generateAccountId(data.accounts),
    accountNumber: generateAccountNumber(data.accounts),
    customerId: payload.customerId,
    type: payload.type,
    status: payload.status,
    openingBalance: payload.openingBalance,
    balance: payload.openingBalance,
    createdAt: new Date().toISOString(),
    interestRate: payload.type === 'savings' ? payload.interestRate ?? 7 : undefined,
  }

  let nextData: BankData = { ...data, accounts: [account, ...data.accounts] }
  let transaction
  if (payload.openingBalance > 0) {
    transaction = { id: generateTransactionRowId(data.transactions), transactionId: generateTransactionId(data.transactions), accountId: account.id, type: 'deposit' as const, amount: payload.openingBalance, balanceAfter: payload.openingBalance, description: 'Opening balance deposit', createdAt: account.createdAt }
    nextData = { ...nextData, transactions: [transaction, ...data.transactions] }
  }
  return { data: nextData, account, transaction }
}

export const setAccountStatus = (data: BankData, accountId: string, status: AccountStatus) => {
  let updatedAccount: Account | undefined
  const accounts = data.accounts.map((account) => {
    if (account.id !== accountId) return account
    updatedAccount = { ...account, status }
    return updatedAccount
  })
  if (!updatedAccount) throw new Error('Account not found.')
  return { data: { ...data, accounts }, account: updatedAccount }
}

export const createDeposit = (data: BankData, payload: { accountId: string; amount: number; description: string }) => {
  requirePositiveAmount(payload.amount)
  const account = getAccount(data, payload.accountId)
  ensureOperationalAccount(account)
  const updatedAccount = { ...account, balance: account.balance + payload.amount }
  const transaction = { id: generateTransactionRowId(data.transactions), transactionId: generateTransactionId(data.transactions), accountId: account.id, type: 'deposit' as const, amount: payload.amount, balanceAfter: updatedAccount.balance, description: payload.description.trim() || 'Cash deposit', createdAt: new Date().toISOString() }
  return { transaction, data: { ...data, accounts: data.accounts.map((item) => item.id === account.id ? updatedAccount : item), transactions: [transaction, ...data.transactions] } }
}

export const createWithdrawal = (data: BankData, payload: { accountId: string; amount: number; description: string }) => {
  requirePositiveAmount(payload.amount)
  const account = getAccount(data, payload.accountId)
  ensureOperationalAccount(account)
  if (account.balance < payload.amount) throw new Error('Insufficient balance for this withdrawal.')
  const updatedAccount = { ...account, balance: account.balance - payload.amount }
  const transaction = { id: generateTransactionRowId(data.transactions), transactionId: generateTransactionId(data.transactions), accountId: account.id, type: 'withdrawal' as const, amount: payload.amount, balanceAfter: updatedAccount.balance, description: payload.description.trim() || 'Cash withdrawal', createdAt: new Date().toISOString() }
  return { transaction, data: { ...data, accounts: data.accounts.map((item) => item.id === account.id ? updatedAccount : item), transactions: [transaction, ...data.transactions] } }
}

export const createTransfer = (data: BankData, payload: { sourceAccountId: string; destinationAccountId: string; amount: number; description: string }) => {
  requirePositiveAmount(payload.amount)
  if (payload.sourceAccountId === payload.destinationAccountId) throw new Error('Source and destination accounts must be different.')
  const sourceAccount = getAccount(data, payload.sourceAccountId)
  const destinationAccount = getAccount(data, payload.destinationAccountId)
  ensureOperationalAccount(sourceAccount)
  ensureOperationalAccount(destinationAccount)
  if (sourceAccount.balance < payload.amount) throw new Error('Insufficient balance for this transfer.')

  const updatedSource = { ...sourceAccount, balance: sourceAccount.balance - payload.amount }
  const updatedDestination = { ...destinationAccount, balance: destinationAccount.balance + payload.amount }
  const baseDescription = payload.description.trim() || 'Fund transfer'
  const transferOut = { id: generateTransactionRowId(data.transactions), transactionId: generateTransactionId(data.transactions), accountId: sourceAccount.id, type: 'transfer_out' as const, amount: payload.amount, balanceAfter: updatedSource.balance, description: `${baseDescription} to ${destinationAccount.accountNumber}`, relatedAccountId: destinationAccount.id, createdAt: new Date().toISOString() }
  const transferIn = { id: generateTransactionRowId([...data.transactions, transferOut]), transactionId: generateTransactionId([...data.transactions, transferOut]), accountId: destinationAccount.id, type: 'transfer_in' as const, amount: payload.amount, balanceAfter: updatedDestination.balance, description: `${baseDescription} from ${sourceAccount.accountNumber}`, relatedAccountId: sourceAccount.id, createdAt: transferOut.createdAt }
  return { transactions: [transferOut, transferIn], data: { ...data, accounts: data.accounts.map((account) => account.id === updatedSource.id ? updatedSource : account.id === updatedDestination.id ? updatedDestination : account), transactions: [transferIn, transferOut, ...data.transactions] } }
}

export const addServiceRequest = (data: BankData, payload: Pick<ServiceRequest, 'customerId' | 'type' | 'subject' | 'description'>) => {
  getCustomer(data, payload.customerId)
  if (!payload.subject.trim() || !payload.description.trim()) throw new Error('Subject and description are required.')
  const request: ServiceRequest = { id: generateServiceRequestId(data.serviceRequests), customerId: payload.customerId, type: payload.type, subject: payload.subject.trim(), description: payload.description.trim(), status: 'open', createdAt: new Date().toISOString() }
  return { request, data: { ...data, serviceRequests: [request, ...data.serviceRequests] } }
}

export const updateServiceRequestStatus = (data: BankData, requestId: string, status: ServiceRequestStatus) => {
  let updatedRequest: ServiceRequest | undefined
  const serviceRequests = data.serviceRequests.map((request) => {
    if (request.id !== requestId) return request
    updatedRequest = { ...request, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined }
    return updatedRequest
  })
  if (!updatedRequest) throw new Error('Service request not found.')
  return { data: { ...data, serviceRequests }, request: updatedRequest }
}

export const createUser = (data: BankData, payload: Pick<User, 'username' | 'password' | 'name' | 'role'>) => {
  if (!payload.username.trim() || !payload.password.trim() || !payload.name.trim()) throw new Error('All user fields are required.')
  if (data.users.some((user) => normalise(user.username) === normalise(payload.username))) throw new Error('Username already exists.')
  const user: User = { id: generateUserId(data.users), username: payload.username.trim(), password: payload.password.trim(), name: payload.name.trim(), role: payload.role, createdAt: new Date().toISOString() }
  return { user, data: { ...data, users: [user, ...data.users] } }
}

import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Role = 'Admin' | 'Manager' | 'Cashier' | 'CSR'
type CustomerStatus = 'Active' | 'Inactive' | 'Dormant'
type AccountType = 'Savings' | 'Current'
type AccountStatus = 'Active' | 'Frozen' | 'Closed'
type TransactionType = 'Deposit' | 'Withdrawal' | 'Transfer'
type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved'
type Tab = 'dashboard' | 'customers' | 'accounts' | 'transactions' | 'service' | 'reports' | 'security'

type Customer = {
  id: number
  customerCode: string
  cnic: string
  name: string
  fatherName: string
  dob: string
  phone: string
  address: string
  status: CustomerStatus
  createdAt: string
}

type Account = {
  id: number
  accountNumber: string
  customerId: number
  type: AccountType
  balance: number
  status: AccountStatus
  openedAt: string
}

type Transaction = {
  id: number
  type: TransactionType
  accountId: number
  customerId: number
  amount: number
  balanceAfter: number
  description: string
  reference: string
  timestamp: string
  fromAccountId?: number
  toAccountId?: number
  counterparty?: string
}

type Complaint = {
  id: number
  customerId: number
  subject: string
  description: string
  status: ComplaintStatus
  createdAt: string
}

type UserProfile = {
  id: number
  username: string
  password: string
  role: Role
  fullName: string
}

type ActivityEntry = {
  id: number
  user: string
  action: string
  time: string
}

type BankDatabase = {
  customers: Customer[]
  accounts: Account[]
  transactions: Transaction[]
  complaints: Complaint[]
  users: UserProfile[]
  activityLog: ActivityEntry[]
}

const STORAGE_KEY = 'bank-management-demo-v1'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'customers', label: 'Customers' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'service', label: 'CSR' },
  { id: 'reports', label: 'Reports' },
  { id: 'security', label: 'Security' },
]

const defaultUsers: UserProfile[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin', fullName: 'Aisha Rahman' },
  { id: 2, username: 'manager', password: 'manager123', role: 'Manager', fullName: 'Naeem Hassan' },
  { id: 3, username: 'cashier', password: 'cashier123', role: 'Cashier', fullName: 'Sara Iqbal' },
  { id: 4, username: 'csr', password: 'csr123', role: 'CSR', fullName: 'Hamza Tariq' },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

const seedCustomers: Customer[] = [
  {
    id: 1,
    customerCode: 'C-1001',
    cnic: '42101-1234567-1',
    name: 'Ali Khan',
    fatherName: 'Rashid Khan',
    dob: '1988-05-14',
    phone: '+92-300-1234567',
    address: 'Gulshan-e-Iqbal, Karachi',
    status: 'Active',
    createdAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 2,
    customerCode: 'C-1002',
    cnic: '42101-7654321-4',
    name: 'Mariam Noor',
    fatherName: 'Asif Noor',
    dob: '1992-11-26',
    phone: '+92-321-7654321',
    address: 'Clifton, Karachi',
    status: 'Active',
    createdAt: '2024-02-02T11:00:00.000Z',
  },
  {
    id: 3,
    customerCode: 'C-1003',
    cnic: '42101-3344556-9',
    name: 'Usman Ali',
    fatherName: 'Farhan Ali',
    dob: '1985-08-07',
    phone: '+92-333-4455667',
    address: 'Defence, Karachi',
    status: 'Dormant',
    createdAt: '2023-12-12T13:45:00.000Z',
  },
]

const seedAccounts: Account[] = [
  {
    id: 1,
    accountNumber: 'BA-1010001',
    customerId: 1,
    type: 'Savings',
    balance: 185000,
    status: 'Active',
    openedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 2,
    accountNumber: 'BA-1010002',
    customerId: 2,
    type: 'Current',
    balance: 265500,
    status: 'Active',
    openedAt: '2024-02-08T10:00:00.000Z',
  },
  {
    id: 3,
    accountNumber: 'BA-1010003',
    customerId: 3,
    type: 'Savings',
    balance: 92000,
    status: 'Frozen',
    openedAt: '2023-12-18T08:30:00.000Z',
  },
]

const seedTransactions: Transaction[] = [
  {
    id: 1,
    type: 'Deposit',
    accountId: 1,
    customerId: 1,
    amount: 40000,
    balanceAfter: 185000,
    description: 'Monthly salary credit',
    reference: 'DEP-2024-0001',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'Withdrawal',
    accountId: 2,
    customerId: 2,
    amount: 15000,
    balanceAfter: 265500,
    description: 'ATM cash withdrawal',
    reference: 'WDL-2024-0002',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 3,
    type: 'Transfer',
    accountId: 2,
    customerId: 2,
    amount: 24000,
    balanceAfter: 245500,
    description: 'Transfer to account BA-1010003',
    reference: 'TRF-2024-0003',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    fromAccountId: 2,
    toAccountId: 3,
    counterparty: 'BA-1010003',
  },
  {
    id: 4,
    type: 'Deposit',
    accountId: 3,
    customerId: 3,
    amount: 22000,
    balanceAfter: 92000,
    description: 'Cash deposit',
    reference: 'DEP-2024-0004',
    timestamp: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
]

const seedComplaints: Complaint[] = [
  {
    id: 1,
    customerId: 1,
    subject: 'Debit card renewal',
    description: 'Customer requested a replacement debit card at Gulshan branch.',
    status: 'Resolved',
    createdAt: '2024-03-21T08:00:00.000Z',
  },
  {
    id: 2,
    customerId: 2,
    subject: 'Statement request',
    description: 'Needs last 6 months account statement for tax filing.',
    status: 'In Progress',
    createdAt: '2024-04-03T15:00:00.000Z',
  },
]

const seedActivity: ActivityEntry[] = [
  { id: 1, user: 'Aisha Rahman', action: 'Opened branch dashboard for today', time: new Date().toISOString() },
  { id: 2, user: 'Sara Iqbal', action: 'Processed deposit for Ali Khan', time: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, user: 'Hamza Tariq', action: 'Reviewed customer complaint status', time: new Date(Date.now() - 2 * 3600000).toISOString() },
]

const seedData = (): BankDatabase => ({
  customers: seedCustomers,
  accounts: seedAccounts,
  transactions: seedTransactions,
  complaints: seedComplaints,
  users: defaultUsers,
  activityLog: seedActivity,
})

const getCustomerById = (customers: Customer[], customerId: number) =>
  customers.find((customer) => customer.id === customerId)

const getAccountById = (accounts: Account[], accountId: number) =>
  accounts.find((account) => account.id === accountId)

const buildReceipt = (transaction: Transaction, customer: Customer | undefined, account: Account | undefined) => {
  const time = new Date(transaction.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return [
    'Bank Management System Receipt',
    '',
    `Transaction ID: ${transaction.reference}`,
    `Date & Time: ${time}`,
    `Customer: ${customer?.name ?? 'Unknown Customer'}`,
    `Account: ${account?.accountNumber ?? 'N/A'}`,
    `Type: ${transaction.type}`,
    `Amount: ${formatCurrency(transaction.amount)}`,
    `Balance After: ${formatCurrency(transaction.balanceAfter)}`,
    `Description: ${transaction.description}`,
    '',
    'Thank you for banking with ITMANGEMENT.',
  ].join('\n')
}

function App() {
  const [bankData, setBankData] = useState<BankDatabase>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as BankDatabase) : seedData()
    } catch {
      return seedData()
    }
  })
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [globalSearch, setGlobalSearch] = useState('')
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(defaultUsers[0])
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' })
  const [loginMessage, setLoginMessage] = useState('')

  const [customerForm, setCustomerForm] = useState({
    customerCode: '',
    cnic: '',
    name: '',
    fatherName: '',
    dob: '',
    phone: '',
    address: '',
    status: 'Active' as CustomerStatus,
  })
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({})

  const [accountForm, setAccountForm] = useState({
    customerId: '',
    type: 'Savings' as AccountType,
    openingBalance: '',
    status: 'Active' as AccountStatus,
  })
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({})

  const [transactionMode, setTransactionMode] = useState<TransactionType>('Deposit')
  const [transactionForm, setTransactionForm] = useState({
    accountId: '',
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  })
  const [transactionErrors, setTransactionErrors] = useState<Record<string, string>>({})

  const [complaintForm, setComplaintForm] = useState({ customerId: '', subject: '', description: '' })
  const [complaintErrors, setComplaintErrors] = useState<Record<string, string>>({})

  const [reportType, setReportType] = useState('daily')
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Cashier' as Role, fullName: '' })
  const [userErrors, setUserErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bankData))
  }, [bankData])

  const recordActivity = (action: string, userName = sessionUser?.fullName ?? 'System') => {
    setBankData((current) => ({
      ...current,
      activityLog: [
        { id: Date.now(), user: userName, action, time: new Date().toISOString() },
        ...current.activityLog,
      ].slice(0, 15),
    }))
  }

  const customerSearchTerm = globalSearch.trim().toLowerCase()

  const customerRows = useMemo(
    () =>
      bankData.customers.filter((customer) => {
        if (!customerSearchTerm) return true
        return (
          customer.name.toLowerCase().includes(customerSearchTerm) ||
          customer.customerCode.toLowerCase().includes(customerSearchTerm) ||
          customer.cnic.toLowerCase().includes(customerSearchTerm)
        )
      }),
    [bankData.customers, customerSearchTerm],
  )

  const accountRows = useMemo(
    () =>
      bankData.accounts.filter((account) => {
        const customer = getCustomerById(bankData.customers, account.customerId)
        if (!customerSearchTerm) return true
        return (
          account.accountNumber.toLowerCase().includes(customerSearchTerm) ||
          customer?.name.toLowerCase().includes(customerSearchTerm) ||
          customer?.cnic.toLowerCase().includes(customerSearchTerm)
        )
      }),
    [bankData.accounts, bankData.customers, customerSearchTerm],
  )

  const transactionsRows = useMemo(
    () =>
      bankData.transactions.filter((transaction) => {
        const customer = getCustomerById(bankData.customers, transaction.customerId)
        if (!customerSearchTerm) return true
        return (
          transaction.reference.toLowerCase().includes(customerSearchTerm) ||
          transaction.description.toLowerCase().includes(customerSearchTerm) ||
          customer?.name.toLowerCase().includes(customerSearchTerm)
        )
      }),
    [bankData.customers, bankData.transactions, customerSearchTerm],
  )

  const dashboardStats = useMemo(() => {
    const totalDeposits = bankData.transactions
      .filter((entry) => entry.type === 'Deposit')
      .reduce((sum, entry) => sum + entry.amount, 0)
    const totalWithdrawals = bankData.transactions
      .filter((entry) => entry.type === 'Withdrawal')
      .reduce((sum, entry) => sum + entry.amount, 0)
    const today = new Date().toDateString()
    const todaysTransactions = bankData.transactions.filter(
      (entry) => new Date(entry.timestamp).toDateString() === today,
    ).length

    return {
      totalAccounts: bankData.accounts.length,
      totalDeposits,
      totalWithdrawals,
      todaysTransactions,
    }
  }, [bankData.accounts.length, bankData.transactions])

  const activeCustomer =
    bankData.customers.find(
      (customer) =>
        customer.name.toLowerCase() === customerSearchTerm ||
        customer.customerCode.toLowerCase() === customerSearchTerm,
    ) ?? null

  const reportRows = useMemo(() => {
    switch (reportType) {
      case 'daily':
        return bankData.transactions.map((transaction) => ({
          Date: new Date(transaction.timestamp).toLocaleDateString(),
          Type: transaction.type,
          Ref: transaction.reference,
          Amount: formatCurrency(transaction.amount),
          Customer: getCustomerById(bankData.customers, transaction.customerId)?.name ?? 'Unknown',
        }))
      case 'deposits':
        return bankData.transactions
          .filter((entry) => entry.type === 'Deposit')
          .map((transaction) => ({
            Date: new Date(transaction.timestamp).toLocaleDateString(),
            Account: getAccountById(bankData.accounts, transaction.accountId)?.accountNumber ?? 'N/A',
            Customer: getCustomerById(bankData.customers, transaction.customerId)?.name ?? 'Unknown',
            Amount: formatCurrency(transaction.amount),
          }))
      case 'withdrawals':
        return bankData.transactions
          .filter((entry) => entry.type === 'Withdrawal')
          .map((transaction) => ({
            Date: new Date(transaction.timestamp).toLocaleDateString(),
            Account: getAccountById(bankData.accounts, transaction.accountId)?.accountNumber ?? 'N/A',
            Customer: getCustomerById(bankData.customers, transaction.customerId)?.name ?? 'Unknown',
            Amount: formatCurrency(transaction.amount),
          }))
      case 'accounts':
        return bankData.accounts.map((account) => ({
          Account: account.accountNumber,
          Customer: getCustomerById(bankData.customers, account.customerId)?.name ?? 'Unknown',
          Type: account.type,
          Status: account.status,
          Balance: formatCurrency(account.balance),
        }))
      case 'customers':
        return bankData.customers.map((customer) => ({
          Customer: customer.name,
          CNIC: customer.cnic,
          Phone: customer.phone,
          Status: customer.status,
          'Account(s)': bankData.accounts.filter((account) => account.customerId === customer.id).length,
        }))
      case 'profit': {
        const interest = bankData.accounts.reduce((sum, account) => sum + account.balance * 0.032, 0)
        return [{
          'Estimated Monthly Interest': formatCurrency(interest),
          'Total Deposits': formatCurrency(dashboardStats.totalDeposits),
          'Total Accounts': bankData.accounts.length,
        }]
      }
      default:
        return []
    }
  }, [bankData, dashboardStats.totalDeposits, reportType])

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const matchUser = bankData.users.find(
      (user) => user.username === loginForm.username && user.password === loginForm.password,
    )

    if (!matchUser) {
      setLoginMessage('Invalid username or password.')
      return
    }

    setSessionUser(matchUser)
    setLoginMessage('')
    recordActivity(`Logged in as ${matchUser.fullName}`, matchUser.fullName)
  }

  const handleLogout = () => {
    if (sessionUser) {
      recordActivity('Logged out from bank console', sessionUser.fullName)
    }
    setSessionUser(null)
  }

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    const trimmedCnic = customerForm.cnic.trim()
    const trimmedName = customerForm.name.trim()
    const trimmedFather = customerForm.fatherName.trim()
    const trimmedPhone = customerForm.phone.trim()
    const trimmedAddress = customerForm.address.trim()

    if (!trimmedCnic) errors.cnic = 'CNIC is required.'
    if (!trimmedName) errors.name = 'Name is required.'
    if (!trimmedFather) errors.fatherName = "Father's name is required."
    if (!customerForm.dob) errors.dob = 'Date of birth is required.'
    if (!trimmedPhone) errors.phone = 'Phone is required.'
    if (!trimmedAddress) errors.address = 'Address is required.'

    if (bankData.customers.some((customer) => customer.cnic === trimmedCnic)) {
      errors.cnic = 'This CNIC already exists.'
    }

    if (Object.keys(errors).length > 0) {
      setCustomerErrors(errors)
      return
    }

    const newCustomer: Customer = {
      id: Date.now(),
      customerCode: customerForm.customerCode || `C-${String(bankData.customers.length + 1001)}`,
      cnic: trimmedCnic,
      name: trimmedName,
      fatherName: trimmedFather,
      dob: customerForm.dob,
      phone: trimmedPhone,
      address: trimmedAddress,
      status: customerForm.status,
      createdAt: new Date().toISOString(),
    }

    setBankData((current) => ({ ...current, customers: [newCustomer, ...current.customers] }))
    setCustomerErrors({})
    setCustomerForm({
      customerCode: '',
      cnic: '',
      name: '',
      fatherName: '',
      dob: '',
      phone: '',
      address: '',
      status: 'Active',
    })
    recordActivity(`Added customer ${newCustomer.name}`, sessionUser?.fullName)
    setActiveTab('customers')
  }

  const handleOpenAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    const openingBalance = Number(accountForm.openingBalance)

    if (!accountForm.customerId) errors.customerId = 'Select a customer.'
    if (!accountForm.openingBalance || Number.isNaN(openingBalance) || openingBalance <= 0) {
      errors.openingBalance = 'Opening balance must be greater than zero.'
    }

    if (Object.keys(errors).length > 0) {
      setAccountErrors(errors)
      return
    }

    const nextAccountNumber = `BA-${String(bankData.accounts.length + 1010001)}`
    const customer = getCustomerById(bankData.customers, Number(accountForm.customerId))

    if (!customer) {
      setAccountErrors({ customerId: 'Customer not found.' })
      return
    }

    const freshAccount: Account = {
      id: Date.now(),
      accountNumber: nextAccountNumber,
      customerId: Number(accountForm.customerId),
      type: accountForm.type,
      balance: openingBalance,
      status: accountForm.status,
      openedAt: new Date().toISOString(),
    }

    setBankData((current) => ({
      ...current,
      accounts: [freshAccount, ...current.accounts],
      transactions: [
        {
          id: Date.now() + 1,
          type: 'Deposit',
          accountId: freshAccount.id,
          customerId: customer.id,
          amount: openingBalance,
          balanceAfter: openingBalance,
          description: `Opening balance for ${freshAccount.type} account`,
          reference: `OPN-${freshAccount.accountNumber}`,
          timestamp: new Date().toISOString(),
        },
        ...current.transactions,
      ],
    }))

    setAccountForm({ customerId: '', type: 'Savings', openingBalance: '', status: 'Active' })
    setAccountErrors({})
    recordActivity(`Opened account ${freshAccount.accountNumber} for ${customer.name}`, sessionUser?.fullName)
    setActiveTab('accounts')
  }

  const handleTransactionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    const amount = Number(transactionForm.amount)

    if (!transactionForm.amount || Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be greater than zero.'
    }

    if (transactionMode === 'Transfer') {
      if (!transactionForm.fromAccountId) errors.fromAccountId = 'Select source account.'
      if (!transactionForm.toAccountId) errors.toAccountId = 'Select destination account.'
      if (transactionForm.fromAccountId === transactionForm.toAccountId) {
        errors.toAccountId = 'Destination account must differ from source.'
      }
    } else if (!transactionForm.accountId) {
      errors.accountId = 'Select an account.'
    }

    if (transactionMode !== 'Transfer' && transactionForm.accountId) {
      const account = getAccountById(bankData.accounts, Number(transactionForm.accountId))
      if (account && transactionMode === 'Withdrawal' && account.balance < amount) {
        errors.amount = 'Insufficient balance for withdrawal.'
      }
    }

    if (transactionMode === 'Transfer' && transactionForm.fromAccountId) {
      const sourceAccount = getAccountById(bankData.accounts, Number(transactionForm.fromAccountId))
      if (sourceAccount && sourceAccount.balance < amount) {
        errors.amount = 'Source account has insufficient funds.'
      }
    }

    if (Object.keys(errors).length > 0) {
      setTransactionErrors(errors)
      return
    }

    const sourceAccount =
      transactionMode === 'Transfer'
        ? getAccountById(bankData.accounts, Number(transactionForm.fromAccountId))
        : getAccountById(bankData.accounts, Number(transactionForm.accountId))
    const targetAccount =
      transactionMode === 'Transfer' ? getAccountById(bankData.accounts, Number(transactionForm.toAccountId)) : null

    if (!sourceAccount) {
      setTransactionErrors({ accountId: 'Account not found.' })
      return
    }

    if (transactionMode === 'Transfer' && !targetAccount) {
      setTransactionErrors({ toAccountId: 'Destination account not found.' })
      return
    }

    const transactionTimestamp = new Date().toISOString()

    setBankData((current) => {
      const updatedAccounts = current.accounts.map((account) => {
        if (transactionMode === 'Deposit' && account.id === Number(transactionForm.accountId)) {
          return { ...account, balance: account.balance + amount }
        }

        if (transactionMode === 'Withdrawal' && account.id === Number(transactionForm.accountId)) {
          return { ...account, balance: account.balance - amount }
        }

        if (transactionMode === 'Transfer') {
          if (account.id === Number(transactionForm.fromAccountId)) {
            return { ...account, balance: account.balance - amount }
          }

          if (account.id === Number(transactionForm.toAccountId)) {
            return { ...account, balance: account.balance + amount }
          }
        }

        return account
      })

      const transactionReference = `${transactionMode.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`
      const newTransaction: Transaction = {
        id: Date.now(),
        type: transactionMode,
        accountId: sourceAccount.id,
        customerId: sourceAccount.customerId,
        amount,
        balanceAfter:
          transactionMode === 'Deposit'
            ? sourceAccount.balance + amount
            : transactionMode === 'Withdrawal'
              ? sourceAccount.balance - amount
              : sourceAccount.balance - amount,
        description:
          transactionMode === 'Deposit'
            ? 'Cash deposit'
            : transactionMode === 'Withdrawal'
              ? 'Cash withdrawal'
              : `Transfer to ${targetAccount?.accountNumber ?? 'account'}`,
        reference: transactionReference,
        timestamp: transactionTimestamp,
        fromAccountId: transactionMode === 'Transfer' ? sourceAccount.id : undefined,
        toAccountId: transactionMode === 'Transfer' ? targetAccount?.id : undefined,
        counterparty: transactionMode === 'Transfer' ? targetAccount?.accountNumber : undefined,
      }

      return {
        ...current,
        accounts: updatedAccounts,
        transactions: [newTransaction, ...current.transactions],
      }
    })

    const summaryAction =
      transactionMode === 'Deposit'
        ? `Processed deposit of ${formatCurrency(amount)}`
        : transactionMode === 'Withdrawal'
          ? `Processed withdrawal of ${formatCurrency(amount)}`
          : `Transferred ${formatCurrency(amount)} between accounts`

    recordActivity(summaryAction, sessionUser?.fullName)
    setTransactionForm({ accountId: '', fromAccountId: '', toAccountId: '', amount: '', description: '' })
    setTransactionErrors({})
    setActiveTab('transactions')
  }

  const handleComplaintSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}

    if (!complaintForm.customerId) errors.customerId = 'Select a customer.'
    if (!complaintForm.subject.trim()) errors.subject = 'Subject is required.'
    if (!complaintForm.description.trim()) errors.description = 'Description is required.'

    if (Object.keys(errors).length > 0) {
      setComplaintErrors(errors)
      return
    }

    const newComplaint: Complaint = {
      id: Date.now(),
      customerId: Number(complaintForm.customerId),
      subject: complaintForm.subject.trim(),
      description: complaintForm.description.trim(),
      status: 'Open',
      createdAt: new Date().toISOString(),
    }

    setBankData((current) => ({ ...current, complaints: [newComplaint, ...current.complaints] }))
    setComplaintForm({ customerId: '', subject: '', description: '' })
    setComplaintErrors({})
    recordActivity(`Logged complaint: ${newComplaint.subject}`, sessionUser?.fullName)
  }

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    const username = userForm.username.trim()
    const fullName = userForm.fullName.trim()
    const password = userForm.password.trim()

    if (!fullName) errors.fullName = 'Full name is required.'
    if (!username) errors.username = 'Username is required.'
    if (password.length < 6) errors.password = 'Password must be at least 6 characters.'

    if (bankData.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      errors.username = 'Username already exists.'
    }

    if (Object.keys(errors).length > 0) {
      setUserErrors(errors)
      return
    }

    const newUser: UserProfile = {
      id: Date.now(),
      username,
      password,
      role: userForm.role,
      fullName,
    }

    setBankData((current) => ({ ...current, users: [newUser, ...current.users] }))
    setUserForm({ username: '', password: '', role: 'Cashier', fullName: '' })
    setUserErrors({})
    recordActivity(`Created new user ${newUser.username}`, sessionUser?.fullName)
  }

  const updateComplaintStatus = (complaintId: number, status: ComplaintStatus) => {
    setBankData((current) => ({
      ...current,
      complaints: current.complaints.map((complaint) =>
        complaint.id === complaintId ? { ...complaint, status } : complaint,
      ),
    }))
    recordActivity(`Updated complaint status to ${status}`, sessionUser?.fullName)
  }

  const printReceipt = (transaction: Transaction) => {
    const customer = getCustomerById(bankData.customers, transaction.customerId)
    const account = getAccountById(bankData.accounts, transaction.accountId)
    const receiptBody = buildReceipt(transaction, customer, account)
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (!printWindow) return

    printWindow.document.write(
      `<!doctype html><html><head><title>Bank Receipt</title><style>body{font-family:Arial,sans-serif;padding:24px;line-height:1.7;white-space:pre-wrap}</style></head><body>${receiptBody}</body></html>`,
    )
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 250)
  }

  const exportCsv = (rows: Array<Record<string, string | number | boolean>>) => {
    if (!rows.length) return

    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`)
          .join(','),
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bank-report-${reportType}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const isAdmin = sessionUser?.role === 'Admin'
  const activeAccount = accountRows[0] ?? null

  return (
    <div className="bank-shell">
      <div className="bank-layout">
        <aside className="sidebar">
          <div className="brand-block">
            <div className="brand-mark">B</div>
            <div>
              <p className="eyebrow">Bank</p>
              <h1>ITMANGEMENT</h1>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Main navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'nav-item active' : 'nav-item'}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <span className="label">Session</span>
            <strong>{sessionUser?.fullName ?? 'Guest'}</strong>
            <span className="tag">{sessionUser?.role ?? 'Not signed in'}</span>
            <a
              className="opencode-link"
              href="https://opencode.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit opencode.com"
            >
              opencode.com
            </a>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="search-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                placeholder="Search customer, account or txn"
              />
            </div>

            <div className="topbar-actions">
              <button type="button" className="icon-button" aria-label="Notifications">
                🔔
              </button>
              <button type="button" className="icon-button" aria-label="Messages">
                ✉️
              </button>
              {sessionUser ? (
                <button type="button" className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button type="button" className="logout-button" onClick={() => setActiveTab('security')}>
                  Login
                </button>
              )}
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Overview</p>
                  <h2>Banking Dashboard</h2>
                </div>
                <button type="button" className="primary-button" onClick={() => setActiveTab('transactions')}>
                  New Transaction
                </button>
              </div>

              <div className="stats-grid">
                <div className="metric-card blue">
                  <span>Total Accounts</span>
                  <strong>{dashboardStats.totalAccounts}</strong>
                  <small>Across active portfolios</small>
                </div>
                <div className="metric-card green">
                  <span>Total Deposits</span>
                  <strong>{formatCurrency(dashboardStats.totalDeposits)}</strong>
                  <small>Current month flow</small>
                </div>
                <div className="metric-card amber">
                  <span>Total Withdrawals</span>
                  <strong>{formatCurrency(dashboardStats.totalWithdrawals)}</strong>
                  <small>Cash movement</small>
                </div>
                <div className="metric-card purple">
                  <span>Today's Transactions</span>
                  <strong>{dashboardStats.todaysTransactions}</strong>
                  <small>Daily branch activity</small>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Recent Transactions</h3>
                    <button type="button" className="ghost-button" onClick={() => setActiveTab('transactions')}>
                      View all
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Customer</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankData.transactions.slice(0, 6).map((transaction) => {
                          const customer = getCustomerById(bankData.customers, transaction.customerId)
                          return (
                            <tr key={transaction.id}>
                              <td>{transaction.reference}</td>
                              <td>{customer?.name ?? 'Unknown'}</td>
                              <td>
                                <span className={`status-pill ${transaction.type.toLowerCase()}`}>{transaction.type}</span>
                              </td>
                              <td>{formatCurrency(transaction.amount)}</td>
                              <td>
                                <button type="button" className="text-button" onClick={() => printReceipt(transaction)}>
                                  Receipt
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="quick-actions">
                    <button type="button" className="primary-button" onClick={() => setActiveTab('customers')}>
                      Add Customer
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setActiveTab('accounts')}>
                      Open Account
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setActiveTab('transactions')}>
                      Process Deposit
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setActiveTab('reports')}>
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'customers' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Customer Management</p>
                  <h2>Customers</h2>
                </div>
              </div>

              <div className="two-column-layout">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Add Customer</h3>
                  </div>

                  <form className="form-grid" onSubmit={handleAddCustomer}>
                    <label>
                      Customer ID
                      <input
                        type="text"
                        value={customerForm.customerCode}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, customerCode: event.target.value }))
                        }
                        placeholder="Optional"
                      />
                    </label>
                    <label>
                      CNIC
                      <input
                        type="text"
                        value={customerForm.cnic}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, cnic: event.target.value }))
                        }
                      />
                      {customerErrors.cnic && <span className="field-error">{customerErrors.cnic}</span>}
                    </label>
                    <label>
                      Name
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, name: event.target.value }))
                        }
                      />
                      {customerErrors.name && <span className="field-error">{customerErrors.name}</span>}
                    </label>
                    <label>
                      Father's Name
                      <input
                        type="text"
                        value={customerForm.fatherName}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, fatherName: event.target.value }))
                        }
                      />
                      {customerErrors.fatherName && <span className="field-error">{customerErrors.fatherName}</span>}
                    </label>
                    <label>
                      Date of Birth
                      <input
                        type="date"
                        value={customerForm.dob}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, dob: event.target.value }))
                        }
                      />
                      {customerErrors.dob && <span className="field-error">{customerErrors.dob}</span>}
                    </label>
                    <label>
                      Phone
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, phone: event.target.value }))
                        }
                      />
                      {customerErrors.phone && <span className="field-error">{customerErrors.phone}</span>}
                    </label>
                    <label className="full-span">
                      Address
                      <textarea
                        rows={4}
                        value={customerForm.address}
                        onChange={(event) =>
                          setCustomerForm((current) => ({ ...current, address: event.target.value }))
                        }
                      />
                      {customerErrors.address && <span className="field-error">{customerErrors.address}</span>}
                    </label>
                    <label>
                      Account Status
                      <select
                        value={customerForm.status}
                        onChange={(event) =>
                          setCustomerForm((current) => ({
                            ...current,
                            status: event.target.value as CustomerStatus,
                          }))
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Dormant">Dormant</option>
                      </select>
                    </label>
                    <div className="form-actions full-span">
                      <button type="submit" className="primary-button">
                        Save Customer
                      </button>
                    </div>
                  </form>
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Customer Directory</h3>
                    <span className="pill">{customerRows.length} records</span>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>CNIC</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerRows.map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <div className="customer-cell">
                                <strong>{customer.name}</strong>
                                <small>{customer.customerCode}</small>
                              </div>
                            </td>
                            <td>{customer.cnic}</td>
                            <td>
                              <span className={`status-pill ${customer.status.toLowerCase()}`}>{customer.status}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="text-button"
                                onClick={() => {
                                  setAccountForm((current) => ({ ...current, customerId: String(customer.id) }))
                                  setActiveTab('accounts')
                                }}
                              >
                                Open account
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'accounts' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Accounts</p>
                  <h2>Open New Account</h2>
                </div>
              </div>

              <div className="two-column-layout">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Account Setup</h3>
                  </div>

                  <form className="form-grid" onSubmit={handleOpenAccount}>
                    <label>
                      Customer
                      <select
                        value={accountForm.customerId}
                        onChange={(event) =>
                          setAccountForm((current) => ({ ...current, customerId: event.target.value }))
                        }
                      >
                        <option value="">Select customer</option>
                        {bankData.customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} ({customer.customerCode})
                          </option>
                        ))}
                      </select>
                      {accountErrors.customerId && <span className="field-error">{accountErrors.customerId}</span>}
                    </label>
                    <label>
                      Account Type
                      <select
                        value={accountForm.type}
                        onChange={(event) =>
                          setAccountForm((current) => ({ ...current, type: event.target.value as AccountType }))
                        }
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                      </select>
                    </label>
                    <label>
                      Opening Balance
                      <input
                        type="number"
                        min="1"
                        value={accountForm.openingBalance}
                        onChange={(event) =>
                          setAccountForm((current) => ({ ...current, openingBalance: event.target.value }))
                        }
                      />
                      {accountErrors.openingBalance && (
                        <span className="field-error">{accountErrors.openingBalance}</span>
                      )}
                    </label>
                    <label>
                      Account Status
                      <select
                        value={accountForm.status}
                        onChange={(event) =>
                          setAccountForm((current) => ({ ...current, status: event.target.value as AccountStatus }))
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Frozen">Frozen</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </label>
                    <div className="form-actions full-span">
                      <button type="submit" className="primary-button">
                        Open Account
                      </button>
                    </div>
                  </form>
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Account Details</h3>
                    <span className="pill">{accountRows.length} active accounts</span>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Owner</th>
                          <th>Balance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountRows.map((account) => {
                          const customer = getCustomerById(bankData.customers, account.customerId)
                          return (
                            <tr key={account.id}>
                              <td>{account.accountNumber}</td>
                              <td>{customer?.name ?? 'Unknown'}</td>
                              <td>{formatCurrency(account.balance)}</td>
                              <td>
                                <span className={`status-pill ${account.status.toLowerCase()}`}>{account.status}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {activeAccount && (
                    <div className="statement-box">
                      <h4>Statement preview</h4>
                      <ul>
                        {bankData.transactions
                          .filter((transaction) => transaction.accountId === activeAccount.id)
                          .slice(0, 4)
                          .map((transaction) => (
                            <li key={transaction.id}>
                              <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                              <strong>{transaction.type}</strong>
                              <em>{formatCurrency(transaction.amount)}</em>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'transactions' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Transactions</p>
                  <h2>Cash & Transfer Management</h2>
                </div>
              </div>

              <div className="two-column-layout">
                <div className="panel-card">
                  <div className="transaction-tabs">
                    {(['Deposit', 'Withdrawal', 'Transfer'] as TransactionType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={transactionMode === type ? 'tab-button active' : 'tab-button'}
                        onClick={() => setTransactionMode(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <form className="form-grid" onSubmit={handleTransactionSubmit}>
                    {transactionMode === 'Transfer' ? (
                      <>
                        <label>
                          From Account
                          <select
                            value={transactionForm.fromAccountId}
                            onChange={(event) =>
                              setTransactionForm((current) => ({ ...current, fromAccountId: event.target.value }))
                            }
                          >
                            <option value="">Select source</option>
                            {bankData.accounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.accountNumber} ({formatCurrency(account.balance)})
                              </option>
                            ))}
                          </select>
                          {transactionErrors.fromAccountId && (
                            <span className="field-error">{transactionErrors.fromAccountId}</span>
                          )}
                        </label>
                        <label>
                          To Account
                          <select
                            value={transactionForm.toAccountId}
                            onChange={(event) =>
                              setTransactionForm((current) => ({ ...current, toAccountId: event.target.value }))
                            }
                          >
                            <option value="">Select destination</option>
                            {bankData.accounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.accountNumber} ({formatCurrency(account.balance)})
                              </option>
                            ))}
                          </select>
                          {transactionErrors.toAccountId && (
                            <span className="field-error">{transactionErrors.toAccountId}</span>
                          )}
                        </label>
                      </>
                    ) : (
                      <label>
                        Account
                        <select
                          value={transactionForm.accountId}
                          onChange={(event) =>
                            setTransactionForm((current) => ({ ...current, accountId: event.target.value }))
                          }
                        >
                          <option value="">Select account</option>
                          {bankData.accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.accountNumber} — {getCustomerById(bankData.customers, account.customerId)?.name}
                            </option>
                          ))}
                        </select>
                        {transactionErrors.accountId && (
                          <span className="field-error">{transactionErrors.accountId}</span>
                        )}
                      </label>
                    )}

                    <label>
                      Amount
                      <input
                        type="number"
                        min="1"
                        value={transactionForm.amount}
                        onChange={(event) =>
                          setTransactionForm((current) => ({ ...current, amount: event.target.value }))
                        }
                      />
                      {transactionErrors.amount && <span className="field-error">{transactionErrors.amount}</span>}
                    </label>
                    <label className="full-span">
                      Description
                      <textarea
                        rows={3}
                        value={transactionForm.description}
                        onChange={(event) =>
                          setTransactionForm((current) => ({ ...current, description: event.target.value }))
                        }
                      />
                    </label>
                    <div className="form-actions full-span">
                      <button type="submit" className="primary-button">
                        {transactionMode === 'Deposit'
                          ? 'Submit Deposit'
                          : transactionMode === 'Withdrawal'
                            ? 'Submit Withdrawal'
                            : 'Submit Transfer'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Recent Activity</h3>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Ref</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionsRows.slice(0, 8).map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.reference}</td>
                            <td>{transaction.type}</td>
                            <td>{formatCurrency(transaction.amount)}</td>
                            <td>
                              <button type="button" className="text-button" onClick={() => printReceipt(transaction)}>
                                Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'service' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Customer Service</p>
                  <h2>CSR Desk</h2>
                </div>
              </div>

              <div className="two-column-layout">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Customer Search</h3>
                  </div>
                  <div className="form-grid compact-grid">
                    <label className="full-span">
                      Search by name or customer code
                      <input
                        type="search"
                        value={globalSearch}
                        onChange={(event) => setGlobalSearch(event.target.value)}
                        placeholder="Search customer"
                      />
                    </label>
                  </div>

                  {activeCustomer ? (
                    <div className="customer-detail-box">
                      <h4>{activeCustomer.name}</h4>
                      <p>{activeCustomer.customerCode}</p>
                      <ul>
                        <li>CNIC: {activeCustomer.cnic}</li>
                        <li>Phone: {activeCustomer.phone}</li>
                        <li>Address: {activeCustomer.address}</li>
                        <li>Status: {activeCustomer.status}</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="empty-panel">No matching customer found.</div>
                  )}
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Customer Requests</h3>
                  </div>
                  <form className="form-grid" onSubmit={handleComplaintSubmit}>
                    <label>
                      Customer
                      <select
                        value={complaintForm.customerId}
                        onChange={(event) =>
                          setComplaintForm((current) => ({ ...current, customerId: event.target.value }))
                        }
                      >
                        <option value="">Select customer</option>
                        {bankData.customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                      {complaintErrors.customerId && (
                        <span className="field-error">{complaintErrors.customerId}</span>
                      )}
                    </label>
                    <label className="full-span">
                      Subject
                      <input
                        type="text"
                        value={complaintForm.subject}
                        onChange={(event) =>
                          setComplaintForm((current) => ({ ...current, subject: event.target.value }))
                        }
                      />
                      {complaintErrors.subject && (
                        <span className="field-error">{complaintErrors.subject}</span>
                      )}
                    </label>
                    <label className="full-span">
                      Description
                      <textarea
                        rows={4}
                        value={complaintForm.description}
                        onChange={(event) =>
                          setComplaintForm((current) => ({ ...current, description: event.target.value }))
                        }
                      />
                      {complaintErrors.description && (
                        <span className="field-error">{complaintErrors.description}</span>
                      )}
                    </label>
                    <div className="form-actions full-span">
                      <button type="submit" className="primary-button">
                        File Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3>Complaint Status</h3>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankData.complaints.map((complaint) => {
                        const customer = getCustomerById(bankData.customers, complaint.customerId)
                        return (
                          <tr key={complaint.id}>
                            <td>{customer?.name ?? 'Unknown'}</td>
                            <td>{complaint.subject}</td>
                            <td>
                              <span className={`status-pill ${complaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {complaint.status}
                              </span>
                            </td>
                            <td>
                              <select
                                value={complaint.status}
                                onChange={(event) =>
                                  updateComplaintStatus(complaint.id, event.target.value as ComplaintStatus)
                                }
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'reports' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Reports</p>
                  <h2>Operational Reporting</h2>
                </div>
                <div className="report-actions">
                  <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
                    <option value="daily">Daily transaction report</option>
                    <option value="deposits">Deposit report</option>
                    <option value="withdrawals">Withdrawal report</option>
                    <option value="accounts">Account report</option>
                    <option value="customers">Customer report</option>
                    <option value="profit">Profit/interest report</option>
                  </select>
                  <button type="button" className="primary-button" onClick={() => exportCsv(reportRows)}>
                    Export CSV
                  </button>
                  <button type="button" className="secondary-button" onClick={() => window.print()}>
                    Print/PDF
                  </button>
                </div>
              </div>

              <div className="panel-card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {reportRows[0] && Object.keys(reportRows[0]).map((header) => <th key={header}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {reportRows.map((row, index) => (
                        <tr key={`${String(row[Object.keys(row)[0]] ?? '')}-${index}`}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td key={`${String(cell)}-${cellIndex}`}>{String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="space-y-6">
              <div className="section-header">
                <div>
                  <p className="eyebrow">User & Security</p>
                  <h2>Access Control</h2>
                </div>
              </div>

              {!sessionUser ? (
                <div className="panel-card login-panel">
                  <h3>Secure Login</h3>
                  <form className="form-grid compact-grid" onSubmit={handleLogin}>
                    <label>
                      Username
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(event) =>
                          setLoginForm((current) => ({ ...current, username: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({ ...current, password: event.target.value }))
                        }
                      />
                    </label>
                    <div className="form-actions full-span">
                      <button type="submit" className="primary-button">
                        Login
                      </button>
                    </div>
                    {loginMessage && <p className="status-message error">{loginMessage}</p>}
                  </form>
                </div>
              ) : (
                <div className="two-column-layout">
                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Current Session</h3>
                    </div>
                    <div className="session-card">
                      <div>
                        <span className="eyebrow muted">User</span>
                        <h4>{sessionUser.fullName}</h4>
                      </div>
                      <div className="tag-wrap">
                        <span className="tag strong">{sessionUser.role}</span>
                        <span className="tag muted">{sessionUser.username}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <form className="form-grid" onSubmit={handleAddUser}>
                        <h4>Create New User</h4>
                        <label>
                          Full Name
                          <input
                            type="text"
                            value={userForm.fullName}
                            onChange={(event) =>
                              setUserForm((current) => ({ ...current, fullName: event.target.value }))
                            }
                          />
                          {userErrors.fullName && <span className="field-error">{userErrors.fullName}</span>}
                        </label>
                        <label>
                          Username
                          <input
                            type="text"
                            value={userForm.username}
                            onChange={(event) =>
                              setUserForm((current) => ({ ...current, username: event.target.value }))
                            }
                          />
                          {userErrors.username && <span className="field-error">{userErrors.username}</span>}
                        </label>
                        <label>
                          Password
                          <input
                            type="password"
                            value={userForm.password}
                            onChange={(event) =>
                              setUserForm((current) => ({ ...current, password: event.target.value }))
                            }
                          />
                          {userErrors.password && <span className="field-error">{userErrors.password}</span>}
                        </label>
                        <label>
                          Role
                          <select
                            value={userForm.role}
                            onChange={(event) =>
                              setUserForm((current) => ({ ...current, role: event.target.value as Role }))
                            }
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                            <option value="CSR">CSR</option>
                          </select>
                        </label>
                        <div className="form-actions full-span">
                          <button type="submit" className="primary-button">
                            Create User
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Audit Trail</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankData.activityLog.map((entry) => (
                            <tr key={entry.id}>
                              <td>{entry.user}</td>
                              <td>{entry.action}</td>
                              <td>{new Date(entry.time).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

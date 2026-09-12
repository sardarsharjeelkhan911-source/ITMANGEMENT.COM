import { useEffect, useMemo, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { PrintableReceipt } from './components/PrintableReceipt'
import { Header, PageTitle, Sidebar } from './components/layout'
import { Button, ConfirmDialog, Modal, ToastStack, type TableRow } from './components/ui'
import { useBankStore } from './hooks/useBankStore'
import { AccountsPage } from './pages/AccountsPage'
import { CsrPage } from './pages/CsrPage'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ReportsPage } from './pages/ReportsPage'
import { SecurityPage } from './pages/SecurityPage'
import { TransactionsPage } from './pages/TransactionsPage'
import {
  addCustomer,
  addServiceRequest,
  createDeposit,
  createTransfer,
  createUser,
  createWithdrawal,
  openAccount,
  setAccountStatus,
  setCustomerStatus,
  updateCustomer,
  updateServiceRequestStatus,
} from './services/bankService'
import { appendAuditLog, clearSessionUserId, loadSessionUserId, saveSessionUserId } from './services/storage'
import type { RouteKey, RouteState, SearchResult, User } from './types/bank'
import { formatCurrency, formatDateTime, normalise } from './utils/format'
import { exportElementToPdf } from './utils/export'
import {
  canAccessRoute,
  canManageAccounts,
  canManageCustomers,
  canManageServiceRequests,
  canManageTransactions,
  canManageUsers,
  routes,
} from './utils/rbac'

const pageMeta: Record<RouteKey, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Operational overview, KPIs, and branch quick actions.' },
  customers: { title: 'Customer Management', description: 'Create, search, and maintain customer records.' },
  accounts: { title: 'Accounts', description: 'Open new accounts and review account statements.' },
  transactions: { title: 'Transactions', description: 'Process deposits, withdrawals, transfers, and print receipts.' },
  csr: { title: 'Customer Service', description: 'Balance inquiry, account lookup, and complaint handling.' },
  reports: { title: 'Reports', description: 'Generate exportable daily, operational, and profit reports.' },
  security: { title: 'Users & Audit', description: 'Manage users and inspect role-based activity logs.' },
}

function App() {
  const { bankData, setBankData } = useBankStore()
  const [route, setRoute] = useState<RouteKey>('dashboard')
  const [routeState, setRouteState] = useState<RouteState>({})
  const [sessionUser, setSessionUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin' })
  const [loginError, setLoginError] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: number; tone: 'success' | 'error'; message: string }>>([])
  const [receiptTransactionId, setReceiptTransactionId] = useState<string | null>(null)
  const [confirmState, setConfirmState] = useState<{
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    const sessionId = loadSessionUserId()
    if (!sessionId) return
    const user = bankData.users.find((item) => item.id === sessionId)
    if (user) setSessionUser(user)
  }, [bankData.users])

  useEffect(() => {
    if (!toasts.length) return undefined
    const timer = window.setTimeout(() => setToasts((current) => current.slice(1)), 3200)
    return () => window.clearTimeout(timer)
  }, [toasts])

  const pushToast = (tone: 'success' | 'error', message: string) => {
    setToasts((current) => [...current, { id: Date.now(), tone, message }])
  }

  const openRoute = (nextRoute: RouteKey, nextRouteState: RouteState = {}) => {
    setRoute(nextRoute)
    setRouteState(nextRouteState)
    setGlobalSearch('')
  }

  const handleLogin = () => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginError('Username and password are required.')
      return
    }

    const user = bankData.users.find(
      (candidate) =>
        candidate.username === loginForm.username.trim() && candidate.password === loginForm.password.trim(),
    )

    if (!user) {
      setLoginError('Invalid username or password.')
      pushToast('error', 'Login failed. Please check your credentials.')
      return
    }

    setBankData((current) => appendAuditLog(current, `User logged in (${user.role})`, user))
    saveSessionUserId(user.id)
    setSessionUser(user)
    setLoginError('')
    openRoute('dashboard')
    pushToast('success', `Welcome back, ${user.name}.`)
  }

  const handleLogout = () => {
    if (sessionUser) {
      setBankData((current) => appendAuditLog(current, 'User logged out', sessionUser))
    }
    clearSessionUserId()
    setSessionUser(null)
    setLoginForm({ username: 'admin', password: 'admin' })
    pushToast('success', 'You have been logged out.')
  }

  const accessibleRoutes = sessionUser ? routes.filter((item) => canAccessRoute(sessionUser.role, item.key)) : []
  const isRouteAllowed = sessionUser ? canAccessRoute(sessionUser.role, route) : false

  const dashboardStats = useMemo(() => {
    const totalDeposits = bankData.transactions
      .filter((transaction) => transaction.type === 'deposit')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const totalWithdrawals = bankData.transactions
      .filter((transaction) => transaction.type === 'withdrawal')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const today = new Date().toISOString().slice(0, 10)
    const todaysTransactions = bankData.transactions.filter(
      (transaction) => transaction.createdAt.slice(0, 10) === today,
    )

    return {
      totalAccounts: bankData.accounts.length,
      totalDeposits,
      totalWithdrawals,
      todaysCount: todaysTransactions.length,
      todaysAmount: todaysTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    }
  }, [bankData.accounts.length, bankData.transactions])

  const recentTransactions: TableRow[] = useMemo(
    () =>
      [...bankData.transactions]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 10)
        .map((transaction) => {
          const account = bankData.accounts.find((item) => item.id === transaction.accountId)
          const customer = bankData.customers.find((item) => item.id === account?.customerId)
          return {
            id: transaction.id,
            raw: { amount: transaction.amount, createdAt: transaction.createdAt },
            cells: {
              transactionId: transaction.transactionId,
              customer: customer?.name ?? 'Unknown',
              type: transaction.type,
              amount: formatCurrency(transaction.amount),
              createdAt: formatDateTime(transaction.createdAt),
            },
          }
        }),
    [bankData.accounts, bankData.customers, bankData.transactions],
  )

  const globalSearchResults = useMemo<SearchResult[]>(() => {
    const term = normalise(globalSearch)
    if (!term) return []

    const customerResults = bankData.customers
      .filter((customer) =>
        [customer.name, customer.cnic, customer.phone].some((value) => normalise(value).includes(term)),
      )
      .slice(0, 4)
      .map((customer) => ({
        id: `customer-${customer.id}`,
        title: customer.name,
        description: `${customer.cnic} · ${customer.phone}`,
        route: 'customers' as const,
        routeState: { selectedCustomerId: customer.id },
      }))

    const accountResults = bankData.accounts
      .filter((account) => normalise(account.accountNumber).includes(term))
      .slice(0, 4)
      .map((account) => ({
        id: `account-${account.id}`,
        title: account.accountNumber,
        description: `Balance ${formatCurrency(account.balance)} · ${account.status}`,
        route: 'accounts' as const,
        routeState: { selectedAccountId: account.id },
      }))

    return [...customerResults, ...accountResults]
  }, [bankData.accounts, bankData.customers, globalSearch])

  const notifications = useMemo(
    () => [
      ...bankData.serviceRequests
        .filter((request) => request.status !== 'resolved')
        .slice(0, 3)
        .map((request) => ({
          id: request.id,
          label: `${request.type} · ${request.subject}`,
          meta: `Status: ${request.status}`,
        })),
      ...bankData.auditLogs.slice(0, 2).map((log) => ({
        id: log.id,
        label: log.action,
        meta: formatDateTime(log.createdAt),
      })),
    ],
    [bankData.auditLogs, bankData.serviceRequests],
  )

  const receiptTransaction = receiptTransactionId
    ? bankData.transactions.find((transaction) => transaction.id === receiptTransactionId)
    : null
  const receiptAccount = receiptTransaction
    ? bankData.accounts.find((account) => account.id === receiptTransaction.accountId)
    : null
  const receiptCustomer = receiptAccount
    ? bankData.customers.find((customer) => customer.id === receiptAccount.customerId)
    : null

  if (!sessionUser) {
    return (
      <>
        <LoginPage
          error={loginError}
          onSubmit={handleLogin}
          password={loginForm.password}
          setPassword={(password) => setLoginForm((current) => ({ ...current, password }))}
          setUsername={(username) => setLoginForm((current) => ({ ...current, username }))}
          username={loginForm.username}
        />
        <ToastStack toasts={toasts} />
      </>
    )
  }

  const canEditCustomers = canManageCustomers(sessionUser.role)
  const canEditAccounts = canManageAccounts(sessionUser.role)
  const canDoTransactions = canManageTransactions(sessionUser.role)
  const canEditTickets = canManageServiceRequests(sessionUser.role)
  const canCreateUsers = canManageUsers(sessionUser.role)
  const pageTitle = pageMeta[route]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activeRoute={route}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onNavigate={(nextRoute) => openRoute(nextRoute as RouteKey)}
        routes={accessibleRoutes}
        user={sessionUser}
      />
      <div className="lg:pl-72">
        <Header
          notifications={notifications}
          onLogout={handleLogout}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onSearchSelect={(result) => openRoute(result.route, result.routeState)}
          search={globalSearch}
          searchResults={globalSearchResults}
          setSearch={setGlobalSearch}
          title={<PageTitle title={pageTitle.title} description={pageTitle.description} />}
          user={sessionUser}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {!isRouteAllowed ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-900">Access Denied</h2>
                <p className="mt-3 text-sm text-slate-500">
                  Your {sessionUser.role.toUpperCase()} role cannot open this module. Please return to the
                  dashboard or contact an administrator.
                </p>
                <Button className="mt-6" onClick={() => openRoute('dashboard')} type="button">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : null}

          {isRouteAllowed && route === 'dashboard' ? (
            <DashboardPage
              accounts={bankData.accounts}
              onQuickAction={(action) => {
                if (action === 'customer') {
                  openRoute('customers')
                  return
                }
                if (action === 'account') {
                  openRoute('accounts')
                  return
                }
                openRoute('transactions', { transactionType: action })
              }}
              recentTransactions={recentTransactions}
              serviceRequests={bankData.serviceRequests}
              stats={dashboardStats}
            />
          ) : null}

          {isRouteAllowed && route === 'customers' ? (
            <CustomersPage
              accounts={bankData.accounts}
              canEdit={canEditCustomers}
              customers={bankData.customers}
              onAddCustomer={(payload) => {
                const result = addCustomer(bankData, payload)
                setBankData(appendAuditLog(result.data, `Added customer ${result.customer.name}`, sessionUser))
                openRoute('customers', { selectedCustomerId: result.customer.id })
                pushToast('success', `Customer ${result.customer.name} added successfully.`)
              }}
              onSelectCustomer={(customerId) => setRouteState((current) => ({ ...current, selectedCustomerId: customerId }))}
              onUpdateCustomer={(customerId, payload) => {
                const result = updateCustomer(bankData, customerId, payload)
                setBankData(appendAuditLog(result.data, `Updated customer ${result.customer.name}`, sessionUser))
                pushToast('success', `Customer ${result.customer.name} updated.`)
              }}
              requestStatusChange={(customerId, status) => {
                const customer = bankData.customers.find((item) => item.id === customerId)
                if (!customer) return
                setConfirmState({
                  title: 'Confirm customer status change',
                  description: `Set ${customer.name} to ${status}?`,
                  confirmLabel: 'Update Status',
                  onConfirm: () => {
                    setBankData((current) => {
                      const result = setCustomerStatus(current, customerId, status)
                      return appendAuditLog(
                        result.data,
                        `Changed customer ${result.customer.name} status to ${status}`,
                        sessionUser,
                      )
                    })
                    pushToast('success', `Customer status updated to ${status}.`)
                  },
                })
              }}
              selectedCustomerId={routeState.selectedCustomerId}
            />
          ) : null}

          {isRouteAllowed && route === 'accounts' ? (
            <AccountsPage
              accounts={bankData.accounts}
              canManage={canEditAccounts}
              customers={bankData.customers}
              onOpenAccount={(payload) => {
                const result = openAccount(bankData, payload)
                setBankData(appendAuditLog(result.data, `Opened account ${result.account.accountNumber}`, sessionUser))
                openRoute('accounts', { selectedAccountId: result.account.id })
                pushToast('success', `Account ${result.account.accountNumber} opened.`)
              }}
              onSelectAccount={(accountId) => setRouteState((current) => ({ ...current, selectedAccountId: accountId }))}
              onStatusChange={(accountId, status) => {
                const account = bankData.accounts.find((item) => item.id === accountId)
                if (!account) return
                setConfirmState({
                  title: 'Confirm account status change',
                  description: `Set account ${account.accountNumber} to ${status}?`,
                  confirmLabel: 'Update Account',
                  onConfirm: () => {
                    setBankData((current) => {
                      const result = setAccountStatus(current, accountId, status)
                      return appendAuditLog(
                        result.data,
                        `Changed account ${result.account.accountNumber} status to ${status}`,
                        sessionUser,
                      )
                    })
                    pushToast('success', `Account status updated to ${status}.`)
                  },
                })
              }}
              selectedAccountId={routeState.selectedAccountId}
              transactions={[...bankData.transactions].sort((left, right) => right.createdAt.localeCompare(left.createdAt))}
            />
          ) : null}

          {isRouteAllowed && route === 'transactions' ? (
            <TransactionsPage
              accounts={bankData.accounts}
              canTransact={canDoTransactions}
              customers={bankData.customers}
              onPrintReceipt={(transactionId) => setReceiptTransactionId(transactionId)}
              onSubmit={(payload) => {
                if (payload.mode === 'deposit' && payload.accountId) {
                  const result = createDeposit(bankData, {
                    accountId: payload.accountId,
                    amount: payload.amount,
                    description: payload.description,
                  })
                  setBankData(appendAuditLog(result.data, `Processed deposit ${result.transaction.transactionId}`, sessionUser))
                  setReceiptTransactionId(result.transaction.id)
                  pushToast('success', 'Deposit recorded successfully.')
                  return
                }

                if (payload.mode === 'withdrawal' && payload.accountId) {
                  const result = createWithdrawal(bankData, {
                    accountId: payload.accountId,
                    amount: payload.amount,
                    description: payload.description,
                  })
                  setBankData(
                    appendAuditLog(result.data, `Processed withdrawal ${result.transaction.transactionId}`, sessionUser),
                  )
                  setReceiptTransactionId(result.transaction.id)
                  pushToast('success', 'Withdrawal recorded successfully.')
                  return
                }

                if (payload.mode === 'transfer' && payload.sourceAccountId && payload.destinationAccountId) {
                  const result = createTransfer(bankData, {
                    sourceAccountId: payload.sourceAccountId,
                    destinationAccountId: payload.destinationAccountId,
                    amount: payload.amount,
                    description: payload.description,
                  })
                  setBankData(appendAuditLog(result.data, `Processed fund transfer ${result.transactions[0].transactionId}`, sessionUser))
                  setReceiptTransactionId(result.transactions[0].id)
                  pushToast('success', 'Transfer completed successfully.')
                  return
                }

                throw new Error('Please complete the selected transaction form.')
              }}
              preselectedAccountId={routeState.selectedAccountId}
              preselectedType={routeState.transactionType}
              transactions={[...bankData.transactions].sort((left, right) => right.createdAt.localeCompare(left.createdAt))}
            />
          ) : null}

          {isRouteAllowed && route === 'csr' ? (
            <CsrPage
              accounts={bankData.accounts}
              customers={bankData.customers}
              onAddRequest={(payload) => {
                const result = addServiceRequest(bankData, payload)
                setBankData(
                  appendAuditLog(
                    result.data,
                    `Created ${result.request.type} ${result.request.subject}`,
                    sessionUser,
                  ),
                )
                pushToast('success', `${result.request.type} logged successfully.`)
              }}
              onSelectAccount={(accountId) => setRouteState((current) => ({ ...current, selectedAccountId: accountId }))}
              onSelectCustomer={(customerId) => setRouteState((current) => ({ ...current, selectedCustomerId: customerId }))}
              onUpdateStatus={(requestId, status) => {
                if (!canEditTickets) {
                  pushToast('error', 'Your role cannot update service request status.')
                  return
                }
                const result = updateServiceRequestStatus(bankData, requestId, status)
                setBankData(appendAuditLog(result.data, `Updated service ticket ${result.request.id} to ${status}`, sessionUser))
                pushToast('success', `Ticket moved to ${status}.`)
              }}
              selectedAccountId={routeState.selectedAccountId}
              selectedCustomerId={routeState.selectedCustomerId}
              serviceRequests={bankData.serviceRequests}
              transactions={[...bankData.transactions].sort((left, right) => right.createdAt.localeCompare(left.createdAt))}
            />
          ) : null}

          {isRouteAllowed && route === 'reports' ? (
            <ReportsPage
              accounts={bankData.accounts}
              customers={bankData.customers}
              initialReportType={routeState.reportType}
              transactions={bankData.transactions}
            />
          ) : null}

          {isRouteAllowed && route === 'security' ? (
            <SecurityPage
              auditLogs={bankData.auditLogs}
              canCreateUser={canCreateUsers}
              onCreateUser={(payload) => {
                const result = createUser(bankData, payload)
                setBankData(appendAuditLog(result.data, `Created user ${result.user.username}`, sessionUser))
                pushToast('success', `User ${result.user.username} created.`)
              }}
              users={bankData.users}
            />
          ) : null}
        </main>
      </div>

      <Modal
        isOpen={Boolean(receiptTransaction && receiptAccount && receiptCustomer)}
        onClose={() => setReceiptTransactionId(null)}
        title="Printable Receipt"
      >
        {receiptTransaction && receiptAccount && receiptCustomer ? (
          <div className="space-y-6">
            <PrintableReceipt account={receiptAccount} customer={receiptCustomer} transaction={receiptTransaction} />
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                onClick={() => {
                  const printWindow = window.open('', '_blank', 'width=900,height=700')
                  const printable = document.getElementById('printable-receipt')
                  if (!printWindow || !printable) return
                  printWindow.document.write(
                    `<!doctype html><html><head><title>Receipt</title><style>body{font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px}*{box-sizing:border-box}</style></head><body>${printable.outerHTML}</body></html>`,
                  )
                  printWindow.document.close()
                  printWindow.focus()
                  printWindow.print()
                }}
                type="button"
                variant="secondary"
              >
                Print
              </Button>
              <Button
                onClick={async () => {
                  const element = document.getElementById('printable-receipt')
                  if (!element) return
                  await exportElementToPdf(element, `${receiptTransaction.transactionId}.pdf`)
                }}
                type="button"
              >
                Export PDF
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        confirmLabel={confirmState?.confirmLabel}
        description={confirmState?.description ?? ''}
        isOpen={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
        onConfirm={() => confirmState?.onConfirm()}
        title={confirmState?.title ?? 'Confirm'}
      />
      <ToastStack toasts={toasts} />
    </div>
  )
}

export default App

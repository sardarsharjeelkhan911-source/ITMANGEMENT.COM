import { ArrowLeftRight, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react'
import { Button, Card, StatCard, Table, type TableRow } from '../components/ui'
import type { Account, ServiceRequest } from '../types/bank'
import { formatCurrency } from '../utils/format'

export const DashboardPage = ({ accounts, onQuickAction, recentTransactions, serviceRequests, stats }: { stats: { totalAccounts: number; totalDeposits: number; totalWithdrawals: number; todaysCount: number; todaysAmount: number }; recentTransactions: TableRow[]; accounts: Account[]; serviceRequests: ServiceRequest[]; onQuickAction: (action: 'customer' | 'account' | 'deposit' | 'withdrawal') => void }) => {
  const activeAccounts = accounts.filter((account) => account.status === 'active').length
  const openTickets = serviceRequests.filter((request) => request.status !== 'resolved').length
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<PiggyBank className="h-6 w-6" />} title="Total Accounts" value={String(stats.totalAccounts)} badge={`${activeAccounts} active`} />
        <StatCard icon={<TrendingUp className="h-6 w-6" />} title="Total Deposits" value={formatCurrency(stats.totalDeposits)} badge="All-time credit inflows" />
        <StatCard icon={<TrendingDown className="h-6 w-6" />} title="Total Withdrawals" value={formatCurrency(stats.totalWithdrawals)} badge="All-time debit outflows" />
        <StatCard icon={<ArrowLeftRight className="h-6 w-6" />} title="Today's Transactions" value={String(stats.todaysCount)} badge={`${formatCurrency(stats.todaysAmount)} processed today`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <div className="mb-4"><h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3><p className="text-sm text-slate-500">Latest 10 transactions across all accounts.</p></div>
          <Table columns={[{ key: 'transactionId', label: 'Transaction', sortable: true }, { key: 'customer', label: 'Customer', sortable: true }, { key: 'type', label: 'Type' }, { key: 'amount', label: 'Amount', sortable: true }, { key: 'createdAt', label: 'Date', sortable: true }]} emptyMessage="Transactions will appear here after banking activity is recorded." rows={recentTransactions} />
        </Card>
        <div className="space-y-6">
          <Card><h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3><div className="mt-4 grid gap-3"><Button onClick={() => onQuickAction('account')} type="button">Open Account</Button><Button onClick={() => onQuickAction('deposit')} type="button" variant="secondary">Deposit Cash</Button><Button onClick={() => onQuickAction('withdrawal')} type="button" variant="secondary">Withdraw Cash</Button><Button onClick={() => onQuickAction('customer')} type="button" variant="secondary">Add Customer</Button></div></Card>
          <Card><h3 className="text-lg font-semibold text-slate-900">Service Overview</h3><div className="mt-4 space-y-4 text-sm text-slate-600"><div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Open complaints / requests</span><strong className="text-slate-900">{openTickets}</strong></div><div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Dormant or closed accounts</span><strong className="text-slate-900">{accounts.filter((account) => account.status !== 'active').length}</strong></div><div className="rounded-2xl bg-blue-50 px-4 py-4 text-blue-900">Keep daily cash positions healthy by monitoring today's inflow and unresolved service requests before branch close.</div></div></Card>
        </div>
      </div>
    </div>
  )
}

import type { Account, Customer, Transaction } from '../types/bank'
import { formatCurrency, formatDateTime } from '../utils/format'

const typeLabels: Record<Transaction['type'], string> = { deposit: 'Cash Deposit', withdrawal: 'Cash Withdrawal', transfer_out: 'Fund Transfer Out', transfer_in: 'Fund Transfer In' }

export const PrintableReceipt = ({ account, customer, transaction }: { transaction: Transaction; customer: Customer; account: Account }) => (
  <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 print:border-0 print:shadow-none" id="printable-receipt">
    <div className="border-b border-slate-200 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">ITMANGEMENT.COM</p><h2 className="mt-2 text-2xl font-semibold">Bank Transaction Receipt</h2><p className="mt-1 text-sm text-slate-500">Generated for {customer.name}</p></div>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <section className="space-y-3 rounded-2xl bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-900">Transaction Details</h3><div className="space-y-2 text-sm text-slate-600"><p><span className="font-medium text-slate-900">Transaction ID:</span> {transaction.transactionId}</p><p><span className="font-medium text-slate-900">Date & Time:</span> {formatDateTime(transaction.createdAt)}</p><p><span className="font-medium text-slate-900">Type:</span> {typeLabels[transaction.type]}</p><p><span className="font-medium text-slate-900">Description:</span> {transaction.description}</p></div></section>
      <section className="space-y-3 rounded-2xl bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-900">Account Details</h3><div className="space-y-2 text-sm text-slate-600"><p><span className="font-medium text-slate-900">Customer:</span> {customer.name}</p><p><span className="font-medium text-slate-900">CNIC:</span> {customer.cnic}</p><p><span className="font-medium text-slate-900">Account Number:</span> {account.accountNumber}</p><p><span className="font-medium text-slate-900">Account Type:</span> {account.type}</p></div></section>
    </div>
    <div className="mt-6 rounded-2xl bg-blue-50 p-6 text-center"><p className="text-sm font-medium text-blue-800">Amount</p><p className="mt-2 text-4xl font-semibold text-blue-900">{formatCurrency(transaction.amount)}</p><p className="mt-3 text-sm text-blue-800">Balance after transaction: {formatCurrency(transaction.balanceAfter)}</p></div>
    <p className="mt-6 text-center text-xs text-slate-500">Thank you for banking with ITMANGEMENT.COM. This receipt is system generated.</p>
  </div>
)

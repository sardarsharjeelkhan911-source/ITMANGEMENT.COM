import { endOfDay, format, isWithinInterval, parseISO, startOfDay } from 'date-fns'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (value: string) => format(parseISO(value), 'dd MMM yyyy')
export const formatDateTime = (value: string) => format(parseISO(value), 'dd MMM yyyy, hh:mm a')
export const normalise = (value: string) => value.trim().toLowerCase()
export const cnicPattern = /^\d{13}$/
export const phonePattern = /^[\d+\-\s]{10,16}$/

export const matchesDateRange = (value: string, start?: string, end?: string) => {
  const date = parseISO(value)
  if (start && end) return isWithinInterval(date, { start: startOfDay(parseISO(start)), end: endOfDay(parseISO(end)) })
  if (start) return date >= startOfDay(parseISO(start))
  if (end) return date <= endOfDay(parseISO(end))
  return true
}

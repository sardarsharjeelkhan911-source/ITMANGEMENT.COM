import { useEffect, useState } from 'react'
import type { BankData } from '../types/bank'
import { loadBankData, saveBankData } from '../services/storage'

export const useBankStore = () => {
  const [bankData, setBankData] = useState<BankData>(() => loadBankData())

  useEffect(() => {
    saveBankData(bankData)
  }, [bankData])

  return { bankData, setBankData }
}

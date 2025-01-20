// types/api.ts
import { Prisma } from '@prisma/client'

export type ApiResponse<T> ={
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface TransactionTableParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
  moneyFor?: string
}
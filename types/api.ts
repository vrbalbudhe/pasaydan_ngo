// Enums
export enum UserType {
    INDIVIDUAL = "INDIVIDUAL",
    ORGANIZATION = "ORGANIZATION"
  }
  
  export enum TransactionType {
    UPI = "UPI",
    NET_BANKING = "NET_BANKING",
    CARD = "CARD",
    CASH = "CASH"
  }
  
  export enum TransactionNature {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
  }
  
  export enum EntryType {
    MANUAL = "MANUAL",
    DONATION_FORM = "DONATION_FORM"
  }
  
  export enum TransactionStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
  }
  
  export enum MoneyForCategory {
    CLOTHES = "CLOTHES",
    FOOD = "FOOD",
    CYCLE = "CYCLE",
    EDUCATION = "EDUCATION",
    HEALTHCARE = "HEALTHCARE",
    OTHER = "OTHER"
  }
  
  // Base Transaction interface
  export interface Transaction {
    id: string;
    name: string;
    email: string;
    phone: string;
    userType: UserType;
    amount: number;
    type: TransactionType;
    transactionId: string;
    date: Date;
    transactionNature: TransactionNature;
    screenshotPath?: string;
    entryType: EntryType;
    entryBy: string;
    entryAt: Date;
    description?: string;
    status: TransactionStatus;
    statusDescription?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    moneyFor: MoneyForCategory;
    customMoneyFor?: string;
    userId?: string;
    organizationId?: string;
    User?: {
      id: string;
      fullname: string;
      email: string;
    } | null;
    Organization?: {
      id: string;
      name: string;
      email: string;
    } | null;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface TransactionTableParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: TransactionStatus;
    startDate?: string;
    endDate?: string;
    moneyFor?: MoneyForCategory;
    userType?: UserType;
    transactionType?: TransactionType;
    transactionNature?: TransactionNature;
  }
  
  export interface TransactionFormData {
    name: string;
    email: string;
    phone: string;
    userType: UserType;
    amount: number;
    type: TransactionType;
    date: Date | string;
    transactionNature: TransactionNature;
    description?: string;
    moneyFor: MoneyForCategory;
    customMoneyFor?: string;
    entryType: EntryType;
    userId?: string;
    organizationId?: string;
    screenshot?: File;
  }
  
  export interface TransactionStatusUpdate {
    status: TransactionStatus;
    statusDescription?: string;
  }
  
  export interface TransactionListResponse extends ApiResponse<Transaction[]> {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }
  
  export interface TransactionStats {
    totalAmount: number;
    totalTransactions: number;
    pendingTransactions: number;
    verifiedTransactions: number;
    rejectedTransactions: number;
    categoryWiseAmount: Record<MoneyForCategory, number>;
    lastSevenDaysStats: {
      date: string;
      amount: number;
      count: number;
    }[];
  }
import { CreateWallet } from '@favid-inc/api/lib/app-artist';

export type BankAccount = CreateWallet['Request']['data']['bankAccount'];
export type RegisterInformation = CreateWallet['Request']['data']['registerInformation'];

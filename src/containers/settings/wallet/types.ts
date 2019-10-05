import { CreateWallet } from '@favid-inc/api/lib/app-artist';
import { LoadWalletInfo } from '@favid-inc/api/lib/app-artist';

export type BankAccount = CreateWallet['Request']['data']['bankAccount'];
export type RegisterInformation = CreateWallet['Request']['data']['registerInformation'];
export type Recipient = CreateWallet['Response'];

export type Balance = LoadWalletInfo['Response']['balance'];

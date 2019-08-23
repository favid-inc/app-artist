import { TopBarNavigationOptions } from '@src/core/navigation/options';
import { WalletContainer } from './WalletContainter';
import { WithdrawFormContainer } from './WithdrawFormContainer';

export const WalletNavigation = {
  'Minha Carteira': {
    screen: WalletContainer,
    navigationOptions: TopBarNavigationOptions,
  },
  'Sacar Dinheiro': {
    screen: WithdrawFormContainer,
    navigationOptions: TopBarNavigationOptions,
  },
};

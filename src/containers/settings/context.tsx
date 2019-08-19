import React from 'react';
import { NavigationContainer, NavigationScreenProps } from 'react-navigation';

interface Payment {
  cpf?: string;
  name?: string;
  address?: string;
  cep?: string;
  city?: string;
  state?: string;
  telephone?: string;
  bank?: string;
  bank_ag?: string;
  account_type?: string;
  bank_cc?: string;
  status?: string;
  cash?: string;
}

export interface SettingsContextType {
  payment?: Payment;
  setPayment?: (p: Payment) => void;
  setCash?: (p: string) => void;
}

type State = SettingsContextType;
export const SettingsContext = React.createContext<SettingsContextType>({});

export function connect(Navigator: NavigationContainer) {
  class ContextNavigator extends React.Component<NavigationScreenProps, State> {
    static router = Navigator.router;
    static screenProps = Navigator.screenProps;
    static navigationOptions = Navigator.navigationOptions;

    public state: State = {
      payment: {
        cpf: '123.123.123-12',
        name: 'Nome da Pessoa',
        address: 'Av. Paulista 320 cj 10',
        cep: '01419-000',
        city: 'São Paulo',
        state: 'São Paulo',
        telephone: '11-91231-1234',
        bank: 'Itaú',
        bank_ag: '5721',
        account_type: 'Corrente',
        bank_cc: '198632',
        status: 'verified',
        cash: '19600',
      },
      setPayment: (payment: Payment) => {
        this.setState({ payment: { ...payment, status: 'verified', cash: '19600' } });
      },
      setCash: (cash: string) => {
        this.setState({ payment: { ...this.state.payment, cash } });
      },
    };

    public render() {
      return (
        <SettingsContext.Provider value={this.state}>
          <SettingsContext.Consumer>{() => <Navigator {...this.props} />}</SettingsContext.Consumer>
        </SettingsContext.Provider>
      );
    }
  }

  return ContextNavigator;
}

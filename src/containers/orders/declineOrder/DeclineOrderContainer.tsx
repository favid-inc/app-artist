import { Order } from '@favid-inc/api';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { OrdersContext } from '../context';

import { declineOrder } from './declineOrder';
import { DeclineOrder } from './DeclineOrder';

interface DeclineOrderContainerProps {
  currentOrder: Order;
  idToken: string;
  error: any;
  onDeclineOrder: (order: Order, idToken: string) => void;
  onError: (error: any) => void;
  onSignOut: () => void;
}

type Props = NavigationScreenProps & DeclineOrderContainerProps;

interface State {
  sending: boolean;
}

type Context = typeof OrdersContext;

export class DeclineOrderContainer extends Component<Props, State, Context> {
  static contextType = OrdersContext;
  public context: React.ContextType<Context>;

  public state: State = {
    sending: false,
  };

  public render() {
    if (this.props.error) {
      this.props.onError(null);
    }
    return <DeclineOrder sending={this.state.sending} onDecline={this.handleDecline} onCancel={this.handleCancel} />;
  }

  private declineOrder = async (statusDeclinedDescription) => {
    this.setState({ sending: true });
    try {
      await declineOrder({ ...this.context.order, statusDeclinedDescription });
      this.context.removeSelectedOrder();
      this.props.navigation.goBack();
    } catch {
      Alert.alert('Erro ao enviar dados', 'tente novamente');
    } finally {
      this.setState({ sending: false });
    }
  };

  private handleCancel = () => {
    this.props.navigation.goBack();
  };

  private handleDecline = (statusDeclinedDescription: string) => {
    Alert.alert(
      'Cancelar pedido?',
      'Esta ação não poderá ser desfeita.',
      [
        { text: 'OK, cancelar pedido.', onPress: () => this.declineOrder(statusDeclinedDescription) },
        { text: 'Não', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };
}

import { Order } from '@favid-inc/api';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { OrdersContext } from '../context';

import { DeclineOrder } from './DeclineOrder';
import { declineOrder } from './declineOrder';

interface DeclineOrderContainerProps {
  currentOrder: Order;
  idToken: string;
  error: any;
  onDeclineOrder: (order: Order, idToken: string) => void;
  onError: (error: any) => void;
  onSignOut: () => void;
}

type Props = NavigationScreenProps & DeclineOrderContainerProps;

export class DeclineOrderContainer extends Component<Props> {
  static contextType = OrdersContext;

  public context: React.ContextType<typeof OrdersContext>;

  public render() {
    if (this.props.error) {
      this.props.onError(null);
    }
    return <DeclineOrder onDecline={this.handleDecline} onCancel={this.handleCancel} />;
  }

  private handleCancel = () => {
    this.props.navigation.goBack();
  };

  private handleDecline = (statusDeclinedDescription: string) => {
    const handleOk = async () => {
      try {
        this.context.patchOrder({ statusDeclinedDescription });

        this.props.navigation.goBack();
      } catch {
        Alert.alert('Erro ao enviar dados', 'tente novamente');
      }
    };

    Alert.alert(
      'Cancelar pedido?',
      'Esta ação não poderá ser desfeita.',
      [{ text: 'OK, cancelar pedido.', onPress: handleOk }, { text: 'Não', style: 'cancel' }],
      { cancelable: false },
    );
  };
}

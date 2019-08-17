import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React, { Component } from 'react';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { OrdersContext } from '../context';

import { listOrders } from './listOrders';
import { SelectOrder } from './SelectOrder';

type Props = NavigationScreenProps & ThemedComponentProps;

interface State {
  loading: boolean;
}

class Container extends Component<Props, State> {
  static contextType = OrdersContext;

  public context: React.ContextType<typeof OrdersContext>;

  public state: State = {
    loading: false,
  };

  public componentDidMount() {
    // this.refresh();
  }

  public render() {
    const { themedStyle } = this.props;
    const { orders } = this.context;
    const { loading } = this.state;

    return (
      <ScrollView
        contentContainerStyle={themedStyle.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
      >
        {orders && orders.length ? (
          <SelectOrder
            loading={loading}
            onDeclineOrder={this.handleDeclineOrder}
            onDelayOrder={this.handleDelayOrder}
            onAcceptOrder={this.handleAcceptOrder}
          />
        ) : (
          <Text appearance='hint' style={themedStyle.text} category='h6'>
            Nenhum pedido.
          </Text>
        )}
      </ScrollView>
    );
  }

  private handleDelayOrder = () => {
    Alert.alert(
      'Adiar pedido?',
      'Esta ação não poderá ser desfeita.',
      [
        { text: 'OK, adiar pedido.', onPress: () => this.context.removeSelectedOrder() },
        { text: 'Não', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  private handleDeclineOrder = () => {
    this.props.navigation.navigate('DeclineOrder');
  };

  private handleAcceptOrder = () => {
    this.props.navigation.navigate('RecordOrderVideo');
  };

  private handleRefresh = () => {
    this.refresh();
  };

  private async refresh() {
    try {
      this.context.setSelectedOrder(0);
      this.context.setOrders([]);
      this.setState({ loading: true });
      const orders = await listOrders();
      this.context.setOrders(orders);
    } catch (e) {
      Alert.alert('Erro', 'Desculpe. Houve um erro ao buscar os seus pedidos');
    } finally {
      this.setState({ loading: false });
    }
  }
}

export const SelectOrderContainer = withStyles<{}>(Container, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
}));

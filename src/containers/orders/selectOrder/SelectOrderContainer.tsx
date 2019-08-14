import { Order } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React, { Component } from 'react';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { OrdersContext } from '../context';

import { listOrders } from './listOrders';
import { SelectOrder } from './SelectOrder';

type Props = NavigationScreenProps & ContainerProps & ThemedComponentProps;

interface State {
  loading: boolean;
}

class Container extends Component<Props, State> {
  static contextType = OrdersContext;
  public state: State = {
    loading: false,
  };

  public context: React.ContextType<typeof OrdersContext>;

  public componentDidMount = () => {
    this.refresh();
  };

  public render() {
    const { themedStyle, orders, loading } = this.props;

    return (
      <ScrollView
        contentContainerStyle={themedStyle.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}
      >
        {orders && orders.length ? (
          <SelectOrder
            loading={loading}
            onDeclineOrder={this.declineOrder}
            onDelayOrder={this.delayOrder}
            onAcceptOrder={this.acceptOrder}
          />
        ) : (
          <Text appearance='hint' style={themedStyle.text} category='h6'>
            Nenhum pedido.
          </Text>
        )}
      </ScrollView>
    );
  }

  private delayOrder = () => {
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

  private declineOrder = () => {
    this.props.navigation.navigate('DeclineOrder');
  };

  private acceptOrder = () => {
    this.props.navigation.navigate('RecordOrderVideo');
  };

  private refresh = async () => {
    try {
      this.setState({ loading: true });
      const orders = await listOrders();
      this.context.setSelectedOrder(0);
      this.context.setOrders(orders);
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ loading: false });
    }
  };
}

export const SelectOrderContainer = withStyles<ContainerProps>(Container, (theme: ThemeType) => ({
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

import React from 'react';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import { NavigationScreenProps } from 'react-navigation';
import { MyOrders } from './MyOrders';
import { listOrders } from './listOrders';
import { RefreshControl, ScrollView } from 'react-native';
import { OrdersContext } from './context';

type Props = ThemedComponentProps & NavigationScreenProps;

interface State {
  loading: boolean;
}

class MyOrdersContainerComponent extends React.Component<Props, State> {
  static contextType = OrdersContext;

  public context: React.ContextType<typeof OrdersContext>;

  public state: State = {
    loading: false,
  };

  public async componentDidMount() {
    this.handleRefresh();
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
        <MyOrders
        loading={this.state.loading}
       />
      ) : (
        <Text appearance='hint' style={themedStyle.text} category='h6'>
          Nenhum pedido.
        </Text>
      )}
    </ScrollView>
    );
  }

  private handleRefresh = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      this.context.setOrders([]);
      const orders = await listOrders();
      this.context.setOrders(orders);
    } finally {
      this.setState({ loading: false });
    }
  };
}

export const MyOrdersContainer = withStyles(MyOrdersContainerComponent, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
}));

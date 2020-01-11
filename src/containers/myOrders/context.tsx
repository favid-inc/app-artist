import { Order } from '@favid-inc/api';
import React from 'react';
import { NavigationContainer, NavigationScreenProps } from 'react-navigation';

export interface OrdersContextType {
  selectedOrder?: number;
  setSelectedOrder?: (index: number) => void;
  removeSelectedOrder?: () => void;

  order?: Order;
  patchOrder?: (order: Order) => void;

  orders?: Order[];
  setOrders?: (orders: Order[]) => void;
}

type State = OrdersContextType;

export const OrdersContext = React.createContext<OrdersContextType>({});

export function connect(Navigator: NavigationContainer) {
  class ContextNavigator extends React.Component<NavigationScreenProps, State> {
    static router = Navigator.router;
    static screenProps = Navigator.screenProps;
    static navigationOptions = Navigator.navigationOptions;

    public state: State = {
      selectedOrder: 0,
      setSelectedOrder: (selectedOrder) => {
        this.setState({
          selectedOrder,
          order: this.state.orders[selectedOrder] || {},
        });
      },
      removeSelectedOrder: () => {
        const { selectedOrder } = this.state;

        const orders = [...this.state.orders];
        orders.splice(selectedOrder, 1);

        this.setState({
          order: orders[selectedOrder] || {},
          orders,
          selectedOrder: Math.max(0, Math.min(selectedOrder, orders.length - 1)),
        });
      },

      order: {},
      patchOrder: (order: Order) => {
        this.setState({
          order: {
            ...this.state.order,
            ...order,
          },
        });
      },

      orders: [],
      setOrders: (orders) => this.setState({ orders }),
    };

    public render() {
      return (
        <OrdersContext.Provider value={this.state}>
          <OrdersContext.Consumer>{() => <Navigator {...this.props} />}</OrdersContext.Consumer>
        </OrdersContext.Provider>
      );
    }
  }

  return ContextNavigator;
}

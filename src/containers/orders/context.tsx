import { Order } from '@favid-inc/api';
import React from 'react';
import { NavigationContainer, NavigationScreenProps } from 'react-navigation';

export interface OrdersContextType {
  selectedOrder?: number;
  setSelectedOrder?: (index: number) => void;
  orders?: Order[];
  setOrders?: (orders: Order[]) => void;
  removeSelectedOrder?: () => void;
  updateSelectedOrder?: (order: Order) => void;
}

type State = OrdersContextType;

export const OrdersContext = React.createContext<OrdersContextType>({});

export function connect(Navigator: NavigationContainer) {
  class ContextNavigator extends React.Component<NavigationScreenProps, State> {
    static router = Navigator.router;
    static screenProps = Navigator.screenProps;
    static navigationOptions = Navigator.navigationOptions;

    public state: State = {
      orders: [],
      selectedOrder: 0,
      setOrders: (orders) => this.setState({ orders }),
      setSelectedOrder: (selectedOrder) => this.setState({ selectedOrder }),
      removeSelectedOrder: () => {
        const { selectedOrder } = this.state;

        const orders = [...this.state.orders];
        orders.splice(selectedOrder, 1);
        this.setState({
          orders,
          selectedOrder: Math.max(0, Math.min(selectedOrder, orders.length - 1)),
        });
      },
      updateSelectedOrder: (order: Order) => {
        const { selectedOrder } = this.state;

        const orders = [...this.state.orders];
        orders[selectedOrder] = order;

        this.setState({ orders });
      },
    };

    public render() {
      return (
        <OrdersContext.Provider value={this.state}>
          <Navigator {...this.props} />
        </OrdersContext.Provider>
      );
    }
  }

  return ContextNavigator;
}

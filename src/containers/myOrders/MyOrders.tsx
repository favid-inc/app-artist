import { ThemedComponentProps, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { View, ViewProps, ActivityIndicator } from 'react-native';
import { OrdersContext } from './context';
import { Order } from '@favid-inc/api';

interface ComponentProps {
  loading: boolean;
}
export type Props = ComponentProps & ThemedComponentProps & ViewProps;

class MyOrdersComponent extends React.Component<Props> {
  static contextType = OrdersContext;
  public context: React.ContextType<typeof OrdersContext>;

  public render() {
    const { style, themedStyle, loading } = this.props;

    return (
      <View style={[themedStyle.container, style]}>
        { loading
          ? <ActivityIndicator size='large' />
          : (
            this.context.orders.map((order: Order) => (
              <Text>{order.instructions}</Text>
            ))
          )
        }
      </View>
    );
  }
}

export const MyOrders = withStyles(MyOrdersComponent, () => ({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 30,
  },
}));

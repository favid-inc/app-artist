import { ThemedComponentProps, withStyles, ThemeType } from '@kitten/theme';
import React from 'react';
import { View, ListRenderItemInfo, ViewProps, ActivityIndicator } from 'react-native';
import { OrdersContext } from './context';
import { Order } from '@favid-inc/api';
import { OrderCard, OrderCardProps } from './OrderCard';
import { List } from 'react-native-ui-kitten/ui';
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
            <List contentContainerStyle={themedStyle.container} renderItem={this.renderItem} data={this.context.orders} />
          )
        }
      </View>
    );
  };

  private renderItem = (info: ListRenderItemInfo<Order>): React.ReactElement<OrderCardProps> => {
    const { themedStyle } = this.props;
    return <OrderCard key={info.item.id} style={themedStyle.item} order={info.item} />;
  };
}

export const MyOrders = withStyles(MyOrdersComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  item: {
    marginVertical: 8,
    backgroundColor: theme['background-basic-color-1'],
  },
}));

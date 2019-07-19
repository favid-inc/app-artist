import React, { Component } from 'react';
import { OrderModel } from '@favid-inc/api';
import { List, Text, InputProps, Input, Button } from '@kitten/ui';
import { ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View, ViewProps } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps, StyleType } from '@kitten/theme';
import { textStyle } from '@src/components/common';
interface ComponentProps {
  orders: OrderModel[];
  onDetails: (order: OrderModel) => void;
}

type OrdersProps = ComponentProps & ThemedComponentProps;

class OrdersComponent extends Component<OrdersProps> {
  public render() {
    const { themedStyle } = this.props;
    let orders: React.ReactNode = <Text>Loading...</Text>;
    if (this.props.orders) {
      orders = this.props.orders.map((order: OrderModel) => {
        return (
          <View key={order.id}>
            <Text style={themedStyle.pagerLabel} appearance='hint'>
              {order.videoInstructions}
            </Text>
            <Button onPress={() => this.props.onDetails(order)}>Details</Button>
          </View>
        );
      });
    }
    return (
      <View style={themedStyle.container}>
        <ScrollView contentContainerStyle={themedStyle.container}>{orders}</ScrollView>
      </View>
    );
  }
}

export const Orders = withStyles(OrdersComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pagerContainer: {
    marginVertical: 8,
  },
  pagerLabel: {
    marginVertical: 16,
    ...textStyle.paragraph,
  },
  pagerCard: {
    width: 226,
  },
  listCard: {
    marginVertical: 8,
  },
  pagerCardMargin: {
    marginRight: 16,
  },
  pagerIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  pagerIndicatorSelected: {
    backgroundColor: theme['background-basic-color-4'],
  },
  indicatorMarginRight: {
    marginRight: 12,
  },
  input: {
    marginHorizontal: 10,
  },
}));

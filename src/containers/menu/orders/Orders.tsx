import React, { Component } from 'react';
import { OrderModel } from '@favid-inc/api';
import { Text, Button } from '@kitten/ui';
import { View } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps, StyleType } from '@kitten/theme';
import { textStyle, SwiperComponent } from '@src/components/common';

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
        <View style={themedStyle.swiperWrapper}>
          <Text style={themedStyle.title}> 1 de 4</Text>
          <SwiperComponent />
        </View>
        <View style={themedStyle.buttonsWrapper}>
          <View style={themedStyle.buttons}>
            <Button style={themedStyle.button}>OK</Button>
            <Button style={themedStyle.button}>skip</Button>
            <Button style={themedStyle.button}>Não</Button>
          </View>
        </View>
      </View>
    );
  }
}

export const Orders = withStyles(OrdersComponent, (theme: ThemeType) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme['background-basic-color-4'],
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: '100%',
  },
  swiperWrapper: {
    flex: 1,
    flexGrow: 5,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  buttonsWrapper: {
    flex: 1,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 50,
  },
  title: {
    ...textStyle.subtitle,
    fontFamily: 'opensans-bold',
    color: 'white',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: 30,
  },
}));

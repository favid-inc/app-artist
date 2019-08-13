import React, { Component } from 'react';
import { Order } from '@favid-inc/api';
import { Text, Button } from '@kitten/ui';
import { View, ActivityIndicator } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps, StyleType } from '@kitten/theme';
import { textStyle, SwiperComponent, ActivityAuthoring } from '@src/components/common';
import { EvaCheckmarkOutline, CloseIconOutline } from '@src/assets/icons';
interface ComponentProps {
  orders: Order[];
  loading: boolean;
  onDeclineOrder: (order: Order) => void;
  onDelayOrder: (orderId: string) => void;
  onAcceptOrder: (order: Order) => void;
}

interface State {
  selectedOrder: number;
}

type OrdersProps = ComponentProps & ThemedComponentProps;

class AbstractSelectOrder extends Component<OrdersProps, State> {
  public state: State = {
    selectedOrder: 0,
  };
  public onDeclineOrder = () => {
    const order: Order = this.props.orders[this.state.selectedOrder];
    this.props.onDeclineOrder(order);
  };

  public onDelayOrder = () => {
    const order: Order = this.props.orders[this.state.selectedOrder];
    this.props.onDelayOrder(order.id);
  };

  public onAcceptOrder = () => {
    const order: Order = this.props.orders[this.state.selectedOrder];
    this.props.onAcceptOrder(order);
  };
  public onSelectedOrderChanged = (i: number) => {
    this.setState({ selectedOrder: i });
  };

  public render() {
    const { themedStyle, loading, orders } = this.props;

    return (
      <View style={themedStyle.container}>
        <View style={themedStyle.swiperWrapper}>
          {loading ? (
            <LoadingOrders themedStyle={themedStyle} />
          ) : (
            <SwipeOrders
              orders={this.props.orders}
              themedStyle={themedStyle}
              onSelectedOrderChanged={this.onSelectedOrderChanged}
              title={`${this.state.selectedOrder + 1} de ${(this.props.orders && this.props.orders.length) || 0}`}
            />
          )}
        </View>
        <View style={themedStyle.buttonsWrapper}>
          <View style={themedStyle.buttons}>
            <Button
              style={themedStyle.button}
              status='danger'
              size='giant'
              appearance='outline'
              icon={CloseIconOutline}
              disabled={this.props.loading}
              onPress={this.onDeclineOrder}
            />
            <Button
              style={themedStyle.button}
              status='info'
              size='large'
              appearance='outline'
              disabled={this.props.loading}
              onPress={this.onDelayOrder}
            >
              adiar
            </Button>
            <Button
              style={themedStyle.button}
              status='success'
              size='giant'
              appearance='outline'
              icon={EvaCheckmarkOutline}
              disabled={this.props.loading}
              onPress={this.onAcceptOrder}
            />
          </View>
        </View>
      </View>
    );
  }
}
const SwipeOrders = ({ themedStyle, orders, title, onSelectedOrderChanged }) => (
  <View style={themedStyle.swiperWrapper}>
    <Text style={themedStyle.title} appearance='hint'>
      {title}
    </Text>
    <SwiperComponent selectedOrderChanged={i => onSelectedOrderChanged(i)}>
      {orders.map((order: Order, index: number) => {
        return (
          <View key={order.id} style={themedStyle.slide}>
            <Text style={[themedStyle.price, themedStyle.text]} appearance='hint' category='h5'>
              {`R$ ${order.price}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.name]} appearance='hint' category='h4'>
              {`por ${order.customerName}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.expiration]} appearance='hint' category='c1'>
              {`expira em ${new Date(order.creationDate)}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.instruction]} appearance='hint' category='h6'>
              {order.videoInstructions}
            </Text>
          </View>
        );
      })}
    </SwiperComponent>
  </View>
);
const LoadingOrders = ({ themedStyle }) => (
  <View style={themedStyle.swiperWrapper}>
    <Text style={themedStyle.title} appearance='hint'>
      Carregando pedidos...
    </Text>
    <View style={themedStyle.loadingWrapper}>
      <ActivityIndicator size='large' style={themedStyle.loading} />
    </View>
  </View>
);

export const Orders = withStyles(AbstractSelectOrder, (theme: ThemeType) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme['background-basic-color-4'],
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: '100%',
  },
  loadingWrapper: {
    flexDirection: 'row',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  loading: {
    flex: 1,
  },
  swiperWrapper: {
    flex: 1,
    flexGrow: 5,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  buttonsWrapper: {
    flex: 1,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 100,
  },
  title: {
    ...textStyle.subtitle,
    fontFamily: 'opensans-regular',
    width: '100%',
    marginTop: 20,
    textAlign: 'center',
  },
  text: {
    ...textStyle.subtitle,
    width: '100%',
  },
  price: {
    ...textStyle.paragraph,
    fontSize: 25,
    lineHeight: 25,
    marginBottom: 5,
  },
  name: {
    fontSize: 30,
    lineHeight: 30,
    marginBottom: 5,
  },
  expiration: {
    marginBottom: 10,
  },
  instruction: {
    paddingVertical: 15,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
  buttn: {
    color: 'white',
  },
  slide: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 40,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
}));

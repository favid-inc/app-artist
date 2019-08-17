import { Order } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import { CloseIconOutline, EvaCheckmarkOutline } from '@src/assets/icons';
import { SwiperComponent, textStyle } from '@src/components/common';
import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { OrdersContext } from '../context';

interface ComponentProps {
  loading: boolean;
  onDeclineOrder: () => void;
  onDelayOrder: () => void;
  onAcceptOrder: () => void;
}

type Props = ComponentProps & ThemedComponentProps;

class SelectOrderComponent extends Component<Props> {
  static contextType = OrdersContext;
  public context: React.ContextType<typeof OrdersContext>;

  public render() {
    const { themedStyle, loading } = this.props;

    return (
      <View style={themedStyle.container}>
        <View style={themedStyle.swiperWrapper}>
          {loading ? (
            <LoadingOrders themedStyle={themedStyle} />
          ) : (
            <SwipeOrders
              orders={this.context.orders}
              themedStyle={themedStyle}
              onSelectedOrderChanged={this.handleSelectedOrderChanged}
              title={`${this.context.selectedOrder + 1} de ${this.context.orders.length}`}
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
              onPress={this.handleDeclineOrder}
            />
            <Button
              style={themedStyle.button}
              status='info'
              size='large'
              appearance='outline'
              disabled={this.props.loading}
              onPress={this.handleDelayOrder}
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
              onPress={this.handleAcceptOrder}
            />
          </View>
        </View>
      </View>
    );
  }

  private handleDeclineOrder = () => {
    this.props.onDeclineOrder();
  };

  private handleDelayOrder = () => {
    this.props.onDelayOrder();
  };

  private handleAcceptOrder = () => {
    this.props.onAcceptOrder();
  };

  private handleSelectedOrderChanged = (i: number) => {
    this.context.setSelectedOrder(i);
  };
}

const SwipeOrders = ({ themedStyle, orders, title, onSelectedOrderChanged }) => (
  <View style={themedStyle.swiperWrapper}>
    <Text style={themedStyle.title} appearance='hint'>
      {title}
    </Text>
    <SwiperComponent selectedOrderChanged={onSelectedOrderChanged}>
      {orders.map((order: Order) => {
        return (
          <View key={order.id} style={themedStyle.slide}>
            <Text style={[themedStyle.price, themedStyle.text]} appearance='hint' category='h5'>
              {`R$ ${order.price}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.name]} appearance='hint' category='h4'>
              {`por ${order.customerName}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.expiration]} appearance='hint' category='c1'>
              {`expira em ${new Date(order.statusPlacedDate)}`}
            </Text>
            <Text style={[themedStyle.text, themedStyle.instruction]} appearance='hint' category='h6'>
              {order.instructions}
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

export const SelectOrder = withStyles<ComponentProps>(SelectOrderComponent, (theme: ThemeType) => ({
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

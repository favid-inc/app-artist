import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { OrderModel } from '@favid-inc/api';

import { Orders } from './Orders';
import * as actions from '../../../store/actions';
import { View, Alert } from 'react-native';
import { ContainerView } from '@src/components/common';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { Text } from 'react-native-ui-kitten/ui';

interface OrdersContainerProps {
  loading: boolean;
  artistId: string;
  onListOrders: (string) => void;
  onSetCurrentOrder: (order: OrderModel) => void;
  onDelayOrder: (orderId: string) => void;
  orders: OrderModel[];
}

type Props = NavigationScreenProps & OrdersContainerProps & ThemedComponentProps;

interface State {
  showDeclineModal: boolean;
}

class OrdersContainerComponent extends Component<Props, State> {
  public state: State = {
    showDeclineModal: true,
  };

  public componentDidMount() {
    this.props.onListOrders(this.props.artistId);
  }

  public onDeclineOrder(order: OrderModel) {
    this.props.onSetCurrentOrder(order);
    this.props.navigation.navigate({ routeName: 'DeclineOrder' });
  }

  public onDelayOrder(orderId: string) {
    Alert.alert(
      'Adiar pedido?',
      'Esta ação não poderá ser desfeita.',
      [
        {
          text: 'OK, adiar pedido.',
          onPress: () => this.props.onDelayOrder(orderId),
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  public onAcceptOrder(orderId: string) {
    console.log('abre a camera..');
  }

  public render() {
    const { themedStyle } = this.props;
    return (
      <View>
        {this.props.orders && this.props.orders.length ? (
          <Orders
            loading={this.props.loading}
            orders={this.props.orders}
            onDeclineOrder={(order: OrderModel) => this.onDeclineOrder(order)}
            onDelayOrder={orderId => this.onDelayOrder(orderId)}
            onAcceptOrder={orderId => this.onAcceptOrder(orderId)}
          />
        ) : (
          <View style={themedStyle.contentContainer}>
            <Text appearance='hint' style={themedStyle.text} category='h6'>
              Nenhum pedido.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ order, auth }) => ({
  loading: order.loading,
  orders: order.orders,
  artistId: auth.authState.uid,
});

const mapDispatchToProps = dispatch => ({
  onListOrders: artistId => dispatch(actions.listOrders(artistId)),
  onSetCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)),
  onDelayOrder: (orderId: string) => dispatch(actions.delayOrder(orderId)),
});

const OrdersContainerStyled = withStyles(OrdersContainerComponent, (theme: ThemeType) => ({
  contentContainer: {
    backgroundColor: theme['background-basic-color-2'],
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
}));

export const OrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersContainerStyled);

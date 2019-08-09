import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { OrderModel } from '@favid-inc/api';

import { Orders } from './SelectOrder';
import * as actions from '../../../store/actions';
import { ScrollView, RefreshControl, View, Alert } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { Text } from 'react-native-ui-kitten/ui';

interface ContainerProps {
  loading: boolean;
  artistId: string;
  onListOrders: (string) => void;
  onSetCurrentOrder: (order: OrderModel) => void;
  onDelayOrder: (orderId: string) => void;
  orders: OrderModel[];
}

type Props = NavigationScreenProps & ContainerProps & ThemedComponentProps;

interface ContainerState {
  showDeclineModal: boolean;
}

class Container extends Component<Props, ContainerState> {
  public state: ContainerState = {
    showDeclineModal: true,
  };

  public componentDidMount = () => {
    this.props.onListOrders(this.props.artistId);
  };

  private onRefresh = () => this.props.onListOrders(this.props.artistId);

  public onDeclineOrder = (order: OrderModel) => {
    this.props.onSetCurrentOrder(order);
    this.props.navigation.navigate('DeclineOrder');
  };

  public onDelayOrder = (orderId: string) => {
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
  };

  public onAcceptOrder = (order: OrderModel) => {
    this.props.onSetCurrentOrder(order);
    this.props.navigation.navigate('RecordOrderVideo');
  };

  public render() {
    const { themedStyle, orders, loading } = this.props;

    return (
      <ScrollView
        contentContainerStyle={themedStyle.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}
      >
        {orders && orders.length ? (
          <Orders
            loading={loading}
            orders={orders}
            onDeclineOrder={this.onDeclineOrder}
            onDelayOrder={this.onDelayOrder}
            onAcceptOrder={this.onAcceptOrder}
          />
        ) : (
          <Text appearance='hint' style={themedStyle.text} category='h6'>
            Nenhum pedido.
          </Text>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ order, artist }) => ({
  loading: order.loading,
  orders: order.orders,
  artistId: artist.artist.id,
});

const mapDispatchToProps = dispatch => ({
  onListOrders: artistId => dispatch(actions.listOrders(artistId)),
  onSetCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)),
  onDelayOrder: (orderId: string) => dispatch(actions.delayOrder(orderId)),
});

const ContainerStyled = withStyles(Container, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
}));

export const SelectOrderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContainerStyled);

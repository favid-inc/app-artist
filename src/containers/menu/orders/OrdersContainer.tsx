import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { OrderModel } from '@favid-inc/api';

import { Orders } from './Orders';
import * as actions from '../../../store/actions';

interface OrdersContainerProps {
  artistId: string;
  onListOrders: (string) => void;
  orders: OrderModel[];
  onSetOrder: (Order) => void;
}

type Props = NavigationScreenProps & OrdersContainerProps;

class OrdersContainer extends Component<Props> {
  componentDidMount() {
    this.props.onListOrders(this.props.artistId);
  }

  public render() {
    return <Orders orders={this.props.orders} onDetails={order => this.props.onSetOrder(order)} />;
  }
}

const mapStateToProps = ({ order, auth }) => ({
  orders: order.orders,
  artistId: auth.authState.uid,
});

const mapDispatchToProps = dispatch => ({
  onListOrders: artistId => dispatch(actions.listOrders(artistId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersContainer);

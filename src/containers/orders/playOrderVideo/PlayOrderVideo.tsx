import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { OrderModel } from '@favid-inc/api';

import * as actions from '../../../store/actions';

interface StoreState {
  order: OrderModel;
}

interface StoreDispatch {
  setCurrentOrder: (order: OrderModel) => void;
}

interface Props extends StoreState, StoreDispatch {
  onDone: () => void;
}

class AbstractPlayOrderVideo extends Component<Props> {
  public render(): React.ReactNode {
    return <Text>{JSON.stringify(this.props.order, null, 2)}</Text>;
  }
}

const mapStateToProps = ({ order }) => ({
  order: order.currentOrder,
} as StoreState);

const mapDispatchToProps = dispatch => ({
  setCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)),
} as StoreDispatch);

export const PlayOrderVideo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AbstractPlayOrderVideo);

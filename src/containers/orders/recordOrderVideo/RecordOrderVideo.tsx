import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Camera } from './Camera';
import { Order } from '@favid-inc/api';

import * as actions from '../../../store/actions';

interface StoreState {
  order: Order;
}

interface StoreDispatch {
  setCurrentOrder: (order: Order) => void;
}

interface Props extends StoreState, StoreDispatch {
  onDone: () => void;
}

class AbstractRecordOrderVideo extends Component<Props> {
  onCameraRecord = video => {
    this.props.setCurrentOrder({ ...this.props.order, video });
    this.props.onDone();
  };

  public render(): React.ReactNode {
    return <Camera onRecord={this.onCameraRecord} />;
  }
}

const mapStateToProps = ({ order }) =>
  ({
    order: order.currentOrder,
  } as StoreState);

const mapDispatchToProps = dispatch =>
  ({
    setCurrentOrder: (order: Order) => dispatch(actions.setCurrentOrder(order)),
  } as StoreDispatch);

export const RecordOrderVideo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AbstractRecordOrderVideo);

import React, { Component } from 'react';
import { Booking } from './Booking';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

interface ComponentProps  {
  loading: boolean;
  onPostOrder: (any) => void;
}

class BookingContainer extends Component<ComponentProps> {
  private onSend(order) {
    this.props.onPostOrder(order);
  }

  public render(): React.ReactNode {
    return <Booking onSend={this.onSend} loading={this.props.loading}/>;
  }
}

const mapStateToProps = ({order}) => ({
  loading: order.loading,
});

const mapDispatchToProps = dispatch => ({
  onPostOrder: order => dispatch(actions.postOrder(order)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingContainer);

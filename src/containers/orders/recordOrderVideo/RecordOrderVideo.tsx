import { Order } from '@favid-inc/api';
import React, { Component } from 'react';

import { OrdersContext } from '../context';

import { Camera } from './Camera';

interface Props {
  onDone: () => void;
}

export class RecordOrderVideo extends Component<Props> {
  static contextType = OrdersContext;
  public context: React.ContextType<typeof OrdersContext>;

  public render(): React.ReactNode {
    return <Camera onRecord={this.handleCameraRecord} />;
  }

  private handleCameraRecord = (videoUri: string) => {
    const order = {
      ...this.context.orders[this.context.selectedOrder],
      videoUri,
    };
    this.context.updateSelectedOrder(order);
    this.props.onDone();
  };
}

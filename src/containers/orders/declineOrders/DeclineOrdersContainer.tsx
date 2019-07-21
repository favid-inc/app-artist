import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { OrderModel } from '@favid-inc/api';

import { DeclineOrder } from './DeclineOrder';
import * as actions from '../../../store/actions';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { Alert } from 'react-native';

interface DeclineOrderContainerProps {
  currentOrder: OrderModel;
  onDeclineOrder: (orderId: string, artitId: string, message: string) => void;
}

type Props = NavigationScreenProps & DeclineOrderContainerProps;

class DeclineOrderContainerClass extends Component<Props> {
  public onSendDecline(refusedByArtistDescription: string) {
    Alert.alert(
      'Cancelar pedido?',
      'Esta ação não poderá ser desfeita.',
      [
        {
          text: 'OK, cancelar pedido.',
          onPress: () => {
            this.props.onDeclineOrder(
              this.props.currentOrder.id,
              this.props.currentOrder.artistId,
              refusedByArtistDescription,
            );
            this.onGoback();
          },
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  public onGoback() {
    this.props.navigation.goBack(KEY_NAVIGATION_BACK);
  }

  public render() {
    return (
      <DeclineOrder
        onDeclineOrder={refusedByArtistDescription => this.onSendDecline(refusedByArtistDescription)}
        onGoback={() => this.onGoback()}
      />
    );
  }
}

const mapStateToProps = ({ order }) => ({
  loading: order.loading,
  currentOrder: order.currentOrder,
});

const mapDispatchToProps = dispatch => ({
  onDeclineOrder: (orderId: string, artistId: string, message: string) =>
    dispatch(actions.declineOrder(orderId, artistId, message)),
});

export const DeclineOrderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeclineOrderContainerClass);

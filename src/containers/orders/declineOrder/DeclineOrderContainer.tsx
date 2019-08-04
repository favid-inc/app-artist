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
  idToken: string;
  error: any;
  onDeclineOrder: (order: OrderModel, idToken: string) => void;
  onError: (error: any) => void;
  onSignOut: () => void;
}

type Props = NavigationScreenProps & DeclineOrderContainerProps;

class DeclineOrderContainerClass extends Component<Props> {
  public onSendDecline(declinedByArtistDescription: string) {
    Alert.alert(
      'Cancelar pedido?',
      'Esta ação não poderá ser desfeita.',
      [
        {
          text: 'OK, cancelar pedido.',
          onPress: () => {
            this.props.onDeclineOrder(
              {
                ...this.props.currentOrder,
                declinedByArtistDescription,
              },
              this.props.idToken,
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
    if (this.props.error) {
      const action =
        this.props.error.status === 403
          ? [
              {
                text: 'Ok, efetuar login novamente.',
                onPress: () => this.props.onSignOut(),
              },
            ]
          : null;
      Alert.alert(this.props.error.message, null, action, { cancelable: false });
      this.props.onError(null);
    }
    return (
      <DeclineOrder
        onDeclineOrder={refusedByArtistDescription => this.onSendDecline(refusedByArtistDescription)}
        onGoback={() => this.onGoback()}
      />
    );
  }
}

const mapStateToProps = ({ order, auth }) => ({
  idToken: auth.authState.idToken,
  error: order.error,
  loading: order.loading,
  currentOrder: order.currentOrder,
});

const mapDispatchToProps = dispatch => ({
  onError: error => dispatch(actions.orderError(error)),
  onDeclineOrder: (order: OrderModel, idToken: string) => dispatch(actions.declineOrder(order, idToken)),
  onSignOut: () => dispatch(actions.signOut()),
});

export const DeclineOrderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeclineOrderContainerClass);

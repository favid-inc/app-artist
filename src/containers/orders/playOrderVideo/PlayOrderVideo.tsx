import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import { OrderModel } from '@favid-inc/api';

import * as actions from '../../../store/actions';

import { VideoPlayer } from './videoPlayer';

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
    return (
      <View style={styles.container}>
        <VideoPlayer
          videoProps={{
            shouldPlay: true,
            resizeMode: Video.RESIZE_MODE_COVER,
            source: {
               uri: this.props.order.video,
            },
          }}
          showControlsOnLoad={true}
          showFullscreenButton={false}
          isPortrait={true}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ order }) =>
  ({
    order: order.currentOrder,
  } as StoreState);

const mapDispatchToProps = dispatch =>
  ({
    setCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)),
  } as StoreDispatch);

export const PlayOrderVideo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AbstractPlayOrderVideo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
});

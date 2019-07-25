import React, { Component } from 'react';
import { ActivityIndicator, Alert, Dimensions, View, StyleSheet, GestureResponderEvent } from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import { OrderModel, OrderFlow } from '@favid-inc/api';
import { Button, Modal } from 'react-native-ui-kitten';
import 'abort-controller/polyfill';
import { AbortController } from 'abort-controller';

import * as actions from '../../../store/actions';
import * as config from '@src/core/config';

import { VideoPlayer } from './videoPlayer';

type EventHandler = (event: GestureResponderEvent) => void;

interface StoreState {
  order: OrderModel;
}

interface StoreDispatch {
  setCurrentOrder: (order: OrderModel) => void;
}

interface Props extends StoreState, StoreDispatch {
  onRedo: () => void;
  onUpload: () => void;
}

interface State {
  isUploading: boolean;
}

class AbstractPlayOrderVideo extends Component<Props, State> {
  public state: State = {
    isUploading: false,
  };

  private abortController: AbortController;

  private handleRedoClick = () => {
    this.props.onRedo();
  };

  private handleSendClick = async () => {
    this.setState({ isUploading: true });

    try {
      const data = new FormData();

      data.append('video', {
        name: 'mobile-video-upload',
        type: 'video/mp4',
        uri: this.props.order.video,
      });

      this.abortController && this.abortController.abort();

      this.abortController = new AbortController();

      // TODO: Add credentials
      const result = await fetch(`${config.api.baseURL}/${OrderFlow.ACCEPT}/${this.props.order.id}`, {
        method: 'PUT',
        body: data,
        // @ts-ignore
        signal: this.abortController.signal,
      });

      if (!/^2\d\d/.test(result.status)) {
        throw new Error(`Error during video upload. Server responded with an error status: "${result.status}"`);
      }
      this.props.onUpload();
    } catch (e) {
      Alert.alert('Erro', 'Erro ao fazer upload do vídeo. Tente novamente mais tarde.');
      // tslint:disable-next-line: no-console
      console.error(e);
    }

    this.setState({ isUploading: false });
  };

  public componentDidMount() {
    this.props.order.video || this.props.onRedo();
  }

  public componentWillUnmount() {
    this.abortController && this.abortController.abort();
  }

  public render(): React.ReactNode {
    return this.state.isUploading ? (
      <LoadingIndicator />
    ) : (
      <VideoPlayerWithToolbar
        order={this.props.order}
        onRedoClick={this.handleRedoClick}
        onSendClick={this.handleSendClick}
      />
    );
  }
}

const LoadingIndicator = () => (
  <View style={styles.loading}>
    <ActivityIndicator size='large' color='#0000ff' />
  </View>
);

const VideoPlayerWithToolbar = (props: { order: OrderModel; onRedoClick: EventHandler; onSendClick: EventHandler }) => (
  <View style={styles.container}>
    <VideoPlayer
      videoProps={{
        shouldPlay: true,
        resizeMode: Video.RESIZE_MODE_COVER,
        source: {
          uri: props.order.video,
        },
      }}
      showControlsOnLoad={true}
      showFullscreenButton={false}
      isPortrait={true}
    />
    <View style={styles.toolbar}>
      <Row>
        <Col>
          <Button onPress={props.onRedoClick}>Refazer</Button>
        </Col>
        <Col>
          <Button onPress={props.onSendClick}>Enviar</Button>
        </Col>
      </Row>
    </View>
  </View>
);

const mapStateToProps = ({ order }) =>
  ({
    order: order.currentOrder,
  } as StoreState);

const mapDispatchToProps = dispatch =>
  ({ setCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)) } as StoreDispatch);

export const PlayOrderVideo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AbstractPlayOrderVideo);

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

const Col = ({ children }) => <View style={styles.col}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },

  // loading indicator
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // video player
  toolbar: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 80,
    bottom: 80,
  },

  // grid system
  col: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import { OrderModel } from '@favid-inc/api';
import { Button } from 'react-native-ui-kitten';

import { VideoPlayer } from './videoPlayer';

interface StoreState {
  order: OrderModel;
}

interface Props extends StoreState {
  onRedo: () => void;
  onUpload: () => void;
}

class AbstractPlayOrderVideo extends Component<Props> {
  private handleRedoClick = () => {
    this.props.onRedo();
  };

  private handleUploadClick = async () => {
    this.props.onUpload();
  };

  public componentDidMount() {
    this.props.order.video || this.props.onRedo();
  }

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
        <View style={styles.toolbar}>
          <Row>
            <Col>
              <Button onPress={this.handleRedoClick}>Refazer</Button>
            </Col>
            <Col>
              <Button onPress={this.handleUploadClick}>Enviar</Button>
            </Col>
          </Row>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ order }) =>
  ({
    order: order.currentOrder,
  } as StoreState);

export const PlayOrderVideo = connect(
  mapStateToProps,
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

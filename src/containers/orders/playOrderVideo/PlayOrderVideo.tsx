import * as firebase from 'firebase';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { OrderModel } from '@favid-inc/api';
import { Button } from 'react-native-ui-kitten';
import { Dimensions, View, StyleSheet, Text } from 'react-native';

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

  private handleUploadClick = () => {
    this.props.onUpload();
  };

  public componentDidMount() {
    this.props.order.video || this.props.onRedo();
  }

  public render(): React.ReactNode {
    const { order } = this.props;

    if (!order) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <Row>
          <Col>
            <OrderVideoPlayer order={this.props.order} />
          </Col>
        </Row>
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

function OrderVideoPlayer({ order }: { order: OrderModel }) {
  const video = `${order.video}`;
  const [uri, setUri] = React.useState<string>(video);

  React.useEffect(() => {
    (async () => {
      if (video.startsWith('file://')) {
        return setUri(video);
      }

      try {
        const storage = firebase.storage();
        const downloadUrl = await storage.ref(video).getDownloadURL();

        setUri(downloadUrl);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [video]);

  if (!uri) {
    return <View />;
  }

  return <VideoPlayer uri={uri} />;
}

const mapStateToProps = ({ order }) =>
  ({
    order: order.currentOrder,
  } as StoreState);

export const PlayOrderVideo = connect(mapStateToProps)(AbstractPlayOrderVideo);

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

const Col = ({ children }) => <View style={styles.col}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // video player
  toolbar: {
    position: 'absolute',
    bottom: 100,
  },

  // grid system
  col: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    width: Dimensions.get('window').width,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

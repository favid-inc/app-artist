import { Order } from '@favid-inc/api';
import { Button } from '@kitten/ui';
import * as firebase from 'firebase';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { OrdersContext } from '../context';

import { VideoPlayer } from './videoPlayer';

interface Props {
  onRedo: () => void;
  onUpload: () => void;
}

export class PlayOrderVideo extends Component<Props> {
  static contextType = OrdersContext;
  public context: React.ContextType<typeof OrdersContext>;

  public render() {
    const { order } = this.context;

    return (
      <View style={styles.container}>
        <Row>
          <Col>
            <OrderVideoPlayer order={order} />
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
  private handleRedoClick = () => {
    this.props.onRedo();
  };

  private handleUploadClick = () => {
    this.props.onUpload();
  };
}

function OrderVideoPlayer({ order }: { order: Order }) {
  const video = `${order.videoUri}`;
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

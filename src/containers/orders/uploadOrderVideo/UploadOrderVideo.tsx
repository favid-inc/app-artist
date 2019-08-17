import { OrderStatus } from '@favid-inc/api';
import { Button, Text } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { OrdersContext } from '../context';

import { Canceler, CancelToken, fufillOrder } from './fufillOrder';

interface Props {
  onDone: () => void;
}

interface State {
  isUploading: boolean;
  uploadPercentage: number;
}

export class UploadOrderVideo extends React.Component<Props, State> {
  static contextType = OrdersContext;
  public context: React.ContextType<typeof OrdersContext>;

  public state: State = {
    isUploading: false,
    uploadPercentage: 0,
  };

  private uploadCanceler: Canceler;
  private isLive: boolean = true;

  public componentDidMount() {
    this.handleUpload();
  }

  public componentWillUnmount() {
    this.isLive = false;
    if (this.uploadCanceler) {
      this.uploadCanceler();
    }
  }

  public render(): React.ReactNode {
    if (this.state.isUploading) {
      return <SendingIndicator percentage={this.state.uploadPercentage} />;
    }

    if (this.context.order.status === OrderStatus.FULFILLED) {
      return <SuccessMessage onPress={this.props.onDone} />;
    }

    return <SendButton onPress={this.handleUpload} />;
  }

  private handleUpload = async () => {
    if (this.isLive) {
      this.setState({ isUploading: true, uploadPercentage: 0 });
    }

    try {
      const cancelToken = new CancelToken((canceler) => {
        if (this.isLive) {
          this.uploadCanceler = canceler;
        }
      });

      const order = await fufillOrder(this.context.order, cancelToken, (uploadPercentage) => {
        if (this.isLive) {
          this.setState({ uploadPercentage });
        }
      });

      this.context.patchOrder(order);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o vídeo. Verifique sua conexão e tente novamente.');
    } finally {
      if (this.isLive) {
        this.setState({ isUploading: false });
      }
    }
  };
}

const SendingIndicator = (props: { percentage: number }) => (
  <View>
    <ActivityIndicator size='large' color='#0000ff' />
    <Text>{`Enviando vídeo: ${props.percentage.toPrecision(0)}%`}</Text>
  </View>
);

const SendButton = (props) => (
  <View>
    <Button title='Enviar Vídeo' {...props} />
  </View>
);

const SuccessMessage = (props) => (
  <View>
    <Text>Vídeo enviado com sucesso!</Text>
    <Button title='Voltar' {...props} />
  </View>
);

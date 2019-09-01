import { OrderStatus } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { OrdersContext } from '../context';
import { Canceler, CancelToken, fufillOrder } from './fufillOrder';

interface ComponentProps {
  onDone: () => void;
}

type Props = ThemedComponentProps & ComponentProps;

interface State {
  isUploading: boolean;
  uploadPercentage: number;
}

class UploadOrderVideoComponent extends React.Component<Props, State> {
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

  public render() {
    const { themedStyle } = this.props;
    return <View style={themedStyle.container}>{this.renderContent()}</View>;
  }

  private renderContent() {
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
      const cancelToken = (canceler) => {
        this.uploadCanceler = canceler;
      };

      await fufillOrder(this.context.order, cancelToken, (uploadPercentage) => {
        if (this.isLive) {
          this.setState({ uploadPercentage });
        }
      });

      this.context.removeSelectedOrder();
      this.props.onDone();
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
  <>
    <ActivityIndicator size='large' color='#0000ff' />
    <Text style={{ textAlign: 'center' }}>{`Enviando vídeo: ${Math.round(props.percentage)}%`}</Text>
  </>
);

const SendButton = (props) => (
  <Button size='large' {...props}>
    Enviar Vídeo
  </Button>
);

const SuccessMessage = (props) => (
  <>
    <Text>Vídeo enviado com sucesso!</Text>
    <Button size='large' {...props}>
      Voltar
    </Button>
  </>
);

export const UploadOrderVideo = withStyles<ComponentProps>(UploadOrderVideoComponent, (theme: ThemeType) => ({
  container: {
    alignContent: 'space-between',
    backgroundColor: theme['background-basic-color-1'],
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
  },
}));

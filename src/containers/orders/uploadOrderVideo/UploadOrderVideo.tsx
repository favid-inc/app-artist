import { OrderStatus } from '@favid-inc/api';
import { Button, Text } from '@kitten/ui';
import { withStyles, ThemedComponentProps } from '@kitten/theme';
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
    if (this.state.isUploading) {
      return (
        <View style={themedStyle.container}>
          <SendingIndicator percentage={this.state.uploadPercentage} />
        </View>
      );
    }

    if (this.context.order.status === OrderStatus.FULFILLED) {
      return (
        <View style={themedStyle.container}>
          <SuccessMessage onPress={this.props.onDone} />
        </View>
      );
    }

    return (
      <View style={themedStyle.container}>
        <SendButton onPress={this.handleUpload} />;
      </View>
    );
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
    <Text>{`Enviando vídeo: ${Math.round(props.percentage)}%`}</Text>
  </View>
);

const SendButton = (props) => (
  <View>
    <Button size='large' title='Enviar Vídeo' {...props} />
  </View>
);

const SuccessMessage = (props) => (
  <View>
    <Text>Vídeo enviado com sucesso!</Text>
    <Button size='large' title='Voltar' {...props} />
  </View>
);

export const UploadOrderVideo = withStyles<ComponentProps>(UploadOrderVideoComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));

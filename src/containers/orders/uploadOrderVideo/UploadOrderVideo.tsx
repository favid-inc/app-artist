import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Alert, Button } from 'react-native';
import { connect } from 'react-redux';
import { OrderModel, OrderFlow, OrderStatus } from '@favid-inc/api';
import * as actions from '../../../store/actions';
import * as config from '@src/core/config';

interface StoreState {
  order: OrderModel;
  idToken: string;
}

interface StoreDispatch {
  setCurrentOrder: (order: OrderModel) => void;
}

interface Props extends StoreState, StoreDispatch {
  onDone: () => void;
}

interface State {
  isUploading: boolean;
}

class AbstractUploadOrderVideo extends Component<Props, State> {
  public state: State = {
    isUploading: false,
  };

  public componentDidMount() {
    this.doUpload();
  }

  private async doUpload() {
    this.setState({ isUploading: true });

    try {
      const data = new FormData();
      data.append('video', {
        type: 'video/mp4',
        uri: this.props.order.video,
      });
      const response = await fetch(`${config.api.baseURL}/${OrderFlow.ACCEPT}/${this.props.order.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.props.idToken}`,
        },
        body: data,
      });
      const order = (await response.json()) as OrderModel;
      this.props.setCurrentOrder(order);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o vídeo. Verifique sua conexão e tente novamente.');
      console.error(e);
    }
    this.setState({ isUploading: false });
  }

  public render(): React.ReactNode {
    if (this.state.isUploading) {
      return <SendingIndicator />;
    }

    if (this.props.order.status !== OrderStatus.OPENED) {
      return <SuccessMessage onPress={this.props.onDone} />;
    }

    return <SendButton onPress={this.doUpload} />;
  }
}

const SendingIndicator = () => (
  <View>
    <ActivityIndicator size='large' color='#0000ff' />
    <Text>Enviando vídeo</Text>
  </View>
);

const SendButton = props => (
  <View>
    <Button title='Enviar Vídeo' {...props} />
  </View>
);

const SuccessMessage = props => (
  <View>
    <Text>Vídeo enviado com sucesso!</Text>
    <Button title='Voltar' {...props} />
  </View>
);

const mapStateToProps = ({ order, auth }) =>
  ({
    order: order.currentOrder,
    idToken: auth.authState.idToken,
  } as StoreState);

const mapDispatchToProps = dispatch =>
  ({ setCurrentOrder: (order: OrderModel) => dispatch(actions.setCurrentOrder(order)) } as StoreDispatch);

export const UploadOrderVideo = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AbstractUploadOrderVideo);

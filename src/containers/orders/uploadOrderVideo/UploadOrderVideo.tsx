import axios from 'axios';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as config from '@src/core/config';
import { OrderModel, OrderFlow, OrderStatus } from '@favid-inc/api';
import { ActivityIndicator, Text, View, Alert, Button } from 'react-native';

import * as actions from '../../../store/actions';

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
  uploadPercentage: number;
}

class AbstractUploadOrderVideo extends Component<Props, State> {
  public state: State = {
    isUploading: false,
    uploadPercentage: 0,
  };

  public componentDidMount() {
    this.doUpload();
  }

  private doUpload = async () => {
    this.setState({ isUploading: true, uploadPercentage: 0 });

    const apiUrl = `${config.api.baseURL}/${OrderFlow.ACCEPT}/${this.props.order.id}`;

    try {
      const data = new FormData();

      data.append('video', {
        type: 'video/mp4',
        uri: this.props.order.video,
        name: 'video.mp4',
      });

      const response = await axios.put(apiUrl, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.idToken}`,
        },
        onUploadProgress: progressEvent =>
          this.setState({
            uploadPercentage: Math.floor(Math.round((progressEvent.loaded / progressEvent.total) * 100)),
          }),
      });

      const { order } = response.data;
      this.props.setCurrentOrder(order);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o vídeo. Verifique sua conexão e tente novamente.');
    }
    this.setState({ isUploading: false });
  };

  public render(): React.ReactNode {
    if (this.state.isUploading) {
      return <SendingIndicator percentage={this.state.uploadPercentage} />;
    }

    if (this.props.order.status !== OrderStatus.OPENED) {
      return <SuccessMessage onPress={this.props.onDone} />;
    }

    return <SendButton onPress={this.doUpload} />;
  }
}

const SendingIndicator = (props: { percentage: number }) => (
  <View>
    <ActivityIndicator size='large' color='#0000ff' />
    <Text>Enviando vídeo: {props.percentage}%</Text>
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

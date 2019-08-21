import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import React, { Component } from 'react';
import { TextInput, View, ActivityIndicator } from 'react-native';

import { ContainerView } from '@src/components/common';

interface State {
  description: string;
  errors: string[];
  sended: boolean;
}

interface Props {
  sending: boolean;
  onDecline: (description: string) => void;
  onCancel: () => void;
}

class DeclineOrderComponent extends Component<ThemedComponentProps & Props, State> {
  public state: State = {
    description: '',
    errors: [],
    sended: false,
  };

  public render() {
    const { themedStyle, sending } = this.props;

    if (sending) {
      return (
        <ContainerView style={themedStyle.container} contentContainerStyle={themedStyle.contentContainer}>
          <View style={themedStyle.contentContainer}>
            <ActivityIndicator size='large' />
          </View>
        </ContainerView>
      );
    }

    return (
      <ContainerView style={themedStyle.container} contentContainerStyle={themedStyle.contentContainer}>
        <View style={themedStyle.contentContainer}>
          <View style={themedStyle.middleContainer}>
            <Text category='h4'>Recusar Pedido</Text>
          </View>

          <View style={themedStyle.middleContainer}>
            <TextInput
              style={themedStyle.input}
              multiline={true}
              numberOfLines={4}
              onChangeText={this.handleDescriptionChange}
              value={this.state.description}
            />
          </View>

          <View style={themedStyle.middleContainer}>
            {this.state.errors.map((error) => (
              <Text style={themedStyle.error} category='label'>
                {error}
              </Text>
            ))}
          </View>
          <View style={themedStyle.middleContainer}>
            <Button
              status='danger'
              size='giant'
              appearance='outline'
              style={themedStyle.button}
              onPress={this.handleOnDecline}
            >
              Recusar Pedido
            </Button>
          </View>
          <View style={themedStyle.middleContainer}>
            <Button
              status='danger'
              size='giant'
              appearance='ghost'
              style={themedStyle.button}
              onPress={this.handleOnCancel}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </ContainerView>
    );
  }

  private validade(): string[] {
    const errors: string[] = [];
    if (!this.state.description) {
      errors.push('Informe o motivo de recusar o pedido.');
    }

    return errors;
  }

  private handleDescriptionChange = (description) => {
    this.setState({ description });
  };

  private handleOnDecline = () => {
    this.setState({ sended: true });

    const errors = this.validade();

    this.setState({ errors });

    if (!errors.length) {
      this.props.onDecline(this.state.description);
    }
  };

  private handleOnCancel = () => {
    this.props.onCancel();
  };
}

export const DeclineOrder = withStyles<Props>(DeclineOrderComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginVertical: 5,
  },
  error: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    color: theme['text-alternative-color'],
    height: 150,
    borderRadius: 10,
    borderColor: theme['text-alternative-color'],
    borderWidth: 1,
    padding: 10,
    fontSize: 17,
    fontFamily: 'opensans-regular',

    width: '100%',
  },
  button: {
    marginHorizontal: 14,
    marginVertical: 5,
  },
  formContainer: {
    flex: 1,
    marginTop: 40,
  },
}));

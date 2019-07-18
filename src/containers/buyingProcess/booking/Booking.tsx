import React, { Component } from 'react';
import { ThemedComponentProps, withStyles, ThemeType } from 'react-native-ui-kitten/theme';
import { ContainerView, ValidationInput, textStyle } from '@src/components/common';
import { View, ViewProps, ActivityIndicator } from 'react-native';
import { Toggle, Text, Button, Input } from 'react-native-ui-kitten/ui';
import { NameValidator } from '@src/core/validators';

interface ComponentProps {
  loading: boolean;
  onSend: (gift: boolean, name: string, message: string) => void;
}

export type BookingProps = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
  gift: boolean;
  name: string;
  theirName?: string;
  message: string;
}



class BookingComponent extends Component<BookingProps, State> {
  public state: State = {
    gift: false,
    name: '',
    theirName: '',
    message: '',
  };

  private onSend() {
    const { gift, name, message } = this.state;
    this.props.onSend(gift, name, message);
  }

  public render() {
    const { themedStyle } = this.props;
    let giftFields = null;

    if (this.state.gift) {
      giftFields = (
        <View style={themedStyle.middleContainer}>
          <ValidationInput
            value={this.state.theirName}
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            label='Nome Dele'
            placeholder='José'
            validator={NameValidator}
            onChangeText={theirName => this.setState({ theirName })}
          />
        </View>
      );
    }

    return (
      <ContainerView style={themedStyle.container} contentContainerStyle={themedStyle.contentContainer}>
        <View style={themedStyle.formContainer}>
          <View style={themedStyle.middleContainer}>
            <Text appearance='hint' category='s2' style={themedStyle.tittleLabel}>
              Para Presente?
            </Text>
            <Toggle checked={this.state.gift} style={themedStyle.gift} onChange={gift => this.setState({ gift })} />
          </View>
          <View style={themedStyle.middleContainer}>
            <ValidationInput
              value={this.state.name}
              style={themedStyle.input}
              textStyle={textStyle.paragraph}
              labelStyle={textStyle.label}
              label='Meu Nome'
              placeholder='João'
              validator={NameValidator}
              onChangeText={name => this.setState({ name })}
            />
          </View>
          {giftFields}
          <View style={themedStyle.middleContainer}>
            <ValidationInput
              value={this.state.message}
              style={themedStyle.input}
              textStyle={textStyle.paragraph}
              labelStyle={textStyle.label}
              label='Minha Menssagem'
              placeholder='Por favor deseje um feliz aniversário ao meu amigo Lucas Marques.'
              validator={NameValidator}
              onChangeText={message => this.setState({ message })}
            />
          </View>
        </View>
        <Button status='success' disabled={this.props.loading} size='giant' style={themedStyle.addButton} onPress={() => this.onSend}>
          {this.props.loading ? 'Enviando Pedido...' : 'Enviar Pedido' } 
        </Button>
      </ContainerView>
    );
  }
}

export const Booking = withStyles(BookingComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  contentContainer: {
    flex: 1,
  },
  titleLabel: {
    minWidth: 128,
    ...textStyle.subtitle,
  },
  gift: {
    marginHorizontal: 5,
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  addButton: {
    marginVertical: 24,
  },
  formContainer: {
    flex: 1,
    marginTop: 40,
  },
}));

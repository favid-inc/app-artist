import React, { Component } from 'react';
import { ThemedComponentProps, withStyles, ThemeType } from 'react-native-ui-kitten/theme';
import { ContainerView } from '@src/components/common';
import { View, TextInput } from 'react-native';
import { Button, Text } from 'react-native-ui-kitten/ui';

interface State {
  sended: boolean;
  refusedByArtistDescription: string;
}

interface Props {
  onDeclineOrder: (refusedByArtistDescription: string) => void;
  onGoback: () => void;
}

class DeclineOrderComponent extends Component<ThemedComponentProps & Props, State> {
  public state: State = {
    sended: false,
    refusedByArtistDescription: '',
  };

  public refusedByArtistDescriptionError(): string[] {
    const errors: string[] = [];
    if (!this.state.sended) {
      return errors;
    }
    !this.state.refusedByArtistDescription.length && errors.push('Informe o motivo de recusar o pedido.');
    return errors;
  }

  public onDeclineOrder() {
    this.setState({ sended: true });
    if (this.state.refusedByArtistDescription.length) {
      this.props.onDeclineOrder(this.state.refusedByArtistDescription);
    }
  }

  public render() {
    const { themedStyle } = this.props;
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
              onChangeText={refusedByArtistDescription => this.setState({ refusedByArtistDescription })}
              value={this.state.refusedByArtistDescription}
            />
          </View>
          <View style={themedStyle.middleContainer}>
            {this.refusedByArtistDescriptionError().map(error => (
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
              onPress={() => this.onDeclineOrder()}
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
              onPress={() => this.props.onGoback()}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </ContainerView>
    );
  }
}

export const DeclineOrder = withStyles(DeclineOrderComponent, (theme: ThemeType) => ({
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
